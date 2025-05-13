/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
const { fontFamily } = defaultTheme;

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg-primary': 'var(--dark-bg-primary)',
        'dark-bg-secondary': 'var(--dark-bg-secondary)',
        'dark-card-bg': 'var(--dark-card-bg)',
        'blue-accent': 'var(--blue-accent)',
        primary: {
          50: '#e6f0fa',
          100: '#cce1f5',
          200: '#99c3eb',
          300: '#66a5e0',
          400: '#3387d6',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#fff0e6',
          100: '#ffe1cc',
          200: '#ffc399',
          300: '#ffa566',
          400: '#ff8733',
          500: '#ff6600',
          600: '#cc5200',
          700: '#993d00',
          800: '#662900',
          900: '#331400',
        },
        success: {
          50: '#e6f7ef',
          100: '#ccf0df',
          200: '#99e1bf',
          300: '#66d29f',
          400: '#33c37f',
          500: '#00b45f',
          600: '#00904c',
          700: '#006c39',
          800: '#004826',
          900: '#002413',
        },
        danger: {
          50: '#fdebeb',
          100: '#fbd7d7',
          200: '#f7afaf',
          300: '#f38787',
          400: '#ef5f5f',
          500: '#eb3737',
          600: '#bc2c2c',
          700: '#8d2121',
          800: '#5e1616',
          900: '#2f0b0b',
        },
        warning: {
          50: '#fef9e6',
          100: '#fef3cc',
          200: '#fde799',
          300: '#fcdb66',
          400: '#fbcf33',
          500: '#fac300',
          600: '#c89c00',
          700: '#967500',
          800: '#644e00',
          900: '#322700',
        },
        info: {
          50: '#e6f3ff',
          100: '#cce7ff',
          200: '#99cfff',
          300: '#66b7ff',
          400: '#339fff',
          500: '#0087ff',
          600: '#006ccc',
          700: '#005199',
          800: '#003666',
          900: '#001b33',
        },
        dark: {
          50: '#e6e6e6',
          100: '#cccccc',
          200: '#999999',
          300: '#666666',
          400: '#333333',
          500: '#1a1a1a',
          600: '#151515',
          700: '#101010',
          800: '#121722',
          900: '#0a0e15',
        },
        light: {
          50: '#ffffff',
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f9f9f9',
          400: '#f7f7f7',
          500: '#f5f5f5',
          600: '#c4c4c4',
          700: '#939393',
          800: '#626262',
          900: '#313131',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        heading: ['var(--font-montserrat)', ...fontFamily.sans],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'card': '0 5px 15px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-left': 'slideLeft 0.5s ease-in-out',
        'slide-right': 'slideRight 0.5s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.dark.500'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: theme('colors.dark.500'),
            },
            h2: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: theme('colors.dark.500'),
            },
            h3: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: theme('colors.dark.500'),
            },
            h4: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: theme('colors.dark.500'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    // Importações carregadas dinamicamente em tempo de execução
    // @ts-ignore
    import('@tailwindcss/typography').then(plugin => plugin.default),
    // @ts-ignore
    import('@tailwindcss/forms').then(plugin => plugin.default),
    // @ts-ignore
    import('@tailwindcss/aspect-ratio').then(plugin => plugin.default),
    // @ts-ignore
    import('tailwindcss-animate').then(plugin => plugin.default),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
