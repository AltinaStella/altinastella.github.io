import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 已发布的文章，新的在前。本地开发时也包含草稿。 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 所有标签及其文章数，按数量从多到少。 */
export function countTags(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

/** 带上 base 路径的站内链接，例如 url('blog/') → '/blog/'。 */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export const postUrl = (post: Post) => url(`blog/${post.id}/`);
export const tagUrl = (tag: string) => url(`tags/${tag}/`);

// 日期在 frontmatter 里是 UTC 零点，按 UTC 格式化，避免在不同时区构建时差一天。
const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('zh-CN', { timeZone: 'UTC', ...options });

export const formatDate = (date: Date) => fmt({ year: 'numeric', month: 'long', day: 'numeric' }).format(date);
export const formatMonthDay = (date: Date) => fmt({ month: 'long', day: 'numeric' }).format(date);

/** 粗略的阅读时间：中文约 400 字/分钟，英文约 220 词/分钟。 */
export function readingMinutes(text = ''): number {
  const cjk = /[぀-ヿ㐀-鿿]/g;
  const chars = text.match(cjk)?.length ?? 0;
  const words = text.replace(cjk, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(chars / 400 + words / 220));
}
