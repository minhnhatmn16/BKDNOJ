import time

def log_time1(submission_id, timestamp, filename="logs/time1.txt"):
    with open(filename, "a") as f:
        f.write(f"{submission_id},{timestamp}\n")

def log_time2(submission_id, timestamp, filename="logs/time2.txt"):
    with open(filename, "a") as f:
        f.write(f"{submission_id},{timestamp}\n")

def log_time3(submission_id, timestamp, filename="logs/time3.txt"):
    with open(filename, "a") as f:
        f.write(f"{submission_id},{timestamp}\n")

def log_time4(submission_id, timestamp, filename="logs/time4.txt"):
    with open(filename, "a") as f:
        f.write(f"{submission_id},{timestamp}\n")