/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: "#1F2937", // Dark gray for headings
        paragraph: "#4B5563", // Medium gray for paragraphs
        primary: "#3B82F6", // Blue for primary buttons and links
        secondary: "#10B981", // Green for secondary actions
        background: "#F9FAFB", // Light gray for background
        border: "#E5E7EB", // Light gray for borders and dividers
        danger: "#EF4444", // Red for error or warning
        "tw-white": "#F8F8F8", // White for text or backgrounds
        "tw-black": "#333333",
      },
    },
  },
  plugins: [],
};

export default config;
