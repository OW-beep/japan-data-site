import Link from "next/link";

import NewBadge from "@/components/NewBadge";
import { getLatestArticles, isNew, formatMD } from "@/lib/articles";

/**
 * 各記事の末尾に表示する「新着記事」ブロック。
 * 全記事から新しい記事へ内部リンクが張られるので、
 * 新記事がクロールされやすくなり、回遊(読了後の次の1ページ)も増える。
 */
export default function LatestArticles({
  currentPath,
}: {
  currentPath?: string;
}) {
  const slug = currentPath?.replace(/^\/articles\//, "");
  const items = getLatestArticles(4, slug);

  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 20 }}>🆕 新着記事</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        {items.map((a) => (
          <Link
            prefetch={false}
            key={a.slug}
            href={`/articles/${a.slug}`}
            style={{
              display: "block",
              padding: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#fff",
              color: "#111827",
              textDecoration: "none",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              {isNew(a.date) && (
                <>
                  <NewBadge />{" "}
                </>
              )}
              {formatMD(a.date)}
            </div>
            <div style={{ fontWeight: 700, lineHeight: 1.5, fontSize: 14 }}>
              {a.title}
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 14, fontSize: 14 }}>
        <Link
          prefetch={false}
          href="/articles"
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          すべての分析記事を見る →
        </Link>
      </p>
    </section>
  );
}
