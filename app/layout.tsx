import "./globals.css";

export const metadata = {
  title: "日本自治体データ",
  description: "全国自治体の人口・ランキングを可視化",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: "#0b0f19", color: "white" }}>
        {children}
      </body>
    </html>
  );
}