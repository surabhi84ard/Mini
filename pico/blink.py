from machine import Pin
import time

led = Pin(25, Pin.OUT)  # Onboard LED is GPIO 25 on Pico

while True:
    led.toggle()  # Toggle LED state
    time.sleep(0.5)  # 500 ms delay
