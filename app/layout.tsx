import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui",
          background: "#f4f7ff",
          color: "#111",
        }}
      >
        <header
          style={{
            padding: 16,
            background: "white",
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 900 }}>
            🇯🇵 日本自治体データランキング
          </div>

          <nav style={{ marginTop: 8, fontSize: 14 }}>
            <Link href="/ranking" style={link}>
              ランキング一覧
            </Link>
            <Link href="/ranking/population" style={link}>
              人口
            </Link>
            <Link href="/ranking/child" style={link}>
              子ども
            </Link>
            <Link href="/ranking/aging" style={link}>
              高齢化
            </Link>
            <Link href="/ranking/decline" style={link}>
              少人口
            </Link>
          </nav>
        </header>

        <div>{children}</div>
      </body>
    </html>
  );
}

const link: React.CSSProperties = {
  marginRight: 12,
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: 600,
};