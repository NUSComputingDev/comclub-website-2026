/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
      },
      colors: {
        primary: '#365486',
        outline: '#333333',
        highlight: '#61afef',
      },
      transitionTimingFunction: {
        'out-flex': 'cubic-bezier(0.05, 0.6, 0.4, 0.9)',
      },
      screens: {
        xs: '480px',
      },
      fontFamily: {
        inter: ['Inter var', 'sans-serif'],
        subheading: ['Quicksand', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['Lexend', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        card: `
          0 0 1px 0 rgba(189,192,207,0.06),
          0 10px 16px -1px rgba(189,192,207,0.2)
        `,
        cardhover: `
          0 0 1px 0 rgba(189,192,207,0.06),
          0 10px 16px -1px rgba(189,192,207,0.4)
        `,
      },
      dropShadow: {
        window: '8px 8px 0px #365486',
      },
    },
  },
  plugins: [],
};
