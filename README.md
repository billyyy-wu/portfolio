# Portfolio 网站维护说明

这是一个基于 Astro、Tailwind CSS 和本地 MDX 内容构建的作品集网站。首页作品列表和文章详情页都由 `content/articles/` 目录中的 `.mdx` 文件驱动。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开：

```text
http://localhost:4321
```

部署前可以本地构建检查：

```bash
npm run build
```

更新内容后如需刷新字体子集：

```bash
npm run font:subset
```

## 当前架构

```text
astro/
  components/        Astro 静态组件和少量原生交互脚本
  content.config.ts  Astro Content Collections 配置
  layouts/           全站布局
  lib/               内容排序和展示辅助函数
  pages/             Astro 路由页面
  styles/            全局 Tailwind/CSS
content/articles/    作品和文章 MDX 内容
public/images/articles/ 本地作品封面
```

默认生产站点由 Astro 构建。新增页面、交互和内容展示逻辑都优先改 `astro/`，文章内容继续由 `content/articles/` 管理。

## 使用 MDX 更新网页内容

所有作品内容都放在：

```text
content/articles/
```

每个 `.mdx` 文件对应一篇作品文章，文件名会成为访问路径。例如：

```text
content/articles/my-new-work.mdx
```

对应页面：

```text
/articles/my-new-work
```

新增作品时，可以复制下面模板：

```mdx
---
title: "作品标题"
date: "2026-05-26"
description: "首页卡片和 SEO 中显示的作品简介。"
cover: "/images/articles/my-new-work.webp"
coverAlt: "封面图的文字描述。"
order: 1
---

## 项目介绍

这里写作品正文，支持 Markdown 和 MDX。

可以添加段落、标题、列表、链接和图片。
```

字段说明：

- `title`：首页卡片标题和详情页标题。
- `date`：文章日期，建议使用 `YYYY-MM-DD` 格式。
- `description`：首页卡片简介和页面 SEO 描述。
- `cover`：首页卡片封面图，优先使用 `/public` 下的本地图片路径，例如 `/images/articles/my-new-work.webp`。
- `coverAlt`：封面图的可访问性描述。
- `order`：可选，数字越小首页越靠前；不填写时按日期倒序排列。
- `externalUrl`：可选，填写后首页卡片会跳转到外部链接。

删除作品时，直接删除对应的 `.mdx` 文件即可。

## 使用本地图片

把图片放到 `public/` 目录下，例如：

```text
public/images/articles/my-cover.webp
```

然后在 MDX frontmatter 中这样引用：

```mdx
---
cover: "/images/articles/my-cover.webp"
coverAlt: "我的项目封面图"
---
```

如果新增封面的比例和现有卡片不同，需要在 `astro/lib/articles.ts` 的 `coverAspectBySlug` 中补充对应 slug 的比例，避免首页瀑布流布局跳动。

## 上传 Resume PDF

简历 PDF 放在：

```text
public/resume.pdf
```

Astro/Vercel 部署后，这个文件会以站点根路径公开访问：

```text
/resume.pdf
```

如果生产域名是 `https://example.com`，完整访问地址就是：

```text
https://example.com/resume.pdf
```

更新简历时，直接替换 `public/resume.pdf`，然后提交并推送到 GitHub。Vercel 完成部署后，新 PDF 会随站点一起更新。

## 上传更新到 GitHub

每次修改 MDX 内容、图片或代码后，先查看变更：

```bash
git status
```

提交并上传：

```bash
git add .
git commit -m "更新网站内容"
git push
```

如果只想提交某一个文件，例如一篇新文章：

```bash
git add content/articles/my-new-work.mdx
git commit -m "新增作品文章"
git push
```

如果 GitHub 要求输入账号和密码：

- `Username` 输入 GitHub 用户名。
- `Password` 粘贴 GitHub Personal Access Token，不是 GitHub 登录密码。
- token 需要有当前仓库的 `Contents: Read and write` 权限。

## Vercel 部署

首次部署：

1. 打开 Vercel Dashboard。
2. 点击 `Add New...` 或 `New Project`。
3. 导入 GitHub 仓库 `billyyy-wu/portfolio`。
4. Framework Preset 选择或自动识别为 `Astro`。
5. 保持默认构建配置：

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

6. 点击 `Deploy`。

完成连接后，每次执行 `git push` 到 `main` 分支，Vercel 会自动触发 Production 部署。

## 手动触发 Vercel 重新部署

方式一：在 Vercel 后台操作。

1. 进入项目。
2. 打开 `Deployments`。
3. 找到需要重新部署的记录。
4. 点击 `Redeploy`。

方式二：本地创建一个空提交触发部署。

```bash
git commit --allow-empty -m "Trigger Vercel deploy"
git push
```

## 推荐维护流程

1. 修改或新增 `content/articles/*.mdx`。
2. 本地运行 `npm run dev` 预览。
3. 需要上线前运行 `npm run build` 和 `npm run lint` 检查。
4. 执行 `git add .`、`git commit`、`git push` 上传到 GitHub。
5. 等待 Vercel 自动部署完成。
