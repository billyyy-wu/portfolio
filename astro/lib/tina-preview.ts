import { requestWithMetadata } from "@tinacms/astro/data";
import type { TinaRichTextContent } from "@tinacms/astro/types";
import tinaLock from "../../tina/tina-lock.json";

const articleQuery = `query article($relativePath: String!) {
  article(relativePath: $relativePath) {
    id
    _sys { filename relativePath breadcrumbs }
    title date description cover coverAlt externalUrl order body
  }
}`;

const pageQuery = `query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    id
    _sys { filename relativePath breadcrumbs }
    title description name localizedName pronunciation
    heroImages { main small }
    intro { label paragraphs highlight }
    experience { label items { title period paragraphs } }
    award { label title period description }
    publications { label items { title meta } }
    education { label items { year school note } }
    galleryImages
  }
}`;

export interface TinaArticle {
  title: string;
  description: string;
  cover?: string | null;
  coverAlt?: string | null;
  body?: TinaRichTextContent;
}

export interface TinaPage {
  title: string;
  description: string;
  name: string;
  localizedName: string;
  pronunciation: string;
  heroImages: { main: string; small: string };
  intro: { label: string; paragraphs: string[]; highlight: string };
  experience: { label: string; items: { title: string; period: string; paragraphs?: string[] }[] };
  award: { label: string; title: string; period: string; description: string };
  publications: { label: string; items: { title: string; meta: string }[] };
  education: { label: string; items: { year: string; school: string; note?: string }[] };
  galleryImages: string[];
}

function apiUrl() {
  if (process.env.TINA_ENABLED === "true" || process.env.NODE_ENV === "development") {
    return "http://localhost:4001/graphql";
  }

  const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
  const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main";
  if (!clientId) throw new Error("TinaCloud client ID is missing");
  const { major, minor } = tinaLock.schema.version;
  return `https://content.tinajs.io/${major}.${minor}/content/${clientId}/github/${encodeURIComponent(branch)}`;
}

async function queryTina<T>(query: string, relativePath: string) {
  const variables = { relativePath };
  const response = await fetch(apiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.TINA_TOKEN ? { "X-API-KEY": process.env.TINA_TOKEN } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Tina query failed: ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) throw new Error(result.errors.map((error: { message: string }) => error.message).join("; "));
  return requestWithMetadata<T>({ data: result.data, query, variables }, { priority: "primary" });
}

export function getTinaArticle(slug: string) {
  return queryTina<{ article: TinaArticle }>(articleQuery, `${slug}.mdx`);
}

export function getTinaAbout() {
  return queryTina<{ page: TinaPage }>(pageQuery, "about.mdx");
}
