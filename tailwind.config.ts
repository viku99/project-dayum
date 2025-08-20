import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui'], // Default font
        syne: ['var(--font-syne)', 'sans-serif'],         // Optional utility class
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        fadeInUp: 'fadeInUp 1s ease-out both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            textShadow:
              '0 0 4px rgba(255,255,255,0.3), 0 0 10px rgba(255,255,255,0.4)',
          },
          '50%': {
            textShadow:
              '0 0 8px rgba(255,255,255,0.6), 0 0 14px rgba(255,255,255,0.8)',
          },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
