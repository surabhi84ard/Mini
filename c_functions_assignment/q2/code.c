/* 
2)Modify the calculator program - with functions ,Add(),Sub(),Mul(),Div(),Mod(). 
  Each function should take the inputs as parameters and return the result as output.
  Hint: int add(int , int); int sub (int, int);
*/

#include <stdio.h>

// Function declarations
int Add(int a, int b);
int Sub(int a, int b);
int Mul(int a, int b);
int Div(int a, int b);
int Mod(int a, int b);

int main() {
    int num1, num2, choice, result;

    printf("Simple Calculator\n");
    printf("-----------------\n");
    printf("1. Addition\n");
    printf("2. Subtraction\n");
    printf("3. Multiplication\n");
    printf("4. Division\n");
    printf("5. Modulus\n");

    printf("Enter your choice (1-5): ");
    scanf("%d", &choice);

    printf("Enter two integers: ");
    scanf("%d %d", &num1, &num2);

    switch (choice) {
        case 1:
            result = Add(num1, num2);
            printf("Result = %d\n", result);
            break;
        case 2:
            result = Sub(num1, num2);
            printf("Result = %d\n", result);
            break;
        case 3:
            result = Mul(num1, num2);
            printf("Result = %d\n", result);
            break;
        case 4:
            if (num2 != 0) {
                result = Div(num1, num2);
                printf("Result = %d\n", result);
            } else {
                printf("Error: Division by zero!\n");
            }
            break;
        case 5:
            if (num2 != 0) {
                result = Mod(num1, num2);
                printf("Result = %d\n", result);
            } else {
                printf("Error: Modulus by zero!\n");
            }
            break;
        default:
            printf("Invalid choice!\n");
    }

    return 0;
}

// Function definitions
int Add(int a, int b) {
    return a + b;
}

int Sub(int a, int b) {
    return a - b;
}

int Mul(int a, int b) {
    return a * b;
}

int Div(int a, int b) {
    return a / b;  // Integer division
}

int Mod(int a, int b) {
    return a % b;
}
