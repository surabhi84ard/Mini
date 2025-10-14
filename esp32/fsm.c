// Pin for output (LED)
const int ledPin = 2;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Simulate all 8 possible states of (A, B, C)
  for (int state = 0; state < 8; state++) {
    bool A = (state & 0x4) >> 2;
    bool B = (state & 0x2) >> 1;
    bool C = (state & 0x1);

    // Mealy FSM output logic: Y = AB!C + A!BC
    bool Y = (A && B && !C) || (A && !B && C);

    // Output Y to LED: ON if Y=1, OFF if Y=0
    digitalWrite(ledPin, Y);

    delay(500); // Hold for half a second for each state
  }
}
