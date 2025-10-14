// Define ESP32 pins for 7447 BCD inputs
const int bcdPins[4] = {25, 26, 27, 14}; // A, B, C, D

void setup() {
  for (int i = 0; i < 4; i++) pinMode(bcdPins[i], OUTPUT);
}

void setBCD(int value) {
  for (int i = 0; i < 4; i++)
    digitalWrite(bcdPins[i], (value >> i) & 0x01);
}

void loop() {
  // Loop over all input combinations (simulate A, B, C)
  for (int i = 0; i < 8; i++) {
    bool A = (i & 0x4) >> 2;
    bool B = (i & 0x2) >> 1;
    bool C = (i & 0x1);

    // Implement Y = AB!C + A!BC
    bool Y = (A && B && !C) || (A && !B && C);

    // On 7447, write "1" if Y=1, else "0"
    if (Y)
      setBCD(1); // Show "1"
    else
      setBCD(0); // Show "0"

    delay(1000);
  }
}
