import js from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  {
    ignores: [".astro/**", "dist/**", "node_modules/**", "out/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
  },
);

export default eslintConfig;
