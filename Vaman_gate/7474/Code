module gate_pos_7474(
    input wire clk,      // Clock source for DFF
    input wire a,
    input wire b,
    input wire c,
    output wire D_out    // Connect this to 7474 D input
);

assign D_out = (b | c) & (a | ~c);

endmodule
