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
        // Dark mode colors
        "dark-1": "#0f172a", //zinc-900
        "dark-2": "rgba(30,41,59,.6)", //zinc-800
        // Light mode colors
        "light-1": "#fafafa", // zinc-50
        "light-2": "#ffffff", // white
      },
    },
  },
  plugins: [],
};
