import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "日本自治体データランキング",
  description: "人口・子ども・高齢化などの自治体データランキング",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630812027939211"
          crossOrigin="anonymous"
        />
      </head>

      <body style={body}>
        <header style={header}>
          🇯🇵 日本自治体データランキング
        </header>

        <main style={{ padding: 20 }}>{children}</main>

        <footer style={footer}>
          <a href="/privacy">プライバシー</a> |{" "}
          <a href="/contact">お問い合わせ</a>
        </footer>
      </body>
    </html>
  );
}

const body: React.CSSProperties = {
  fontFamily: "system-ui",
  background: "#f7f9ff",
  color: "#111",
};

const header: React.CSSProperties = {
  background: "#fff",
  padding: "16px 20px",
  borderBottom: "1px solid #eee",
  position: "sticky",
  top: 0,
  fontWeight: 800,
};

const footer: React.CSSProperties = {
  marginTop: 40,
  padding: 20,
  textAlign: "center",
  fontSize: 12,
  color: "#666",
};