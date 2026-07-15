/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f6f8fa',
        surface: '#ffffff',
        card: '#ffffff',
        'card-2': '#f2f5f7',
        hover: '#eef2f5',
        border: '#e5e9ee',
        'border-2': '#d8dee6',
        text: '#0a0d0c',
        dim: '#48525c',
        muted: '#6b7580',
        accent: {
          DEFAULT: '#15a06b',
          bright: '#17b378',
          deep: '#0f7d53',
          soft: '#e7f6ef',
          line: '#bfe6d4',
        },
        teal: '#2aa0a8',
        blue: '#3b7fd4',
        amber: '#d99a17',
        danger: '#d8503f',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,13,12,.05)',
        card: '0 6px 24px rgba(10,13,12,.07)',
        lift: '0 20px 60px rgba(10,13,12,.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'scene-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(.99)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'dot-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(21,160,107,.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(21,160,107,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(21,160,107,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.2,.7,.25,1) both',
        'scene-in': 'scene-in .3s ease both',
        'dot-pulse': 'dot-pulse 2.2s infinite',
        marquee: 'marquee 46s linear infinite',
      },
    },
  },
  plugins: [],
};
