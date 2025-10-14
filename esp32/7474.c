// Simulate D flip-flop states
bool FF_A = 0;
bool FF_B = 0;

void setup() {
  pinMode(2, OUTPUT); // LED indicator for Y
}

void loop() {
  // Simulated input C (you can alternate or randomize it)
  for (int i = 0; i < 8; i++) {
    bool A = (i & 0x4) >> 2; // D input for FF_A
    bool B = (i & 0x2) >> 1; // D input for FF_B
    bool C = (i & 0x1);

    // Update FFs to new state (simulate clock edge)
    FF_A = A;
    FF_B = B;

    // Calculate Y from flip-flop outputs
    bool Y = (FF_A && FF_B && !C) || (FF_A && !FF_B && C);

    digitalWrite(2, Y); // LED ON if Y=1

    delay(500); // Wait before next input combination
  }
}
