module led_blink(
    input wire clk,         // External clock input (e.g., 50 MHz)
    output reg led          // Output pin to LED
);

reg [23:0] counter = 0;    // 24-bit counter, adjust for blink speed

always @(posedge clk) begin
    counter <= counter + 1;
    if(counter == 24'd5000000) begin // Approx half period (adjust value for speed)
        led <= ~led;
        counter <= 0;
    end
end

endmodule
