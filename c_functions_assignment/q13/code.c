// 13)Write a function to return the product of two numbers without using * operator.

#include <stdio.h>

// Function to multiply without using *
int multiply(int a, int b) {
    int result = 0;
    int positive = 1;

    // Handle negative numbers
    if (a < 0) {
        a = -a;
        positive = -positive;
    }
    if (b < 0) {
        b = -b;
        positive = -positive;
    }

    // Repeated addition
    for (int i = 0; i < b; i++) {
        result += a;
    }

    return positive * result;
}

int main() {
    int x, y;

    printf("Enter two integers: ");
    scanf("%d %d", &x, &y);

    int product = multiply(x, y);
    printf("Product of %d and %d = %d\n", x, y, product);

    return 0;
}
