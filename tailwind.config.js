// tailwind.config.js (Este archivo ya lo tienes configurado, solo para referencia)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define la fuente Inter
      },
    },
  },
  plugins: [],
};
