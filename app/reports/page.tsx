import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/reports" },
  title: "自治体財政健全度レポート(サンプル)｜全国自治体データランキング",
  description:
    "1自治体ごとの財政健全度をまとめたPDFレポートのサンプル版です。財政力指数・独自データ・類似自治体との比較・自動診断コメントを6ページに凝縮。北海道泊村のサンプルを無料で公開しています。",
};

export default function Page() {
  return (
    <main style={wrap}>
      <p style={eyebrow}>DATA REPORT SAMPLE</p>
      <h1 style={h1}>自治体財政健全度レポート</h1>

      <p style={lead}>
        1つの自治体の財政の状態を、財政力指数・独自データ・類似自治体との
        比較・自動診断コメントとともに6ページのPDFにまとめたレポートです。
        当サイトのランキング・記事データをもとに自動生成しています。
        現在はサンプル版のみの公開ですが、実際にどんな内容か、下記から
        無料でご覧いただけます。
      </p>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル①</div>
        <h2 style={sampleTitle}>北海道 泊村</h2>
        <p style={sampleDesc}>
          原子力発電所が立地し、財政力指数1.65(全国平均0.54の約3倍)と、
          小さな村ながら全国トップクラスの財政力を持つ自治体。なぜこの
          スコアになるのかを、レポートの実例として公開しています。
        </p>
        <a
          href="/reports/tomari-mura_fiscal-health-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料・6ページ)
        </a>
      </div>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル②</div>
        <h2 style={sampleTitle}>北海道 夕張市</h2>
        <p style={sampleDesc}>
          財政健全度スコアは全国1,576団体中1,575位。実質公債費比率が
          全国平均の約9倍にのぼり、自動診断でも「財政再建が必要な水準」
          と判定される、対照的な事例です。健全な自治体だけでなく、
          厳しい状況にある自治体も同じフォーマットで機械的に診断
          できることを示すサンプルです。
        </p>
        <a
          href="/reports/yubari-shi_fiscal-health-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料・6ページ)
        </a>
      </div>

      <h2 style={h2}>何がわかるレポートか</h2>
      <ul style={ul}>
        <li style={li}>
          財政力指数・経常収支比率・自主財源比率・実質公債費比率・民生費比率をZスコアで統合した「財政健全度スコア」と、全国・都道府県内での順位
        </li>
        <li style={li}>
          5つの財政指標を、全国平均・都道府県平均と並べたグラフでの比較
        </li>
        <li style={li}>
          ふるさと納税受入額、昼夜間人口比率、リサイクル率など、都市データパックのような大手資料には載らない独自データ
        </li>
        <li style={li}>
          人口規模が近い全国10自治体との、財政力指数・高齢化率の比較
        </li>
        <li style={li}>
          「なぜこのスコアになるのか」をルールベースで自動診断したコメント(原発・ダム立地、財政再建リスク、ベッドタウン傾向など)
        </li>
      </ul>

      <h2 style={h2}>どんな人が使うことを想定しているか</h2>
      <ul style={ul}>
        <li style={li}>
          <strong>地域おこし協力隊・自治体職員</strong> ── 着任先や比較対象の自治体を、財政面から素早く把握したいとき
        </li>
        <li style={li}>
          <strong>地方紙・地域メディアの記者</strong> ── 記事の裏付けデータや、取材前の下調べとして
        </li>
        <li style={li}>
          <strong>大学の地域研究ゼミ・学生</strong> ── レポートや卒論の一次データ・比較材料として
        </li>
        <li style={li}>
          <strong>移住・進出を検討している個人・企業</strong> ── 候補自治体の財政的な健全性を確認したいとき
        </li>
      </ul>

      <h2 style={h2}>お金を払う価値があるか、正直なところ</h2>
      <p style={p}>
        本サイトの全データ・全記事は無料で公開しており、このレポートで
        使っている情報自体は、各ランキングページ・記事を見比べれば同じ
        内容を無料で確認できます。レポートの価値は、データそのものでは
        なく「複数のページを回遊して自分で比較する手間を、1つのPDFに
        まとめてある」という点にあります。議会や取材先に一枚渡せる形に
        なっている、というのが有料級の使いどころだと考えています。
      </p>

      <h2 style={h2}>価格の目安</h2>
      <p style={p}>
        現時点では決済機能を用意しておらず、サンプル版の無料公開のみ
        行っています。将来的に有料化する場合の想定価格は以下のとおりです。
      </p>

      <div style={priceTable}>
        {[
          ["単体レポート(自治体1つ)", "1,980円"],
          ["比較レポート(自分の市+類似3市)", "3,980円"],
          ["都道府県セット(県内全市区町村)", "9,800円"],
          ["法人サブスク(全国データ・月次更新)", "29,800円 / 月"],
        ].map(([label, price], i, arr) => (
          <div
            key={label}
            style={{
              ...priceRow,
              borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--line)",
            }}
          >
            <span>{label}</span>
            <strong>{price}</strong>
          </div>
        ))}
      </div>

      <h2 style={h2}>他の自治体のレポートが欲しい場合</h2>
      <p style={p}>
        現在、他の自治体のレポートは自動配信の仕組みを用意していない
        ため、個別対応になります。ご希望の自治体名を添えて、
        <Link prefetch={false} href="/contact" style={link}>
          お問い合わせページ
        </Link>
        からご連絡ください。
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: 20,
};

const eyebrow: React.CSSProperties = {
  color: "var(--indigo)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  marginBottom: 4,
};

const h1: React.CSSProperties = {
  marginTop: 4,
};

const h2: React.CSSProperties = {
  marginTop: 36,
};

const lead: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 16,
  lineHeight: 1.9,
};

const p: React.CSSProperties = {
  lineHeight: 1.9,
};

const ul: React.CSSProperties = {
  lineHeight: 1.9,
  paddingLeft: 20,
};

const li: React.CSSProperties = {
  marginBottom: 8,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
};

const sampleBox: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  padding: "24px 28px",
  margin: "28px 0",
};

const sampleLabel: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--indigo)",
  border: "1px solid var(--indigo)",
  borderRadius: 4,
  padding: "2px 8px",
  marginBottom: 10,
};

const sampleTitle: React.CSSProperties = {
  margin: "0 0 8px",
};

const sampleDesc: React.CSSProperties = {
  color: "var(--muted)",
  lineHeight: 1.8,
  marginBottom: 18,
};

const downloadButton: React.CSSProperties = {
  display: "inline-block",
  background: "var(--indigo)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: "12px 20px",
  borderRadius: 8,
  textDecoration: "none",
};

const priceTable: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  overflow: "hidden",
};

const priceRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid var(--line)",
};
