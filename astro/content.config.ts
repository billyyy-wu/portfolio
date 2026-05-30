import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({
    base: "./content/articles",
    pattern: "**/*.mdx",
  }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    externalUrl: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { articles };
