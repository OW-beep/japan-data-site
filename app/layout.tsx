import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "日本自治体データベース",
    template: "%s | 日本自治体データベース",
  },
  description:
    "全国の市区町村の人口・統計データを可視化。ランキング・検索・比較ができます。",
  keywords: [
    "日本",
    "自治体",
    "人口",
    "市区町村",
    "ランキング",
    "データ",
  ],
  openGraph: {
    title: "日本自治体データベース",
    description: "全国自治体の人口・統計を見える化",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}