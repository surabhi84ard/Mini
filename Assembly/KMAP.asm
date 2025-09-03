.include "m328pdef.inc"

.cseg
.org 0x00
rjmp __start

; Register usage
.def temp = r16
.def F = r17
.def A = r18
.def B = r19
.def C = r20

__start:
    ldi temp, 0x00
    out DDRD, temp         ; PD2, PD3, PD4 as input

    ldi temp, 0x01
    out DDRB, temp         ; PB0 (PORTB.0) as output

loop:
    in temp, PIND          ; Read PORTD

    ; Extract A (PD2)
    mov A, temp
    andi A, 0x04           ; Mask PD2 (bit 2)
    lsr A
    lsr A                  ; Now A is 0 or 1

    ; Extract B (PD3)
    mov B, temp
    andi B, 0x08           ; Mask PD3 (bit 3)
    lsr B
    lsr B
    lsr B                  ; Now B is 0 or 1

    ; Extract C (PD4)
    mov C, temp
    andi C, 0x10           ; Mask PD4 (bit 4)
    lsr C
    lsr C
    lsr C
    lsr C                  ; Now C is 0 or 1

    ; Compute F = ~A*B + A*C

    ; ~A*B
    mov temp, A
    com temp                ; Invert A
    and temp, B             ; ~A * B
    mov F, temp

    ; A*C
    mov temp, A
    and temp, C             ; A * C

    ; F = (~A*B) + (A*C)
    or F, temp

    ; Write to PB0
    in temp, PORTB
    andi temp, 0xFE         ; Clear PB0
    tst F
    breq skip_set
    ori temp, 0x01          ; Set PB0
skip_set:
    out PORTB, temp

    rjmp loop
