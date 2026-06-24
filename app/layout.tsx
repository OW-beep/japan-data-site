import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={body}>
        <Header />

        <main style={main}>{children}</main>

        <Footer />
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

const main: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
};