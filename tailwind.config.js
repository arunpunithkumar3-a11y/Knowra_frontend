/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#000000',
        canvas: '#050505',
        surface: {
          50: '#141416',
          100: '#0E0E10',
          200: '#1C1C1F',
          300: '#27272A',
          card: '#0C0C0E',
          hover: '#18181B',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
        },
        ink: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
          faint: '#52525B',
        },
        accent: {
          primary: '#F97316',
          primaryHover: '#EA580C',
          secondary: '#18181B',
          orange: '#F97316',
          white: '#FFFFFF',
          black: '#000000',
        },
        status: {
          success: '#22C55E',
          successBg: 'rgba(34, 197, 94, 0.1)',
          successBorder: 'rgba(34, 197, 94, 0.25)',
          warning: '#F59E0B',
          warningBg: 'rgba(245, 158, 11, 0.1)',
          warningBorder: 'rgba(245, 158, 11, 0.25)',
          error: '#EF4444',
          errorBg: 'rgba(239, 68, 68, 0.1)',
          errorBorder: 'rgba(239, 68, 68, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.6)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.8), 0 1px 3px -1px rgba(0, 0, 0, 0.6)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'button-white': '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'button-orange': '0 1px 2px rgba(0, 0, 0, 0.3), 0 0 14px rgba(249, 115, 22, 0.35)',
        'button-dark': '0 1px 2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'subtle-grid': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.06) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
