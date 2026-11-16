import "./globals.css";
import type { Metadata } from "next";

import Script from "next/script";
import { Noto_Sans_JP, Work_Sans } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, ADSENSE_CLIENT_ID, CONTACT_EMAIL } from "@/lib/site";

/*
 * 参考サイト(honeycomb-labo.com)が使っている
 * Noto Sans JP(和文)+ Work Sans(数字・欧文)の組み合わせ。
 * next/font/google はビルド時にフォントを取得して自己ホストするため、
 * 実行時にGoogle Fontsへ追加リクエストは発生しない。
 */
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  // 太さは本文(400)と見出し(700)の2つだけ。以前は500も読み込んでいた(和文フォントは1太さごとのデータが大きい)。
  // 500を指定している箇所は、ブラウザが近い太さ(400)で表示する。
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    // 以前は「| 全国自治体データランキング」(13文字)を全ページに付けていたため、
    // 検索結果で日本語タイトルが途中で切れやすかった。短いブランド名にする。
    template: "%s｜自治体データ",
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

    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "全国自治体データランキング",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description:
      "人口・出生率・高齢化率・財政力指数など全国1741自治体を比較",

    images: ["/images/og-default.png"],
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
        {/* RSSフィードの自動検出。ページごとの metadata(canonical)に上書きされないよう、<head> に直接置く */}
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} 新着記事`} href="/feed.xml" />
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
        {/* サイト全体の構造化データ(WebSite + Organization)。運営主体を検索エンジンに明示する */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: "ja",
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              email: CONTACT_EMAIL,
            },
          }}
        />
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