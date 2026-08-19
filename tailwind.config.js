/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        verse: ['"UthmanicHafs"', "serif"],
        naskh: ['"Amiri"', '"Noto Naskh Arabic"', "serif"],
      },
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2) / <alpha-value>)",
        "ink-3": "rgb(var(--ink-3) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
        },
        "dark-1": "#12181A",
        "dark-2": "#1A2225",
        "light-1": "#F5F5F5",
        "light-2": "#FFFFFF",
      },
      borderRadius: {
        card: "1.25rem",
        control: "0.875rem",
      },
      boxShadow: {
        // Real depth: offset + soft blur, never a zero-offset halo.
        card: "0 1px 2px rgb(8 20 18 / 0.04), 0 12px 32px -12px rgb(8 20 18 / 0.18)",
        lift: "0 2px 4px rgb(8 20 18 / 0.05), 0 20px 48px -16px rgb(8 20 18 / 0.26)",
        control: "0 1px 2px rgb(8 20 18 / 0.06), 0 4px 12px -4px rgb(8 20 18 / 0.14)",
        brand: "0 4px 14px -4px rgb(var(--brand) / 0.45)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
