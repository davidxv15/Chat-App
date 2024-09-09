/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // this will include the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JS, TS, JSX, and TSX files in the src folder
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
