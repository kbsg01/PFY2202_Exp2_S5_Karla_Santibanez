/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de la agencia: océano profundo + arena + atardecer.
        oceano: { 50: '#eef8fa', 100: '#d4eef3', 200: '#a9dce7', 500: '#1f8a9e', 600: '#17707f', 700: '#145b68', 800: '#0f4550', 900: '#0b333b' },
        arena: { 50: '#fbf8f2', 100: '#f4ecdc', 200: '#e9dab9' },
        atardecer: { 400: '#f5945c', 500: '#ee7434', 600: '#d65d1f' },
      },
      fontFamily: {
        titulo: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      keyframes: {
        progreso: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(300%)' } },
      },
      animation: { progreso: 'progreso 1.1s ease-in-out infinite' },
    },
  },
  plugins: [],
};
