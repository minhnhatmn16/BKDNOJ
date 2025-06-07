import subprocess
import os
import sys

def run_in_terminal(script_path):
    if sys.platform == "win32":
        try:
            subprocess.Popen(["wt", "python", script_path])
        except FileNotFoundError:
            subprocess.Popen(f"start cmd /k python {script_path}", shell=True)
    else:
        print("Hệ điều hành không được hỗ trợ")

if __name__ == "__main__":
    scripts = ["judge_5555.py", "judge_5556.py", "judge_5557.py", "server.py"]
    # scripts = ["judge_5555.py", "judge_5556.py", "server.py"]
    # scripts = ["judge_5555.py", "server.py"]
    
    scripts = [s for s in scripts if os.path.exists(s)]

    if not scripts:
        print("Không tìm thấy file Python nào để chạy!")
        sys.exit(1)
    
    for script in scripts:
        print(f"Đang chạy {script} trong terminal mới...")
        run_in_terminal(script)
    
    print("Đã khởi chạy tất cả script trong các terminal riêng biệt.")