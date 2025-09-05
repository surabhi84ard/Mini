/*
Q5: "Write a function that communicates with main using a single static variable without taking any input arguments.
Everytime function returns something using the static variable,after using it, main sends another input using the same variable and calls the function again.
eg., print the square of each number of an array :
for each number of the array :
    call the function
    main gets the static variable address as return value from function.
    main puts the array element in static variable.
in the function :
    create static variable.
    if static variable value is not zero, print its square.
    function sends static variable address back to main."
*/

#include <stdio.h>

// Function that uses a static variable to communicate with main
int* comm() {
    static int value = 0;

    if (value != 0) {
        printf("Square of %d is %d\n", value, value * value);
        value = 0; // Reset after use
    }

    return &value; // Return address of static variable
}

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6};
    int size = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < size; i++) {
        int *ptr = comm();  // Get address of static variable
        *ptr = arr[i];              // Set value
        comm();             // Trigger square computation
    }

    return 0;
}
