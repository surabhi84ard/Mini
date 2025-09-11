/*
4)"write a function that can take an integer as input and return 1, 
if the number is prime number and 0 if it is not prime and print appropriate output message.
return type is integer. IsPrime - returns int (0,1)"
  */

#include <stdio.h>

// Function to check prime
int IsPrime(int n) {
    if (n <= 1) {
        return 0;  // 0 and 1 are not prime
    }

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return 0;  // Not prime
        }
    }
    return 1;  // Prime
}

int main() {
    int num;

    printf("Enter an integer: ");
    scanf("%d", &num);

    if (IsPrime(num)) {
        printf("%d is a Prime number.\n", num);
    } else {
        printf("%d is NOT a Prime number.\n", num);
    }

    return 0;
}
