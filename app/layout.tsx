import "./globals.css";
import Link from "next/link";

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
          fontFamily:
            "system-ui, -apple-system, sans-serif",
          background:
            "linear-gradient(180deg,#f6f7fb,#eef2ff)",
          color: "#111",
        }}
      >
        {/* ヘッダー */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 800,
              fontSize: 16,
              textDecoration: "none",
              color: "#111",
            }}
          >
            🇯🇵 日本データランキング
          </Link>

          <nav style={{ display: "flex", gap: 12 }}>
            <Link style={nav} href="/ranking/population">
              人口ランキング
            </Link>
            <Link style={nav} href="/search">
              検索
            </Link>
          </nav>
        </header>

        {/* メイン */}
        <main
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: 24,
          }}
        >
          {/* 上部広告枠（将来用） */}
          <div style={adBox}>
            📢 広告スペース（ここにAdSense入れる）
          </div>

          {children}

          {/* 下部導線（回遊） */}
          <div style={{ marginTop: 40 }}>
            <div style={footerCard}>
              🔥 人気ランキングを見る →
              <div style={{ marginTop: 10 }}>
                <Link href="/ranking/population">
                  人口ランキングTOP100
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* フッター */}
        <footer
          style={{
            marginTop: 60,
            padding: 20,
            textAlign: "center",
            fontSize: 12,
            color: "#666",
          }}
        >
          © Japan Data Ranking
        </footer>
      </body>
    </html>
  );
}

const nav = {
  fontSize: 14,
  textDecoration: "none",
  color: "#333",
  padding: "6px 10px",
  borderRadius: 8,
  background: "#f3f4f6",
};

const adBox = {
  marginTop: 10,
  marginBottom: 20,
  padding: 20,
  background: "white",
  borderRadius: 12,
  border: "1px dashed #cbd5e1",
  textAlign: "center" as const,
  color: "#666",
};

const footerCard = {
  padding: 16,
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};