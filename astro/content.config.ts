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

const pages = defineCollection({
  loader: glob({
    base: "./content/pages",
    pattern: "**/*.mdx",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    name: z.string(),
    localizedName: z.string(),
    pronunciation: z.string(),
    heroImages: z.object({
      main: z.string(),
      small: z.string(),
    }),
    intro: z.object({
      label: z.string(),
      paragraphs: z.array(z.string()),
      highlight: z.string(),
    }),
    experience: z.object({
      label: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          period: z.string(),
          paragraphs: z.array(z.string()).optional(),
        }),
      ),
    }),
    award: z.object({
      label: z.string(),
      title: z.string(),
      period: z.string(),
      description: z.string(),
    }),
    publications: z.object({
      label: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          meta: z.string(),
        }),
      ),
    }),
    education: z.object({
      label: z.string(),
      items: z.array(
        z.object({
          year: z.string(),
          school: z.string(),
          note: z.string().optional(),
        }),
      ),
    }),
    galleryImages: z.array(z.string()),
  }),
});

export const collections = { articles, pages };
