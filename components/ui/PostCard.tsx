import Image from "next/image";

import type { PostSummary } from "@/lib/mdx";
import { cn } from "@/lib/utils";

const coverAspectBySlug: Record<string, string> = {
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

export interface PostCardProps {
  post: PostSummary;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const href = post.externalUrl ?? `/articles/${post.slug}`;
  const isExternal = Boolean(post.externalUrl);

  return (
    <article className="mb-16 break-inside-avoid px-3 md:px-5">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      >
        {post.cover ? (
          <div
            className={cn(
              "relative mb-4 w-full overflow-hidden bg-neutral-100",
              coverAspectBySlug[post.slug] ?? "aspect-[352.66/326.2]",
            )}
          >
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              fill
              sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, 100vw"
              priority={priority}
              className="object-cover transition duration-200 ease-in-out md:group-hover:-rotate-3 md:group-hover:scale-110 md:group-hover:shadow-2xl"
            />
          </div>
        ) : null}

        <h3 className="mb-1 text-[24px] font-bold leading-[1.2] tracking-[-0.6px] text-ink">
          {post.title}
        </h3>
        <p className="mb-4 text-[18px] font-medium leading-[1.8] tracking-[-0.45px] text-neutral-600">
          {post.description}
        </p>
      </a>
    </article>
  );
}
