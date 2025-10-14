const int segA = 13;
const int segB = 12;
const int segC = 14;
const int segD = 27;
const int segE = 26;
const int segF = 25;
const int segG = 33;

// Segment byte maps for numerals 0 and 1
const byte segMap[2][7] = {
  // a, b, c, d, e, f, g
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}  // 1
}; 

void setup() {
  int segPins[] = {segA, segB, segC, segD, segE, segF, segG};
  for (int i = 0; i < 7; i++) pinMode(segPins[i], OUTPUT);
}

void loop() {
  // Simulate inputs A, B, C as before
  for (int i=0; i<8; i++) {
    bool A = (i & 0x4) >> 2;
    bool B = (i & 0x2) >> 1;
    bool C = (i & 0x1);
    bool Y = (A && B && !C) || (A && !B && C);

    int segPins[] = {segA, segB, segC, segD, segE, segF, segG};
    for (int j=0;j<7;j++)
      digitalWrite(segPins[j], segMap[Y][j]);
    delay(500);
  }
}
