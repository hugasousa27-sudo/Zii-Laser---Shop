import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf6f0",
          100: "#f3e9dc",
          200: "#e4d0ba",
          300: "#cfbeaf",
          400: "#c08552",
          500: "#a06a42",
          600: "#895737",
          700: "#704429",
          800: "#5e3023",
          900: "#3d1d13",
          950: "#220f0a",
        },
        slate: {
          50: "#faf6f0",
          100: "#f3e9dc",
          200: "#e4d0ba",
          300: "#cfbeaf",
          400: "#c08552",
          500: "#a06a42",
          600: "#895737",
          700: "#272727",
          800: "#272727",
          900: "#272727",
          950: "#272727",
        },
        indigo: {
          50: "#faf6f0",
          100: "#f3e9dc",
          200: "#e4d0ba",
          300: "#cfbeaf",
          400: "#c08552",
          500: "#a06a42",
          600: "#895737",
          700: "#704429",
          800: "#5e3023",
          900: "#3d1d13",
          950: "#220f0a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
