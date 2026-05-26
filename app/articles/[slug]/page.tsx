import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { AnchorHTMLAttributes } from "react";

import { FadeUp } from "@/components/animations/FadeUp";
import { getAllPosts, getPostBySlug, type Post } from "@/lib/mdx";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const mdxComponents = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="font-bold text-accent underline-offset-4 hover:underline" />
  ),
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        images: post.cover ? [post.cover] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let post: Post;

  try {
    // 先完成文件读取和校验，再进入 JSX 渲染，便于 notFound 处理缺失内容。
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
      <FadeUp>
        <p className="mb-4 text-sm font-black uppercase text-accent">
          {new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
          }).format(new Date(post.date))}
        </p>
        <h1 className="text-4xl font-black leading-tight text-ink md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-9 text-neutral-600">
          {post.description}
        </p>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="prose prose-neutral mt-12 max-w-none prose-headings:text-ink prose-headings:font-black prose-p:leading-8 prose-a:text-accent">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </FadeUp>
    </article>
  );
}
