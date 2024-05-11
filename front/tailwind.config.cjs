/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dynamic: 'var(--dynamic-color)',
        transparent: 'transparent',
        current: 'currentColor',
        "primary": "#00ADB5",
        "secondary": "#393E46",
        "text": "#EEEEEE",
        "background": "#222831"
      },
      backgroundImage: {
        'bennar': "url('client\src\assets\berrar.png')",
        'footer-texture': "url('/img/footer-texture.png')",
      },

      container: {
        center: true,
        padding: "2rem"
      }
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar-hide')
  ]
};
