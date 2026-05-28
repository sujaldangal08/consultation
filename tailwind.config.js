/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          DEFAULT: '#050816',
          deep: '#030510',
          mid: '#0a0f2e',
          glow: '#111840',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f4d77a',
          dim: '#a88a20',
          pale: '#e8cc6a',
        },
        stardust: {
          DEFAULT: '#c8d0e8',
          dim: '#7a85a8',
          bright: '#e8eeff',
        },
      },
      fontFamily: {
        'serif-display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: { glass: '24px' },
      boxShadow: {
        gold: '0 0 40px rgba(212,175,55,0.35)',
        'gold-lg': '0 0 80px rgba(212,175,55,0.45)',
        'gold-sm': '0 0 15px rgba(212,175,55,0.25)',
        card: '0 8px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.18)',
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-12px) translateX(6px)' },
          '66%': { transform: 'translateY(6px) translateX(-9px)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'pulse-glow': {
          '0%,100%': { filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' },
          '50%': { filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.9))' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'scroll-line': {
          '0%,100%': { opacity: '0.2', transform: 'scaleY(0.6)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
      animation: {
        twinkle: 'twinkle var(--dur,4s) var(--delay,0s) infinite ease-in-out',
        'float-slow': 'float-slow 18s ease-in-out infinite',
        'spin-slow': 'spin-slow 120s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'scroll-line': 'scroll-line 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
