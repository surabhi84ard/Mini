// 12)"Write a function to accept a character as input, return case reverse of the character. char CaseReverse(char );"

#include <stdio.h>

// Function to reverse case
char CaseReverse(char c) {
    if (c >= 'A' && c <= 'Z') {
        return c + ('a' - 'A');  // Convert to lowercase
    } else if (c >= 'a' && c <= 'z') {
        return c - ('a' - 'A');  // Convert to uppercase
    } else {
        return c;  // Non-alphabetic, return unchanged
    }
}

int main() {
    char ch, result;

    printf("Enter a character: ");
    scanf(" %c", &ch);  // space before %c to skip whitespace

    result = CaseReverse(ch);

    printf("Case reversed character: %c\n", result);

    return 0;
}
