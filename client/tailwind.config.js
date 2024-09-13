/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      rotate: {
        '-90': '-90deg',
      },
      fontFamily: {
        'sans': ['BR Firma', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia'],
        'mono': ['ui-monospace', 'SFMono-Regular'],
        'display': ['Oswald'],
        'body': ['Open Sans'],
        'cursive': ['Playwrite FR Moderne', 'cursive'],
        'heading': ['Merriweather', 'serif'],
        'nunito': ['nunito', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'tenorSans': ['Tenor Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        /* Scrollbar width */
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '4px',
          },
        },
        '.scrollbar-none': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        /* Scrollbar track */
        '.scrollbar-track-gray': {
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
        },

        /* Scrollbar thumb */
        '.scrollbar-thumb-rounded': {
          '&::-webkit-scrollbar-thumb': {
            background: '#ff0099',
            borderRadius: '10px',
          },
        },
        '.scrollbar-thumb-rounded:hover': {
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#ff0099',
          },
        },
      });
    },
    require('@tailwindcss/forms'), // other plugins
    require('tailwindcss-filters'), // this enables the filter utilities
  ],
}