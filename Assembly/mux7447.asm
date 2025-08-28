.include "m328pdef.inc"  ; or define register names manually if unavailable

.cseg
.org 0x00
rjmp __start

__start:
    ; Set PD2, PD3, PD4 as input
    ldi r16, 0x00
    out DDRD, r16          ; DDRD controls PD ports, set those as input

    ; Set PB5 as output (Arduino Digital 13)
    ldi r16, 0x20
    out DDRB, r16          ; DDRB controls PB ports, set PB5 as output

loop:
    ; Read PIND
    in r17, PIND           ; Read port D

    ; Extract A0 (PD2)
    mov r18, r17
    andi r18, 0x04         ; Mask bit 2
    lsr r18
    lsr r18                ; r18 = A0

    ; Extract A1 (PD3)
    mov r19, r17
    andi r19, 0x08         ; Mask bit 3
    lsr r19
    lsr r19
    lsr r19                ; r19 = A1

    ; Extract C (PD4)
    mov r20, r17
    andi r20, 0x10         ; Mask bit 4
    lsr r20
    lsr r20
    lsr r20
    lsr r20                ; r20 = C

    ; MUX logic
    tst r20
    breq use_a0
use_a1:
    mov r21, r19
    rjmp set_output
use_a0:
    mov r21, r18

set_output:
    in r22, PORTB          ; Read PORTB
    andi r22, 0xDF         ; Clear PB5 (bit 5)

    tst r21
    breq skip_set
    ori r22, 0x20          ; Set PB5 (bit 5)

skip_set:
    out PORTB, r22         ; Write PORTB
    rjmp loop
