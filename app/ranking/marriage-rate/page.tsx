import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import MarriageRateSummary from "../../../components/ranking/MarriageRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { getMunicipalities2025 } from "../../../lib/city2025";
import { estatLatestYear } from "../../../lib/estatLatest";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/marriage-rate" },
  title: "全国自治体 婚姻率ランキング｜東京都心の区がなぜ上位に",
  description:
    "全国自治体の人口1,000人あたり婚姻件数(婚姻率)をランキング形式で比較。台東区・墨田区など東京都心の特別区が上位を占める理由を解説します。",
};

export function generateMetadata() {
  return withTop1("marriage-rate", baseMetadata);
}

export default function MarriageRateRankingPage() {
  const ranking = getMunicipalities2025()
    .filter(
      (c) =>
        c.marriages != null &&
        !Number.isNaN(c.marriages) &&
        c.population >= 3000
    )
    .map((c) => ({
      ...c,
      marriageRate: ((c.marriages ?? 0) / c.population) * 1000,
    }))
    .sort((a, b) => b.marriageRate - a.marriageRate)
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
        💍 婚姻率ランキング
      </h1>

      <DataAsOf text={`婚姻件数:${estatLatestYear("vital") ?? 2023}年(人口動態調査)、人口:令和7年国勢調査(確定値)`} />

      <a
        href="/articles/marriage-rate-analysis"
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
        📖 分析記事「都心と郊外でなぜ差が出るのか」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          上位は中央区9.97件、墨田区9.96件、台東区9.91件と、東京
          都心の区が並びます。全国の中央値2.85件の3倍以上で、人口
          1,000人あたり5件以上の自治体は64しかありません。都心の区は
          単身の若い世代が多く住むため、分母の総人口に対して結婚する
          年齢層の割合そのものが高く、その年齢構成が順位を押し上げて
          います。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          逆に、湯前町0.31件や吉野町0.57件のように低い町村は、
          「結婚しない人が多い街」ではありません。高齢化が進み、
          結婚適齢期の人口自体が少ないため、総人口で割ると小さく
          なります。このランキングは「結婚の多さ」より「年齢構成の
          若さ」を映す指標と捉えるのが正確です。結婚した夫婦がその
          土地で子どもを持つかは別の動きで、
          <a href="/articles/marriage-birthrate-analysis" style={{ color: "#2563eb" }}>
            婚姻率と出生率の掛け合わせ分析
          </a>
          で詳しく見ています。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="件"
        definition="人口1,000人あたりの年間婚姻件数です。値が高いほど、人口に対して結婚した夫婦の数が多いことを意味します。人口3,000人未満の自治体は、母数が小さく数値が不安定になるため対象から除外しています。"
        formula="婚姻件数 ÷ 総人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.marriageRate?.toFixed(2) ?? "0.00"}`,
        }}
      source={dataSources["marriage-rate"]}
      />

      <MarriageRateSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.marriageRate,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.marriageRate.toFixed(2)}
            unit="件"
          />
        ))}
      </div>

      <RankingCommentary slug="marriage-rate" />

    </main>
  );
}
