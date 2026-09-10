import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main style={wrap}>
      <p style={code}>404</p>

      <h1 style={h1}>お探しのページが見つかりませんでした</h1>

      <p style={p}>
        URLが変更・削除されたか、入力に誤りがある可能性があります。
        以下のページから、お探しの情報をご確認ください。
      </p>

      <div style={grid}>
        <Link href="/" style={card}>
          <div style={emoji}>🏠</div>
          <div style={cardTitle}>トップページ</div>
          <div style={cardDesc}>サイト全体のランキング一覧</div>
        </Link>

        <Link href="/ranking/population" style={card}>
          <div style={emoji}>📊</div>
          <div style={cardTitle}>人口ランキング</div>
          <div style={cardDesc}>全国自治体を人口順に比較</div>
        </Link>

        <Link href="/search" style={card}>
          <div style={emoji}>🔍</div>
          <div style={cardTitle}>市区町村検索</div>
          <div style={cardDesc}>自治体名からページを探す</div>
        </Link>

        <Link href="/articles" style={card}>
          <div style={emoji}>📖</div>
          <div style={cardTitle}>データ分析記事</div>
          <div style={cardDesc}>統計データの読み解き方を紹介</div>
        </Link>
      </div>

      <p style={{ ...p, marginTop: 32 }}>
        ページが存在するはずなのに表示されない場合は、
        <Link href="/contact" style={link}>
          お問い合わせページ
        </Link>
        よりご連絡いただけると助かります。
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "60px 24px",
  textAlign: "center",
};

const code: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 800,
  color: "#d1d5db",
  margin: 0,
  lineHeight: 1,
};

const h1: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  marginTop: 12,
  marginBottom: 16,
};

const p: React.CSSProperties = {
  color: "#4b5563",
  lineHeight: 1.9,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 16,
  marginTop: 32,
  textAlign: "left",
};

const card: React.CSSProperties = {
  display: "block",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 20,
  textDecoration: "none",
  color: "inherit",
};

const emoji: React.CSSProperties = {
  fontSize: 24,
  marginBottom: 8,
};

const cardTitle: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: 4,
};

const cardDesc: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
