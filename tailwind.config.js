const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#70ba3f',
        'white-active': '#eaffdc',
        'primary-active': '#9bce7a',
        error: '#ea0038',
        'error-active': '#f75e83',
        lime: colors.lime
      },
      height: {
        'custom-full': 'calc(100vh - 1px)',
        '50vh': '50vh',
        '90': '90%'
      },
      width: {
        expanded: '120%',
        '90': '90%'
      },
      margin: {
        'expanded-compensation': '-10%',
      },
      borderRadius: {
        ellipse: '125% 50%',
        '4xl': '2em',
        '5xl': '5em'
      },
      outline: {
        bold: '1em solid #70ba3f',
        extra: '1.25em solid #70ba3f'
      },
      borderWidth: {
        bold: '1em',
        extra: '1.1em'
      },
      transitionProperty: {
        btn: 'height, width, borderWidth'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      width: ['active'],
      height: ['active'],
      borderWidth: ['active']
    }
  },
  plugins: [],
  
}
