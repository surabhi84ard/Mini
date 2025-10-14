module pos_7_segment(
    input wire a,
    input wire b,
    input wire c,
    output reg [6:0] seg
);

// Compute the PoS output
wire f;
assign f = (b | c) & (a | ~c);

// 7-segment decoder for '0' and '1'
// Assuming common cathode display:
// 0 -> seg = 7'b1000000
// 1 -> seg = 7'b1111001

always @(*) begin
    case (f)
        1'b0: seg = 7'b1000000; // display '0'
        1'b1: seg = 7'b1111001; // display '1'
        default: seg = 7'b1111111; // blank
    endcase
end

endmodule
