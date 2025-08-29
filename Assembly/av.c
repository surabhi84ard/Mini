#define F_CPU 16000000UL
#include <avr/io.h> 
#include <util/delay.h>

#define DATA_PIN PD2      // Using digital pin 2 for Data input
#define OUTPUT_PIN PD3    // Using digital pin 3 for output Y

int main(void) {
    // Set DATA_PIN as input
    DDRD &= ~(1 << DATA_PIN);  // Clear bit for input
    // Enable pull-up resistor on input pin (optional if needed)
    PORTD |= (1 << DATA_PIN);

    // Set OUTPUT_PIN as output
    DDRD |= (1 << OUTPUT_PIN); // Set bit for output

    uint8_t prev = 0, cur = 0;

    while (1) {
        cur = (PIND & (1 << DATA_PIN)) ? 1 : 0;
        if (cur == 1 && prev == 0) {
            PORTD |= (1 << OUTPUT_PIN);     // LED ON
            _delay_ms(100);                 // Keep ON for 100ms
            PORTD &= ~(1 << OUTPUT_PIN);    // LED OFF
        }
        prev = cur;
        _delay_ms(1000);
    }
}


