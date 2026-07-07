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
        },
        wds: {
          navy: '#1a365d',
          teal: '#0d9488',
          gold: '#d4af37',
          emerald: '#059669',
          sky: '#0ea5e9',
          rose: '#f43f5e',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          'light-gold': '#fcd34d',
          'dark-teal': '#0f766e',
          'soft-blue': '#e0f2fe',
          'warm-cream': '#fffbeb'
        }
      },
      boxShadow: { 
        soft: '0 14px 40px rgba(16, 74, 105, 0.12)',
        luxury: '0 20px 60px rgba(13, 148, 136, 0.15)'
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(13, 148, 136, 0.8)' }
        }
      }
    }
  },
  plugins: []
};
export default config;
