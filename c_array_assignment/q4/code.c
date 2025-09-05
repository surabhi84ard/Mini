// Q4:  Write a function that can take two integers as input, and gives 5 outputs : addition, subtraction, multiplication, quotient and reminder of those two numbers. Print the outputs in the main function.

#include <stdio.h>

// Function to perform arithmetic operations
void compute(int a, int b, int *sum, int *diff, int *prod, int *quot, int *rem) {
    *sum = a + b;
    *diff = a - b;
    *prod = a * b;

    if (b != 0) {
        *quot = a / b;
        *rem = a % b;
    } else {
        // Handle division by zero
        *quot=0;
        *rem=0;
        printf("Warning: Division by zero is undefined.\n");
    }
}

int main() {
    int num1, num2;
    printf("Enter 2 numbers\n");
    scanf("%d %d", &num1,&num2);
    int sum, diff, prod, quot, rem;

    compute(num1, num2, &sum, &diff, &prod, &quot, &rem);

    printf("Inputs: num1 = %d, num2 = %d\n", num1, num2);
    printf("Addition      : %d\n", sum);
    printf("Subtraction   : %d\n", diff);
    printf("Multiplication: %d\n", prod);
    printf("Quotient      : %d\n", quot);
    printf("Remainder     : %d\n", rem);

    return 0;
}
