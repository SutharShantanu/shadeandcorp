import { Quicksand, Raleway, Nabla } from "next/font/google";

// Quicksand for body text
export const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-quicksand",
});

// Raleway for headings/titles
export const raleway = Raleway({
    subsets: ["latin"],
    variable: "--font-raleway",
});

// Nabla for special/funky highlight text
export const nabla = Nabla({
    subsets: ["latin"],
    variable: "--font-nabla",
});