/*
6)"Write a function to determine if a character is alphanumeric or not and
print the result in main function. Hint: int fun_alpha_num(char c)"
*/

#include <stdio.h>

// Function to check if character is alphanumeric
int fun_alpha_num(char c) {
    if ((c >= 'A' && c <= 'Z') ||   // Uppercase letters
        (c >= 'a' && c <= 'z') ||   // Lowercase letters
        (c >= '0' && c <= '9')) {   // Digits
        return 1;  // Alphanumeric
    }
    return 0;  // Not alphanumeric
}

int main() {
    char ch;

    printf("Enter a character: ");
    scanf(" %c", &ch);  // space before %c to ignore whitespace

    if (fun_alpha_num(ch)) {
        printf("'%c' is an Alphanumeric character.\n", ch);
    } else {
        printf("'%c' is NOT an Alphanumeric character.\n", ch);
    }

    return 0;
}
