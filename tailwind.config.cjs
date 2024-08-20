/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Inter"', 'sans-serif']
        },
        colors: {
          'mvx-blue': "#23F7DD",
      }
      },
      backgroundImage: {
        // eslint-disable-next-line quotes
        'mvx-white': "url('../multiversx-white.svg')"
      }
    },
    plugins: []
  };
  