import { Raleway, Nabla } from "next/font/google";

// Raleway for all body and headings
export const raleway = Raleway({
    subsets: ["latin"],
    variable: "--font-sans",
});

// Nabla for special/funky highlight text
export const nabla = Nabla({
    subsets: ["latin"],
    variable: "--font-nabla",
});