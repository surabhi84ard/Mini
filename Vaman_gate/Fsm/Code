module pos_fsm_vaman(
    input wire clk,      // System clock
    input wire rst,      // Active-high reset
    input wire a,
    input wire b,
    input wire c,
    output reg out      // Output for PoS result
);

typedef enum reg [0:0] {
    STATE_ZERO = 1'b0,
    STATE_ONE  = 1'b1
} state_t;

state_t state, next_state;

// Next state logic
always @(*) begin
    if ( (b | c) & (a | ~c) )
        next_state = STATE_ONE;
    else
        next_state = STATE_ZERO;
end

// FSM state update
always @(posedge clk or posedge rst) begin
    if (rst)
        state <= STATE_ZERO;
    else
        state <= next_state;
end

// Output logic
always @(*) begin
    out = (state == STATE_ONE) ? 1'b1 : 1'b0;
end

endmodule
