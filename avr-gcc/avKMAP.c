uint8_t ff1_Q;   // Output of first flip-flop (Q1)
uint8_t ff2_Q;   // Output of second flip-flop (Q2)

void loop() {
    // Assume you update ff1_Q and ff2_Q at each clock tick as per previous code:
    // ff2_Q = ff1_Q_last
    // ff1_Q = digitalRead(DATA_PIN);

    uint8_t Y = ff1_Q && (!ff2_Q);

    if (Y) {
        // Output logic: for example, show '1' on display, turn LED on, etc.
        // display_one();
    }
}
