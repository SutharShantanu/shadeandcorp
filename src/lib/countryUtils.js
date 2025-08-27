// import { getCountries, getCountryCallingCode } from "libphonenumber-js";

// // Build the reverse map once (cached)
// const reverseCountryCodeMap = (() => {
//   const map = {};
//   getCountries().forEach((countryCode) => {
//     const callingCode = getCountryCallingCode(countryCode);
//     // There can be multiple countries with same calling code, keep the first one
//     if (!map[callingCode]) {
//       map[callingCode] = countryCode;
//     }
//   });
//   return map;
// })();

// /**
//  * Converts a country calling code (e.g. '91') to a country ISO code (e.g. 'IN')
//  * @param {string | number} callingCode - Country calling code, e.g. '91' or 91
//  * @returns {string | undefined} Country ISO code (e.g. 'IN'), or undefined if not found
//  */
// export function getCountryCodeFromCallingCode(callingCode) {
//   return reverseCountryCodeMap[String(callingCode)];
// }

// lib/countryUtils.js

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

  return undefined; // fallback if not found
};
