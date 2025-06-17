import requests
import threading
import time
import json
from logger import log_time1

def clear_logs():
    filenames = [
        "logs/time1.txt",
        "logs/time2.txt",
        "logs/time3.txt",
        "logs/time4.txt"
    ]
    for file in filenames:
        open(file, "w").close()

clear_logs()

PROBLEM_ID = 1

API_URL = f"http://localhost:4444/api/problem/{PROBLEM_ID}/submit"

source_code = '''#include <bits/stdc++.h>
using namespace std;
int main()
{
   ios_base::sync_with_stdio(false);
   cin.tie(NULL);
   cout.tie(NULL);

   long long n;
   cin>>n;
   while (n!=1) {
      cout<<n<<" ";
      n=(n%2==0) ? n/2 : n*3+1;
   }
   cout<<n;
}'''

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJtaW5obmhhdG1uMTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTAxMTEwMzYsImV4cCI6MTc1MDExNDYzNn0.WeYswRrN7ar3pZiFtTWZreqKo-7D6wHTvzf1JCeI3O8"  
}
SUBMIT_DATA = {
    "code": source_code,
    "language": "cpp",
    "timelimit_ms": 1000,
    "memorylimit_kb": 1024
}

def submit_code(thread_id):
    start = time.time()
    response = requests.post(API_URL, headers=HEADERS, data=json.dumps(SUBMIT_DATA))
    log_time1(response.json().get("data"), time.time())
    end = time.time()
    print(f"[Thread {thread_id}] Status: {response.status_code} | Time: {round(end - start, 3)}s")

threads = []
NUM_USERS = 100

for i in range(NUM_USERS):
    t = threading.Thread(target=submit_code, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
