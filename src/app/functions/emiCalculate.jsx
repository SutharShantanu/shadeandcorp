/**
 * Calculates the EMI (Equated Monthly Installment) for a given price over a range of months.
 *
 * @param {number} price - The total price for which the EMI needs to be calculated.
 * @param {number[]} [monthsArray=[]] - An optional array of months for which to calculate the EMI. Defaults to an array from 3 to 18 months.
 * @param {number} [interestRate=0] - An optional interest rate. Defaults to 0 if not provided.
 * @returns {Object} An object where the keys are the number of months and the values are objects containing the EMI amounts and interest.
 */
export const calculateEMI = (price, monthsArray = [], interestRate = 0) => {
    if (!price || price <= 0) return {};

    const validMonths = monthsArray.length > 0 ? monthsArray : Array.from({ length: 16 }, (_, i) => i + 3);
    const result = {};

    validMonths.forEach((months) => {
        if (months >= 3 && months <= 18) {
            let emi;
            let totalInterest = 0;

            if (interestRate > 0) {
                const monthlyInterestRate = interestRate / 12 / 100;
                emi = Math.round((price * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / (Math.pow(1 + monthlyInterestRate, months) - 1));
                totalInterest = Math.round(emi * months - price);
            } else {
                emi = Math.round(price / months);
            }

            if (emi > 0) {
                result[months] = {
                    emi,
                    interest: totalInterest
                };
            }
        }
    });

    return result;
};
