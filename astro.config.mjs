// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // 仓库改名为 AltinaStella.github.io 后，博客就在这个地址的根路径下。
  site: 'https://altinastella.github.io',
  // 如果仓库保留原名（williamlina.github.io），取消下一行注释。
  // base: '/williamlina.github.io',
  integrations: [sitemap()],
  markdown: {
    // 用 remark/rehype 流程渲染 Markdown，以便用 KaTeX 渲染数学公式
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'tokyo-night' },
      defaultColor: false,
    },
  },
});
