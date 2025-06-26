import threading
import time
from flask import Flask, jsonify
from pyngrok import ngrok, conf, exception
import pymysql
from db_config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

def update_judge_server_url(new_url):
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn:
            with conn.cursor() as cursor:
                sql = "UPDATE judgeservers SET url = %s WHERE id = 1"
                cursor.execute(sql, (new_url,))
            conn.commit()
        print(f"[DB] Đã cập nhật ngrok URL: {new_url}")
    except Exception as e:
        print(f"[DB ERROR] Không thể cập nhật judgeservers: {e}")

app = Flask(__name__)

FLASK_PORT = 5000
def start_ngrok(port):
    try:
        print(f"[{time.strftime('%H:%M:%S')}] Đang khởi động ngrok cho cổng {port}...")
        http_tunnel = ngrok.connect(port, "http")

        public_url = http_tunnel.public_url
        print(f"[{time.strftime('%H:%M:%S')}] ngrok Public URL: {public_url}")
        update_judge_server_url(public_url)
        return public_url
    except exception.PyngrokNgrokInstallError as e:
        print(f"[{time.strftime('%H:%M:%S')}] Lỗi cài đặt ngrok: {e}")
        print("Vui lòng tải ngrok.exe thủ công từ https://ngrok.com/download, giải nén và đặt vào thư mục PATH hoặc chỉ định ngrok_path trong script.")
        return None
    except exception.PyngrokNgrokURLError as e:
        print(f"[{time.strftime('%H:%M:%S')}] Lỗi cấu hình ngrok: {e}")
        print("Đảm bảo bạn đã thêm authtoken vào ngrok. Bạn có thể làm điều này bằng cách chạy 'ngrok config add-authtoken YOUR_AUTHTOKEN' trong terminal.")
        return None
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Lỗi khi khởi động ngrok: {e}")
        return None

def run_flask():
    print(f"[{time.strftime('%H:%M:%S')}] Đang khởi động ứng dụng Flask trên cổng {FLASK_PORT}...")
    app.run(port=FLASK_PORT, debug=False, use_reloader=False)

@app.route('/', methods=["GET"])
def home_page():
    data_set = {'Page': 'Home', 'Message': 'Turtle get code'}
    print(f"[{time.strftime('%H:%M:%S')}] Yêu cầu tới / nhận được.")
    return jsonify(data_set) 

if __name__ == '__main__':
    public_url = start_ngrok(FLASK_PORT)

    if public_url:
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"[{time.strftime('%H:%M:%S')}] Phát hiện Ctrl+C. Đang đóng ngrok tunnel...")
            ngrok.disconnect()
            print(f"[{time.strftime('%H:%M:%S')}] ngrok tunnel đã đóng.")
    else:
        print(f"[{time.strftime('%H:%M:%S')}] Không thể khởi động ngrok. Vui lòng kiểm tra lại cấu hình và kết nối.")

