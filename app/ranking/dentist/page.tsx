import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import DentistSummary from "../../../components/ranking/DentistSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 歯科医師数ランキング｜人口10万人あたりで比較",
  description:
    "人口10万人あたりの歯科医師数をランキング形式で比較。医師数ランキングと同様、都市部や大学病院を抱える自治体が上位に入る一方、歯科医師が1人もいない自治体もあります。",
};

export default function DentistRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.dentistsCount != null && c.population >= 3000
  );

  const zeroCount = base.filter((c) => c.dentistsCount === 0).length;

  const ranking = base
    .filter((c) => (c.dentistsCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      dentistsPer100k: ((c.dentistsCount ?? 0) / c.population) * 100000,
    }))
    .sort((a, b) => b.dentistsPer100k - a.dentistsPer100k)
    .slice(0, 100);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        🦷 歯科医師数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/doctors-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eff6ff",
          color: "#1d4ed8",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 医師数ランキング分析記事もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口10万人あたりの歯科医師数です。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="歯科医師数 ÷ 人口 × 100,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.dentistsPer100k?.toFixed(1) ?? "0.0"}`,
        }}
      />

      <DentistSummary
        zeroCount={zeroCount}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.dentistsPer100k,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.dentistsPer100k.toFixed(1)}
            unit="人"
          />
        ))}
      </div>
    </main>
  );
}
