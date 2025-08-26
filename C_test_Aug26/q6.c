#include <stdio.h>

int main() {
    int a, b, i;

    printf("Enter the first number : ");
    scanf("%d", &a);
    printf("Enter the second number : ");
    scanf("%d", &b);

    printf("\nNumbers in reverse order:\n");

    if (a > b) {
        for (i = a; i >= b; i--) {
            printf("%d ", i);
        }
    } else {
        for (i = b; i >= a; i--) {
            printf("%d ", i);
        }
    }

    printf("\n");
    return 0;
}
