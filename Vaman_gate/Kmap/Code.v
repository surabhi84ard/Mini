module kmap_gate_vaman(
    input wire a,
    input wire b,
    input wire c,
    output wire f
);

assign f = (b | c) & (a | ~c);

endmodule
