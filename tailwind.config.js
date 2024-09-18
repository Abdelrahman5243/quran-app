/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        "dark-1": "#121212", 
        "dark-2": "#22222255", 
        "light-1": "#f9f9f9", 
        "light-2": "#ffffff", 
      },
    },
  },
  plugins: [],
};
