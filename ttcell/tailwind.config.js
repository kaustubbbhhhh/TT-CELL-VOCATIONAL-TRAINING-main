/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false, // Critical to keep MUI UI intact
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f0',
          100: '#d9e8d9',
          200: '#b3d1b3',
          300: '#7ab57a',
          400: '#4d954d',
          500: '#2d6a2d',
          600: '#1e5c1e',
          700: '#174d17',
          800: '#123f12',
          900: '#0d330d',
          950: '#071a07',
        },
        military: {
          green: '#1B3A2D',
          dark: '#0F2419',
          light: '#2D5A3D',
          mid: '#234832',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8BB3A',
          dark: '#A07D1A',
          muted: '#D4AF5A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFB',
          subtle: '#F1F5F2',
          border: '#E2E8E4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.06)',
        'sidebar': '2px 0 16px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
