#include <Arduino.h>

// Arduino pins connected to 7447
const int PIN_A = 2; // LSB
const int PIN_B = 3;
const int PIN_C = 4;
const int PIN_D = 5; // MSB

void outputDigit(int digit) {
    // Map digit to BCD for segment driver: A = bit 0, B = bit 1, C = bit 2, D = bit 3
    digitalWrite(PIN_A, (digit >> 0) & 1);
    digitalWrite(PIN_B, (digit >> 1) & 1);
    digitalWrite(PIN_C, (digit >> 2) & 1);
    digitalWrite(PIN_D, (digit >> 3) & 1);
}

void setup() {
    Serial.begin(9600);
    pinMode(PIN_A, OUTPUT);
    pinMode(PIN_B, OUTPUT);
    pinMode(PIN_C, OUTPUT);
    pinMode(PIN_D, OUTPUT);
}

void loop() {
    for (int A = 0; A <= 1; A++) {
        for (int B = 0; B <= 1; B++) {
            for (int C = 0; C <= 1; C++) {
                for (int D = 0; D <= 1; D++) {
                    int Y = (A && B) || (C && D); // AB + CD

                    // Show 0 or 1 on 7-segment via 7447, using LSB pin for '1'
                    outputDigit(Y);

                    Serial.print("A="); Serial.print(A);
                    Serial.print(" B="); Serial.print(B);
                    Serial.print(" C="); Serial.print(C);
                    Serial.print(" D="); Serial.print(D);
                    Serial.print(" | Y="); Serial.println(Y);

                    delay(1000);
                }
            }
        }
    }
    while (true);
}
