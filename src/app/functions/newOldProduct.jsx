export const useIsNewProduct = (rawDate, days) => {
    const productDate = new Date(rawDate);
    const currentDate = new Date();

    const diffInDays = (currentDate - productDate) / (1000 * 60 * 60 * 24);

    return diffInDays <= days;
};
