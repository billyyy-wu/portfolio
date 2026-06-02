import mdx from "@astrojs/mdx";
import tina from "@tinacms/astro/integration";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  srcDir: "./astro",
  integrations: [mdx(), tina()],
});
