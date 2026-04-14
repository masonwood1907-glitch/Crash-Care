/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        usna: {
          bg: '#0d0f0b',
          surface: '#141710',
          surface2: '#1c2018',
          border: '#2a3025',
          olive: '#4a5c38',
          'olive-bright': '#6b8c4a',
          gold: '#c8a84b',
          'gold-dim': '#7a6530',
          'green-bright': '#5aab5a',
          text: '#c8cfc0',
          'text-dim': '#6b7560',
          'text-bright': '#e8f0d8',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}
