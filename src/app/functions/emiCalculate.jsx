/**
 * Calculates the Equated Monthly Installment (EMI) for a given price over specified months with an optional interest rate.
 *
 * @param {number} price - The principal amount for which EMI is to be calculated.
 * @param {number[]} [monthsArray=[]] - An array of months over which the EMI is to be calculated. Defaults to [3, 6, 9, 12, 18, 24] if not provided.
 * @param {number} [interestRate=0] - The annual interest rate as a percentage. Defaults to 0 if not provided.
 * @returns {Object} An object where keys are the number of months and values are objects containing the EMI and total interest.
 * @returns {Object.<number, {emi: number, interest: number}>} - The EMI and total interest for each month.
 */
export const calculateEMI = (price, monthsArray = [], interestRate = 0) => {
    if (!price || price <= 0) return {};

    const validMonths = monthsArray.length > 0 ? monthsArray : [3, 6, 9, 12, 18, 24];
    const result = {};

    validMonths.forEach((months) => {
        if (months >= 3 && months <= 24) {
            let emi, totalInterest = 0;

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
                    interest: totalInterest,
                };
            }
        }
    });

    return result;
};
