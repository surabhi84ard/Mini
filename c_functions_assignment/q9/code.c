// 9)Write a function to accept two dates as input arguments, and return 1 if the first date is older, 0 if the second date is older

#include <stdio.h>

// Function to compare two dates
int compareDates(int d1, int m1, int y1, int d2, int m2, int y2) {
    if (y1 < y2) {
        return 1; // first is older
    } else if (y1 > y2) {
        return 0; // second is older
    } else {
        // same year, compare month
        if (m1 < m2) {
            return 1;
        } else if (m1 > m2) {
            return 0;
        } else {
            // same month, compare day
            if (d1 < d2) {
                return 1;
            } else if (d1 > d2) {
                return 0;
            } else {
                return -1; // dates are same
            }
        }
    }
}

int main() {
    int d1, m1, y1, d2, m2, y2;

    printf("Enter first date (dd mm yyyy): ");
    scanf("%d %d %d", &d1, &m1, &y1);

    printf("Enter second date (dd mm yyyy): ");
    scanf("%d %d %d", &d2, &m2, &y2);

    int result = compareDates(d1, m1, y1, d2, m2, y2);

    if (result == 1) {
        printf("First date is older.\n");
    } else if (result == 0) {
        printf("Second date is older.\n");
    } else {
        printf("Both dates are the same.\n");
    }

    return 0;
}
