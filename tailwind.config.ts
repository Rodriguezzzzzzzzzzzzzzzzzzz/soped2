import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        soped: {
          navy: '#091c36',
          dark: '#05070d',
          darker: '#0a0f1a',
          gold: '#b8960c',
          'gold-light': '#d4af37',
          'glass-border': 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'Helvetica', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'glow-breathe': 'glowBreathe 2.5s ease-in-out infinite',
        'logo-intro': 'logoIntro 0.8s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowBreathe: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(184,150,12,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 28px rgba(184,150,12,0.65))' },
        },
        logoIntro: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
