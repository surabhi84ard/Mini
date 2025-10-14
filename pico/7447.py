from machine import Pin
import time

# Assign Pico pins to BCD inputs (A–D) of 7447
bcd_pins = [Pin(i, Pin.OUT) for i in (0, 1, 2, 3)]  # Use GPIO 0–3 for example

def set_bcd(value):
    for i in range(4):
        bcd_pins[i].value((value >> i) & 1)

while True:
    for num in range(10):
        set_bcd(num)
        time.sleep(1)
