/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink': '#FE1940',
        'blue': '#0844B8',
        'gray-dark': '#4A4A4A',
        'gray': '#B8B8B8',
        'gray-light': '#F0F0F0',
      },
      fontFamily: {
        'oxygen': ['Oxygen']
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

