/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#2d2d2d",
          foreground: "#fafafa",
        },
        secondary: {
          default: "#f9f9f9",
          foreground: "#2d2d2d",
        },
        background: "#f4f4f4",
        border: "#d1d1d1",
        foreground: "#333333",
        card: {
          default: "#ffffff",
          foreground: "#333333",
        },
        popover: {
          default: "#ffffff",
          foreground: "#333333",
        },
        muted: {
          default: "#e1e1e1",
          foreground: "#666666",
        },
        accent: {
          default: "#4b8e8d",
          foreground: "#2d2d2d",
        },
        destructive: {
          default: "#e57373",
          foreground: "#333333",
        },
        input: "#ffffff",
        ring: "#4b8e8d",
        chart: {
          1: "#f4a261",
          2: "#06d6a0",
          3: "#457b9d",
          4: "#f77f00",
          5: "#e63946",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        forum: ["Forum", "serif"],
        worksans: ["Work Sans", "sans-serif"],
      },
      fontSize: {
        title: ["2.25rem", { lineHeight: "2.75rem", fontWeight: "700" }], // ~36px
        heading: ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }], // ~30px
        subheading: ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }], // ~24px
        description: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }], // ~16px
        small: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], // ~14px
      },
      fontWeight: {
        title: "700",
        heading: "700",
        subheading: "600",
        description: "400",
      },
      lineHeight: {
        title: "2.75rem",
        heading: "2.25rem",
        subheading: "2rem",
        description: "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
