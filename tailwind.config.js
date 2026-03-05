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
            fontFamily: {
                sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', 'Cormorant Garamond', ...defaultTheme.fontFamily.serif],
                display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
                elegant: ['Cormorant Garamond', ...defaultTheme.fontFamily.serif],
                script: ['Great Vibes', 'cursive'],
            },
        },
    },

    plugins: [forms],
};
