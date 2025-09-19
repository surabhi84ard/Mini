#define DATA_PIN 2      // Input representing Data for first 7474
#define CLOCK_PIN 7     // (Optional) Clock for sync; if polling, you can skip this

uint8_t ff1_Q = 0;      // Q output of first 7474
uint8_t ff2_Q = 0;      // Q output of second 7474

void setup() {
    pinMode(DATA_PIN, INPUT_PULLUP);
}

void loop() {
    static uint8_t prev_clock = LOW;
    uint8_t cur_data = digitalRead(DATA_PIN);
    uint8_t cur_clock = HIGH; // If you want to sync to clock, else simulate one

    // Update flip-flops on clock rising edge (simulate)
    if (/* simulate clock rising edge or just update every poll */) {
        ff2_Q = ff1_Q;       // Second flip-flop receives output of first
        ff1_Q = cur_data;    // First flip-flop receives current data
    }

    // Edge detect logic: Y = ff1_Q AND (NOT ff2_Q)
    uint8_t Y = ff1_Q && (!ff2_Q);

    if (Y) {
        // Rising edge detected! Output signal, blink LED, etc.
        // For example, turn on an LED at pin 13 for 1s
        digitalWrite(13, HIGH);
        delay(1000);
        digitalWrite(13, LOW);
    }

    delay(50); // Poll interval
}
