import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./astro/**/*.{astro,js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: "#FBEEEE",
        ink: "#222222",
        accent: "#FF6E99",
      },
      maxWidth: {
        site: "1170px",
      },
      fontFamily: {
        sans: ["var(--font-oppo-sans)", "ui-sans-serif", "system-ui"],
        nav: ["var(--font-gotham-medium)", "var(--font-oppo-sans)", "ui-sans-serif"],
      },
      boxShadow: {
        lift: "0 22px 48px rgba(34, 34, 34, 0.18)",
      },
    },
  },
  plugins: [typography],
};

export default config;
