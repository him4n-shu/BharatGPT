/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian flag colors
        saffron: '#FF9933',
        white: '#FFFFFF',
        green: '#138808',
        navy: '#000080', // Ashoka Chakra color
        // UI theme colors
        primary: '#FF9933', // Saffron
        secondary: '#138808', // Green
        accent: '#000080', // Navy blue
        background: '#F8F8F8',
        'light-gray': '#F0F0F0',
        'dark-gray': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '0.5rem',
        'button': '0.375rem',
      },
    },
  },
  plugins: [],
};