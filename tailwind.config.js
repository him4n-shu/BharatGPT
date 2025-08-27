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
        navy: '#000080', 
        // UI theme colors
        primary: '#FF9933', 
        secondary: '#138808', 
        accent: '#000080', 
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            h3: {
              color: theme('colors.saffron'),
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            h4: {
              color: theme('colors.green'),
              fontWeight: '500',
              marginTop: '1.25em',
              marginBottom: '0.5em',
            },
            strong: {
              color: theme('colors.gray.800'),
            },
            a: {
              color: theme('colors.saffron'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            ul: {
              li: {
                '&:before': {
                  backgroundColor: theme('colors.saffron'),
                },
              },
            },
            ol: {
              li: {
                '&:before': {
                  color: theme('colors.green'),
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};