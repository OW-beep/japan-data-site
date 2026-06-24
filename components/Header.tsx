import Link from "next/link";

export default function Header() {
  return (
    <header style={wrap}>
      <div style={{ fontWeight: 700 }}>
        🇯🇵 日本自治体データランキング
      </div>

      <nav style={nav}>
        <Link href="/ranking/population">人口</Link>
        <Link href="/ranking/child">子ども</Link>
        <Link href="/ranking/aging">高齢化</Link>
        <Link href="/ranking/decline">減少</Link>
      </nav>
    </header>
  );
}

const wrap: React.CSSProperties = {
  padding: 16,
  background: "#111827",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: 12,
  fontSize: 14,
};