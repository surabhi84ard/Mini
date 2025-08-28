.include "m328pdef.inc"

.equ STATE_S0 = 0
.equ STATE_S1 = 1

.cseg
.org 0x00
rjmp __start

; Variables
.def state = r16      ; Current state variable
.def inputs = r17     ; Inputs register
.def bcd_output = r18 ; Output for BCD pins

__start:
    ; Initialize ports
    ldi r16, 0x00
    out DDRD, r16         ; PD2, PD3 inputs (others inputs too)
    ldi r16, 0x0F
    out DDRB, r16         ; PB0..PB3 as outputs for BCD

    ; Initialize state to S0
    ldi state, STATE_S0

loop:
    ; Read inputs PD2 (A0) and PD3 (A1)
    in inputs, PIND
    andi inputs, 0x0C     ; Mask PD2 and PD3 (bits 2 and 3)

    ; Check if both inputs are HIGH (bits 2 and 3 set)
    cpi inputs, 0x0C
    brne no_toggle

    ; Toggle state when both inputs are HIGH
    cp state, STATE_S0
    breq set_s1
    ; if not S0, go to S0
set_s0:
    ldi state, STATE_S0
    rjmp output_state
set_s1:
    ldi state, STATE_S1

output_state:
    ; Output state to PB0..PB3 as BCD to drive 7447
    mov bcd_output, state
    out PORTB, bcd_output

    rjmp loop

no_toggle:
    ; No input condition, just output current state
    mov bcd_output, state
    out PORTB, bcd_output
    rjmp loop
