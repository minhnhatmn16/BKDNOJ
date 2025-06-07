import sys
import math
import time

EPSILON = 1e-6  
def is_float_equal(a, b, epsilon=EPSILON):
    try:
        af = float(a)
        bf = float(b)
        return abs(af - bf) < epsilon
    except ValueError:
        return False

def compare_lines(expected, output):
    expected = expected.strip()
    output = output.strip()
    
    if expected == output:
        return True  
    
    expected_tokens = expected.split()
    output_tokens = output.split()
    
    if len(expected_tokens) != len(output_tokens):
        return False  
    
    for e, o in zip(expected_tokens, output_tokens):
        if e != o and not is_float_equal(e, o):
            return False  
    
    return True

def check(expected_file, output_lines):
    with open(expected_file, 'r') as f:
        for i, (expected_line, output_line) in enumerate(zip(f, output_lines)):
            if not compare_lines(expected_line.rstrip('\n'), output_line.rstrip('\n')):
                return "WA"
        
        if sum(1 for _ in f) + i + 1 != len(output_lines):
            return "WA"
    return "AC"    
