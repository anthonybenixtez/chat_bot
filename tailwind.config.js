/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Esto asegura que Tailwind trabaje con todos los archivos .vue
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
