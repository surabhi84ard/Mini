#include <stdio.h>

int main() {

    int n, i, j,total, topper = 0;
    int marks[100][6];
    float percentage[100];

    printf("Enter number of students: ");
    scanf("%d", &n);

    while (i < n) {
        total = 0;
        printf("\nEnter marks of 6 subjects for student %d:\n", i + 1);

        j = 0;
        while (j < 6) {
            scanf("%d", &marks[i][j]);
            total += marks[i][j];
            j++;
        }

        percentage[i] = (total / 600.0) * 100;
        i++;
    }

    i = 1;
    while (i < n) {
        if (percentage[i] > percentage[topper]) {
            topper = i;
        }
        i++;
    }

    printf("\nPercentage of each student:\n");
    i = 0;
    while (i < n) {
        printf("Student %d: %.2f%%\n", i + 1, percentage[i]);
        i++;
    }

    printf("\nTopper is Student %d with %.2f%%\n", topper + 1, percentage[topper]);

    return 0;
}
