/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffecd1',
          200: '#ffd7a3',
          300: '#ffbc6b',
          400: '#ff9530',
          500: '#d4741a',
          600: '#b85c0f',
          700: '#964710',
          800: '#7a3a14',
          900: '#633113'
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#c74a5c',
          500: '#a73c47',
          600: '#8b2635',
          700: '#701e2a',
          800: '#581823',
          900: '#4a1520'
        },
        rotary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1f4e79'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    },
  },
  plugins: [],
}
