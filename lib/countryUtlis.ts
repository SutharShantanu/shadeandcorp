
import metadata from 'react-phone-number-input/metadata.min.json';
import { getCountryCallingCode } from 'react-phone-number-input';

export const getCountryISO = (callingCode) => {
    const countries = metadata.countries;

    for (const [countryCode, countryData] of Object.entries(countries)) {
        const countryCallingCode = getCountryCallingCode(countryCode);
        if (countryCallingCode === callingCode) {
            return countryCode;
        }
    }

    return undefined;
};
