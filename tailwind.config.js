module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
    safelist: [
      'col-start-1',
      'col-start-2',
      'col-start-3',
      'col-start-4',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#70ba3f',
        'white-active': '#eaffdc',
        'primary-active': '#9bce7a',
        error: '#ea0038',
        'error-active': '#f75e83',
        'white-transparent': 'rgba(255, 255, 255, .3)'
      },
      height: {
        'custom-full': 'calc(100vh - 1px)',
        '50vh': '50vh',
        '65vh': '65vh',
        '90': '90%'
      },
      width: {
        expanded: '120%',
        '50vh': '50vh',
        '65vh': '65vh',
        '90': '90%'
      },
      margin: {
        'expanded-compensation': '-10%',
      },
      padding: {
        'expanded-compensation': '10%',
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
      borderWidth: ['active'],
      borderColor: ['focus-within'],
      textColor: ['active']
    }
  },
  plugins: [],
  
}
