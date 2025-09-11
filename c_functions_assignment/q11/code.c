// 11)Write a function to accept a date and return 1 if the date is valid, 0 if it is not valid.

#include <stdio.h>

// Function to check leap year
int isLeapYear(int year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return 1;
    }
    return 0;
}

// Function to check if date is valid
int isValidDate(int d, int m, int y) {
    if (y < 1) return 0;        // Year must be positive
    if (m < 1 || m > 12) return 0;  // Invalid month

    int daysInMonth;

    switch (m) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            daysInMonth = 31;
            break;
        case 4: case 6: case 9: case 11:
            daysInMonth = 30;
            break;
        case 2:
            if (isLeapYear(y))
                daysInMonth = 29;
            else
                daysInMonth = 28;
            break;
        default:
            return 0; // Shouldn't reach here
    }

    if (d < 1 || d > daysInMonth) return 0;

    return 1;  // Valid date
}

int main() {
    int d, m, y;

    printf("Enter date (dd mm yyyy): ");
    scanf("%d %d %d", &d, &m, &y);

    if (isValidDate(d, m, y)) {
        printf("The date %02d-%02d-%04d is VALID.\n", d, m, y);
    } else {
        printf("The date %02d-%02d-%04d is NOT VALID.\n", d, m, y);
    }

    return 0;
}
