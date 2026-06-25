import Link from "next/link";

const pages = [
  {
    title: "人口ランキング",
    href: "/ranking/population",
    desc: "人口が多い自治体ランキング",
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
    title: "人口減少ランキング",
    href: "/ranking/decline",
    desc: "人口減少率のランキング",
  },
  {
    title: "プライバシーポリシー",
    href: "/privacy",
    desc: "個人情報保護方針",
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