// 14)Write a function to take a number and return its square, without using * operator.\

#include <stdio.h>

// Function to return square without using *
int square(int n) {
    int result = 0;
    int abs_n = (n < 0) ? -n : n; // handle negative numbers

    for (int i = 0; i < abs_n; i++) {
        result += abs_n;  // repeated addition
    }

    return result;
}

int main() {
    int num;

    printf("Enter an integer: ");
    scanf("%d", &num);

    int sq = square(num);
    printf("Square of %d = %d\n", num, sq);

    return 0;
}
