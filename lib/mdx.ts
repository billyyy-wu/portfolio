import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  cover?: string;
  coverAlt?: string;
  externalUrl?: string;
  order?: number;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

export type PostSummary = Omit<Post, "content">;

type RawFrontmatter = Partial<Record<keyof PostFrontmatter, unknown>>;

function assertSafeSlug(slug: string) {
  // 限制 slug 字符，避免通过动态路由读取 content/articles 之外的文件。
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error(`Invalid article slug: ${slug}`);
  }
}

function normalizeFrontmatter(slug: string, data: RawFrontmatter): PostFrontmatter {
  const title = typeof data.title === "string" ? data.title : slug;
  const date = typeof data.date === "string" ? data.date : "";
  const description = typeof data.description === "string" ? data.description : "";
  const cover = typeof data.cover === "string" ? data.cover : undefined;
  const coverAlt = typeof data.coverAlt === "string" ? data.coverAlt : undefined;
  const externalUrl = typeof data.externalUrl === "string" ? data.externalUrl : undefined;
  const order = typeof data.order === "number" ? data.order : undefined;

  if (!date) {
    throw new Error(`Missing required "date" in content/articles/${slug}.mdx`);
  }

  return { title, date, description, cover, coverAlt, externalUrl, order };
}

function readPostFile(slug: string): Post {
  assertSafeSlug(slug);

  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = normalizeFrontmatter(slug, data as RawFrontmatter);

  return {
    slug,
    content,
    ...frontmatter,
  };
}

export const getPostBySlug = cache((slug: string): Post => {
  return readPostFile(slug);
});

export const getAllPosts = cache((): PostSummary[] => {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => readPostFile(fileName.replace(/\.mdx$/, "")))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      cover: post.cover,
      coverAlt: post.coverAlt,
      externalUrl: post.externalUrl,
      order: post.order,
    }))
    .sort((a, b) => {
      // order 用于手动控制首页排序；未填写时继续按日期倒序，便于纯内容管理。
      if (typeof a.order === "number" || typeof b.order === "number") {
        return (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY);
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
});
