/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,ts,html}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      },
      colors: {
        'dark-blue': '#023646',
        'medium-blue': '#5a8c9a',
        'light-blue': '#EBF3F6',
        'footer-color': '#232B2E',
        'green-color': '#4EC26F',
        'blue-order-status': '#06A7D9',
        'blue-statisticSum': '#0BA3D1',
        main: '#9D9DAB',
        primary: '#00034E',
        'pseudo-white': '#F3F4F5',
        'primary-white': '#747474',
        'blue-light': '#0BA3D1',
        lighter: '#F3F4F5'
      },
      backgroundImage: {
        astana: "url('./src/assets/astanaHub.png')"
      },
      spacing: {
        33.125: '33.125rem'
      }
    }
  },
  plugins: []
};
