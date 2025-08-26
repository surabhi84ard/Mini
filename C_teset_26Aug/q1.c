#include <stdio.h>

int main() {
    int n, i, j, no;

    printf("Enter how many numbers: ");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) {
        printf("\nEnter number %d: ", i);
        scanf("%d", &no);

        printf("Multiplication Table of %d:\n", no);
        for (j = 1; j <= 10; j++) {
            printf("%d x %d = %d\n", no, j, no * j);
        }
        printf("\n");
    }

    return 0;
}
