/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                paws: {
                    bg: 'var(--paws-bg)',
                    surface: 'var(--paws-surface)',
                    text: 'var(--paws-text)',
                    accent: 'var(--paws-accent)',
                    border: 'var(--paws-border)'
                },
                claws: {
                    bg: 'var(--claws-bg)',
                    surface: 'var(--claws-surface)',
                    text: 'var(--claws-text)',
                    accent: 'var(--claws-accent)',
                    border: 'var(--claws-border)'
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up-fade': 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                slideUpFade: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                },
                pop: {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
            }
        }
    },
    plugins: [],
}
