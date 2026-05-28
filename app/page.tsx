import Image from "next/image";

import { FadeUp } from "@/components/animations/FadeUp";
import { PostCard } from "@/components/ui/PostCard";
import { getAllPosts, type PostSummary } from "@/lib/mdx";

const logoItems = [
  {
    src: "/logos/logo-carlsberg.svg",
    width: 96,
    height: 38,
    heightClass: "h-[38px]",
    alt: "Carlsberg",
  },
  {
    src: "/logos/logo-momkind.svg",
    width: 133,
    height: 24,
    heightClass: "h-[24px]",
    alt: "momkind",
  },
  {
    src: "/logos/logo-roskilde-festival.svg",
    width: 105,
    height: 40,
    heightClass: "h-[40px]",
    alt: "Roskilde Festival",
  },
  {
    src: "/logos/logo-la-cabra.svg",
    width: 121,
    height: 20,
    heightClass: "h-[20px]",
    alt: "La Cabra",
  },
  {
    src: "/logos/logo-mobilepay.svg",
    width: 125,
    height: 40,
    heightClass: "h-[40px]",
    alt: "MobilePay",
  },
  {
    src: "/logos/logo-wwf.svg",
    width: 38,
    height: 56,
    heightClass: "h-[56px]",
    alt: "WWF",
  },
];

function getDesktopColumns(posts: PostSummary[], columnCount = 3) {
  // 首页作品完全由 content/articles/*.mdx 驱动，新增/删除文件后自动重新分栏。
  return posts.reduce<PostSummary[][]>(
    (columns, post, index) => {
      columns[index % columnCount].push(post);
      return columns;
    },
    Array.from({ length: columnCount }, () => []),
  );
}

export default function HomePage() {
  // 首页只消费文章摘要，正文延迟到详情页读取，保持首屏数据轻量。
  const posts = getAllPosts();
  const columns = getDesktopColumns(posts);

  return (
    <>
      <section className="site-gradient-top pb-16 pt-12 md:min-h-[844px] md:pb-24 md:pt-32">
        <div className="mx-auto flex w-full max-w-site flex-col gap-16 px-4">
          <div className="flex w-full flex-col gap-8">
            <FadeUp>
              <h1 className="text-4xl font-bold leading-[1.3] tracking-[-1.44px] text-ink sm:text-[40px] md:text-[60px] md:leading-[78px] md:tracking-[-2.4px]">
                Independent art director, designer,
                <br className="hidden md:block" /> educator and founder of{" "}
                <Image
                  src="/logo-panka.svg"
                  alt="Panka"
                  width={178}
                  height={56}
                  priority
                  unoptimized
                  className="mb-2 ml-1 inline-block h-auto w-[120px] md:w-[178px]"
                />
                .
              </h1>
            </FadeUp>

            <FadeUp delay={0.08}>
              <p className="text-lg font-medium leading-8 tracking-[-0.45px] text-neutral-600 md:text-[23.8px] md:leading-[42px] md:tracking-[-0.6px]">
                With more than 10 years of experience in branding, advertising
                and visual design, I work as an independent creative for clients
                who want to stand out with bold design and clever ideas.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.16}>
            <a
              href="#connect"
              className="group inline-flex h-[68px] items-center rounded-full bg-neutral-900 py-3 pl-3 pr-7 text-[20px] font-medium leading-7 text-white"
            >
              <span className="relative mr-4 size-11 overflow-hidden rounded-full">
                <Image
                  src="/cathrine-understrup.png"
                  alt=""
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
                <span className="absolute inset-0 rounded-full bg-accent mix-blend-screen transition-opacity duration-200 group-hover:opacity-0" />
                {/* 悬浮时白色遮罩只做淡入，视觉动效集中在箭头本身。 */}
                <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                <span
                  data-no-global-reveal
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                >
                  <Image
                    src="/images/hero-arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className="-translate-x-2 opacity-0 will-change-transform transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,1.18,0.42,1)] group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
              </span>
              <span className="pt-0.5">About Billy</span>
            </a>
          </FadeUp>

          <FadeUp delay={0.24}>
            <div className="overflow-hidden py-12 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <ul className="flex min-h-14 min-w-max items-center">
                {[...logoItems, ...logoItems, ...logoItems].map((item, index) => (
                  <li
                    key={`${item.alt}-${index}`}
                    className="mr-16 flex shrink-0 items-center justify-center md:mr-[100px]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      unoptimized
                      className={`${item.heightClass} w-auto opacity-30`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      <section id="resume" className="bg-white py-12 md:overflow-hidden">
        <div className="mx-auto w-full max-w-site px-4">
          <FadeUp className="mb-8 flex items-center">
            <h2 className="text-3xl font-bold leading-[1.2] tracking-[-0.6px] text-ink md:text-[32px]">
              Selected work
            </h2>
            <span
              aria-hidden="true"
              data-no-global-reveal
              className="ml-2 inline-flex size-8 items-center justify-center"
            >
              <Image
                src="/images/selectedwork-arrow.svg"
                alt=""
                width={32}
                height={32}
                unoptimized
                className="size-8"
              />
            </span>
          </FadeUp>

          <div className="columns-1 sm:columns-2 lg:hidden">
            {posts.map((post, index) => (
              <FadeUp key={post.slug} delay={(index % 3) * 0.05}>
                <PostCard post={post} priority={index < 3} />
              </FadeUp>
            ))}
          </div>

          <div className="-mx-1 hidden grid-cols-3 lg:grid">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex}>
                {column.map((post, index) => (
                  <FadeUp key={post.slug} delay={(columnIndex + index) * 0.02}>
                    <PostCard
                      post={post}
                      priority={columnIndex === 0 && index === 0}
                    />
                  </FadeUp>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
