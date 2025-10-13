module pos_7447(
    input wire a,
    input wire b,
    input wire c,
    output reg [3:0] bcd // connected to 7447 A,B,C,D pins
);

// Compute PoS output
wire f;
assign f = (b | c) & (a | ~c);

always @(*) begin
    if (f == 1'b1)
        bcd = 4'b0001; // BCD for '1'
    else
        bcd = 4'b0000; // BCD for '0'
end

endmodule
