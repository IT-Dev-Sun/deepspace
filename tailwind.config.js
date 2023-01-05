const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  // important: '#__next',
  // darkMode: true,
  mode: 'jit',
  // future: {
  //   purgeLayersByDefault: true,
  //   applyComplexClasses: true,
  // },
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/img/hero-pattern.svg')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
      linearBorderGradients: {
        directions: {
          tr: 'to top right',
          r: 'to right',
        },
        colors: {
          'blue-pink': ['#27B0E6', '#FA52A0'],
          'purple-lightpink': ['#d400a6', '#7f16d3'],
          'darkpink-darkpurple': ['#492144', '#40324f'],
          'pink-red-light-brown': ['#FE5A75', '#FEC464'],
        },

        background: {
          'dark-1000': '#0D0415',
          'dark-900': '#16151a',
          'dark-800': '#202231',
          'dark-pink-red': '#4e3034',
        },

        border: {
          1: '1px',
          2: '2px',
          3: '3px',
          4: '4px',
        },
      },
      colors: {
        purple: '#a755dd',
        darkpurple: '#40324f',
        darkpink: '#492144',
        blue: '#0993ec',
        pink: '#f338c3',
        lightpink: '#d400a6',
        purple: '#7f16d3',
        green: '#7cff6b',
        red: '#ff3838',
        yellow: '#ffd166',

        'opaque-purple': '#a755dd80',
        'opaque-lightpink': '#d400a680',
        'opaque-blue': '#0993ec80',
        'opaque-pink': '#f338c380',
        'pink-red': '#FE5A75',
        'light-brown': '#FEC464',
        'light-yellow': '#FFD166',
        'baby-blue': '#00ffff',
        'cyan-blue': '#0993EC',
        'dark-pink': '#221825',
        'dark-blue': '#0F182A',
        'dark-1000': '#0D0415',
        'dark-900': '#16151a',
        'dark-850': '#1d1e2c',
        'dark-800': '#202231',
        'dark-700': '#2E3348',
        'dark-600': '#1C2D49',
        'dark-500': '#223D5E',
        'low-emphesis': '#575757',
        'grey-color': '#B0BAC9',
        primary: '#BFBFBF',
        secondary: '#7F7F7F',
        'high-emphesis': '#E3E3E3',
      },
      backgroundColor: {
        'ds-purple-800': 'rgba(101, 10, 174, 0.7)',
        'ds-purple-700': 'rgba(127, 22, 211, 0.69)',
      },
      lineHeight: {
        '48px': '48px',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        hero: [
          '48px',
          {
            letterSpacing: '-0.02em;',
            lineHeight: '96px',
            fontWeight: 700,
          },
        ],
      },
      borderRadius: {
        none: '0',
        px: '1px',
        DEFAULT: '3px',
        '5px': '5px',
        '2x': '35px',
      },
      boxShadow: {
        swap: '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
        liquidity: '0px 50px 250px -47px rgba(123, 97, 255, 0.23)',
        'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
        'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
        'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
        'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',
      },
      ringWidth: {
        DEFAULT: '1px',
      },
      padding: {
        px: '1px',
        '3px': '3px',
      },
      minHeight: {
        empty: '128px',
        cardContent: '230px',
        fitContent: 'fit-content',
      },
      minHeight: {
        5: '1.25rem',
      },
      minWidth: {
        5: '1.25rem',
      },
      dropShadow: {
        currencyLogo: '0px 3px 6px rgba(15, 15, 15, 0.25)',
      },
      screens: {
        wd3: '898px',
        wd4: '1200px',
        wd5: '1500px',
        '3xl': '1600px',
        animation: {
          ellipsis: 'ellipsis 1.25s infinite',
          'spin-slow': 'spin 2s linear infinite',
          fade: 'opacity 150ms linear',
        },
        keyframes: {
          ellipsis: {
            '0%': { content: '"."' },
            '33%': { content: '".."' },
            '66%': { content: '"..."' },
          },
          opacity: {
            '0%': { opacity: 0 },
            '100%': { opacity: 100 },
          },
        },
      },
    },
  },
  variants: {
    linearBorderGradients: ['responsive', 'hover', 'dark'], // defaults to ['responsive']
    extend: {
      backgroundColor: ['checked', 'disabled'],
      backgroundImage: ['hover', 'focus'],
      borderColor: ['checked', 'disabled'],
      cursor: ['disabled'],
      opacity: ['hover', 'disabled'],
      placeholderColor: ['hover', 'active'],
      ringWidth: ['disabled'],
      ringColor: ['disabled'],
    },
  },
  plugins: [
    require('tailwindcss-border-gradient-radius'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.header-border-b': {
          background:
            'linear-gradient(to right, rgba(39, 176, 230, 0.2) 0%, rgba(250, 82, 160, 0.2) 100%) left bottom no-repeat',
          backgroundSize: '100% 1px',
        },
      })
    }),
  ],
}
