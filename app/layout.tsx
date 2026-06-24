import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={body}>
        <Header />

        {/* 上部広告枠 */}
        <AdSense />

        <main style={main}>{children}</main>

        {/* 下部広告枠 */}
        <AdSense />

        <Footer />
      </body>
    </html>
  );
}

const body: React.CSSProperties = {
  margin: 0,
  fontFamily: "system-ui",
  background: "#f4f6fb",
  color: "#111",
};

const main: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: 20,
};