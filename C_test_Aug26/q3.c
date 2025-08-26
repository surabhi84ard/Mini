#include <stdio.h>

int main() {
    int a, b, i;

    printf("Enter the first number: ");
    scanf("%d", &a);
    printf("Enter the second number: ");
    scanf("%d", &b);

    printf("Numbers between %d and %d are:\n", a, b);

    if (a < b) {
        for (i = a; i <= b; i++) {
            printf("%d ", i);
        }
    } else {
        for (i = a; i >= b; i--) {
            printf("%d ", i);
        }
    }

    printf("\n");
    return 0;
}
