import Link from "next/link";

export default function Header() {
  return (
    <header style={header}>
      <div style={container}>
        <Link href="/" style={logo}>
          🇯🇵 全国自治体データランキング
        </Link>

        <nav style={nav}>
          <Link href="/">ホーム</Link>
          <Link href="/search">検索</Link>
          <Link href="/ranking/population">人口</Link>
          <Link href="/ranking/area">面積</Link>
          <Link href="/ranking/density">人口密度</Link>
          <Link href="/ranking/child">子ども</Link>
          <Link href="/ranking/aging">高齢化</Link>
        </nav>
      </div>
    </header>
  );
}

const header: React.CSSProperties = {
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 20,
};

const logo: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 800,
  fontSize: 22,
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: 18,
  flexWrap: "wrap",
  fontSize: 15,
};