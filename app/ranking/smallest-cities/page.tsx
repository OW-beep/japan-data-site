import type { Metadata } from "next";
import Link from "next/link";

import AdSense from "@/components/AdSense";
import DataAsOf from "@/components/DataAsOf";
import CompareCTA from "@/components/CompareCTA";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterLinks from "@/components/ClusterLinks";
import { getMunicipalitiesPop, isShi, shortName, changePct } from "@/lib/cityPopulation";

const LIMIT = 50;

function getRows() {
  const { rows, label, use2025 } = getMunicipalitiesPop();
  const shi = rows.filter((c) => isShi(c.name));
  const sorted = [...shi].sort((a, b) => a.population - b.population);
  return { shi, sorted, label, use2025 };
}

export function generateMetadata(): Metadata {
  const { sorted, use2025 } = getRows();
  const first = sorted[0];
  return {
    alternates: { canonical: "/ranking/smallest-cities" },
    title: `人口が少ない市ランキング${use2025 ? "(2025年国勢調査)" : ""}｜日本一人口が少ない市は${shortName(first.name)}`,
    description: `全国の「市」を人口が少ない順にランキング。最も人口が少ない市は${first.name}(${first.population.toLocaleString()}人)。市の要件は人口5万人以上ですが、実際には5万人未満の市も多数あります。町村を含む全自治体の順位は人口が少ない自治体ランキングへ。`,
  };
}

export default function SmallestCitiesPage() {
  const { shi, sorted, label, use2025 } = getRows();
  const top = sorted.slice(0, LIMIT);
  const under50k = shi.filter((c) => c.population < 50_000).length;
  const under10k = shi.filter((c) => c.population < 10_000).length;
  const first = sorted[0];

  const faq = [
    {
      q: "日本で一番人口が少ない市はどこですか？",
      a: `${label}では${first.name}で、人口は${first.population.toLocaleString()}人です。2020年の${first.pop2020.toLocaleString()}人から${changePct(first).toFixed(1)}%の変化でした。`,
    },
    {
      q: "市になるには人口が何人必要ですか？",
      a: `地方自治法では、市になる要件の1つが「人口5万人以上」です。ただし合併特例などで要件を緩和した例があり、人口5万人未満の市も全国に${under50k}市あります(全${shi.length}市のうち)。`,
    },
    {
      q: "人口1万人未満の市はありますか？",
      a: under10k > 0 ? `あります。${label}で人口1万人未満の市は${under10k}市です。` : `${label}では、人口1万人未満の市はありません。`,
    },
  ];

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumbs items={[{ name: "ランキング", href: "/ranking" }, { name: "人口が少ない市" }]} />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>🏘️ 人口が少ない市ランキング</h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        全国{shi.length}市を人口が少ない順に並べました(下位{LIMIT}市)。最も人口が少ない市は
        <strong>{first.name}({first.population.toLocaleString()}人)</strong>です。全{shi.length}市のうち
        人口5万人未満は{under50k}市で、「市=人口5万人以上」という通説とは異なる実態が見えてきます。
        町村も含めた順位は
        <Link prefetch={false} href="/ranking/decrease" style={a}>人口が少ない自治体ランキング</Link>、
        大きい側の一覧は
        <Link prefetch={false} href="/ranking/mid-cities" style={a}>人口30万人以上の都市ランキング</Link>
        をご覧ください。
      </p>

      <AdSense />

      <div style={{ overflowX: "auto", marginTop: 20 }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={{ ...th, textAlign: "left" }}>市</th>
              <th style={thNum}>人口(人)</th>
              <th style={thNum}>2020年比</th>
              <th style={thNum}>面積(km²)</th>
              <th style={thNum}>人口密度(人/km²)</th>
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => (
              <tr key={c.code}>
                <td style={td}>{i + 1}</td>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                  <Link prefetch={false} href={`/city/${c.code}`} style={{ color: "#1d4ed8" }}>
                    {c.name}
                  </Link>
                </td>
                <td style={tdNum}>{c.population.toLocaleString()}</td>
                <td style={tdNum}>
                  {changePct(c) > 0 ? "+" : ""}
                  {changePct(c).toFixed(1)}%
                </td>
                <td style={tdNum}>{c.area != null ? c.area.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "―"}</td>
                <td style={tdNum}>
                  {c.area != null && c.area > 0 ? Math.round(c.population / c.area).toLocaleString() : "―"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
        {use2025 ? "人口密度は令和7年の人口を面積で割った値です。" : "人口密度は令和2年の人口を面積で割った値です。"}
        東京都特別区は「市」ではないため対象外です。
      </p>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：人口が少ない市</h2>
        {faq.map((f) => (
          <p key={f.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <ClusterLinks current="/ranking/smallest-cities" />
      <CompareCTA />
    </main>
  );
}

const a: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
