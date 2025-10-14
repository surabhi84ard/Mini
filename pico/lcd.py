from machine import Pin
from time import sleep_ms

# Assign the Pico pins (adjust to your wiring)
RS = 0  # LCD RS pin
EN = 1  # LCD EN pin
D4 = 2  # LCD D4 pin
D5 = 3  # LCD D5 pin
D6 = 4  # LCD D6 pin
D7 = 5  # LCD D7 pin

def pulse_enable(en):
    en.value(1)
    sleep_ms(2)
    en.value(0)
    sleep_ms(2)

def send_nibble(pins, nibble, en):
    for i in range(4):
        pins[i].value((nibble >> i) & 1)
    pulse_enable(en)    

def send_byte(rs, pins, en, byte, char_mode=False):
    rs.value(char_mode)  # Char mode True for data, False for command
    send_nibble(pins, byte >> 4, en)
    send_nibble(pins, byte & 0x0F, en)
    sleep_ms(2)

def lcd_init(rs, en, pins):
    sleep_ms(50)
    # LCD initialization sequence
    for i in range(3):
        send_nibble(pins, 0x03, en)
        sleep_ms(5)
    send_nibble(pins, 0x02, en)
    sleep_ms(5)
    send_byte(rs, pins, en, 0x28)      # Function set: 4-bit, 2 lines, 5x8 dots
    send_byte(rs, pins, en, 0x0C)      # Display on, cursor off, blink off
    send_byte(rs, pins, en, 0x01)      # Clear display
    sleep_ms(2)
    send_byte(rs, pins, en, 0x06)      # Entry mode set

def lcd_write(rs, pins, en, text):
    for c in text:
        send_byte(rs, pins, en, ord(c), True)

def lcd_set_cursor(rs, pins, en, col, row):
    row_offsets = [0x00, 0x40]
    send_byte(rs, pins, en, 0x80 | (col + row_offsets[row]))

# Set up pins
rs = Pin(RS, Pin.OUT)
en = Pin(EN, Pin.OUT)
data_pins = [Pin(D4, Pin.OUT), Pin(D5, Pin.OUT), Pin(D6, Pin.OUT), Pin(D7, Pin.OUT)]

# Initialize LCD
lcd_init(rs, en, data_pins)

def lcd_command(rs, pins, en, cmd):
    rs.value(0)
    send_byte(rs, pins, en, cmd)
# Display "Hello, World!"
lcd_set_cursor(rs, data_pins, en, 0, 0)     # Line 1, position 0
lcd_write(rs, data_pins, en, "Welcome to")
lcd_command(rs, data_pins, en, 0xC0)  # Move cursor to second line
lcd_write(rs, data_pins, en, "IIITB Comet!!")

while True:
    pass

