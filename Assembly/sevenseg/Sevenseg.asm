; --- 2:1 MUX with 7-seg Display ---
; A0 = PD0, A1 = PD1, C = PD2
; 7-seg connected to PORTB (common anode)

.include "m328pdef.inc"

.org 0x00
    rjmp RESET

RESET:
    ; set PORTD as input (A0,A1,C)
    ldi r16, 0x00
    out DDRD, r16

    ; set PORTB as output (7-seg)
    ldi r16, 0xFF
    out DDRB, r16

MAIN:
    ; Read inputs
    in r17, PIND       ; r17 = [D7..D0]
    
    ; Extract A0, A1, C
    mov r18, r17
    andi r18, 0x01     ; r18 = A0
    mov r19, r17
    lsr r19            ; shift >> 1
    andi r19, 0x01     ; r19 = A1
    mov r20, r17
    lsr r20
    lsr r20            ; shift >> 2
    andi r20, 0x01     ; r20 = C

    ; --- MUX logic: X = A0·C' + A1·C ---

    com r20            ; r20 = ~C (invert)
    andi r20, 0x01

    mov r21, r18       ; r21 = A0
    and r21, r20       ; r21 = A0·C'

    mov r22, r19       ; r22 = A1
    mov r23, r17
    lsr r23
    lsr r23
    andi r23, 0x01     ; r23 = C
    and r22, r23       ; r22 = A1·C

    or r21, r22        ; r21 = X (final output 0/1)

    ; --- Drive 7-seg (common anode) ---
    cpi r21, 0
    breq SHOW_0
    cpi r21, 1
    breq SHOW_1

SHOW_0:
    ldi r24, 0b1000000 ; code for 0
    out PORTB, r24
    rjmp MAIN

SHOW_1:
    ldi r24, 0b1111001 ; code for 1
    out PORTB, r24
    rjmp MAIN
