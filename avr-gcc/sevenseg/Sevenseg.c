#include <avr/io.h>
#include <util/delay.h>

// Common Anode 7-seg patterns (abcdefg order)
// For CA: 0 = segment ON, 1 = segment OFF
#define SEG_ZERO 0b1000000  // Display "0"
#define SEG_ONE  0b1111001  // Display "1"

int main(void) {
    // Input pin: DATA on PD0
    DDRD &= ~(1<<PD0);  

    // Output port: 7-segment on PORTB
    DDRB = 0xFF;  

    uint8_t lastData = 0;

    while (1) {
        uint8_t currentData = (PIND >> PD0) & 1;  // read DATA

        uint8_t Y = 0;
        if (lastData == 0 && currentData == 1) {
            Y = 1;   // detected 0 → 1 transition
        }

        if (Y == 1) {
            PORTB = SEG_ONE;   // show "1"
        } else {
            PORTB = SEG_ZERO;  // show "0"
        }

        lastData = currentData;   // update history
        _delay_ms(200);           // debounce / slow down
    }
}
