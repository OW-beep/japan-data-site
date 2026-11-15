import { SITE_NAME, SITE_URL } from "@/lib/site";
import { articleEntries } from "@/lib/articles";

/**
 * 新着記事のRSSフィード(RSS 2.0)。/feed.xml
 *
 * 記事の一覧(lib/articles.ts)から、公開済みの記事を新しい順に最大50件、自動で生成する。
 * 記事を追加すれば、フィードにも自動で載る(公開日の予約を使っている記事は、公開日が来てから載る)。
 * ビルド時に静的に生成する。
 */
export const dynamic = "force-static";

const FEED_LIMIT = 50;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** 「YYYY-MM-DD」(日本時間の0時)を、RSSの日付形式(RFC 822)にする */
const rfc822 = (d: string) => new Date(`${d}T00:00:00+09:00`).toUTCString();

export function GET() {
  const items = [...articleEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, FEED_LIMIT);

  const channelTitle = `${SITE_NAME} 新着記事`;
  const channelDesc =
    "全国の市区町村の公的データ(人口・財政・所得・将来推計など)を、暮らしの悩みに結びつけて分析する記事の新着です。";
  const lastBuild = items.length > 0 ? rfc822(items[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(channelTitle)}</title>
    <link>${esc(SITE_URL)}</link>
    <description>${esc(channelDesc)}</description>
    <language>ja</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${esc(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map((a) => {
    const url = `${SITE_URL}/articles/${a.slug}`;
    return `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <description>${esc(a.desc)}</description>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
