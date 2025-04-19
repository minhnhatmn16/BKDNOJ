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
    
    def submit_to_judge(self, problem_id, source_path, language, submission_id):
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
                'submission_id' : submission_id,
                'problem_id': problem_id,
                'source_path': source_path,
                'language': language
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

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    try:
        file = request.files['file']
        problem_id = request.form.get('problem_id', '00003')
        language = request.form.get('language')

        # filename = secure_filename(file.filename)
        
        # Tăng submission ID một cách an toàn
        with submission_lock:
            submission_counter += 1
            submission_id = submission_counter

        filename = "code" + str(submission_id) + "." + language
        source_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(source_path)
        client = JudgeClient()
        response = client.submit_to_judge(problem_id, source_path, language, submission_id)
        
        if os.path.exists(source_path):
            os.remove(source_path)

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Submission error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)