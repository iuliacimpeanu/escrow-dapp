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
          'mvx-bg-gray': "#171717",
          'mvx-nav-gray': "#0E0E0E",
          'mvx-button-bg-gray': '#262626',
          'mvx-button-text': '#080808',
          'mvx-text-gray': "#737373",
          'mvx-lighter-gray': '#A3A3A3'
      }
      },
      backgroundImage: {
        // eslint-disable-next-line quotes
        'mvx-white': "url('../multiversx-white.svg')"
      }
    },
    plugins: []
  };
  