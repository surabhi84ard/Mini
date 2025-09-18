; --- 2:1 MUX using 7474 + 7-seg ---
; Inputs: A0=PD0, A1=PD1, C=PD2
; Q1=PD3, Q2=PD4 (from 7474 outputs)
; 7-seg on PORTB (common anode)

.include "m328pdef.inc"

.org 0x00
    rjmp RESET

RESET:
    ; PORTD as input (A0,A1,C,Q1,Q2)
    ldi r16, 0x00
    out DDRD, r16

    ; PORTB as output (7-seg)
    ldi r16, 0xFF
    out DDRB, r16

MAIN:
    ; Read inputs
    in r17, PIND       ; A0=A1=C=Q1=Q2 in r17

    ; Extract inputs
    mov r18, r17
    andi r18, 0x01     ; A0
    mov r19, r17
    lsr r19
    andi r19, 0x01     ; A1
    mov r20, r17
    lsr r20
    lsr r20
    andi r20, 0x01     ; C

    ; Get Q1 and Q2 from flip-flops
    mov r21, r17
    lsr r21
    lsr r21
    lsr r21
    andi r21, 0x01     ; Q1 at PD3

    mov r22, r17
    lsr r22
    lsr r22
    lsr r22
    lsr r22
    andi r22, 0x01     ; Q2 at PD4

    ; Final MUX output: X = Q1 + Q2
    or r21, r22        ; r21 = X

    ; --- Drive 7-seg display ---
    cpi r21, 0
    breq SHOW_0
    cpi r21, 1
    breq SHOW_1

SHOW_0:
    ldi r24, 0b1000000 ; 0 on CA 7-seg
    out PORTB, r24
    rjmp MAIN

SHOW_1:
    ldi r24, 0b1111001 ; 1 on CA 7-seg
    out PORTB, r24
    rjmp MAIN
