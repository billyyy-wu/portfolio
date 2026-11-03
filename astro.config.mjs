import mdx from "@astrojs/mdx";
import tina from "@tinacms/astro/integration";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

const enableTinaIntegration =
  process.env.TINA_ENABLED === "true" ||
  process.env.npm_lifecycle_event === "dev:cms" ||
  Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);

export default defineConfig({
  output: "static",
  adapter: vercel(),
  srcDir: "./astro",
  integrations: [mdx(), ...(enableTinaIntegration ? [tina()] : [])],
});
