from machine import Pin
import time

# LED Pin to show output (Y)
led = Pin(0, Pin.OUT)

# Simulate all possible combinations for three inputs
for i in range(8):  # 000 to 111
    A = (i >> 2) & 1
    B = (i >> 1) & 1
    C = i & 1

    # Substitute with your minimized expression from K-map
    # For example, Y = (A and B and not C) or (A and not B and C)
    Y = (A and B and not C) or (A and not B and C)

    led.value(Y)
    print(f"A={A} B={B} C={C} Y={Y}")  # Optional: Show truth table for testing
    time.sleep(1)
led.value(0)  # Turn off LED after cycling

