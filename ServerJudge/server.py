from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import socket
import json
import os
import threading
from flask import Flask
from flask_cors import CORS 
import time

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
PROBLEMS_FOLDER = "problems"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Biến toàn cục để theo dõi submission ID
submission_counter = 0
submission_lock = threading.Lock()

JUDGE_SERVER_HOST = 'localhost'
JUDGE_SERVER = [
    {'host': 'localhost', 'port': 5555, 'active': False, 'core' : 0},
    {'host': 'localhost', 'port': 5556, 'active': False, 'core' : 1},
    {'host': 'localhost', 'port': 5557, 'active': False, 'core' : 2}
]
class JudgeClient:
    def __init__(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    def submit_to_judge(self, problem_id, source_path, language, submission_id, timelimit_ms, memorylimit_kb):
        _judge_id = 0
        for i in range(len(JUDGE_SERVER)):
            if (JUDGE_SERVER[i]['active'] == False):
                _judge_id  = i
                JUDGE_SERVER[_judge_id]['active'] = True
                break
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
            return json.loads(response)
        except Exception as e:
            return {"status": "error", "message": str(e)}
        finally:
            self.socket.close()
            JUDGE_SERVER[_judge_id]['active'] = False

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

        # Tạo file tạm để lưu code
        filename = f"code{submission_id}.{language}"
        source_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(code)

        client = JudgeClient()
        response = client.submit_to_judge(problem_id, source_path, language, submission_id, timelimit_ms, memorylimit_kb)
        
        if os.path.exists(source_path):
            os.remove(source_path)

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Submission error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)