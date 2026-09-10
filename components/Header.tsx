import Link from "next/link";

export default function Header() {
  return (
    <header style={header}>
      <div style={container}>
        <Link href="/" style={logo}>
          全国自治体データランキング
        </Link>

        <nav style={nav}>
          <Link href="/">ホーム</Link>

          <Link href="/ranking">
            ランキング
          </Link>

          <Link href="/prefecture">
            都道府県
          </Link>

          <Link href="/search">
            市区町村検索
          </Link>

          <Link href="/compare">
            自治体比較
          </Link>

          <Link href="/articles">
            データ分析
          </Link>

          <Link href="/about">
            サイトについて
          </Link>
        </nav>
      </div>
    </header>
  );
}

const header: React.CSSProperties = {
  background: "var(--surface)",
  borderBottom: "1px solid var(--line)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "12px 24px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  gap: 24,
  flexWrap: "wrap",
};

const logo: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--ink)",
  fontFamily: "var(--font-serif)",

  fontWeight: 700,
  fontSize: 18,
};

const nav: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,

  fontSize: 14,
  fontWeight: 600,
};