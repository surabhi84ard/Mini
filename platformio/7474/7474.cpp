// Input signals A,B,C,D
#define A_PIN 2
#define B_PIN 3
#define C_PIN 4
#define D_PIN 5

// 7474 connections
#define D1_PIN 6   // D input of FF1
#define CLK1_PIN 7 // Clock for FF1
#define Q1_PIN 8   // Q output of FF1

#define D2_PIN 9   // D input of FF2
#define CLK2_PIN 10 // Clock for FF2
#define Q2_PIN 11  // Q output of FF2

// 7-seg outputs (common anode)
#define SEG_A 12
#define SEG_B 13
#define SEG_C A0
#define SEG_D A1
#define SEG_E A2
#define SEG_F A3
#define SEG_G A4

void setup() {
  pinMode(A_PIN, INPUT);
  pinMode(B_PIN, INPUT);
  pinMode(C_PIN, INPUT);
  pinMode(D_PIN, INPUT);

  pinMode(D1_PIN, OUTPUT);
  pinMode(CLK1_PIN, OUTPUT);
  pinMode(D2_PIN, OUTPUT);
  pinMode(CLK2_PIN, OUTPUT);

  pinMode(Q1_PIN, INPUT);
  pinMode(Q2_PIN, INPUT);

  pinMode(SEG_A, OUTPUT);
  pinMode(SEG_B, OUTPUT);
  pinMode(SEG_C, OUTPUT);
  pinMode(SEG_D, OUTPUT);
  pinMode(SEG_E, OUTPUT);
  pinMode(SEG_F, OUTPUT);
  pinMode(SEG_G, OUTPUT);

  Serial.begin(9600);
}

// --- Show digit on common-anode 7-seg ---
void showDigit(int digit) {
  switch (digit) {
    case 0:
      digitalWrite(SEG_A, LOW);
      digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW);
      digitalWrite(SEG_D, LOW);
      digitalWrite(SEG_E, LOW);
      digitalWrite(SEG_F, LOW);
      digitalWrite(SEG_G, HIGH);
      break;
    case 1:
      digitalWrite(SEG_A, HIGH);
      digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW);
      digitalWrite(SEG_D, HIGH);
      digitalWrite(SEG_E, HIGH);
      digitalWrite(SEG_F, HIGH);
      digitalWrite(SEG_G, HIGH);
      break;
  }
}

// --- Give a clock pulse to 7474 ---
void clockPulse(int clkPin) {
  digitalWrite(clkPin, LOW);
  delayMicroseconds(5);
  digitalWrite(clkPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(clkPin, LOW);
}

void loop() {
  for (int inputs = 0; inputs < 16; inputs++) {
    int A = (inputs >> 3) & 1;
    int B = (inputs >> 2) & 1;
    int C = (inputs >> 1) & 1;
    int D = (inputs >> 0) & 1;

    // Compute AB and CD
    int AB = A & B;
    int CD = C & D;

    // Load into FF1
    digitalWrite(D1_PIN, AB);
    clockPulse(CLK1_PIN);

    // Load into FF2
    digitalWrite(D2_PIN, CD);
    clockPulse(CLK2_PIN);

    // Read Q outputs
    int Q1 = digitalRead(Q1_PIN);
    int Q2 = digitalRead(Q2_PIN);

    // Final output
    int Y = Q1 | Q2;

    // Show result
    showDigit(Y);

    // Print truth table row
    Serial.print("A="); Serial.print(A);
    Serial.print(" B="); Serial.print(B);
    Serial.print(" C="); Serial.print(C);
    Serial.print(" D="); Serial.print(D);
    Serial.print(" | Y="); Serial.println(Y);

    delay(1000);
  }
}
