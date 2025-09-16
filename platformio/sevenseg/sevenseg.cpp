// 7-seg segment pins (common anode)
#define SEG_A 6
#define SEG_B 7
#define SEG_C 8
#define SEG_D 9
#define SEG_E 10
#define SEG_F 11
#define SEG_G 12

// Show digit 0 or 1 on common-anode 7-seg
void showDigit(int digit) {
  switch (digit) {
    case 0: // 0 → a,b,c,d,e,f ON (LOW), g OFF (HIGH)
      digitalWrite(SEG_A, LOW);
      digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW);
      digitalWrite(SEG_D, LOW);
      digitalWrite(SEG_E, LOW);
      digitalWrite(SEG_F, LOW);
      digitalWrite(SEG_G, HIGH);
      break;
    case 1: // 1 → b,c ON (LOW), others OFF (HIGH)
      digitalWrite(SEG_A, HIGH);
      digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW);
      digitalWrite(SEG_D, HIGH);
      digitalWrite(SEG_E, HIGH);
      digitalWrite(SEG_F, HIGH);
      digitalWrite(SEG_G, HIGH);
      break;
    default: // blank → all OFF
      digitalWrite(SEG_A, HIGH);
      digitalWrite(SEG_B, HIGH);
      digitalWrite(SEG_C, HIGH);
      digitalWrite(SEG_D, HIGH);
      digitalWrite(SEG_E, HIGH);
      digitalWrite(SEG_F, HIGH);
      digitalWrite(SEG_G, HIGH);
  }
}

void setup() {
  pinMode(SEG_A, OUTPUT);
  pinMode(SEG_B, OUTPUT);
  pinMode(SEG_C, OUTPUT);
  pinMode(SEG_D, OUTPUT);
  pinMode(SEG_E, OUTPUT);
  pinMode(SEG_F, OUTPUT);
  pinMode(SEG_G, OUTPUT);

  // Turn all segments OFF initially
  showDigit(-1);

  Serial.begin(9600); // For truth table output
}

void loop() {
  // Cycle through all 16 combinations of A,B,C,D
  for (int inputs = 0; inputs < 16; inputs++) {
    int A = (inputs >> 3) & 1;
    int B = (inputs >> 2) & 1;
    int C = (inputs >> 1) & 1;
    int D = (inputs >> 0) & 1;

    // Logic: Y = AB + CD
    int Y = (A && B) || (C && D);

    // Show Y (0 or 1) on 7-seg
    showDigit(Y);

    // Also print truth table row to Serial Monitor
    Serial.print("A="); Serial.print(A);
    Serial.print(" B="); Serial.print(B);
    Serial.print(" C="); Serial.print(C);
    Serial.print(" D="); Serial.print(D);
    Serial.print(" | Y="); Serial.println(Y);

    delay(1000); // 1 second per row
  }
}
