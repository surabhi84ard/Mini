#include <stdio.h>
#define PI 3.14

// Structure to hold area and perimeter
struct CircleMetrics {
    double area;
    double perimeter;
};

// Function that takes radius and returns CircleMetrics
struct CircleMetrics calculateCircle(double radius) {
    struct CircleMetrics result;
    result.area = PI * radius * radius;
    result.perimeter = 2 * PI * radius;
    return result;
}

int main() {
    double r;
    printf("Enter radius: ");
    scanf("%lf", &r);

    struct CircleMetrics metrics = calculateCircle(r);

    printf("Area = %.2lf\n", metrics.area);
    printf("Perimeter = %.2lf\n", metrics.perimeter);

    return 0;
}

