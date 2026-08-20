import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HospitalSummary from "../../../components/ranking/HospitalSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/hospital" },
  title: "全国自治体 病院数ランキング｜人口10万人あたりで比較",
  description:
    "人口10万人あたりの病院数をランキング形式で比較。上位には高知県越知町など人口数千人規模の町村が並ぶ一方、324自治体には病院が1つもありません。診療所数とあわせて医療アクセスを分析します。",
};

export default function HospitalRankingPage() {
  const base = getMunicipalities().filter(
    (c) =>
      c.hospitalCount != null && c.clinicCount != null && c.population >= 3000
  );

  const zeroCount = base.filter((c) => c.hospitalCount === 0).length;

  const ranking = base
    .filter((c) => (c.hospitalCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      hospPer100k: ((c.hospitalCount ?? 0) / c.population) * 100000,
      clinicPer100k: ((c.clinicCount ?? 0) / c.population) * 100000,
    }))
    .sort((a, b) => b.hospPer100k - a.hospPer100k)
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
        🏥 病院数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/hospital-access-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fef2f2",
          color: "#b91c1c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 病院数ランキング分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit=""
        definition="人口10万人あたりの病院数です。病院(20床以上の入院施設を持つ医療機関)と診療所(それ未満の医療機関)は統計上区別されており、このランキングは病院のみを対象にしています。"
        formula="病院数 ÷ 人口 × 100,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: Number(ranking[0]?.hospPer100k?.toFixed(1) ?? 0),
        }}
        source={dataSources.hospital}
      />

      <HospitalSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.hospPer100k,
        }))}
        zeroCount={zeroCount}
        total={base.length}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.hospPer100k.toFixed(1)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
