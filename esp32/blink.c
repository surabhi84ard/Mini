// Pin assignments
const int pinA = 13;     // Change as required
const int pinB = 12;     // Change as required
const int pinC = 14;     // Change as required
const int ledPin = 2;    // Onboard LED (or choose any GPIO)

void setup() {
  pinMode(pinA, INPUT_PULLUP);  // Buttons/switches should connect to GND when ON
  pinMode(pinB, INPUT_PULLUP);
  pinMode(pinC, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Read inputs (active LOW)
  bool A = !digitalRead(pinA);
  bool B = !digitalRead(pinB);
  bool C = !digitalRead(pinC);

  // Implement Y = (A && B && !C) || (A && !B && C)
  bool Y = (A && B && !C) || (A && !B && C);

  // Blink LED for Y = 1, else keep off
  if (Y) {
    digitalWrite(ledPin, HIGH);
    delay(500);             // LED ON for 500 ms
    digitalWrite(ledPin, LOW);
    delay(500);             // LED OFF for 500 ms
  } else {
    digitalWrite(ledPin, LOW);
  }
}
