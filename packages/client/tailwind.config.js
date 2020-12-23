const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: false,
    content: [
    './src/**/*.html',
    './src/**/*.js',
    ]
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        ...colors.cyan,
        DEFAULT: colors.cyan[400]
      },
      yellow: colors.orange,
      gray: colors.coolGray,
      blue: colors.cyan,
      red: colors.rose,
      white: '#FFFFFF',
      category: {
        '0': colors.red[600],
        '1': colors.cyan[400],
        '2': colors.lime[400],
        '3': colors.violet[400],
        '4': colors.orange[400]
      }
    },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      ringWidth: ['active'],
      ringColor: ['active'],
    },
  },
  plugins: [],
}
