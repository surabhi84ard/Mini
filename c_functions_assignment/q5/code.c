/*
5)"Write a program with a function that takes two integer arguments, and prints all prime numbers between those numbers using 
the prime number function written above.return type should be void. PrintAllPrimes - return type is void. Should use 
IsPrime() function written in Q3 to identify if given number is prime or not."
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

// Function to print all primes in range
void PrintAllPrimes(int start, int end) {
    printf("Prime numbers between %d and %d are:\n", start, end);
    for (int i = start; i <= end; i++) {
        if (IsPrime(i)) {
            printf("%d ", i);
        }
    }
    printf("\n");
}

int main() {
    int num1, num2;

    printf("Enter two integers (range): ");
    scanf("%d %d", &num1, &num2);

    PrintAllPrimes(num1, num2);

    return 0;
}
