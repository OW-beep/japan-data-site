import Link from "next/link";

import NewBadge from "@/components/NewBadge";
import { getFeed, isNew, formatMD } from "@/lib/articles";

/**
 * 新着ランキング・記事セクション。
 *
 * 表示内容は lib/articles.ts(記事)と rankingEntries(ランキング)から
 * 自動で作られる。以前のように、ここを手で更新する必要はない。
 * 新しい記事を追加したら lib/articles.ts の先頭に1行足すだけでよい。
 */
export default function NewArrivalsSection() {
  const items = getFeed(6);

  return (
    <section style={{ marginTop: 32, marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          🆕 新着ランキング・記事
        </h2>

        <Link
          prefetch={false}
          href="/articles"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--indigo)",
            textDecoration: "none",
          }}
        >
          記事一覧を見る →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 12,
        }}
      >
        {items.map((item) => (
          <Link
            prefetch={false}
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--ochre)",
              padding: "14px 16px",
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {isNew(item.date) && <NewBadge />}
              <span style={{ color: "var(--muted)" }}>{item.type}</span>
              <span
                style={{
                  color: "var(--ochre)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatMD(item.date)}
              </span>
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
              {item.title}
            </div>

            {item.desc && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12.5,
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                {item.desc}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
