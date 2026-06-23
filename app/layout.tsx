import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div
          style={{
            fontFamily: "system-ui",
            background: "#f6f7fb",
            minHeight: "100vh",
            color: "#111",
          }}
        >
          <header
            style={{
              background: "white",
              padding: "16px 24px",
              borderBottom: "1px solid #eee",
              position: "sticky",
              top: 0,
            }}
          >
            <h1 style={{ fontSize: 18, margin: 0 }}>
              🇯🇵 日本データランキング
            </h1>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}