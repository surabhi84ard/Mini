/* Q6: Write two source files, main.c and swap.c. The main function initializes a two-element array of ints, 
  and then calls the swap function to swap the pair.
*/ 

#include <stdio.h>

// Declaring the swap function (defined in swap.c)
void swap(int *x, int *y);

int main() {
    int arr[2] = {100, 120};

    printf("Before swap: arr[0] = %d, arr[1] = %d\n", arr[0], arr[1]);

    swap(&arr[0], &arr[1]);

    printf("After swap : arr[0] = %d, arr[1] = %d\n", arr[0], arr[1]);

    return 0;
}
