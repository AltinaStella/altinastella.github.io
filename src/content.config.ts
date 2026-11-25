import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // 文章顶部横幅图，路径相对于这篇 .md 文件
      cover: image().optional(),
      // 草稿只在本地 npm run dev 时显示，不会发布
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
