#include <stdio.h>

// Structure to hold all results
struct ArithmeticResults {
    int sum;
    int difference;
    int product;
    float quotient;
    int remainder;
};

// Function that takes two integers and returns all operations
struct ArithmeticResults compute(int a, int b) {
    struct ArithmeticResults result;
    result.sum = a + b;
    result.difference = a - b;
    result.product = a * b;
    result.quotient = (float)a / b;  // Floating-point division
    result.remainder = a % b;
    return result;
}

int main() {
    int x, y;
    printf("Enter two integers: ");
    scanf("%d %d", &x, &y);

    struct ArithmeticResults r = compute(x, y);

    printf("Sum = %d\n", r.sum);
    printf("Difference = %d\n", r.difference);
    printf("Product = %d\n", r.product);
    printf("Quotient = %.2f\n", r.quotient);
    printf("Remainder = %d\n", r.remainder);

    return 0;
}
