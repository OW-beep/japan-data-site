import Link from "next/link";

const pages = [
  { href: "/", label: "トップ" },
  { href: "/ranking/population", label: "人口ランキング" },
  { href: "/ranking/child", label: "子どもランキング" },
  { href: "/ranking/aging", label: "高齢化ランキング" },
  { href: "/ranking/decline", label: "人口減少ランキング" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Page() {
  return (
    <div style={wrap}>
      <h1 style={title}>サイトマップ</h1>

      <p style={note}>
        各ページ一覧（データランキングサイト内ナビゲーション）
      </p>

      <div style={list}>
        {pages.map((p) => (
          <Link key={p.href} href={p.href} style={item}>
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  padding: 20,
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 10,
};

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  marginBottom: 20,
};

const list: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const item: React.CSSProperties = {
  padding: 12,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  textDecoration: "none",
  color: "#111",
};