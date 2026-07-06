/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean:  '#003D8F',
        water:  '#1FAEFF',
        aqua:   '#BEEFFF',
        silver: '#E8EEF5',
        gold:   '#C9A84C',
        navy:   '#002356',
        frost:  '#F8FBFF',
        sky:    '#5BB8FF',
      },
      fontFamily: {
        sans:  ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float':      'floatBottle 6s ease-in-out infinite',
        'float-slow': 'floatBottleSlow 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'orb1':       'orbFloat1 16s ease-in-out infinite',
        'orb2':       'orbFloat2 20s ease-in-out infinite',
        'scroll':     'scrollBounce 2s ease-in-out infinite',
        'shine':      'shineSweep 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
