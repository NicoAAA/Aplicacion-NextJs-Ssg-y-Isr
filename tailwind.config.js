// tailwind.config.js
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
      // Añadir gradientes personalizados aquí
      backgroundImage: {
        'gradient-rick-morty': 'linear-gradient(to bottom, #78feb4, #33dab7, #00b4b0, #008e9c, #276a7e, #2f4858)',
      },
    },
  },
  plugins: [],
};

