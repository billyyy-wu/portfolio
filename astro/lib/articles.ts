import type { CollectionEntry } from "astro:content";

export type ArticleEntry = CollectionEntry<"articles">;

export const coverAspectBySlug: Record<string, string> = {
  "design-trends-and-ai-collaboration": "aspect-[1200/860]",
  "ai-design-workflow-tips": "aspect-[1200/860]",
  "prompt-library-for-designers": "aspect-[1200/860]",
  fazer: "aspect-[352.66/499.44]",
  "kulturnatt-stockholm": "aspect-[352.66/326.2]",
  mobilepay: "aspect-[352.66/489.75]",
  "simple-feast": "aspect-[352.66/197.92]",
  matas: "aspect-[352.66/368.52]",
  "momkind-packaging": "aspect-[352.66/310.11]",
  klarna: "aspect-[352.66/425.56]",
  "sabos-kombohus": "aspect-[352.66/375.89]",
  "momkind-store": "aspect-[352.66/243.44]",
  sundhedsstyrelsen: "aspect-[352.66/365.16]",
  oumph: "aspect-[352.66/307.42]",
  "klarna-faq": "aspect-[352.66/357.09]",
  mcdonalds: "aspect-[352.66/392]",
  kulturdagen: "aspect-[352.66/413.48]",
  "liverpool-red-hops": "aspect-[352.66/231.8]",
  "computer-arts": "aspect-[352.66/232.69]",
  "connors-run": "aspect-[352.66/483.3]",
  "carlsberg-vuvuzela": "aspect-[352.66/250.59]",
  "furry-font": "aspect-[352.66/348.14]",
  "manna-10": "aspect-[352.66/389.77]",
  "hus-forbi": "aspect-[352.66/266.7]",
};

export function sortArticles(articles: ArticleEntry[]) {
  return [...articles].sort((a, b) => {
    // order 用于手动控制首页排序；未填写时继续按日期倒序，便于纯内容管理。
    if (typeof a.data.order === "number" || typeof b.data.order === "number") {
      return (a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY);
    }

    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

export function getArticleHref(article: ArticleEntry) {
  return article.data.externalUrl ?? `/articles/${article.id}`;
}
