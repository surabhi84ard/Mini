; --- 2:1 MUX using 7474 + 7-seg, with don't cares ---
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
    ; Read PORTD
    in r17, PIND       

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

    ; Get Q1 and Q2
    mov r21, r17
    lsr r21
    lsr r21
    lsr r21
    andi r21, 0x01     ; Q1

    mov r22, r17
    lsr r22
    lsr r22
    lsr r22
    lsr r22
    andi r22, 0x01     ; Q2

    ; Final MUX output: X = Q1 + Q2
    or r21, r22        ; r21 = X

    ; ---- Check for don't care cases ----
    ; Example: let’s say inputs (A0=1, A1=1, C=0) and (A0=0, A1=0, C=1) are don't cares

    ; Case 1: A0=1,A1=1,C=0
    cpi r18, 1
    brne NOT_DC1
    cpi r19, 1
    brne NOT_DC1
    cpi r20, 0
    brne NOT_DC1
    rjmp SHOW_DASH
NOT_DC1:

    ; Case 2: A0=0,A1=0,C=1
    cpi r18, 0
    brne NOT_DC2
    cpi r19, 0
    brne NOT_DC2
    cpi r20, 1
    brne NOT_DC2
    rjmp SHOW_DASH
NOT_DC2:

    ; ---- Normal output ----
    cpi r21, 0
    breq SHOW_0
    cpi r21, 1
    breq SHOW_1

SHOW_0:
    ldi r24, 0b1000000 ; 0
    out PORTB, r24
    rjmp MAIN

SHOW_1:
    ldi r24, 0b1111001 ; 1
    out PORTB, r24
    rjmp MAIN

SHOW_DASH:
    ldi r24, 0b1111110 ; dash "-" on 7-seg
    out PORTB, r24
    rjmp MAIN
