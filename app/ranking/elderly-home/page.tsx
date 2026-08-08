import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import ElderlyHomeSummary from "../../../components/ranking/ElderlyHomeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 高齢者施設数ランキング｜旭川市が「福祉の街」の理由",
  description:
    "老人ホーム1施設あたりの高齢者人口をランキング形式で比較。介護老人福祉施設・養護老人ホーム・有料老人ホームを合算した、最新(2023年度)のデータです。",
};

export default function ElderlyHomeRankingPage() {
  const all = getMunicipalities().filter(
    (c) => c.elderlyHomeCount != null && c.elderlyPopulation > 0
  );

  const zeroCount = all.filter((c) => c.elderlyHomeCount === 0).length;

  const ranking = all
    .filter((c) => (c.elderlyHomeCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      elderlyPerFacility: c.elderlyPopulation / (c.elderlyHomeCount ?? 1),
    }))
    .sort((a, b) => a.elderlyPerFacility - b.elderlyPerFacility)
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
        🏡 高齢者施設数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/elderly-home-analysis"
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
        📖 分析記事「旭川市が福祉の街と呼ばれる理由」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="老人ホーム(介護老人福祉施設・養護老人ホーム・有料老人ホームの合算)1施設あたりの高齢者人口です。数字が小さいほど、高齢者人口に対して施設に余裕があります。老人ホームが1施設もない自治体は対象から除外しています。"
        formula="高齢者人口 ÷ 老人ホーム数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${Math.round(ranking[0]?.elderlyPerFacility ?? 0).toLocaleString()}`,
        }}
      />

      <ElderlyHomeSummary
        zeroCount={zeroCount}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.elderlyPerFacility,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={Math.round(city.elderlyPerFacility).toLocaleString()}
            unit="人/施設"
          />
        ))}
      </div>
    </main>
  );
}
