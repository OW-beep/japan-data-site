import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "全国自治体データランキングの目的、データの出典、更新頻度、運営者情報について説明しています。",
};

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={h1}>このサイトについて</h1>

      <p style={p}>
        「全国自治体データランキング」は、全国1,700以上の市区町村の人口・出生率・高齢化率・
        人口密度・面積・財政力指数などを、誰でも分かりやすく比較・閲覧できることを目的に運営しているサイトです。
      </p>

      <h2 style={h2}>データの出典</h2>
      <p style={p}>
        掲載しているデータは、総務省統計局が提供する政府統計の総合窓口「e-Stat」など、
        公的機関が公表するオープンデータを出典としています。各ページの下部に、利用したデータの出典を明記しています。
      </p>

      <h2 style={h2}>データの加工・可視化について</h2>
      <p style={p}>
        公開されている統計データをそのまま転載するのではなく、当サイトが指標の計算・自治体間の比較・
        ランキング化・解説文の作成を行っています。データの見方や背景については、各ランキングページの解説、
        および「データ分析記事」で補足しています。
      </p>

      <h2 style={h2}>更新頻度</h2>
      <p style={p}>
        統計データは、公的機関による公表タイミングに合わせて定期的に更新しています。
        ただし、統計の性質上、実際の最新の自治体情報と時差が生じる場合があります。
      </p>

      <h2 style={h2}>運営者情報</h2>
      <p style={p}>
        当サイトは個人が運営しています。お問い合わせは
        <a href="/contact" style={link}>
          お問い合わせページ
        </a>
        よりお願いいたします。
      </p>

      <h2 style={h2}>関連ページ</h2>
      <p style={p}>
        データの利用条件については
        <a href="/terms" style={link}>
          利用規約
        </a>
        を、個人情報の取り扱いについては
        <a href="/privacy" style={link}>
          プライバシーポリシー
        </a>
        をご確認ください。
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: "28px 24px",
  lineHeight: 1.9,
};

const h1: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 24,
};

const h2: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginTop: 32,
  marginBottom: 8,
};

const p: React.CSSProperties = {
  color: "#374151",
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
