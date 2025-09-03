// --- 7-seg pins (common anode) ---
#define SEG_A 12
#define SEG_B 13
#define SEG_C A0
#define SEG_D A1
#define SEG_E A2
#define SEG_F A3
#define SEG_G A4

void setup() {
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
void showDigit(char symbol) {
  switch (symbol) {
    case '0': // show 0
      digitalWrite(SEG_A, LOW); digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW); digitalWrite(SEG_D, LOW);
      digitalWrite(SEG_E, LOW); digitalWrite(SEG_F, LOW);
      digitalWrite(SEG_G, HIGH);
      break;
    case '1': // show 1
      digitalWrite(SEG_A, HIGH); digitalWrite(SEG_B, LOW);
      digitalWrite(SEG_C, LOW);  digitalWrite(SEG_D, HIGH);
      digitalWrite(SEG_E, HIGH); digitalWrite(SEG_F, HIGH);
      digitalWrite(SEG_G, HIGH);
      break;
    case 'X': // don’t care → show dash "-"
      digitalWrite(SEG_A, HIGH); digitalWrite(SEG_B, HIGH);
      digitalWrite(SEG_C, HIGH); digitalWrite(SEG_D, LOW);
      digitalWrite(SEG_E, HIGH); digitalWrite(SEG_F, HIGH);
      digitalWrite(SEG_G, HIGH);
      break;
  }
}

void loop() {
  for (int inputs = 0; inputs < 16; inputs++) {
    int A = (inputs >> 3) & 1;
    int B = (inputs >> 2) & 1;
    int C = (inputs >> 1) & 1;
    int D = (inputs >> 0) & 1;

    // Compute AB + CD
    int AB = A & B;
    int CD = C & D;
    int Y = AB | CD;

    char symbol;
    // Example: let’s make don’t care when inputs = 5 or 10
    if (inputs == 5 || inputs == 10) {
      symbol = 'X'; // don’t care
    } else {
      symbol = (Y == 1) ? '1' : '0';
    }

    showDigit(symbol);

    // Print truth table
    Serial.print("A="); Serial.print(A);
    Serial.print(" B="); Serial.print(B);
    Serial.print(" C="); Serial.print(C);
    Serial.print(" D="); Serial.print(D);
    Serial.print(" | Y="); Serial.println(symbol);

    delay(1000);
  }
}
