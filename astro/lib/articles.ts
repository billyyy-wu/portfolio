import type { CollectionEntry } from "astro:content";

export type ArticleEntry = CollectionEntry<"articles">;

export const coverAspectBySlug: Record<string, string> = {
  "chinese-font-history": "aspect-[1260/420]",
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

// 用内容和封面比例预估首页卡片高度，减少运行时 Masonry 测量带来的滚动卡顿。
function getCoverRatio(slug: string) {
  const aspectClass = coverAspectBySlug[slug] ?? "aspect-[352.66/326.2]";
  const match = aspectClass.match(/aspect-\[([\d.]+)\/([\d.]+)\]/);

  if (!match) {
    return 326.2 / 352.66;
  }

  return Number(match[2]) / Number(match[1]);
}

function getTextMeasure(text: string) {
  return Array.from(text).reduce((width, character) => {
    if (/[\u2E80-\u9FFF\uF900-\uFAFF]/.test(character)) {
      return width + 1;
    }

    if (/\s/.test(character)) {
      return width + 0.24;
    }

    if (/[A-Z0-9]/.test(character)) {
      return width + 0.56;
    }

    return width + 0.46;
  }, 0);
}

function estimateLineCount(text: string, contentWidth: number, fontSize: number) {
  const lineCapacity = contentWidth / fontSize;
  return Math.max(1, Math.ceil(getTextMeasure(text) / lineCapacity));
}

export function getArticleGridSpan(
  article: ArticleEntry,
  breakpoint: "sm" | "md" | "lg" | "xl" = "xl",
) {
  const referenceContentWidthByBreakpoint = {
    sm: 330,
    md: 430,
    lg: 330,
    xl: 358,
  };
  const referenceContentWidth = referenceContentWidthByBreakpoint[breakpoint];
  const gridRowSize = 4;
  const targetCardGap = 48;
  const imageHeight = referenceContentWidth * getCoverRatio(article.id);
  const titleHeight = estimateLineCount(article.data.title, referenceContentWidth, 24) * 29;
  const descriptionHeight =
    estimateLineCount(article.data.description, referenceContentWidth, 18) * 32.4;
  const spacingHeight = 16 + 4 + targetCardGap;

  return Math.ceil((imageHeight + titleHeight + descriptionHeight + spacingHeight) / gridRowSize);
}

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
