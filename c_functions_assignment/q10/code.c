/*
10)Write a function that accepts a month and year as input, and returns the number of days of
the month as output. Print the number of days in a given month and year.
*/

#include <stdio.h>

// Function to check leap year
int isLeapYear(int year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return 1;
    }
    return 0;
}

// Function to return days in a given month/year
int getDaysInMonth(int month, int year) {
    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            return 31;
        case 4: case 6: case 9: case 11:
            return 30;
        case 2:
            if (isLeapYear(year))
                return 29;
            else
                return 28;
        default:
            return -1; // Invalid month
    }
}

int main() {
    int month, year;

    printf("Enter month and year (mm yyyy): ");
    scanf("%d %d", &month, &year);

    int days = getDaysInMonth(month, year);

    if (days == -1) {
        printf("Invalid month entered.\n");
    } else {
        printf("Number of days in month %d of year %d = %d\n", month, year, days);
    }

    return 0;
}
