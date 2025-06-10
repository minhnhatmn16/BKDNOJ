from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import socket
import json
import os
import threading
from flask import Flask
from flask_cors import CORS 
import time
from queue import Queue
from threading import Thread
import pymysql

submission_queue = Queue()


app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
PROBLEMS_FOLDER = "problems"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

JUDGE_SERVER_HOST = 'localhost'
JUDGE_SERVER = [
    {'host': 'localhost', 'port': 5555, 'active': False, 'core' : 0},
    {'host': 'localhost', 'port': 5556, 'active': False, 'core' : 1},
    {'host': 'localhost', 'port': 5557, 'active': False, 'core' : 2}
]
judge_queue = Queue()
for i, judge in enumerate(JUDGE_SERVER):
    judge_queue.put(i)
    
    
class JudgeClient:
    def __init__(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    def update_submission(self, submission_id, status, passed, total, time_ms, memory_kb, contest_id):
        try:
            conn = pymysql.connect(
                host="127.0.0.1",
                port=4306,
                user="root",
                password="",
                database="bkdnoj",
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor
            )

            with conn:
                with conn.cursor() as cursor:
                    sql = """
                    UPDATE submissions
                    SET status = %s,
                        passed_test = %s,
                        total_test = %s,
                        time_ms = %s,
                        memory_kb = %s,
                        contest_id = %s
                    WHERE submission_id = %s
                    """
                    cursor.execute(sql, (status, passed, total, time_ms, memory_kb, contest_id, submission_id))
                conn.commit()
        except Exception as e:
            print(f"[DB ERROR] Cannot update submission {submission_id}: {e}")

    def submit_to_judge(self, problem_id, source_path, language, submission_id, timelimit_ms, memorylimit_kb, contest_id):
        # _judge_id = 0
        # for i in range(len(JUDGE_SERVER)):
        #     if (JUDGE_SERVER[i]['active'] == False):
        #         _judge_id  = i
        #         JUDGE_SERVER[_judge_id]['active'] = True
        #         break

        _judge_id = judge_queue.get()

        try:
            print("Nhận được dữ liệu từ postman " , time.time())
            self.socket.connect((JUDGE_SERVER[_judge_id]['host'], JUDGE_SERVER[_judge_id]['port']))
            request = {
                'problem_id': problem_id,
                'submission_id' : submission_id,
                'source_path': source_path,
                'language': language,
                'timelimit_ms': timelimit_ms,
                'memorylimit_kb': memorylimit_kb,
            }
            self.socket.send(json.dumps(request).encode())
            response = self.socket.recv(8192).decode()
            
            result = json.loads(response)

            # Ghi vào database
            self.update_submission(
                submission_id=submission_id,
                status=result.get("status", "error"),
                passed=result.get("passed", 0),
                total=result.get("total", 0),
                time_ms=result.get("time_ms", 0),
                memory_kb=result.get("memory_kb", 0),
                contest_id = contest_id
            )

            return result
        
            # return json.loads(response)
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            if os.path.exists(source_path):
                os.remove(source_path)
            if language == 'cpp':
                exe_path = os.path.splitext(source_path)[0]
                # Windows có .exe
                if os.name == 'nt':
                    exe_path += '.exe'
                if os.path.exists(exe_path):
                    os.remove(exe_path)
            self.socket.close()
            judge_queue.put(_judge_id)

def judge_worker():
    while True:
        job = submission_queue.get()
        if job is None:
            break  # Dừng thread
        try:
            client = JudgeClient()
            response = client.submit_to_judge(**job)
            print(f"[Judge] Done submission_id={job['submission_id']}: {response}")
        except Exception as e:
            print(f"[Judge] Error: {str(e)}")
        submission_queue.task_done()

# Tạo thread chạy nền
threading.Thread(target=judge_worker, daemon=True).start()


@app.route('/submit', methods=['POST'])
def submit_code():
    global submission_counter

    try:
        data = request.get_json()

        problem_id = data['problem_id']
        submission_id = data['submission_id']
        code = data['code']
        language = data['language']
        timelimit_ms = data['timelimit_ms']
        memorylimit_kb = data['memorylimit_kb']
        contest_id = data.get('contest_id')

        # Tạo file tạm để lưu code
        filename = f"code{submission_id}.{language}"
        source_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(code)

        job = {
            'problem_id': problem_id,
            'submission_id': submission_id,
            'source_path': source_path,
            'language': language,
            'timelimit_ms': timelimit_ms,
            'memorylimit_kb': memorylimit_kb,
            'contest_id': contest_id,
        }

        submission_queue.put(job)

        return jsonify({"status": "queued", "message": "Submission enqueued successfully."})

    except Exception as e:
        return jsonify({"error": f"Submission error: {str(e)}"}), 500


import zipfile
testcase_queue = Queue()
def update_problem_has_testcase(problem_id):
    try:
        conn = pymysql.connect(
            host="127.0.0.1",
            port=4306,
            user="root",
            password="",
            database="bkdnoj",
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn:
            with conn.cursor() as cursor:
                sql = "UPDATE problems SET has_testcase = %s WHERE problem_id = %s"
                cursor.execute(sql, (True, problem_id))
            conn.commit()
        print(f"[DB] Updated problem {problem_id} has_testcase = True")
    except Exception as e:
        print(f"[DB ERROR] Update problem {problem_id} failed: {e}")

def testcase_worker():
    while True:
        job = testcase_queue.get()
        if job is None:
            break
        problem_id = job['problem_id']
        zip_path = job['zip_path']

        extract_dir = os.path.join(PROBLEMS_FOLDER, f"{problem_id}")

        try:
            os.makedirs(extract_dir, exist_ok=True)

            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)

            print(f"[Testcase Worker] Extracted testcases to {extract_dir}")
            update_problem_has_testcase(problem_id)
            if os.path.exists(zip_path):
                os.remove(zip_path)

        except Exception as e:
            print(f"[Testcase Worker] Error processing {problem_id}: {e}")
        testcase_queue.task_done()

threading.Thread(target=testcase_worker, daemon=True).start()

@app.route('/uploadTestcase', methods=['POST'])
def upload_testcase():
    try:
        if 'zip_file' not in request.files:
            return jsonify({"error": "No file part with name 'zip_file'"}), 400
        
        zip_file = request.files['zip_file']
        problem_id = request.form.get('problem_id')

        if not problem_id:
            return jsonify({"error": "Missing problem_id"}), 400

        if zip_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        save_path = os.path.join(PROBLEMS_FOLDER, f"{problem_id}.zip")
        zip_file.save(save_path)

        testcase_queue.put({
                    'problem_id': int(problem_id),
                    'zip_path': save_path
                })

        return jsonify({"status": "success", "message": f"Testcase for problem {problem_id} uploaded."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)