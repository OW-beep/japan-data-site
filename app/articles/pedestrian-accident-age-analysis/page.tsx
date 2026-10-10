import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE, national } from "@/lib/trafficAccident";

const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

/** 75歳以上の死亡率が、24歳以下の何倍か(タイトルに使う) */
function oldestRatio(): number {
  const o = national.pedestrianByAge?.["75"];
  const y = national.pedestrianByAge?.["01"];
  if (!o || !y || y.deaths === 0 || o.accidents === 0 || y.accidents === 0) return 0;
  return pct(o.deaths, o.accidents) / pct(y.deaths, y.accidents);
}

function makeTitle(): string {
  const r = oldestRatio();
  return r > 0
    ? `歩行者の事故、年齢で何が違う？75歳以上の歩行者の死亡率は、24歳以下の約${r.toFixed(0)}倍`
    : "歩行者の事故、年齢で何が違う？年齢層別の死亡率を調べた";
}

export function generateMetadata() {
  return {
    alternates: { canonical: "/articles/pedestrian-accident-age-analysis" },
    title: makeTitle(),
    description:
      "警察庁の交通事故データ(令和7年)で、歩行者が関わる事故を年齢層別に集計しました。事故に遭った歩行者の人数と、亡くなった歩行者の人数を年齢層ごとに比べ、死亡率の違いをデータで確かめます。",
  };
}

const AGES: { code: string; label: string }[] = [
  { code: "01", label: "24歳以下" },
  { code: "25", label: "25〜34歳" },
  { code: "35", label: "35〜44歳" },
  { code: "45", label: "45〜54歳" },
  { code: "55", label: "55〜64歳" },
  { code: "65", label: "65〜74歳" },
  { code: "75", label: "75歳以上" },
];

export default function Page() {
  const src = national.pedestrianByAge;
  if (!src) return null;

  const rows = AGES.map((a) => {
    const v = src[a.code] ?? { accidents: 0, deaths: 0 };
    return { ...a, accidents: v.accidents, deaths: v.deaths, rate: pct(v.deaths, v.accidents) };
  });
  const totalAcc = rows.reduce((s, r) => s + r.accidents, 0);
  const totalDeaths = rows.reduce((s, r) => s + r.deaths, 0);
  if (totalAcc === 0 || totalDeaths === 0) return null;

  const overallRate = pct(totalDeaths, totalAcc);
  const young = rows[0];
  const oldest = rows[rows.length - 1];
  const ratio = young.rate > 0 ? oldest.rate / young.rate : 0;

  const over65Deaths = rows.filter((r) => r.code === "65" || r.code === "75").reduce((s, r) => s + r.deaths, 0);
  const over65Acc = rows.filter((r) => r.code === "65" || r.code === "75").reduce((s, r) => s + r.accidents, 0);
  const over65DeathShare = pct(over65Deaths, totalDeaths);
  const over65AccShare = pct(over65Acc, totalAcc);
  const oldestAccShare = pct(oldest.accidents, totalAcc);
  const oldestDeathShare = pct(oldest.deaths, totalDeaths);

  const faq = [
    {
      q: "歩行者の事故で、最も亡くなる割合が高いのは、何歳の人ですか？",
      a: `${oldest.label}の歩行者で、事故に遭った人のうち約${oldest.rate.toFixed(1)}%が亡くなっています。最も低い${young.label}(約${young.rate.toFixed(1)}%)の約${ratio.toFixed(0)}倍です(${ACCIDENT_YEAR_LABEL}、人対車両の事故)。`,
    },
    {
      q: "歩行者の死者のうち、高齢者はどのくらいを占めますか？",
      a: `65歳以上の歩行者が、歩行者の死者の約${over65DeathShare.toFixed(1)}%を占めます。事故に遭った歩行者の人数で見ると、65歳以上は約${over65AccShare.toFixed(1)}%で、死者のほうが大きな割合になっています。`,
    },
    {
      q: "なぜ、高齢の歩行者は亡くなる割合が高いのですか？",
      a: "同じ事故でも、年齢が高いほど、体が受ける影響が大きく、命にかかわりやすいとされています。このデータだけでは、事故の速度や場所、歩行者の行動など、ほかの条件の違いまでは分かりません。",
    },
    {
      q: "「歩行者の事故」とは、どういう事故ですか？",
      a: "この記事では、歩行者と車両が当事者となった人身事故(事故類型が「人対車両」)を数えています。歩行者本人の年齢と、歩行者本人が亡くなったかどうかで、年齢層別に集計しました。",
    },
  ];

  return (
    <ArticleLayout
      title={makeTitle()}
      summary={`令和7年に事故に遭った歩行者のうち、75歳以上は約${oldestAccShare.toFixed(1)}%ですが、亡くなった歩行者では約${oldestDeathShare.toFixed(1)}%を占めます。年齢層別の死亡率は、24歳以下の${young.rate.toFixed(2)}%から、75歳以上の${oldest.rate.toFixed(2)}%まで、大きく違います。`}
      heroLabel="75歳以上の歩行者の死亡率(24歳以下の倍率)"
      heroValue={`${oldest.rate.toFixed(1)}%(約${ratio.toFixed(0)}倍)`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/pedestrian-accident-age-analysis"
      tags={["aging", "geography"]}
      publishedAt="2026-10-08"
      dataNote={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})を集計`}
      top3={[...rows]
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 3)
        .map((r, i) => ({ rank: i + 1, name: `${r.label}の歩行者`, value: `死亡率 ${r.rate.toFixed(2)}%` }))}
    >
      <div style={box}>
        <h2>結論:歩行者の死亡率は、年齢が高いほど大きく上がる</h2>

        <p>
          警察庁の事故データ({ACCIDENT_YEAR_LABEL}・本票)から、歩行者が関わる事故(人対車両)
          {totalAcc.toLocaleString()}件について、歩行者本人の年齢層ごとに、亡くなった割合を
          計算しました。全体では約{overallRate.toFixed(2)}%ですが、<strong>{oldest.label}は
          {oldest.rate.toFixed(2)}%、{young.label}は{young.rate.toFixed(2)}%</strong>で、
          約{ratio.toFixed(0)}倍の開きがあります。
        </p>

        <p>
          事故に遭った歩行者のうち{oldest.label}は約{oldestAccShare.toFixed(1)}%ですが、
          亡くなった歩行者では約<strong>{oldestDeathShare.toFixed(1)}%</strong>を占めます。
          65歳以上全体では、事故に遭った歩行者の約{over65AccShare.toFixed(1)}%に対して、
          死者の約{over65DeathShare.toFixed(1)}%です。
        </p>
      </div>

      <div style={box}>
        <h2>年齢層別:歩行者の事故件数と死亡率</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>歩行者の年齢</th>
              <th style={thNum}>事故に遭った人数</th>
              <th style={thNum}>死者</th>
              <th style={thNum}>死亡率</th>
              <th style={thNum}>死者に占める割合</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code}>
                <td style={td}>{r.label}</td>
                <td style={tdNum}>{r.accidents.toLocaleString()}</td>
                <td style={tdNum}>{r.deaths.toLocaleString()}</td>
                <td style={tdNum}>{r.rate.toFixed(2)}%</td>
                <td style={tdNum}>{pct(r.deaths, totalDeaths).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={note}>
          死亡率は、歩行者が関わる事故のうち、歩行者本人が亡くなった割合です(事故から24時間以内の
          死者)。年齢層は、警察庁のデータの区分に合わせています。
        </p>
      </div>

      <div style={box}>
        <h2>この数字から言えること、言えないこと</h2>

        <ul>
          <li>
            <strong>言えること。</strong>
            同じように事故に遭っても、高齢の歩行者のほうが、亡くなる割合が高いことです。
          </li>
          <li>
            <strong>言えないこと。</strong>
            高齢者の歩き方や注意力に問題がある、ということは、この数字からは分かりません。
            事故の速度、場所、時間帯、運転者側の状況などは、この集計に含まれていません。
          </li>
          <li>
            <strong>夜は、さらに危険が高まります。</strong>
            歩行者の事故は、昼より夜に、死亡事故になる割合が高いことが分かっています。
            詳しくは、
            <Link prefetch={false} href="/articles/dusk-accident-analysis" style={link}>
              薄暮・夜の事故の分析
            </Link>
            をご覧ください。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>家族や身近な人のためにできること</h2>

        <ul>
          <li>
            夕方から夜に出かけるときは、明るい色の服や、反射材を身につけると、運転者から
            見つけやすくなるとされています。
          </li>
          <li>
            運転する人は、夕暮れ時から早めにライトをつけ、歩行者の多い道では速度を落とすことが
            基本です。
          </li>
          <li>
            高齢の家族がいる場合は、よく通る道の、見通しの悪い交差点や、街灯の少ない場所を、
            一緒に確認しておくのも一つの方法です。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の、事故類型・当事者の
            種別と年齢・人身損傷程度(死亡/負傷)です。
          </li>
          <li>
            <strong>加工。</strong>
            事故類型が「人対車両」の事故で、当事者A・Bのうち種別が歩行者の人を特定し、
            その人の年齢層と、歩行者本人が死亡したかどうかで集計しました。
          </li>
          <li>
            <strong>限界。</strong>
            歩行者の人数(その年齢層の人口や、歩く機会の多さ)は含まれないため、
            「歩行者1人あたりの事故のしやすさ」ではありません。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：歩行者の事故についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          歩行者の死亡率は、{young.label}の{young.rate.toFixed(2)}%から{oldest.label}の
          {oldest.rate.toFixed(2)}%まで、年齢が高いほど上がります。{oldest.label}は、事故に遭った
          歩行者の約{oldestAccShare.toFixed(1)}%ですが、死者では約{oldestDeathShare.toFixed(1)}%を
          占めました。数字は、高齢の方を責めるものではなく、運転する人も歩く人も、地域全体で
          備えを考えるための材料です。
        </p>

        <p>
          <Link prefetch={false} href="/articles/dusk-accident-analysis" style={link}>
            薄暮・夜の事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/pedestrian-accident-municipal-analysis" style={link}>
            歩行者が関わる事故の割合が高い街
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/elderly-driver-accident-analysis" style={link}>
            高齢ドライバーの事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/aging" style={link}>
            高齢化率ランキング
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 14 };
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f1f5f9" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
const note: React.CSSProperties = { fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
