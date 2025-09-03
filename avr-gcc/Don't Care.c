#include <avr/io.h>
#include <util/delay.h>

#ifndef F_CPU
#define F_CPU 16000000UL   // 16 MHz clock
#endif

// Common Anode 7-seg patterns (abcdefg order, active low)
#define SEG_ZERO 0b1000000  // "0"
#define SEG_ONE  0b1111001  // "1"
#define SEG_DASH 0b1111110  // "-"

int main(void) {
    // Inputs
    DDRD &= ~((1<<PD0) | (1<<PD1));  // PD0=DATA, PD1=CLOCK as input

    // Output to 7-segment
    DDRB = 0xFF;

    uint8_t Q1 = 0, Q2 = 0;
    uint8_t prevClock = 0;

    while (1) {
        uint8_t clk = (PIND >> PD1) & 1;
        uint8_t data = (PIND >> PD0) & 1;

        // Rising edge detection
        if (clk == 1 && prevClock == 0) {
            Q2 = Q1;
            Q1 = data;
        }
        prevClock = clk;

        // Truth table with don't care
        if (Q1 == 0 && Q2 == 0) {
            PORTB = SEG_ZERO;   // show "0"
        }
        else if (Q1 == 1 && Q2 == 0) {
            PORTB = SEG_ONE;    // show "1"
        }
        else {
            PORTB = SEG_DASH;   // don't care → show "-"
        }

        _delay_ms(100);
    }
}
