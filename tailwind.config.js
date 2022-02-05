const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
  safelist: [
    'col-start-1',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4'
  ]
  ,
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#70ba3f',
        'white-active': '#eaffdc',
        'primary-active': '#9bce7a',
        'error': '#ea0038',
        'error-active': '#f75e83',
        'white-transparent': 'rgba(255, 255, 255, .3)',
        'gray': colors.gray
      },
      height: {
        '90': '90%',
        'expanded': '120%'
      },
      width: {
        'expanded': '120%',
        '90': '90%'
      },
      margin: {
        'expanded-compensation': '-10%',
      },
      padding: {
        'expanded-compensation': '10%',
      },
      translate: {
        'expanded-compensation': '-10%',
      },
      borderRadius: {
        'y-ellipse': '125% 50%',
        'x-ellipse': '50% 125%',
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
      borderWidth: ['active'],
      borderColor: ['focus-within'],
      textColor: ['active'],
      display: ["group-hover"]
    }
  },
  plugins: [],

}
