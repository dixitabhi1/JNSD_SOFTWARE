/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#5f9ec9',
          500: '#3a81b3',
          600: '#2b6897',
          700: '#24547c',
          800: '#1e4465',
          900: '#0f294a', // primary brand navy
          950: '#091a30',
        },
        navy: {
          primary: '#0f294a',
          secondary: '#1e4465',
          accent: '#2b6897',
        },
        accent: {
          teal: '#0d9488',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
          indigo: '#4f46e5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
