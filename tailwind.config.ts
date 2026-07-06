import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        whale: {
          50: '#effaff', 100: '#def4ff', 200: '#b6ebff', 300: '#75dcff',
          400: '#2cc7fb', 500: '#00a8df', 600: '#0087bd', 700: '#056b99',
          800: '#0d597e', 900: '#104a69'
        }
      },
      boxShadow: { soft: '0 14px 40px rgba(16, 74, 105, 0.12)' }
    }
  },
  plugins: []
};
export default config;
