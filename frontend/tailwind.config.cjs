/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0f62fe', 600: '#0b57d0' },
        accent: '#00b894'
      },
      borderRadius: { xl: '1rem' }
    },
  },
  plugins: [],
}
