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
  alternates: { canonical: "/ranking/aging-gap" },
  title: "少子高齢化ギャップランキング｜高齢化率と子ども人口割合の差が大きい自治体",
  description:
    "高齢化率から子ども人口割合(0〜14歳)を引いた「少子高齢化ギャップ」を全国の自治体で比較。差が大きい自治体と、子どもの割合が高齢者の割合を上回る自治体がわかります。",
};

export default function AgingGapRankingPage() {
  const all = getMunicipalities()
    .filter(
      (c) =>
        c.population > 0 && c.elderlyPopulation != null && c.childPopulation != null
    )
    .map((c) => {
      const aging = (c.elderlyPopulation / c.population) * 100;
      const child = (c.childPopulation / c.population) * 100;
      return {
        code: c.code,
        name: c.name,
        population: c.population,
        aging,
        child,
        gap: aging - child,
      };
    })
    .sort((a, b) => b.gap - a.gap);

  if (all.length < 20) return null;

  const top = all.slice(0, 100);
  const reversed = all.filter((c) => c.gap < 0).reverse(); // 子どもが多い順
  const average = all.reduce((s, c) => s + c.gap, 0) / all.length;
  const median = all[Math.floor(all.length / 2)].gap;
  const first = all[0];
  const mostChild = reversed[0] ?? all[all.length - 1];

  const faq = [
    {
      q: "少子高齢化ギャップとは何ですか？",
      a: "高齢化率(65歳以上の割合)から、子ども人口割合(0〜14歳の割合)を引いた値です。数字が大きいほど、高齢者の割合が子どもの割合を大きく上回っています。",
    },
    {
      q: "ギャップが最も大きい自治体はどこですか？",
      a: `${first.name}で、${first.gap.toFixed(1)}ポイントです(高齢化率${first.aging.toFixed(1)}%、子ども人口割合${first.child.toFixed(1)}%)。全国の中央値は${median.toFixed(1)}ポイントです。`,
    },
    {
      q: "子どもの割合が高齢者の割合を上回る自治体はありますか？",
      a:
        reversed.length > 0
          ? `あります。このデータでは${reversed.length}自治体で、ギャップがマイナスになっています。最も子どもの割合が高いのは${mostChild.name}(ギャップ${mostChild.gap.toFixed(1)}ポイント)です。`
          : "このデータでは、子どもの割合が高齢者の割合を上回る自治体はありません。",
    },
    {
      q: "高齢化率ランキングとの違いは何ですか？",
      a: "高齢化率ランキングは高齢者の割合だけを見ます。ギャップは子どもの割合も加味するため、高齢化率が同程度でも、子どもが少ない自治体ほど順位が上がります。",
    },
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        ⚖️ 少子高齢化ギャップランキング
      </h1>

      <DataAsOf />

      <Link prefetch={false} href="/articles/aging-gap" style={linkBtn}>
        📖 分析記事「少子高齢化ギャップ分析」もあわせて読む →
      </Link>

      <MetricBox
        title="指標定義"
        unit="ポイント"
        definition="高齢化率(65歳以上人口÷総人口)から、子ども人口割合(0〜14歳人口÷総人口)を引いた値です。令和2年国勢調査に基づきます。"
        formula="高齢化率(%) − 子ども人口割合(%)"
        example={{ name: first.name, value: `${first.gap.toFixed(1)}ポイント` }}
        source={dataSources["aging-gap"]}
      />

      <section style={summary}>
        <h2 style={{ marginTop: 0, fontSize: 22 }}>ランキングから見える傾向</h2>
        <p style={{ lineHeight: 1.9 }}>
          対象は{all.length.toLocaleString()}自治体で、ギャップの平均は
          {average.toFixed(1)}ポイント、中央値は{median.toFixed(1)}ポイントです。
          最大は<strong>{first.name}</strong>({first.gap.toFixed(1)}ポイント)で、
          高齢化率は{first.aging.toFixed(1)}%、子ども人口割合は
          {first.child.toFixed(1)}%でした。
        </p>
        <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
          子どもの割合が高齢者の割合を上回る(ギャップがマイナス)自治体は
          {reversed.length}あります。高齢化率だけの順位は
          <Link prefetch={false} href="/ranking/aging" style={link}>
            高齢化率ランキング
          </Link>
          、子どもの割合は
          <Link prefetch={false} href="/ranking/child" style={link}>
            子ども人口割合ランキング
          </Link>
          で確認できます。
        </p>
      </section>

      <AdSense />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        ギャップが大きい自治体 上位100
      </h2>
      <GapTable rows={top} />

      {reversed.length > 0 && (
        <>
          <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
            子どもの割合が高齢者の割合を上回る自治体({reversed.length})
          </h2>
          <GapTable rows={reversed} startRank={all.length} descending />
        </>
      )}

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：少子高齢化ギャップについてよくある質問</h2>
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
  aging: number;
  child: number;
  gap: number;
};

function GapTable({
  rows,
  startRank = 1,
  descending,
}: {
  rows: Row[];
  startRank?: number;
  descending?: boolean;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>順位</th>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thNum}>ギャップ(pt)</th>
            <th style={thNum}>高齢化率</th>
            <th style={thNum}>子ども割合</th>
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
              <td style={tdNum}>{c.gap.toFixed(1)}</td>
              <td style={tdNum}>{c.aging.toFixed(1)}%</td>
              <td style={tdNum}>{c.child.toFixed(1)}%</td>
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
  minWidth: 620,
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
