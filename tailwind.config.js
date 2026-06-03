/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forge: {
          // Dark theme
          bg:          'var(--forge-bg)',
          surface:     'var(--forge-surface)',
          card:        'var(--forge-card)',
          border:      'var(--forge-border)',
          accent:      'var(--forge-accent)',
          'accent-dim':'var(--forge-accent-dim)',
          'accent-2':  'var(--forge-accent-2)',
          muted:       'var(--forge-muted)',
          text:        'var(--forge-text)',
          'text-dim':  'var(--forge-text-dim)',
        }
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
      boxShadow: {
        'neon':    '0 0 20px rgba(130,10,209,0.35)',
        'neon-sm': '0 0 10px rgba(130,10,209,0.22)',
        'neon-lg': '0 0 40px rgba(130,10,209,0.45)',
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-neon': 'pulseNeon 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseNeon: {
          '0%,100%': { boxShadow: '0 0 10px rgba(130,10,209,0.2)' },
          '50%':     { boxShadow: '0 0 30px rgba(130,10,209,0.55)' },
        },
      }
    }
  },
  plugins: []
}
