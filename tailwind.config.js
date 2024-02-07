/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#f0f0f0',
        dblue: '#007eb4',
        dark: '#000000',
        red: '#ff6d40',
        blue: '#64b5ff'
      }
    }
  },
  plugins: []
}
