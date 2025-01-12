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
			default: '#2d2d2d',  // --primary
			foreground: '#fafafa' // --primary-foreground
		  },
		  secondary: {
			default: '#f9f9f9',  // --secondary
			foreground: '#2d2d2d' // --secondary-foreground
		  },
		  background: '#f4f4f4', // --background
		  border: '#d1d1d1', // --border
		  foreground: '#333333', // --foreground
		  card: {
			default: '#ffffff', // --card
			foreground: '#333333' // --card-foreground
		  },
		  popover: {
			default: '#ffffff', // --popover
			foreground: '#333333' // --popover-foreground
		  },
		  muted: {
			default: '#e1e1e1', // --muted
			foreground: '#666666' // --muted-foreground
		  },
		  accent: {
			default: '#4b8e8d', // --accent
			foreground: '#2d2d2d' // --accent-foreground
		  },
		  destructive: {
			default: '#e57373', // --destructive
			foreground: '#333333' // --destructive-foreground
		  },
		  input: '#ffffff', // --input
		  ring: '#4b8e8d', // --ring
		  chart: {
			'1': '#f4a261', // --chart-1
			'2': '#06d6a0', // --chart-2
			'3': '#457b9d', // --chart-3
			'4': '#f77f00', // --chart-4
			'5': '#e63946'  // --chart-5
		  }
		},
		borderRadius: {
		  lg: '0.5rem', // --radius
		  md: 'calc(0.5rem - 2px)',
		  sm: 'calc(0.5rem - 4px)'
		},
		keyframes: {
		  'accordion-down': {
			from: {
			  height: '0'
			},
			to: {
			  height: 'var(--radix-accordion-content-height)'
			}
		  },
		  'accordion-up': {
			from: {
			  height: 'var(--radix-accordion-content-height)'
			},
			to: {
			  height: '0'
			}
		  }
		},
		animation: {
		  'accordion-down': 'accordion-down 0.2s ease-out',
		  'accordion-up': 'accordion-up 0.2s ease-out'
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
  };

  export default config;
