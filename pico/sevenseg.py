from machine import Pin
import time

# Pin mapping for segments a–g
segments = [Pin(i, Pin.OUT) for i in (0, 1, 2, 3, 4, 5, 6)]

# Segment patterns for digits 0–9 (a–g)
digit_patterns = [
    [1,1,1,1,1,1,0], # 0
    [0,1,1,0,0,0,0], # 1
    [1,1,0,1,1,0,1], # 2
    [1,1,1,1,0,0,1], # 3
    [0,1,1,0,0,1,1], # 4
    [1,0,1,1,0,1,1], # 5
    [1,0,1,1,1,1,1], # 6
    [1,1,1,0,0,0,0], # 7
    [1,1,1,1,1,1,1], # 8
    [1,1,1,1,0,1,1], # 9
]

while True:
    for num in range(10):
        for i in range(7):
            segments[i].value(digit_patterns[num][i])
        time.sleep(1)
