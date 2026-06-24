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
          fontFamily:
            "system-ui, sans-serif",
          background:
            "linear-gradient(180deg,#eef2ff,#ffffff)",
          color: "#111",
        }}
      >
        <header style={header}>
          🇯🇵 日本自治体データランキング
        </header>

        <main style={{ maxWidth: 1000, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

const header = {
  padding: 16,
  background: "white",
  fontWeight: 800,
  borderBottom: "1px solid #eee",
  position: "sticky",
  top: 0,
};