import "./globals.css";
import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://wakutan.com"),

  title: {
    default: "全国自治体データランキング",
    template: "%s | 全国自治体データランキング",
  },

  description:
    "全国1747自治体の人口・出生率・高齢化率・財政力指数・教育・税収などをランキング形式で比較できるデータサイト。",

  keywords: [
    "自治体",
    "人口ランキング",
    "出生率",
    "高齢化率",
    "人口密度",
    "財政力指数",
    "教育",
    "オープンデータ",
    "e-Stat",
  ],

  openGraph: {
    title: "全国自治体データランキング",

    description:
      "人口・出生率・高齢化率・財政力指数など全国1747自治体を比較",

    url: "https://wakutan.com",

    siteName: "全国自治体データランキング",

    locale: "ja_JP",

    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "KYZp6leIoJkmXQipodIUtUhXTopgEfgqFiQ7eJZuRZA",
  },
};

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
          background: "#f8fafc",
          color: "#111827",
          fontFamily:
            "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        }}
      >
        {/* スクリーンリーダー用 */}
        <a
          href="#main"
          style={{
            position: "absolute",
            left: -9999,
          }}
        >
          メインコンテンツへ移動
        </a>

        <Header />

        <main
          id="main"
          style={{
            minHeight: "80vh",
            width: "100%",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "24px 16px",
            }}
          >
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}