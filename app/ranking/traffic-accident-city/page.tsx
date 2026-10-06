import type { Metadata } from "next";
import Link from "next/link";

import MetricBox from "../../../components/MetricBox";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import JsonLd from "../../../components/JsonLd";
import CompareCTA from "../../../components/CompareCTA";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import { dataSources } from "../../../lib/dataSources";
import { getMunicipalities } from "../../../lib/municipalities";
import { getPopulationBasis } from "../../../lib/population2025";
import {
  ACCIDENT_YEAR_LABEL,
  SOURCE_NOTE,
  getAccidentByCode,
  isAccidentJoinHealthy,
} from "../../../lib/trafficAccident";
import { withTop1 } from "@/lib/rankingMeta";

const MIN_POPULATION = 10_000;

const healthy = () =>
  isAccidentJoinHealthy(getMunicipalities().map((c) => c.code));

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/traffic-accident-city" },
  title:
    "市区町村別 交通事故(人身事故)ランキング｜人口1万人あたり件数【令和7年】",
  description:
    "警察庁の交通事故統計オープンデータ(令和7年)をもとに、全国の市区町村の人身事故件数を人口1万人あたりで比較。事故が多い自治体・少ない自治体と、死亡事故件数がわかります。",
  robots: healthy() ? undefined : { index: false, follow: true },
};

export function generateMetadata() {
  return withTop1("traffic-accident-city", baseMetadata);
}

export default function TrafficAccidentCityPage() {
  if (!healthy()) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28 }}>市区町村別 交通事故ランキング</h1>
        <p>データを準備中です。</p>
      </main>
    );
  }

  const cities = getMunicipalities();
  const basis = getPopulationBasis(cities.map((c) => c.code));

  const all = cities
    .map((c) => ({ ...c, pop: basis.population(c.code, c.population) }))
    .filter((c) => c.pop >= MIN_POPULATION)
    .map((c) => {
      const a = getAccidentByCode(c.code);
      return {
        code: c.code,
        name: c.name,
        population: c.pop,
        accidents: a.accidents,
        fatalAccidents: a.fatalAccidents,
        deaths: a.deaths,
        rate: (a.accidents / c.pop) * 10_000,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  if (all.length < 20) return null;

  const top = all.slice(0, 100);
  const bottom = all.slice(-20).reverse();
  const rates = all.map((r) => r.rate).sort((a, b) => a - b);
  const median = rates[Math.floor(rates.length / 2)];
  const first = all[0];
  const last = all[all.length - 1];
  const zero = all.filter((r) => r.accidents === 0).length;

  const faq = [
    {
      q: "人口あたりの交通事故(人身事故)が最も多い市区町村はどこですか？",
      a: `人口1万人以上の自治体では${first.name}で、人口1万人あたり${first.rate.toFixed(1)}件(人身事故${first.accidents.toLocaleString()}件)です。全国の中央値は${median.toFixed(1)}件です。`,
    },
    {
      q: "人口あたりの交通事故が最も少ない市区町村はどこですか？",
      a:
        zero > 0
          ? `人身事故が0件の自治体が${zero}あります。最も少ない自治体の1つは${last.name}です。`
          : `${last.name}で、人口1万人あたり${last.rate.toFixed(1)}件です。`,
    },
    {
      q: "人身事故とは何ですか？",
      a: "死者または負傷者が出た交通事故のことです。物だけが壊れた物損事故は含まれません。警察庁のオープンデータの本票は、人身事故1件を1行で記録したものです。",
    },
    {
      q: "人口あたりの事故が多い=その自治体の住民が危ない、ということですか？",
      a: "そうとは限りません。事故は、発生した場所の自治体で数えています。国道や高速道路が通る自治体では、住民以外の車による事故も含まれるため、人口の割に件数が多くなります。",
    },
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🚗 市区町村別 交通事故(人身事故)ランキング
      </h1>

      <DataAsOf text={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})、人口は${basis.label}`} />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        {ACCIDENT_YEAR_LABEL}に起きた人身事故の件数を、人口1万人あたりで比べたランキングです。
        都道府県単位の比較は
        <Link prefetch={false} href="/ranking/traffic-accident-rate" style={link}>
          都道府県別の交通事故ランキング
        </Link>
        をご覧ください。
      </p>

      <MetricBox
        title="指標定義"
        unit="件/人口1万人"
        definition={`令和7年の人身事故件数を、人口1万人あたりに直した値です。人口は${basis.label}で、人口${MIN_POPULATION.toLocaleString()}人未満の自治体は対象外です。事故は発生した場所の自治体で数えます。政令指定都市の区は市に合算しています。`}
        formula="人身事故件数 ÷ 人口 × 10,000"
        example={{ name: first.name, value: `${first.rate.toFixed(1)}件` }}
        source={{
          ...dataSources["traffic-accident-city"],
          dataYear: `事故件数は令和7年(2025年)、人口は${basis.label}`,
        }}
      />

      <section style={summary}>
        <h2 style={{ marginTop: 0, fontSize: 22 }}>ランキングから見える傾向</h2>
        <p style={{ lineHeight: 1.9 }}>
          対象は{all.length.toLocaleString()}自治体で、人口1万人あたりの人身事故件数の
          中央値は{median.toFixed(1)}件です。最も多いのは
          <strong>{first.name}</strong>({first.rate.toFixed(1)}件)でした。
          {zero > 0 ? `人身事故が0件だった自治体は${zero}あります。` : ""}
        </p>
        <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
          凍結・積雪路面の事故の割合は
          <Link prefetch={false} href="/ranking/icy-road-accident" style={link}>
            凍結・積雪路面の事故ランキング
          </Link>
          、記事は
          <Link prefetch={false} href="/articles/icy-road-accident-analysis" style={link}>
            雪道・凍結路の事故の分析
          </Link>
          でご覧いただけます。
        </p>
      </section>

      <AdSense />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        人口あたりの事故が多い自治体 上位100
      </h2>
      <AccidentTable rows={top} startRank={1} />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        人口あたりの事故が少ない自治体 下位20
      </h2>
      <AccidentTable rows={bottom} startRank={all.length} descending />

      <p style={note}>
        {SOURCE_NOTE}。{basis.yearNote}
      </p>

      <RankingCommentary slug="traffic-accident-city" />

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：交通事故ランキングについてよくある質問</h2>
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
  accidents: number;
  fatalAccidents: number;
  deaths: number;
  rate: number;
};

function AccidentTable({
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
            <th style={thNum}>1万人あたり(件)</th>
            <th style={thNum}>人身事故(件)</th>
            <th style={thNum}>うち死亡事故(件)</th>
            <th style={thNum}>死者数(人)</th>
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
              <td style={tdNum}>{c.rate.toFixed(1)}</td>
              <td style={tdNum}>{c.accidents.toLocaleString()}</td>
              <td style={tdNum}>{c.fatalAccidents.toLocaleString()}</td>
              <td style={tdNum}>{c.deaths.toLocaleString()}</td>
              <td style={tdNum}>{c.population.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const summary: React.CSSProperties = {
  marginTop: 35,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 30,
};
const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
  marginTop: 12,
};
const table: React.CSSProperties = {
  width: "100%",
  minWidth: 680,
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
