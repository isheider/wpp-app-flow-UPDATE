/** @type {import('tailwindcss').Config} */
const { mauve, violet } = require("@radix-ui/colors");

module.exports = {
  important: true,
  content: [
    "./src/**/*.tsx",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...mauve,
        ...violet,
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
