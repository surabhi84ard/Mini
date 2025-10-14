const int ledPin = 2; // Output LED to indicate Y

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Simulate all input combinations (A, B, C)
  for (int i = 0; i < 8; i++) {
    bool A = (i & 0x4) >> 2;
    bool B = (i & 0x2) >> 1;
    bool C = (i & 0x1);

    // Directly use minimal expression from K-map:
    bool Y = (A && B && !C) || (A && !B && C);

    // Output result to LED
    digitalWrite(ledPin, Y);

    delay(500); // Wait for half a second before next combination
  }
}
