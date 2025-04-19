import socket
import threading
import json
import os
import psutil
from checker_mono import JudgeProcessor

class JudgeServer:
    def __init__(self, host='0.0.0.0', port=5557, core_id = 2):
        self.host = host
        self.port = port
        self.core_id = core_id
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.active_connections = 0
        self.max_connections = 1

    def start(self):
        p = psutil.Process(os.getpid())
        p.cpu_affinity([self.core_id])

        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(5)
        print(f"Judge Server listening on {self.host}:{self.port}")

        while True:
            client_socket, addr = self.server_socket.accept()
            if self.active_connections >= self.max_connections:
                client_socket.send(json.dumps({"status": "error", "message": "Server busy"}).encode())
                client_socket.close()
                continue

            self.active_connections += 1
            print(f"Accepted connection from {addr}")
            threading.Thread(
                target=self.handle_client,
                args=(client_socket,)
            ).start()

    def handle_client(self, client_socket):
        try:
            data = client_socket.recv(1024).decode()
            if not data:
                return

            request = json.loads(data)
            print(f"Received request: {request}")

            # Xử lý yêu cầu chấm bài
            processor = JudgeProcessor()
            response = processor.process_submission(
                request['submission_id'],
                request['problem_id'],
                request['source_path'],
                request['language']
            )

            client_socket.send(json.dumps(response).encode())
        except Exception as e:
            print(f"Error handling client: {str(e)}")
            client_socket.send(json.dumps({"status": "error tai judge_5555", "message": str(e)}).encode())
        finally:
            self.active_connections -= 1
            client_socket.close()

if __name__ == '__main__':
    server = JudgeServer()
    server.start()