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
    def __init__(self, MAX_MEMORY_MB, MAX_CPU_TIME, MAX_WALL_TIME, MAX_OUTPUT_SIZE, source_file, input_file, output_file, language):
        self.MAX_MEMORY_MB = MAX_MEMORY_MB      # Giới hạn bộ nhớ
        self.MAX_CPU_TIME = MAX_CPU_TIME        # Giới hạn thời gian CPU
        self.MAX_WALL_TIME = MAX_WALL_TIME      # Giới hạn thời gian thực
        self.MAX_OUTPUT_SIZE = MAX_OUTPUT_SIZE  # Giới hạn kích thước đầu ra
        self.source_file = source_file          # File mã nguồn
        self.input_file = input_file            # File đầu vào
        self.output_file = output_file          # File đầu ra
        self.language = language                # Ngôn ngữ lập trình

    def compile_cpp(self, source_file):
        executable = os.path.splitext(source_file)[0]
        if platform.system() == 'Windows':
            executable += '.exe'

        if os.path.exists(executable):
            source_mtime = os.path.getmtime(source_file)
            exec_mtime = os.path.getmtime(executable)
            if exec_mtime >= source_mtime:
                return executable

        compile_cmd = ['g++', source_file, '-o', executable]
        compile_process = subprocess.run(compile_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if compile_process.returncode != 0:
            raise RuntimeError("Compilation failed:\n" + compile_process.stderr)
        return executable

    def get_command(self):
        if self.language == 'python':
            return ['python3', self.source_file]
        elif self.language == 'cpp':
            return [self.compile_cpp(self.source_file)]
        else:
            raise ValueError(f"Unsupported language: {self.language}")

    def read_input_data(self):
        if self.input_file and os.path.exists(self.input_file):
            with open(self.input_file, 'r') as f:
                return f.read()
        return None

    def run(self):  
        result = {
            "status": "OK",
            "memory_kb": 0,
            "cpu_time_ms": 0,
            "wall_time_ms": 0,
            "output_size_kb": 0,
            "time_ms": 0,
            "stdout": "",
            "stderr": "",
            "returncode": ""
        }

        input_data = self.read_input_data()

        try:
            command = self.get_command()
        except Exception as e:
            result["status"] = "CE"
            result["stderr"] = str(e)
            return result
        
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
            result["status"] = "OE"
            result["stderr"] = str(e)
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
            result["status"] = "IR"
            result["stderr"] = str(e)
            return result

        stdout_lines = []
        while process.poll() is None:
            try:
                memory_usage = max(memory_usage, proc.memory_info().rss / (1024 * 1024))
                cpu_time = proc.cpu_times().user + proc.cpu_times().system
                wall_time = time.time() - start_time

                if memory_usage > self.MAX_MEMORY_MB:
                    result["status"] = "MLE"    # Memory Limit Exceeded
                    process.terminate()
                    break

                if cpu_time > self.MAX_CPU_TIME:
                    result["status"] = "CTLE"   # CPU Time Limit Exceeded
                    process.terminate()
                    break

                if wall_time > self.MAX_WALL_TIME:
                    result["status"] = "RTLE"   # Real Time Limit Exceeded
                    process.terminate()
                    break

                rlist = select.select([process.stdout], [], [], 0.1)[0] if platform.system() != "Windows" else [process.stdout]
                if rlist:
                    line = process.stdout.readline()
                    if line:
                        stdout_lines.append(line)
                        output_size += len(line.encode())
                    
                    if output_size / (1024 * 1024) > self.MAX_OUTPUT_SIZE:
                        result["status"] = "OLE"    # Output Limit Exceeded
                        process.terminate()
                        break
            except psutil.NoSuchProcess:
                    break
            except Exception as e:
                result["status"] = "IR"
                result["stderr"] = str(e)
                process.terminate()
                break

        # stderr_data = process.stderr.read()
        # if process.returncode != 0 and result["status"] == "OK":
        #     result["status"] = "RE"
        #     return result
        result["memory_kb"] = memory_usage * 1024
        result["time_ms"] = cpu_time

        if (result["status"] == "CTLE" or result["status"] == "RTLE"):
            result["status"] = "TLE"
        elif (result["status"] == "OK"):
            result["status"] = check(self.output_file,stdout_lines)


        # result["time_ms"] = cpu_time
        # result["wall_time"] = wall_time
        # result["wall_time"] = time.time() - start_time
        # result["output_size"] = output_size
        # result["Output"] = stdout_text
        # result["Error"] = stderr_data
        # result["returncode"] = stdout_lines

        return result
