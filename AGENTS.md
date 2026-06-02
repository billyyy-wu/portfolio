# AGENTS.md

## 项目概览

这是一个 Astro 静态作品集网站。当前生产架构以 `astro/` 为源码目录，内容来自 `content/articles/*.mdx`，静态资源放在 `public/`。

## 常用命令

- `npm run dev`：启动 Astro 开发服务器，默认端口通常为 `4321`。
- `npm run build`：构建 Astro 静态站点到 `dist/`。
- `npm run preview`：预览 Astro 构建产物。
- `npm run lint`：运行 ESLint。
- `npm run font:subset`：根据 Astro 源码和 MDX 内容重新生成 OPPO Sans 子集字体。

## 目录职责

- `astro/pages/`：Astro 路由页面，包括首页、文章详情页和 404。
- `astro/layouts/BaseLayout.astro`：全站 HTML 骨架、字体预加载、导航、页脚、返回顶部和页面过场容器。
- `astro/components/`：Astro 静态组件和少量页面脚本。
- `astro/components/PageScripts.astro`：唯一的客户端交互脚本，负责导航、移动菜单、滚动 reveal、返回顶部和内部链接过场。
- `astro/content.config.ts`：Astro Content Collections 配置，读取 `content/articles/*.mdx`。
- `astro/lib/articles.ts`：文章排序、文章链接和封面比例映射。
- `content/articles/`：作品/文章内容源。不要破坏现有 frontmatter 字段。
- `public/images/articles/`：本地作品封面，优先使用 webp/avif。

## 内容规则

文章 frontmatter 支持：

- `title`
- `date`
- `description`
- `cover`
- `coverAlt`
- `externalUrl`
- `order`

首页排序规则必须保持：有 `order` 时按 `order` 升序；没有 `order` 时按 `date` 倒序。文章详情路径必须保持 `/articles/[slug]`。

新增作品封面时，优先放到 `public/images/articles/`，在 MDX 中使用 `/images/articles/example.webp` 这样的站内路径。图片应有稳定比例；如新增特殊封面尺寸，需要同步更新 `astro/lib/articles.ts` 中的 `coverAspectBySlug`。

## 开发原则

- 严格遵循 KISS、YAGNI、SOLID。
- 默认使用 Astro 静态渲染和原生浏览器能力，避免引入全站 React hydration。
- 不引入重型动效库；动效优先使用 CSS `opacity` 和 `transform`。
- 避免长期 `will-change`、大面积阴影动画和高成本裁切动画。
- 新增代码注释默认使用中文，只在解释意图或复杂逻辑时添加。

## 验证要求

完成代码变更后至少运行：

```bash
npm run build
npm run lint
```

关键验收点：

- 首页、文章详情页、404 可访问。
- 首页作品顺序不变。
- 文章内链路径仍为 `/articles/[slug]`。
- 客户端 JS 保持轻量，不重新引入 React/Next 客户端包。
- 页面不引用 `public/fonts/oppo-sans-4.0.woff2` 作为加载字体。
