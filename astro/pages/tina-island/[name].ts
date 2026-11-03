import { experimental_createIslandRoute } from "@tinacms/astro/experimental";
import ArticleLivePreview from "~/components/ArticleLivePreview.astro";
import AboutLivePreview from "~/components/AboutLivePreview.astro";
import { getTinaAbout, getTinaArticle } from "~/lib/tina-preview";

export const prerender = false;

export const ALL = experimental_createIslandRoute({
  article: {
    fetch: async (_request, params) => {
      const slug = params.get("slug") ?? "";
      if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Invalid article slug");
      return getTinaArticle(slug);
    },
    component: ArticleLivePreview,
    wrapper: { tag: "div" },
    propsFromData: (result, params) => ({
      article: (result as Awaited<ReturnType<typeof getTinaArticle>>).data.article,
      slug: params.get("slug") ?? "",
    }),
  },
  about: {
    fetch: () => getTinaAbout(),
    component: AboutLivePreview,
    wrapper: { tag: "div" },
    propsFromData: (result) => ({
      page: (result as Awaited<ReturnType<typeof getTinaAbout>>).data.page,
    }),
  },
});
