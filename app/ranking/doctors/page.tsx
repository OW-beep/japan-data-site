import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DoctorsSummary from "../../../components/ranking/DoctorsSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/doctors" },
  title: "全国自治体 医師数ランキング(人口10万人あたり)",
  description:
    "全国自治体の人口10万人あたり医師数をランキング形式で比較。医科大学の附属病院がある町が上位を独占する理由や、医師が1人もいない自治体の実態を解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) => c.doctorsCount != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      per10k: ((c.doctorsCount ?? 0) / c.population) * 100000,
    }))
    .sort((a, b) => b.per10k - a.per10k)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.per10k, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🩺 医師数ランキング(人口10万人あたり)
      </h1>

      <DataAsOf />

      <a
        href="/articles/doctors-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#f0fdf4",
          color: "#15803d",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 医師数ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口10万人あたりの医師数(医療施設調査ベース)"
        formula="医師数(人口10万人あたり) = 医師数 ÷ 人口 × 100,000"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].per10k.toFixed(0)),
        }}
      source={dataSources["doctors"]}
      />

      <DoctorsSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          per10k: c.per10k,
        }))}
        average={average}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.per10k.toFixed(0)}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}
