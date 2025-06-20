// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        "fondo-oscuro": "#262c3a",
      },
      // Ejemplo: animación que desplaza background-position de 0% a 100%
      keyframes: {
        'nebula-move': {
          '0%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
          '100%': { 'background-position': '0% 0%' },
        },
        // Si quieres un giro lento inverso
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'nebula-move': 'nebula-move 60s linear infinite',
        'spin-slow': 'spin-slow 120s linear infinite',
      },
    },
  },
  plugins: [],
};
