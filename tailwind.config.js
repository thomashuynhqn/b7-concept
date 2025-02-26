/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#227EFF",
        default: "#227EFF",
        icon: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
