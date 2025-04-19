import os
import subprocess
import psutil
import time
import platform

from MonoProcess import MonoProcessMonitor

class JudgeProcessor:

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
                # error_msg = compile_process.stderr
                # raise RuntimeError(f"Compilation failed: {error_msg}")
                raise RuntimeError(f"Compilation failed")
            
            return executable
        except Exception as e:
            # raise RuntimeError(f"Compilation error: {str(e)}")
            raise RuntimeError(f"Compilation error")


    def get_command(self, source_file, language):
        if language == 'python':
            return ['python', source_file]
        elif language == 'cpp':
            try:
                executable = self.compile_cpp(source_file)
                return [executable]
            except Exception as e:
                raise RuntimeError(f"Lỗi biên dịch: {str(e)}")
        else:
            raise ValueError(f"Không hỗ trợ: {language}")
        
    def process_submission(self, submission_id, problem_id, source_path, language):
        try:

            try:
                command = self.get_command(source_path, language)
            except Exception as e:
                # result["Code"] = "CE"  # Compilation Error
                # result["Error"] = str(e)
                # return result
                return {
                    # "status": "CE",  # Compilation Error
                    "status": "CE",
                    "submission_id" : submission_id,
                    "problem_id": problem_id,
                    "results" : [],
                    "summary": {
                        "passed": 0,
                        "total": 0,
                        "score": f"{0}/{0}"
                    }
                }

            input_dir = os.path.join("problems", f"#{problem_id}")
            output_dir = os.path.join("problems", f"#{problem_id}")
            # input_dir = os.path.join("problems", f"#{problem_id}", "input")
            # output_dir = os.path.join("problems", f"#{problem_id}", "output")
            # input_files = [f for f in os.listdir(input_dir) if (f.startswith('Test_') and f.endswith('.txt')) or (f.endswith('.in'))]
            input_files = [f for f in os.listdir(input_dir) if (f.endswith('.in'))]
            input_files.sort(key=lambda x: int(x.split('.')[0]))
            
            count_testcase = 0
            count_testpassed = 0
            results = []
            for input_file in input_files:
                print("Đang chấm test " ,count_testcase)

                input_path = os.path.join(input_dir, input_file)
                output_path = os.path.join(output_dir, input_file.split(".")[0]+".out")
                print(input_path)
                print(output_path)

                temp = MonoProcessMonitor(100, 1, 1.2, 200, source_path, input_path, output_path, language)
                result  = temp.run()
                count_testcase += 1
                
                results.append(result)

                if (result["Code"] == "AC"):
                    count_testpassed += 1
          
            return {
                "status": "ok",
                "submission_id" : submission_id,
                "problem_id": problem_id,
                "results" : results,
                "summary": {
                    "passed": count_testpassed,
                    "total": count_testcase,
                    "score": f"{count_testpassed}/{count_testcase}"
                }
            }
        except Exception as e:
            return {"status": "error tai checker_mono", "message": str(e)}