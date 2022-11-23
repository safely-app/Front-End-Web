const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'background-auth': "url('./assets/image/auth_background.png')",
        'background': "url('./assets/image/back.png')",
        'safeplace-placeholder': "url('./assets/image/safeplace.jpeg')",
        'safeplace-placeholder-2': "url('./assets/image/safeplace_2.jpeg')",
        'safeplace-placeholder-3': "url('./assets/image/safeplace_3.jpg')",
        'safeplace-small-placeholder': "url('./assets/image/safeplace_small.jpeg')",
        'safeplace-small-placeholder-2': "url('./assets/image/safeplace_small_2.jpeg')",
        'safeplace-small-placeholder-3': "url('./assets/image/safeplace_small_3.jpg')",
      }),
      colors: {
        blue: {
          'safely-dark': '#1d3655'
        },
        yellow: {
          'safely-light': '#fff3aa'
        },
      },
      borderWidth: {
        '3': '3px'
      },
      minWidth: {
        '52': '13rem'
      }
    },
    /*colors: {
      yellow_light: {
        DEFAULT: '#FFF3A'
      },
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: colors.red,
      red: {
        light: '#E5383A',
        DEFAULT: '#E5383A',
        dark: '#BB181B',
      },
      'gray1': {
        darkest: '#0B090A',
        dark: '#3D4245',
        DEFAULT: '#161A1D',
        light: '#AEB0B1',
        lightest: '#F8F8F8',
      },
      'midnight': {
        darkest: '#1D3655',
        dark: '#1D3655',
        DEFAULT: '#1D3655',
        light: '#4179B5',
        lightest: '#4179B5',
      },
      'lightmidnight': '#4179B5',
      'yellowS': '#FFF3AA',
    }, */
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Roboto', 'serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none'  /* Firefox */
        }
      })
    })
  ],
}