import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={body}>
        <header style={header}>
          <div style={{ fontWeight: 900 }}>
            🇯🇵 日本自治体データランキング
          </div>
          <div style={sub}>
            人口・子ども・高齢化を可視化
          </div>
        </header>

        <main style={main}>{children}</main>

        <footer style={footer}>
          <a href="/privacy">プライバシー</a> ｜ 
          <a href="/contact">お問い合わせ</a>
        </footer>
      </body>
    </html>
  );
}

const body: React.CSSProperties = {
  margin: 0,
  fontFamily: "system-ui",
  background: "#f5f7ff",
  color: "#111",
};

const header: React.CSSProperties = {
  padding: "18px 20px",
  background: "linear-gradient(135deg,#4f46e5,#06b6d4)",
  color: "white",
};

const sub: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.9,
  marginTop: 4,
};

const main: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
};

const footer: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  padding: 30,
  color: "#666",
};