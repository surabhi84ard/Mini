#include <Arduino.h>
void setup() {
    Serial.begin(9600);
    pinMode(8, OUTPUT); // LED output pin
}
void loop() {
    for (int A = 0; A <= 1; A++) {
        for (int B = 0; B <= 1; B++) {
            for (int C = 0; C <= 1; C++) {
                for (int D = 0; D <= 1; D++) {
                    // Directly compute Y = (A AND B) OR (C AND D)
                    bool Y = (A && B) || (C && D);
                    // Print truth table row
                    Serial.print("A="); Serial.print(A);
                    Serial.print(" B="); Serial.print(B);
                    Serial.print(" C="); Serial.print(C);
                    Serial.print(" D="); Serial.print(D);
                    Serial.print(" | Y="); Serial.println(Y);
                    // Drive LED according to Y value
                    digitalWrite(8, Y ? HIGH : LOW);
                    delay(1000);
                }
            }
        }
    }
    while (true); // stop after one full truth table
}
