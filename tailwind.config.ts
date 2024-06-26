import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        spotify: {
          100: "#FFFFFF",
          200: "#b3b3b3",
          400: "#1fdf64",
          500: "#1DB954",
          600: "#169c46",
          700: "#303832",
          800: "#202622",
          900: "#191414",
        },
      },
    },
  },
  plugins: [],
};
export default config;
