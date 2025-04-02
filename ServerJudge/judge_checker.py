import os
import subprocess
import psutil
import time

class JudgeProcessor:
    def process_submission(self, problem_id, source_path, language):
        try:
            input_dir = os.path.join("problems", f"#{problem_id}", "input")
            output_dir = os.path.join("problems", f"#{problem_id}", "output")
            input_files = [f for f in os.listdir(input_dir) if f.startswith('Test_') and f.endswith('.txt')]

            # results = []
            count_testcase = 0
            count_testpassed = 0
            for input_file in input_files:
                print("Đang chấm test {count_testcase} ",  time.time())
                input_path = os.path.join(input_dir, input_file)
                output_path = os.path.join(output_dir, input_file)
                
                result = self.run_test_case(source_path, language, input_path, output_path)
                count_testcase += 1
                # results.append({
                #     "test_case": input_file,
                #     "result": result["status"],
                #     "message": result["message"]
                # })
                if (result["status"] == "AC"):
                    count_testpassed += 1

            # passed = sum(1 for r in results if r["result"] == "AC")
            
            return {
                "status": "success",
                "problem_id": problem_id,
                # "results": results,
                "summary": {
                    # "passed": passed,
                    "passed": count_testpassed,
                    "total": count_testcase,
                    "score": f"{count_testpassed}/{count_testcase}"
                }
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def run_test_case(self, source_path, language, input_path, output_path):
        try:
            if language == 'python':
                cmd = ['python', source_path]
            elif language == 'cpp':
                executable = source_path.replace('.cpp', '')
                subprocess.run(['g++', source_path, '-o', executable], check=True)
                cmd = [executable]
            else:
                return {"status": "IE", "message": "Unsupported language"}

            with open(input_path) as f_in, open('user_output.txt', 'w') as f_out:
                process = subprocess.Popen(
                    cmd,
                    stdin=f_in,
                    stdout=f_out,
                    stderr=subprocess.PIPE,
                    text=True
                )
                
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    return {"status": "TLE", "message": "Time Limit Exceeded"}

                if process.returncode != 0:
                    error = process.stderr.read()
                    return {"status": "RE", "message": f"Runtime Error: {error}"}

            return self.compare_output(output_path, 'user_output.txt')
        except Exception as e:
            return {"status": "IE", "message": f"Execution Error: {str(e)}"}

    def compare_output(self, expected_file, actual_file):
        try:
            with open(expected_file) as f_exp, open(actual_file) as f_act:
                expected = f_exp.read().strip()
                actual = f_act.read().strip()

                if expected == actual:
                    return {"status": "AC", "message": "Accepted"}
                return {"status": "WA", "message": "Wrong Answer"}
        except Exception as e:
            return {"status": "IE", "message": f"Comparison Error: {str(e)}"}