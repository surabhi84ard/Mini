#include <stdio.h>

int main() {
    int n, i = 0;
    int a, b, result;
    char opr;

    printf("How many calculations do you want to perform? ");
    scanf("%d", &n);

    while (i < n) {
        printf("\nEnter two numbers: ");
        scanf("%d %d", &a, &b);

        printf("Enter operator (+, -, *, /, %%): ");
        scanf(" %c", &opr);

        switch (opr) {
            case '+':
                result = a + b;
                printf("Result: %d\n", result);
                break;
            case '-':
                result = a - b;
                printf("Result: %d\n", result);
                break;
            case '*':
                result = a * b;
                printf("Result: %d\n", result);
                break;
            case '/':
                if (b == 0) {
                    printf("Error: Division by zero!\n");
                }
               
                else {
                    result = a / b;
                    printf("Result: %d\n", result);
                }
                break;
            case '%':
                if (b == 0) {
                    printf("Error: Modulo by zero!\n");

                } else {
                    result = a % b;
                    printf("Result: %d\n", result);
                }
                break;
            default:
                printf("Invalid operator!\n");
        }
        i++;
    }

    return 0;
}
