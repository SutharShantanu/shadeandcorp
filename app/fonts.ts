import { Raleway, Nabla, Roboto_Mono } from "next/font/google";

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

// Roboto Mono for numbers and specific fields
export const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});