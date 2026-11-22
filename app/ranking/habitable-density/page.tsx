import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HabitableDensitySummary from "../../../components/ranking/HabitableDensitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/habitable-density" },
  title: "全国自治体 可住地人口密度ランキング",
  description:
    "山地・湖沼などを除いた「住める土地(可住地)」あたりの人口密度で全国自治体をランキング。単純な人口密度では目立たない、山と海に挟まれた自治体の本当の混雑度が分かります。",
};

export function generateMetadata() {
  return withTop1("habitable-density", baseMetadata);
}

export default function Page() {
  const ranking = getMunicipalities2025()
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

      <DataAsOf text="人口:令和7年国勢調査(確定値)、可住地面積:SSDSE-A-2026年版" />

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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          山林や湖沼を除いた「可住地」だけに絞った人口密度では、豊島区(23,483人/km²)、中野区(22,762人/km²)、台東区(22,556人/km²)と東京の区が上位を占め、中央値は441人/km²です。面積の広い山がちな自治体でも、実際に人が暮らす範囲の密度が見えるのがこの指標の特徴です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          最も低い幌加内町は8人/km²、檜枝岐村は9人/km²で、上位とは3,000倍近い開きがあります。密度の低さは、除雪や移動の負担と表裏一体である一方、土地の広さや自然の近さという魅力でもあります。通常の<a href="/ranking/density" style={{ color: "#2563eb" }}>人口密度</a>と見比べると、数字の違いの理由が見えてきます。
        </p>
      </RankingEditorial>

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

      <RankingCommentary slug="habitable-density" />

    </div>
  );
}
