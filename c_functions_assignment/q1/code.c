/*
1)Write a function that takes principle, rate of interest and time in months as input arguments, 
  and returns the total amount to be repayed, after calculation of simple interest.
*/

#include <stdio.h>

// Function to calculate total amount (principal + simple interest)
float calculateTotal(float principal, float rate, int timeMonths) {
    float timeYears = timeMonths / 12.0;  // Convert months to years
    float simpleInterest = (principal * rate * timeYears) / 100.0;
    return principal + simpleInterest;
}

int main() {
    float principal, rate;
    int timeMonths;

    // Input values
    printf("Enter Principal amount: ");
    scanf("%f", &principal);

    printf("Enter Rate of Interest (per annum in %%): ");
    scanf("%f", &rate);

    printf("Enter Time (in months): ");
    scanf("%d", &timeMonths);

    // Calculate and display total repayment
    float total = calculateTotal(principal, rate, timeMonths);
    printf("Total Amount to be repaid = %.2f\n", total);

    return 0;
}
