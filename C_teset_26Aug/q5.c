#include <stdio.h>

int main() {
    int a, b, i;

    printf("Enter the first number : ");
    scanf("%d", &a);
    printf("Enter the second number : ");
    scanf("%d", &b);

    printf("\nOdd numbers between %d and %d:\n", a, b);
    if (a < b) {
        for (i = a; i <= b; i++) {
            if (i % 2 != 0) {
                printf("%d ", i);
            }
        }
    } else {
        for (i = a; i >= b; i--) {
            if (i % 2 != 0) {
                printf("%d ", i);
            }
        }
    }

    printf("\n\nEven numbers between %d and %d:\n", a, b);
    if (a < b) {
        for (i = a; i <= b; i++) {
            if (i % 2 == 0) {
                printf("%d ", i);
            }
        }
    } else {
        for (i = a; i >= b; i--) {
            if (i % 2 == 0) {
                printf("%d ", i);
            }
        }
    }

    printf("\n");
    return 0;
}

