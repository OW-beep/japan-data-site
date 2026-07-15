import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";

import AreaSummary from "../../../components/ranking/AreaSummary";
import AdSense from "../../../components/AdSense";

import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 面積ランキング",
  description:
    "全国自治体の面積(国土地理院公表値)をランキング形式で比較。面積が広い自治体・狭い自治体の特徴がわかります。",
  openGraph: {
    title: "全国自治体 面積ランキング",
    description: "国土地理院公表の自治体面積を自治体別にランキング。",
  },
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.area)
    .sort(
      (a, b) =>
        (b.area ?? 0) - (a.area ?? 0)
    )
    .slice(0, 50);

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
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        🗺️ 面積ランキング
      </h1>

      <MetricBox
        title="指標定義"
        unit="km²"
        definition="国土地理院が公表する自治体面積です。"
        formula="自治体面積（平方キロメートル）"
        example={{
          name: ranking[0].name,
          value: ranking[0].area ?? 0,
        }}
      />

      <AreaSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.area ?? 0,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.area ?? 0}
            unit="km²"
          />
        ))}
      </div>
    </main>
  );
}