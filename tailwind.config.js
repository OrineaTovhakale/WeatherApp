/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark: variants based on .dark class on <html>
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}