// Q3: Write a function that can rotate the values of three variables. print the results in main function.
#include <stdio.h>

// Function to rotate values: a → b, b → c, c → a
void rotate(int *x, int *y, int *z) {
    int temp = *x;
    *x = *y;
    *y = *z;
    *z = temp;
}

int main() {
    int a = 1, b = 2, c = 3;

    printf("Before rotation:\n");
    printf("a = %d, b = %d, c = %d\n", a, b, c);

    rotate(&a, &b, &c);

    printf("\nAfter rotation:\n");
    printf("a = %d, b = %d, c = %d\n", a, b, c);

    return 0;
}
