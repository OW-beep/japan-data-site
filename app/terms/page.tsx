import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "全国自治体データランキングの利用規約です。ご利用の前に必ずお読みください。",
};

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={h1}>利用規約</h1>

      <p style={p}>
        この利用規約(以下「本規約」)は、「全国自治体データランキング」(以下「当サイト」)の
        利用条件を定めるものです。利用者の皆さまには、本規約に従って当サイトをご利用いただきます。
      </p>

      <h2 style={h2}>第1条(適用)</h2>
      <p style={p}>
        本規約は、利用者と当サイト運営者との間の、当サイトの利用に関わる一切の関係に適用されます。
      </p>

      <h2 style={h2}>第2条(掲載データの取り扱い)</h2>
      <p style={p}>
        当サイトが掲載するランキング・統計・グラフ等は、総務省統計局(e-Stat)などが公表する
        政府統計データを基に、当サイトが加工・集計・可視化したものです。データの正確性・完全性・
        最新性について万全を期していますが、これを保証するものではありません。
      </p>

      <h2 style={h2}>第3条(禁止事項)</h2>
      <p style={p}>
        利用者は、当サイトの利用にあたり、以下の行為をしてはなりません。
      </p>
      <ul style={ul}>
        <li>法令または公序良俗に違反する行為</li>
        <li>
          当サイトのコンテンツを、出典を明記せず自己の作成物として転載・再配布する行為
        </li>
        <li>当サイトのサーバーやネットワークの機能を破壊・妨害する行為</li>
        <li>当サイトの運営を妨害するおそれのある行為</li>
      </ul>

      <h2 style={h2}>第4条(著作権)</h2>
      <p style={p}>
        当サイトが独自に作成した文章・解説・デザイン・グラフ等の著作権は、当サイト運営者に帰属します。
        原データである政府統計データそのものの著作権については、各データ提供元の定めによります。
      </p>

      <h2 style={h2}>第5条(免責事項)</h2>
      <p style={p}>
        当サイトの情報を利用したことにより利用者に生じた損害について、当サイト運営者は
        一切の責任を負いません。重要な判断は、必ず一次情報(各省庁・自治体の公式発表)を
        ご確認のうえ、利用者ご自身の責任で行ってください。
      </p>

      <h2 style={h2}>第6条(本規約の変更)</h2>
      <p style={p}>
        当サイト運営者は、必要と判断した場合には、利用者への予告なく本規約を変更できるものとします。
      </p>

      <h2 style={h2}>第7条(お問い合わせ)</h2>
      <p style={p}>
        本規約に関するお問い合わせは、
        <a href="/contact" style={link}>
          お問い合わせページ
        </a>
        よりご連絡ください。
      </p>

      <p style={{ ...p, color: "#9ca3af", fontSize: 13 }}>
        最終更新日：2026年7月
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

const ul: React.CSSProperties = {
  color: "#374151",
  lineHeight: 1.9,
  paddingLeft: 20,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
