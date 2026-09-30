import type { Metadata } from "next";
import Link from "next/link";

import MetricBox from "../../../components/MetricBox";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import JsonLd from "../../../components/JsonLd";
import CompareCTA from "../../../components/CompareCTA";
import { dataSources } from "../../../lib/dataSources";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/churn" },
  title: "人口の入れ替わり率ランキング｜住民が毎年入れ替わる自治体は？(転入+転出)",
  description:
    "転入者数と転出者数の合計を人口で割った「人口の入れ替わり率」を全国の自治体で比較。人口の増減だけでは見えない、住民の流動性が高い自治体・低い自治体がわかります。",
};

const MIN_POPULATION = 1000;

export default function ChurnRankingPage() {
  const base = getMunicipalities().filter(
    (c) =>
      c.inMigrants != null &&
      c.outMigrants != null &&
      c.population >= MIN_POPULATION
  );

  const all = base
    .map((c) => ({
      code: c.code,
      name: c.name,
      population: c.population,
      churn: ((c.inMigrants! + c.outMigrants!) / c.population) * 100,
      net: ((c.inMigrants! - c.outMigrants!) / c.population) * 100,
    }))
    .sort((a, b) => b.churn - a.churn);

  if (all.length < 20) return null;

  const top = all.slice(0, 100);
  const bottom = all.slice(-20).reverse();
  const average = all.reduce((s, c) => s + c.churn, 0) / all.length;
  const median = all[Math.floor(all.length / 2)].churn;

  // 入れ替わりが激しいのに転入超過率がほぼゼロ(±0.5%)の自治体=「人は動くが人口は変わらない」型
  const balancedTop = top.filter((c) => Math.abs(c.net) <= 0.5).length;

  const first = all[0];
  const last = all[all.length - 1];

  const faq = [
    {
      q: "人口の入れ替わり率とは何ですか？",
      a: "1年間の転入者数と転出者数を足し、人口で割った割合です。住民のうち何%が新しい顔ぶれに変わったかの目安になります。",
    },
    {
      q: "入れ替わり率が最も高い自治体はどこですか？",
      a: `人口${MIN_POPULATION.toLocaleString()}人以上の自治体では${first.name}で、${first.churn.toFixed(1)}%です(全国の中央値は${median.toFixed(1)}%)。ただし転入超過率は${first.net >= 0 ? "+" : ""}${first.net.toFixed(1)}%で、入れ替わりが激しいことと人口が増えていることは別です。`,
    },
    {
      q: "入れ替わり率が最も低い自治体はどこですか？",
      a: `${last.name}で、${last.churn.toFixed(1)}%です。転入も転出も少なく、同じ住民が暮らし続けている自治体といえます。`,
    },
    {
      q: "転入超過率(社会増減率)とはどう違いますか？",
      a: "転入超過率は「転入−転出」で、人口が増えているか減っているかを示します。入れ替わり率は「転入+転出」で、人の動きの大きさを示します。転入超過率がゼロでも、入れ替わり率が高ければ、住む人が毎年大きく入れ替わっている自治体です。",
    },
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🔄 人口の入れ替わり率ランキング
      </h1>

      <DataAsOf />

      <Link
        prefetch={false}
        href="/articles/population-churn-analysis"
        style={linkBtn}
      >
        📖 分析記事「人口の入れ替わり率」もあわせて読む →
      </Link>

      <MetricBox
        title="指標定義"
        unit="%"
        definition={`1年間の転入者数と転出者数の合計が、人口に占める割合です。人口の増減(転入超過率)とは別に、住民の流動性の大きさを見る指標です。人口${MIN_POPULATION.toLocaleString()}人未満の自治体は、母数が小さく数値が不安定になるため対象外としています(分析記事では全自治体を対象にしているため、上位の顔ぶれが一部異なります)。`}
        formula="(転入者数 + 転出者数) ÷ 人口 × 100"
        example={{ name: first.name, value: `${first.churn.toFixed(1)}%` }}
        source={dataSources["churn"]}
      />

      <section style={summary}>
        <h2 style={{ marginTop: 0, fontSize: 22 }}>
          ランキングから見える傾向
        </h2>
        <p style={{ lineHeight: 1.9 }}>
          対象は{all.length.toLocaleString()}自治体で、入れ替わり率の平均は
          {average.toFixed(1)}%、中央値は{median.toFixed(1)}%です。最も高いのは
          <strong>{first.name}</strong>({first.churn.toFixed(1)}%)、最も低いのは
          {last.name}({last.churn.toFixed(1)}%)でした。上位100自治体のうち
          {balancedTop}自治体は、転入超過率が±0.5%以内です。人の出入りは活発でも、
          人口はほとんど変わらない「流動型」の自治体が一定数あることが分かります。
        </p>
        <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
          人口の増減は
          <Link prefetch={false} href="/ranking/decline" style={link}>
            社会増減率ランキング
          </Link>
          、若い世代の動きは
          <Link prefetch={false} href="/ranking/young-adult-migration" style={link}>
            20代純移動率ランキング
          </Link>
          で確認できます。
        </p>
      </section>

      <AdSense />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        入れ替わり率が高い自治体 上位100
      </h2>
      <ChurnTable rows={top} startRank={1} />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        入れ替わり率が低い自治体 下位20
      </h2>
      <ChurnTable rows={bottom} startRank={all.length} descending />

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：人口の入れ替わり率についてよくある質問</h2>
        {faq.map((item) => (
          <p key={item.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </section>

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

      <CompareCTA />
    </main>
  );
}

type Row = {
  code: string;
  name: string;
  population: number;
  churn: number;
  net: number;
};

function ChurnTable({
  rows,
  startRank,
  descending,
}: {
  rows: Row[];
  startRank: number;
  descending?: boolean;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>順位</th>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thNum}>入れ替わり率</th>
            <th style={thNum}>転入超過率</th>
            <th style={thNum}>人口(人)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.code}>
              <td style={td}>{descending ? startRank - i : startRank + i}</td>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                <Link prefetch={false} href={`/city/${c.code}`} style={link}>
                  {c.name}
                </Link>
              </td>
              <td style={tdNum}>{c.churn.toFixed(1)}%</td>
              <td style={tdNum}>
                {c.net >= 0 ? "+" : ""}
                {c.net.toFixed(1)}%
              </td>
              <td style={tdNum}>{c.population.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 20,
  padding: "10px 16px",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 14,
  textDecoration: "none",
};
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const summary: React.CSSProperties = {
  marginTop: 35,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 30,
};
const table: React.CSSProperties = {
  width: "100%",
  minWidth: 560,
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #e5e7eb",
  fontSize: 14,
};
const th: React.CSSProperties = {
  padding: "10px 8px",
  background: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  textAlign: "center",
};
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
