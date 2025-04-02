import sys
import math

EPSILON = 1e-6  
def is_float_equal(a, b, epsilon=EPSILON):
    try:
        return abs(float(a) - float(b)) < epsilon
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
        expected_lines = f.readlines()
    # with open(output_file, 'r') as f:
    #     output_lines = f.readlines()
    
    if len(expected_lines) != len(output_lines):
        return "WA"
    
    for expected, output in zip(expected_lines, output_lines):
        if not compare_lines(expected, output):
            return "WA"
    return "AC"    
