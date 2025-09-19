#include <avr/io.h>
#include <util/delay.h>

// Define CPU frequency for <util/delay.h>
#ifndef F_CPU
#define F_CPU 16000000UL   // 16 MHz for Arduino Uno
#endif

// Common Anode 7-segment patterns (abcdefg order, active low)
#define SEG_ZERO 0b1000000  // Display "0"
#define SEG_ONE  0b1111001  // Display "1"

int main(void) {
    // Configure DATA on PD0 as input
    DDRD &= ~(1<<PD0);

    // Configure CLOCK on PD1 as input
    DDRD &= ~(1<<PD1);

    // Configure PORTB as output (7-segment connected)
    DDRB = 0xFF;

    uint8_t Q1 = 0;   // First FF output
    uint8_t Q2 = 0;   // Second FF output
    uint8_t prevClock = 0;  // To detect rising edge

    while (1) {
        uint8_t clk = (PIND >> PD1) & 1;   // Read CLOCK
        uint8_t data = (PIND >> PD0) & 1;  // Read DATA

        // Detect rising edge of CLOCK
        if (clk == 1 && prevClock == 0) {
            Q2 = Q1;      // Second FF gets old Q1
            Q1 = data;    // First FF gets DATA
        }
        prevClock = clk;

        // Circuit output: Y = Q1 AND NOT Q2
        uint8_t Y = Q1 & (~Q2 & 1);

        // Drive 7-segment
        if (Y == 1) {
            PORTB = SEG_ONE;   // Show "1"
        } else {
            PORTB = SEG_ZERO;  // Show "0"
        }

        _delay_ms(50);  // slow down loop
    }
}
