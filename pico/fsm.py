from machine import Pin
import time

# Output pins for each state indicator LED
led_S0 = Pin(0, Pin.OUT)
led_S1 = Pin(1, Pin.OUT)
led_S2 = Pin(2, Pin.OUT)

# States as a list of tuples (S0, S1, S2)
states = [
    (1, 0, 0),  # S0 ON
    (0, 1, 0),  # S1 ON
    (0, 0, 1),  # S2 ON
]

while True:
    for state in states:
        led_S0.value(state[0])
        led_S1.value(state[1])
        led_S2.value(state[2])
        time.sleep(1)  # Next state after 1 second
