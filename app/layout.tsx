import "./globals.css";
import type { Metadata } from "next";

import Script from "next/script";
import { Noto_Sans_JP, Work_Sans } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { SITE_URL, SITE_NAME, ADSENSE_CLIENT_ID } from "@/lib/site";

/*
 * 参考サイト(honeycomb-labo.com)が使っている
 * Noto Sans JP(和文)+ Work Sans(数字・欧文)の組み合わせ。
 * next/font/google はビルド時にフォントを取得して自己ホストするため、
 * 実行時にGoogle Fontsへ追加リクエストは発生しない。
 */
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "全国1741自治体の人口・出生率・高齢化率・財政力指数・教育・税収などをランキング形式で比較できるデータサイト。",

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
      "人口・出生率・高齢化率・財政力指数など全国1741自治体を比較",

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
    <html lang="ja" className={`${notoSansJP.variable} ${workSans.variable}`}>
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

      <body>
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
        <CookieConsent />
      </body>
    </html>
  );
}