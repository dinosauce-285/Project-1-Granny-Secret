/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#f9f6e8",
        primary: "#006400",
        "primary-hover": "#007a00",
        olive: "#6B8E23",
        "text-muted": "#9ca3af",
        surface: "#fafafa",
        "input-border": "#d1cbb8",
        "input-bg": "#fffdf7",
        accent1: "#FFE0B2",
        accent2: "#FFF0B3",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      plugins: [],
    },
  },
};
