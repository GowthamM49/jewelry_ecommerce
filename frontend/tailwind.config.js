/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f6',
          100: '#ffe4ee',
          200: '#fecddf',
          300: '#fda4c6',
          400: '#fb7185',
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
        },
        gold: {
          50: '#fffef7',
          100: '#fffcee',
          200: '#fff8d6',
          300: '#fff2b8',
          400: '#ffe88a',
          500: '#ffd700',
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39900',
          900: '#998500',
        },
        premium: {
          dark: '#1a1a1a',
          light: '#f8f8f8',
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(17, 24, 39, 0.08)',
        lift: '0 16px 50px rgba(17, 24, 39, 0.12)',
        ring: '0 0 0 6px rgba(255, 215, 0, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

