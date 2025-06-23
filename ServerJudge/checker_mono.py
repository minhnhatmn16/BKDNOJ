import os
import subprocess
import psutil
import time
import platform
from logger import log_time3

from MonoProcess import MonoProcessMonitor

class JudgeProcessor:

    # Biên dịch C++
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
        try:
            compile_process = subprocess.run(
                compile_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            if compile_process.returncode != 0:
                raise RuntimeError(f"Compilation failed")
            
            return executable
        except Exception as e:
            raise RuntimeError(f"Compilation error")

    def get_command(self, source_file, language):
        if language == 'py':
            return ['py', source_file]
        elif language == 'cpp':
            try:
                executable = self.compile_cpp(source_file)
                return [executable]
            except Exception as e:
                raise RuntimeError(f"Lỗi biên dịch: {str(e)}")
        else:
            raise ValueError(f"Không hỗ trợ: {language}")
        
    def process_submission(self, submission_id, problem_id, source_path, language, timelimit_ms, memorylimit_kb):
        try:
            try:
                command = self.get_command(source_path, language)
            except Exception as e:
                return {
                    "submission_id" : submission_id,
                    "status": "CE",  # Compilation Error
                    "passed": 0,
                    "total": 0,
                }

            input_dir = os.path.join("problems", f"{problem_id}")
            output_dir = os.path.join("problems", f"{problem_id}")

            input_files = [f for f in os.listdir(input_dir) if (f.endswith('.in'))]
            input_files.sort(key=lambda x: int(x.split('.')[0]))
            
            count_testcase = 0
            count_testpassed = 0
            results = []
            firstStatus = "AC"
            isFirstStatus = False
            memory_max = 0
            time_max = 0
            timelimit_ms = timelimit_ms / 1000

            start = time.time()
            for input_file in input_files:
                # print("Testcase " ,count_testcase)

                input_path = os.path.join(input_dir, input_file)
                output_path = os.path.join(output_dir, input_file.split(".")[0]+".out")

                temp = MonoProcessMonitor(100, timelimit_ms, timelimit_ms * 3, 2, source_path, input_path, output_path, language)
                result  = temp.run()
                count_testcase += 1
                
                results.append(result)

                if (result["status"] == "AC"):
                    count_testpassed += 1

                if isFirstStatus == False and result["status"] != "AC":
                    isFirstStatus  = True
                    firstStatus = result["status"]

                memory_max = max(memory_max, result["memory_kb"])
                time_max = max(time_max, result["time_ms"])

            log_time3(submission_id, time.time() - start)

            return {
                "status": firstStatus,
                "submission_id" : submission_id,
                "passed": count_testpassed,
                "total": count_testcase,
                "time_ms": time_max,
                "memory_kb": memory_max
            }
        except Exception as e:
            return {"status": "SE", "message": str(e)}