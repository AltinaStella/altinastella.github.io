# Altina's Blog

个人博客，用 [Astro](https://astro.build) 搭建，部署在 GitHub Pages。

## 本地预览

```powershell
npm install
npm run dev
```

然后打开 <http://localhost:4321>。改动保存后页面会自动刷新。草稿（`draft: true`）只在这里显示。

## 写一篇新文章

在 `src/content/blog/` 下新建一个 `.md` 文件，文件名就是网址，例如 `my-first-post.md` → `/blog/my-first-post/`。

```markdown
---
title: 文章标题
description: 一句话简介
pubDate: 2026-11-24
tags:
  - 音游
draft: true   # 写完删掉这一行就会发布
---

正文……
```

支持代码高亮、`$...$` / `$$...$$` 数学公式、表格和图片。完整写法见本地预览里的「写作示例」草稿（`src/content/blog/writing-guide.md`）。

## 常改的地方

| 想改什么 | 文件 |
| --- | --- |
| 站名、标语、社交链接、页脚提示 | `src/site.config.ts` |
| 首页头像旁的自我介绍 | `src/site.config.ts` 里的 `intro` |
| 关于页的自我介绍（Markdown） | `src/about.md` |
| 关于页的项目列表 | `src/data/projects.ts` |
| 头像 / 首页头图 | `src/assets/avatar.jpg` / `src/assets/hero-oc.jpg` |
| 颜色和排版 | `src/styles/global.css` |

## 关于头图

仓库是公开的，放进 `src/assets/` 的图片任何人都能下载。所以这里只放 1600px 宽、右下角带「© Altina」水印的版本，原图请留在自己电脑上。

换头图时，用这条命令从原图生成（会覆盖 `src/assets/hero-oc.jpg`）：

```powershell
npm run hero -- "原图的路径.png"
```

水印文字、大小在 `scripts/prepare-hero.mjs` 开头改。

## 发布

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布。第一次需要在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 里选 **GitHub Actions**。
