/**
 * Determines if a product is new based on the provided date and number of days.
 *
 * @param {string} rawDate - The date when the product was added, in a format recognized by the Date constructor.
 * @param {number} days - The number of days to consider a product as new.
 * @returns {boolean} - Returns true if the product is new, otherwise false.
 */
export const useIsNewProduct = (rawDate, days) => {
    const productDate = new Date(rawDate);
    const currentDate = new Date();

    const diffInDays = (currentDate - productDate) / (1000 * 60 * 60 * 24);

    return diffInDays <= days;
};
