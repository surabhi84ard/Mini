.text
.global __start

__start:
    ; Set DDRD = 0x00 (PD2, PD3, PD4 as input)
    ldi r16, 0x00
    out 0x0A, r16        ; DDRD = 0x0A

    ; Set DDRB = 0x20 (PB5 as output)
    ldi r16, 0x20
    out 0x04, r16        ; DDRB = 0x20
loop:
    ; Read PIND
    in r17, 0x09         ; PIND = 0x09

    ; Extract A0 (PD2)
    mov r18, r17
    andi r18, 0x04       ; Mask bit 2
    lsr r18
    lsr r18              ; r18 = A0

    ; Extract A1 (PD3)
    mov r19, r17
    andi r19, 0x08       ; Mask bit 3
    lsr r19
    lsr r19
    lsr r19              ; r19 = A1

    ; Extract C (PD4)
    mov r20, r17
    andi r20, 0x10       ; Mask bit 4
    lsr r20
    lsr r20
    lsr r20
    lsr r20              ; r20 = C

    ; MUX logic
    tst r20
    breq use_a0
use_a1:
    mov r21, r19
    rjmp set_output
use_a0:
    mov r21, r18

set_output:
    ; Clear PB5
    in r22, 0x05         ; PORTB = 0x05
    andi r22, 0xDF       ; Clear bit 5 (0xDF = 11011111)

    ; If r21 == 1, set PB5
    tst r21
    breq skip_set
    ori r22, 0x20        ; Set bit 5

skip_set:
    out 0x05, r22        ; Write to PORTB
    rjmp loop
