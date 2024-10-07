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
        "dark-1": "#1E1E1E", 
        "dark-2": "#2C2C2C", 
        "light-1": "#F5F5F5", 
        "light-2": "#FFFFFF", 
      },
    },
  },
  plugins: [],
};
