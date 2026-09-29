import Link from "next/link";
import type { Metadata } from "next";

import NewBadge from "@/components/NewBadge";
import { articleEntries, isNew } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/articles" },
  title: "データ分析記事一覧",
  description:
    "全国自治体データランキングが公開している、データ分析記事の一覧です。新しい記事から順に掲載しています。",
};

export default function Page() {
  // lib/articles.ts が単一の情報源。ここは手で更新しない。
  const sorted = [...articleEntries].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );
  const latest = sorted.slice(0, 3);
  const rest = sorted;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
        📖 データ分析記事一覧
      </h1>

      <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: 24 }}>
        全国自治体データをもとにした分析記事の一覧です(全{sorted.length}本、新しい順)。
      </p>

      <h2 style={{ fontSize: 20, marginBottom: 12 }}>🆕 最新の記事</h2>
      <div style={grid}>
        {latest.map((a) => (
          <ArticleItem key={a.slug} a={a} highlight />
        ))}
      </div>

      <h2 style={{ fontSize: 20, margin: "36px 0 12px" }}>すべての記事</h2>
      <div style={grid}>
        {rest.map((a) => (
          <ArticleItem key={a.slug} a={a} />
        ))}
      </div>
    </main>
  );
}

function ArticleItem({
  a,
  highlight,
}: {
  a: (typeof articleEntries)[number];
  highlight?: boolean;
}) {
  return (
    <Link
      prefetch={false}
      href={`/articles/${a.slug}`}
      style={{
        display: "block",
        padding: 22,
        background: "#fff",
        border: highlight ? "2px solid #fca5a5" : "1px solid #e5e7eb",
        borderRadius: 14,
        textDecoration: "none",
        color: "#111827",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        {isNew(a.date) && (
          <>
            <NewBadge />{" "}
          </>
        )}
        {a.date.replaceAll("-", "/")}
        {" "}公開
      </div>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
        {a.title}
      </div>
      <div style={{ color: "#6b7280", fontSize: 14 }}>{a.desc}</div>
    </Link>
  );
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 20,
};
