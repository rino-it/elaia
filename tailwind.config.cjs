/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#16140f',
        'ink-soft': '#26221c',
        cream: '#f0ebe1',
        'cream-warm': '#e8e1d2',
        paper: '#faf6ee',
        bronze: '#9a6f42',
        'bronze-soft': '#c19868',
        muted: '#6b6359',
        line: 'rgba(154,111,66,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}

