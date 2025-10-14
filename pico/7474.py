from machine import Pin
import time

# Output pins representing Q of both flip-flops
ff_A = Pin(0, Pin.OUT)
ff_B = Pin(1, Pin.OUT)

# Simulate changing D inputs (A, B)
states = [(0,0), (0,1), (1,0), (1,1)]

while True:
    for D_A, D_B in states:
        # On clock tick, update Q outputs
        ff_A.value(D_A)
        ff_B.value(D_B)
        
        # Optional: Print Q states for debugging
        print("Q_A:", D_A, "Q_B:", D_B)
        
        time.sleep(1)
