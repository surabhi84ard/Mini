/*
3)Write a function ,that can take two integers, swap their values and print their new 
  values in function itself. function return type should be void.
*/

#include <stdio.h>

// Function to swap and print values
void swap(int a, int b) {
    int temp;

    // Swapping
    temp = a;
    a = b;
    b = temp;

    // Printing inside the function
    printf("After swapping: a = %d, b = %d\n", a, b);
}

int main() {
    int x, y;

    printf("Enter two integers: ");
    scanf("%d %d", &x, &y);

    printf("Before swapping: x = %d, y = %d\n", x, y);

    // Call the function
    swap(x, y);

    return 0;
}
