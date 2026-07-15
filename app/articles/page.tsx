import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "データ分析記事一覧",
  description:
    "全国自治体データランキングが公開している、データ分析記事の一覧です。",
};

const articles = [
  {
    href: "/articles/population-about",
    title: "人口とは？",
    desc: "人口データの見方や集計方法をわかりやすく解説します。",
  },
  {
    href: "/articles/population-top50",
    title: "人口ランキングTOP50",
    desc: "人口が多い自治体をランキング形式で紹介します。",
  },
  {
    href: "/articles/population-concentration",
    title: "人口集中はどこで起きている？",
    desc: "都市への人口集中をデータから分析します。",
  },
  {
    href: "/articles/million-cities",
    title: "100万人都市一覧",
    desc: "人口100万人以上の都市を一覧で比較できます。",
  },
  {
    href: "/articles/child-top50",
    title: "子ども人口ランキング",
    desc: "子ども人口が多い自治体ランキングです。",
  },
  {
    href: "/articles/aging-top50",
    title: "高齢化率ランキング",
    desc: "高齢化率が高い自治体ランキングです。",
  },
  {
    href: "/articles/youngest-municipalities",
    title: "若い自治体ランキング",
    desc: "平均年齢が若い自治体を紹介します。",
  },
  {
    href: "/articles/birth-rate",
    title: "出生率ランキング",
    desc: "出生率が高い自治体ランキングです。",
  },
  {
    href: "/articles/decline",
    title: "人口減少ランキング",
    desc: "人口減少が進む自治体を比較します。",
  },
];

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        📖 データ分析記事一覧
      </h1>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国自治体データをもとにした分析記事の一覧です。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {articles.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "block",
              padding: 22,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                marginBottom: 6,
              }}
            >
              {a.title}
            </div>

            <div style={{ color: "#6b7280", fontSize: 14 }}>
              {a.desc}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
