import mdx from "@astrojs/mdx";
import tina from "@tinacms/astro/integration";
import { defineConfig } from "astro/config";

const enableTinaIntegration =
  process.env.TINA_ENABLED === "true" || process.env.npm_lifecycle_event === "dev:cms";

export default defineConfig({
  output: "static",
  srcDir: "./astro",
  integrations: [mdx(), ...(enableTinaIntegration ? [tina()] : [])],
});
