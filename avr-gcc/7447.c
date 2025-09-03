#define DATA_PIN 2     // Data input (PD2)
#define BCD_A 3        // 7447 A input (PD3)
#define BCD_B 4        // 7447 B input (PD4)
#define BCD_C 5        // 7447 C input (PD5)
#define BCD_D 6        // 7447 D input (PD6)

void setup() {
    pinMode(DATA_PIN, INPUT_PULLUP);   // Data pin input
    pinMode(BCD_A, OUTPUT);
    pinMode(BCD_B, OUTPUT);
    pinMode(BCD_C, OUTPUT);
    pinMode(BCD_D, OUTPUT);
}

void display_one() {
    digitalWrite(BCD_A, HIGH);   // Binary '0001' for 1
    digitalWrite(BCD_B, LOW);
    digitalWrite(BCD_C, LOW);
    digitalWrite(BCD_D, LOW);
}

void display_blank() {
    digitalWrite(BCD_A, LOW);    // Binary '1111' not decoded, keeps display off
    digitalWrite(BCD_B, HIGH);
    digitalWrite(BCD_C, HIGH);
    digitalWrite(BCD_D, HIGH);
}

void loop() {
    static uint8_t prev = LOW;
    uint8_t cur = digitalRead(DATA_PIN);

    if (cur == HIGH && prev == LOW) {
        display_one();      // Show '1' when rising edge is detected
        delay(1000);        // Show for 1 second
        display_blank();    // (Optional) Clear display after
    }
    prev = cur;
    delay(50);              // Sampling every 50ms
}
