import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            colors: {
                midnight: '#0B1026',
                celestial: '#1A1F4B',
                gold: {
                    soft: '#D4AF37',
                    muted: 'rgba(212, 175, 55, 0.6)',
                },
                ivory: '#F8F5F0',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
                script: ['Allura', ...defaultTheme.fontFamily.serif],
            },
            fontSize: {
                'display-xl': ['clamp(3rem,7vw,5rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
                'display-lg': ['clamp(2.25rem,4.5vw,3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
                'display-md': ['clamp(1.75rem,3vw,2.5rem)', { lineHeight: '1.15' }],
                'body-lg': ['1.25rem', { lineHeight: '1.75' }],
                'body-md': ['1.0625rem', { lineHeight: '1.7' }],
                'label': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.28em' }],
                'label-sm': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.32em' }],
            },
            maxWidth: {
                content: '1200px',
                prose: '42rem',
            },
            spacing: {
                'section-mobile': '60px',
                'section-tablet': '80px',
                'section-desktop': '120px',
            },
            transitionDuration: {
                luxury: '600ms',
            },
            animation: {
                'fade-up': 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'float-slow': 'floatSlow 8s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(32px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },

    plugins: [forms],
};
