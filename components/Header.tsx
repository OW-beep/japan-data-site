import Link from "next/link";

export default function Header() {
  return (
    <header style={header}>
      <div style={container}>
        <Link prefetch={false} href="/" style={logo}>
          全国自治体データランキング
        </Link>

        <nav style={nav}>
          <Link prefetch={false} href="/">ホーム</Link>

          <Link prefetch={false} href="/ranking">
            ランキング
          </Link>

          <Link prefetch={false} href="/prefecture">
            都道府県
          </Link>

          <Link prefetch={false} href="/search">
            市区町村検索
          </Link>

          <Link prefetch={false} href="/compare">
            自治体比較
          </Link>

          <Link prefetch={false} href="/articles">
            データ分析
          </Link>

          <Link prefetch={false} href="/about">
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