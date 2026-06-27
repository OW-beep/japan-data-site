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
    "全国1747自治体の人口・面積・人口密度・子ども人口・高齢化率などをランキング形式で掲載。",

  keywords: [
    "自治体",
    "人口ランキング",
    "人口密度",
    "面積ランキング",
    "高齢化率",
    "子ども人口",
    "オープンデータ",
  ],

  openGraph: {
    title: "全国自治体データランキング",

    description:
      "全国1747自治体の人口・面積・人口密度などを比較",

    url: "https://wakutan.com",

    siteName: "全国自治体データランキング",

    locale: "ja_JP",

    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Header />

        <main
          style={{
            minHeight: "80vh",
          }}
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}