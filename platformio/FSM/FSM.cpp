#include <Arduino.h>

// Assign pins for D flip-flop 7474
const int PIN_D = 6;     // Data input for flip-flop
const int PIN_CLK = 7;   // Clock input for flip-flop
const int PIN_Q = 8;     // Output from flip-flop connected to 7447 or display

void setup() {
    Serial.begin(9600);
    pinMode(PIN_D, OUTPUT);       // Will supply data to D input
    pinMode(PIN_CLK, OUTPUT);     // Will pulse clock
    pinMode(PIN_Q, INPUT);        // Read output Q (could connect to display circuit)
}

void loop() {
    for (int A = 0; A <= 1; A++) {
        for (int B = 0; B <= 1; B++) {
            for (int C = 0; C <= 1; C++) {
                for (int D = 0; D <= 1; D++) {
                    int logicY = (A && B) || (C && D); // Y = AB + CD

                    // Set D input to logicY
                    digitalWrite(PIN_D, logicY);

                    // Pulse the CLK HIGH then LOW to store value
                    digitalWrite(PIN_CLK, HIGH);
                    delay(10); // Short pulse
                    digitalWrite(PIN_CLK, LOW);

                    // Read the Q output from 7474
                    int Y_ff = digitalRead(PIN_Q);

                    Serial.print("A="); Serial.print(A);
                    Serial.print(" B="); Serial.print(B);
                    Serial.print(" C="); Serial.print(C);
                    Serial.print(" D="); Serial.print(D);
                    Serial.print(" | Y_logic="); Serial.print(logicY);
                    Serial.print(" | Y_ff (7474 Q)="); Serial.println(Y_ff);

                    delay(1000);
                }
            }
        }
    }
    while (true); // Stop after displaying all combinations
}
