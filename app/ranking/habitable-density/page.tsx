import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HabitableDensitySummary from "../../../components/ranking/HabitableDensitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/habitable-density" },
  title: "全国自治体 可住地人口密度ランキング",
  description:
    "山地・湖沼などを除いた「住める土地(可住地)」あたりの人口密度で全国自治体をランキング。単純な人口密度では目立たない、山と海に挟まれた自治体の本当の混雑度が分かります。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.habitableArea != null &&
        c.habitableArea > 0 &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      habitableDensity: c.population / ((c.habitableArea ?? 1) / 100),
    }))
    .sort((a, b) => b.habitableDensity - a.habitableDensity)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.habitableDensity, 0) /
    ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏔️ 可住地人口密度ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/habitable-density"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#ecfeff",
          color: "#0e7490",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 可住地人口密度ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="総面積ではなく、山地・湖沼などを除いた可住地面積あたりの人口密度"
        formula="可住地人口密度 = 人口 ÷ 可住地面積(km²換算)"
        example={{
          name: `例：${ranking[0].name}`,
          value: Math.round(ranking[0].habitableDensity),
        }}
      source={dataSources["habitable-density"]}
      />

      <HabitableDensitySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          habitableDensity: c.habitableDensity,
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
            value={Math.round(c.habitableDensity).toLocaleString()}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}
