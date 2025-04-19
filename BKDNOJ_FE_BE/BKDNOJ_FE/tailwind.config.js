/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1d243a", // dark navy blue (header background)
          light: "#646c79",
        },
        secondary: {
          DEFAULT: "#e9e9ea", // light gray (background color)
          dark: "#b9bec9",
        },
        accent: {
          DEFAULT: "#4eaa52", // green color for success/available indicators
        },
        text: {
          primary: "#1d243a", // dark text
          secondary: "#717474", // gray text
          accent: "#9598a3", // lighter text
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
