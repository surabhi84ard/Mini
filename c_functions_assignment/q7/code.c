// 7)Write a function that takes two numbers, a and n as input arguments and returns the value of a to the power of n.

#include <stdio.h>

// Function to calculate a^n
int power(int a, int n) {
    int result = 1;
    for (int i = 0; i < n; i++) {
        result *= a;
    }
    return result;
}

int main() {
    int a, n;

    printf("Enter base (a): ");
    scanf("%d", &a);

    printf("Enter exponent (n): ");
    scanf("%d", &n);

    int result = power(a, n);
    printf("%d^%d = %d\n", a, n, result);

    return 0;
}
