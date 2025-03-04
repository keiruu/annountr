/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'main-dark': '#191B1C',
        'secondary-dark': '#232429',
        'accent-1': '#0EBDF6',
        'accent-2': '#F7D15E',
        'accent-3': '#323033',
        'color-1': '#989898'
      },
      fontFamily: {
        work: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
