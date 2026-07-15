import "./globals.css";
import type { Metadata } from "next";

import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME, ADSENSE_CLIENT_ID } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
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
    title: SITE_NAME,

    description:
      "人口・出生率・高齢化率・財政力指数など全国1747自治体を比較",

    url: SITE_URL,

    siteName: SITE_NAME,

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
      <head>
        {/*
          AdSense読み込みスクリプト。
          審査通過前でもタグ自体は設置しておいて問題ありません
          (審査botが検出しやすくなります)。承認前は広告は表示されません。
        */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

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