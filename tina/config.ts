import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

function slugifyFilename(value?: string) {
  return (
    value
      ?.toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-") || "new-article"
  );
}

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  // 使用仓库内媒体库，上传后的图片会随 MDX 一起进入 GitHub 版本管理。
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "images/articles",
    },
    accept: ["image/avif", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp"],
  },
  repoProvider: {
    defaultBranchName: "main",
    historyUrl: ({ relativePath, branch }) => ({
      url: `https://github.com/billyyy-wu/portfolio/commits/${branch}/${relativePath}`,
    }),
  },
  schema: {
    collections: [
      {
        label: "Articles",
        name: "article",
        path: "content/articles",
        format: "mdx",
        ui: {
          router: ({ document }) => `/articles/${document._sys.filename}`,
          filename: {
            showFirst: true,
            description: "文件名会成为文章路径，例如 my-work 对应 /articles/my-work。",
            parse: slugifyFilename,
            slugify: (values) => slugifyFilename(String(values.title || "")),
          },
          allowedActions: {
            create: true,
            delete: true,
            createFolder: false,
            createNestedFolder: false,
          },
        },
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Date",
            name: "date",
            required: true,
            description: "保持 YYYY-MM-DD 格式，避免影响现有排序和日期展示。",
            ui: {
              validate: (value) =>
                /^\d{4}-\d{2}-\d{2}$/.test(value || "")
                  ? undefined
                  : "请使用 YYYY-MM-DD 格式。",
            },
          },
          {
            type: "string",
            label: "Description",
            name: "description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            label: "Cover",
            name: "cover",
            description: "优先上传 webp/avif；保存后路径会写成 /images/articles/...。",
            uploadDir: () => "images/articles",
          },
          {
            type: "string",
            label: "Cover Alt",
            name: "coverAlt",
            description: "封面图的可访问性描述。",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            label: "External URL",
            name: "externalUrl",
            description: "可选。填写后首页卡片会跳转到外部地址。",
          },
          {
            type: "number",
            label: "Order",
            name: "order",
            description: "可选。数字越小，首页越靠前；留空则按日期倒序。",
          },
          {
            type: "rich-text",
            label: "Body",
            name: "body",
            isBody: true,
            parser: {
              type: "mdx",
            },
          },
        ],
      },
    ],
  },
  telemetry: "disabled",
});
