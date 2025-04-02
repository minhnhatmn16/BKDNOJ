import subprocess
import psutil
import time
import select
import os
import platform
import signal
import os
import time
import json
import psutil
import platform
import subprocess
import multiprocessing as mp
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from Checker import check

class MonoProcessMonitor:
    def __init__(self, MAX_MEMORY_MB, MAX_CPU_TIME, MAX_WALL_TIME, MAX_OUTPUT_SIZE, source_file, input_file, output_file, language=None):
        self.MAX_MEMORY_MB = MAX_MEMORY_MB      # Giới hạn bộ nhớ
        self.MAX_CPU_TIME = MAX_CPU_TIME        # Giới hạn thời gian CPU
        self.MAX_WALL_TIME = MAX_WALL_TIME      # Giới hạn thời gian thực
        self.MAX_OUTPUT_SIZE = MAX_OUTPUT_SIZE  # Giới hạn kích thước đầu ra
        self.source_file = source_file          # File mã nguồn
        self.input_file = input_file            # File đầu vào
        self.output_file = output_file          # File đầu ra
        self.language = language.lower() if language else self.detect_language(source_file)  # Ngôn ngữ lập trình
        
    # Phát hiện ngôn ngữ  
    def detect_language(self, filename):  
        ext = os.path.splitext(filename)[1].lower()  # Lấy phần mở rộng
        if ext == '.py':
            return 'python'
        elif ext in ('.cpp', '.c', '.cc', '.cxx'):
            return 'cpp'
        else:
            raise ValueError(f"Không hỗ trợ: {ext}")

    # Biên dịch C++
    def compile_cpp(self, source_file):
        executable = os.path.splitext(source_file)[0]
        if platform.system() == 'Windows':
            executable += '.exe'
        
        if os.path.exists(executable):
            source_mtime = os.path.getmtime(source_file)  # Thời gian sửa file nguồn
            exec_mtime = os.path.getmtime(executable)     # Thời gian sửa file thực thi
            if exec_mtime >= source_mtime:
                return executable
        
        compile_cmd = ['g++', source_file, '-o', executable]
        try:
            compile_process = subprocess.run(
                compile_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            if compile_process.returncode != 0:
                error_msg = compile_process.stderr
                # raise RuntimeError(f"Compilation failed: {error_msg}")
                raise RuntimeError(f"Compilation failed")

            
            return executable
        except Exception as e:
            # raise RuntimeError(f"Compilation error: {str(e)}")
            raise RuntimeError(f"Compilation error")


    def get_command(self):
        if self.language == 'python':
            return ['python', self.source_file]
        elif self.language == 'cpp':
            try:
                executable = self.compile_cpp(self.source_file)
                return [executable]
            except Exception as e:
                raise RuntimeError(f"Lỗi biên dịch: {str(e)}")
        else:
            raise ValueError(f"Không hỗ trợ: {self.language}")

    def read_input_data(self):
        if self.input_file and os.path.exists(self.input_file):
            with open(self.input_file, 'r') as f:
                return f.read()
        return None

    def run(self):  
        result = {"Code": "OK"}
        input_data = self.read_input_data()

        try:
            command = self.get_command()
        except Exception as e:
            result["Code"] = "CE"  # Compilation Error
            result["Error"] = str(e)
            return result
        
        # Khởi chạy process
        try:
            process = subprocess.Popen(
                command, 
                stdin=subprocess.PIPE if input_data else None,
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True, 
                bufsize=1, 
                universal_newlines=True,
                shell=True if platform.system() == "Windows" else False,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if platform.system() == "Windows" else 0
            )
        except Exception as e:
            result["Code"] = "OE" # Operation Error
            result["Error"] = str(e)
            return result
        
        # Giám sát process
        try:
            proc = psutil.Process(process.pid)
            start_time = time.time()
            output_size = 0
            memory_usage = 0
            wall_time = 0
            cpu_time = 0

            if input_data:
                process.stdin.write(input_data)
                process.stdin.flush()
                process.stdin.close()
        except Exception as e:
            result["Code"] = "IR"
            result["Error"] = str(e)
            return result

        stdout_lines = []
        while process.poll() is None:
            try:
                memory_usage = max(memory_usage, proc.memory_info().rss / (1024 * 1024))
                cpu_time = proc.cpu_times().user + proc.cpu_times().system
                wall_time = time.time() - start_time

                if memory_usage > self.MAX_MEMORY_MB:
                    result["Code"] = "MLE"    # Memory Limit Exceeded
                    process.terminate()
                    break

                if cpu_time > self.MAX_CPU_TIME:
                    result["Code"] = "CTLE"   # CPU Time Limit Exceeded
                    process.terminate()
                    break

                if wall_time > self.MAX_WALL_TIME:
                    result["Code"] = "RTLE"   # Real Time Limit Exceeded
                    process.terminate()
                    break

                rlist = select.select([process.stdout], [], [], 0.1)[0] if platform.system() != "Windows" else [process.stdout]
                if rlist:
                    line = process.stdout.readline()
                    if line:
                        stdout_lines.append(line)
                        output_size += len(line.encode())
                    
                    if output_size / (1024 * 1024) > self.MAX_OUTPUT_SIZE:
                        result["Code"] = "OLE"    # Output Limit Exceeded
                        process.terminate()
                        break
            except psutil.NoSuchProcess:
                result["Code"] = "IR"  # Internal Error
                break
            except Exception as e:
                result["Code"] = "IR"  # Internal Error
                result["Error"] = str(e)
                break

        # stdout_text = "\n".join(stdout_lines)
        stderr_data = process.stderr.read()
        if process.returncode != 0 and result["Code"] == "OK":
            result["Code"] = "RE"
        result["Code"] = check(self.output_file,stdout_lines)
        result["memory_usage"] = memory_usage
        result["cpu_time"] = cpu_time
        result["wall_time"] = wall_time
        result["output_size"] = output_size
        # result["Output"] = stdout_text
        result["Error"] = stderr_data
        result["returncode"] = process.returncode


        return result
