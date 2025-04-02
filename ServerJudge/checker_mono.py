import os
import subprocess
import psutil
import time
from MonoProcess import MonoProcessMonitor

class JudgeProcessor:
    def process_submission(self, problem_id, source_path, language):
        try:
            input_dir = os.path.join("problems", f"#{problem_id}", "input")
            output_dir = os.path.join("problems", f"#{problem_id}", "output")
            input_files = [f for f in os.listdir(input_dir) if f.startswith('Test_') and f.endswith('.txt')]

            count_testcase = 0
            count_testpassed = 0
            IsFail = False
            for input_file in input_files:
                # print("Đang chấm test " ,count_testcase, " ",  time.time())
                print("Đang chấm test " ,count_testcase)

                input_path = os.path.join(input_dir, input_file)
                output_path = os.path.join(output_dir, input_file)
                
                # result = self.run_test_case(source_path, language, input_path, output_path)
                temp = MonoProcessMonitor(100, 1, 1.2, 200, source_path, input_path, output_path, language)
                result  = temp.run()
                count_testcase += 1
                
                if (result["Code"] == "AC"):
                    count_testpassed += 1
          
            return {
                "status": "success",
                "problem_id": problem_id,
                "summary": {
                    "passed": count_testpassed,
                    "total": count_testcase,
                    "score": f"{count_testpassed}/{count_testcase}"
                }
            }
        except Exception as e:
            return {"status": "error tai checker_mono", "message": str(e)}

    # def run_test_case(self, source_path, language, input_path, output_path):
    #     try:
    #         if language == 'python':
    #             cmd = ['python', source_path]
    #         elif language == 'cpp':
    #             executable = source_path.replace('.cpp', '')
    #             subprocess.run(['g++', source_path, '-o', executable], check=True)
    #             cmd = [executable]
    #         else:
    #             return {"status": "IE", "message": "Unsupported language"}

    #         with open(input_path) as f_in, open('user_output.txt', 'w') as f_out:
    #             process = subprocess.Popen(
    #                 cmd,
    #                 stdin=f_in,
    #                 stdout=f_out,
    #                 stderr=subprocess.PIPE,
    #                 text=True
    #             )
                
    #             try:
    #                 process.wait(timeout=5)
    #             except subprocess.TimeoutExpired:
    #                 process.kill()
    #                 return {"status": "TLE", "message": "Time Limit Exceeded"}

    #             if process.returncode != 0:
    #                 error = process.stderr.read()
    #                 return {"status": "RE", "message": f"Runtime Error: {error}"}

    #         return self.compare_output(output_path, 'user_output.txt')
    #     except Exception as e:
    #         return {"status": "IE", "message": f"Execution Error: {str(e)}"}

    # def compare_output(self, expected_file, actual_file):
    #     try:
    #         with open(expected_file) as f_exp, open(actual_file) as f_act:
    #             expected = f_exp.read().strip()
    #             actual = f_act.read().strip()

    #             if expected == actual:
    #                 return {"status": "AC", "message": "Accepted"}
    #             return {"status": "WA", "message": "Wrong Answer"}
    #     except Exception as e:
    #         return {"status": "IE", "message": f"Comparison Error: {str(e)}"}