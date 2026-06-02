# 网站内容管理说明

本项目的首页作品列表和文章详情页都由本地 MDX 文件驱动。日常内容维护只需要管理 `content/articles/` 目录里的 `.mdx` 文件，不需要改 Astro 组件代码。

## 目录位置

```text
content/
  articles/
    fazer.mdx
    mobilepay.mdx
    ...
```

每一个 `.mdx` 文件就是一篇文章，也会自动成为首页中的一个作品卡片。

## 新增文章

1. 在 `content/articles/` 下新建一个 `.mdx` 文件。
2. 文件名会成为页面路由，例如：

```text
content/articles/my-new-work.mdx
```

对应访问地址：

```text
/articles/my-new-work
```

3. 文件内容参考下面模板：

```mdx
---
title: "My New Work"
date: "2026-05-26"
description: "首页卡片中显示的一句话简介。"
cover: "/images/articles/my-new-work.webp"
coverAlt: "封面图的可访问性描述。"
order: 1
---

## 项目介绍

这里写文章正文，支持 Markdown 和 MDX。

可以写段落、列表、图片、链接，也可以后续接入自定义 Astro/MDX 组件。
```

## 删除文章

直接删除对应的 `.mdx` 文件即可。

例如删除：

```text
content/articles/my-new-work.mdx
```

首页作品卡片会自动消失，对应的文章页面也不会再生成。

## 调整首页排序

推荐使用 `order` 字段控制顺序：

```mdx
---
title: "Fazer"
date: "2026-05-01"
description: "Handmade typography for a Finnish candy brand."
order: 1
---
```

规则：

- `order` 数字越小，首页越靠前。
- 没有填写 `order` 的文章会排在填写了 `order` 的文章后面。
- 如果所有文章都不写 `order`，则默认按 `date` 倒序排列。

## 必填字段

每篇文章建议至少包含：

```mdx
---
title: "文章标题"
date: "2026-05-26"
description: "文章简介"
cover: "封面图地址"
coverAlt: "封面图描述"
---
```

字段说明：

- `title`：首页卡片标题和详情页标题。
- `date`：文章日期，格式建议使用 `YYYY-MM-DD`。
- `description`：首页卡片简介和 SEO 描述。
- `cover`：首页卡片封面图，优先使用 `/public` 下的本地图片路径。
- `coverAlt`：封面图描述，建议填写。
- `order`：可选，用于手动调整首页排序。
- `externalUrl`：可选，填写后首页卡片会跳转到外部链接。

## 使用本地图片

把图片放到 `public/` 目录中，例如：

```text
public/images/articles/my-cover.webp
```

然后在 MDX 中这样写：

```mdx
---
cover: "/images/articles/my-cover.webp"
coverAlt: "我的项目封面图"
---
```

如果新增封面的比例和现有卡片不同，需要同步更新 `astro/lib/articles.ts` 中的 `coverAspectBySlug`，这样首页卡片在图片加载前也能保持稳定高度。

## 使用 TinaCMS 后台

项目支持通过 TinaCMS 编辑 MDX 内容。本地启动：

```bash
npm run dev:cms
```

后台入口：

```text
http://localhost:4321/admin/index.html
```

线上入口为：

```text
/admin/index.html
```

后台可编辑 `content/articles/*.mdx`，上传图片会保存到 `public/images/articles/`。线上保存后，TinaCloud 会把 MDX 和图片写入 GitHub，Vercel 随后自动重新部署。

线上后台需要配置：

```text
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH=main
```

## 本地预览

修改、新增或删除 MDX 文件后，开发服务器会自动刷新：

```bash
npm run dev
```

打开：

```text
http://localhost:4321
```
