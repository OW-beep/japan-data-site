import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サイトマップ",
  description: "全国自治体データランキング内のページ一覧です。",
};

const pages = [
  {
    title: "人口ランキング",
    href: "/ranking/population",
    desc: "人口が多い自治体ランキング",
  },
  {
    title: "出生率ランキング",
    href: "/ranking/birth-rate",
    desc: "合計特殊出生率ランキング",
  },
  {
    title: "子ども人口ランキング",
    href: "/ranking/child",
    desc: "子ども割合が高い自治体ランキング",
  },
  {
    title: "高齢化率ランキング",
    href: "/ranking/aging",
    desc: "高齢化率が高い自治体ランキング",
  },
  {
    title: "人口密度ランキング",
    href: "/ranking/density",
    desc: "人口密度が高い自治体ランキング",
  },
  {
    title: "面積ランキング",
    href: "/ranking/area",
    desc: "面積が広い自治体ランキング",
  },
  {
    title: "財政力指数ランキング",
    href: "/ranking/finance",
    desc: "財政力指数ランキング",
  },
  {
    title: "社会増減率ランキング",
    href: "/ranking/decline",
    desc: "転入超過・転出超過ランキング",
  },
  {
    title: "単独世帯割合ランキング",
    href: "/ranking/household",
    desc: "一人暮らし世帯の割合ランキング",
  },
  {
    title: "都道府県から探す",
    href: "/prefecture",
    desc: "都道府県別に自治体データを見る",
  },
  {
    title: "市区町村検索",
    href: "/search",
    desc: "自治体名からデータを検索",
  },
  {
    title: "データ分析記事",
    href: "/articles",
    desc: "ランキングの背景を解説する記事一覧",
  },
  {
    title: "サイトについて",
    href: "/about",
    desc: "運営者情報・データの出典について",
  },
  {
    title: "プライバシーポリシー",
    href: "/privacy",
    desc: "個人情報保護方針",
  },
  {
    title: "利用規約",
    href: "/terms",
    desc: "当サイトのご利用にあたって",
  },
  {
    title: "お問い合わせ",
    href: "/contact",
    desc: "お問い合わせフォーム",
  },
];

export default function SitemapPage() {
  return (
    <div>
      <h1 style={title}>サイトマップ</h1>

      <p style={lead}>
        日本自治体データランキング内のページ一覧です。
      </p>

      <div style={grid}>
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={card}
          >
            <div style={cardTitle}>
              {page.title}
            </div>

            <div style={cardDesc}>
              {page.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 12,
};

const lead: React.CSSProperties = {
  color: "#666",
  marginBottom: 24,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  display: "block",
  padding: 20,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  textDecoration: "none",
};

const cardTitle: React.CSSProperties = {
  fontWeight: 700,
  color: "#111827",
  marginBottom: 8,
};

const cardDesc: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 14,
};
