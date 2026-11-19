import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HospitalSummary from "../../../components/ranking/HospitalSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/hospital" },
  title: "全国自治体 病院数ランキング｜人口10万人あたりで比較",
  description:
    "人口10万人あたりの病院数をランキング形式で比較。上位には高知県越知町など人口数千人規模の町村が並ぶ一方、303自治体には病院が1つもありません。診療所数とあわせて医療アクセスを分析します。",
};

export default function HospitalRankingPage() {
  const base = getMunicipalities2025().filter(
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

      <DataAsOf text="病院・診療所数:2023年(医療施設調査)、人口:令和7年国勢調査(確定値)" />

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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          上位は高知県越知町(人口10万人あたり90.1か所)をはじめ、
          人口数千人規模の町村が占めます。これは「病院が充実した街」
          というより、人口の少ない自治体に病院が1つあるだけで
          人口あたりの数値が跳ね上がるためです。病院のある自治体の
          中央値は7.1か所で、上位の数字とは大きな開きがあります。
          人口あたりの順位は、規模の小さい自治体ほど1施設の増減に
          左右される点に注意してください。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          病院が1つもない自治体は、人口3,000人以上の1,548自治体のうち
          303あります。ただし診療所もゼロという自治体は1つもなく、
          病院ゼロの自治体でも診療所は人口10万人あたり中央値で
          72か所あります。日常の医療は診療所が担い、入院や手術は
          近隣市の中核病院へ、という役割分担が実態です。一方で、
          愛知県愛西市(人口57,755人)、岐阜県瑞穂市(同56,616人)、
          茨城県つくばみらい市(同52,100人)のように、人口5万人を超えても
          市内に病院がない市もあり、医療機関までの距離は自治体単位の
          数字だけでは測れません。老後の住まい選びの観点では
          <a href="/articles/retirement-city-guide" style={{ color: "#2563eb" }}>
            老後の街選びガイド
          </a>
          、医師の人数では
          <a href="/ranking/doctors" style={{ color: "#2563eb" }}>
            医師数ランキング
          </a>
          もあわせてご覧ください。
        </p>
      </RankingEditorial>

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

      <RankingInsightFAQ
        metricName="人口10万人あたり病院数"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.hospPer100k.toFixed(1)}か所`,
        }))}
        totalCount={base.length}
        topNote="人口の少ない自治体に病院が1つあるため、人口あたりでは大きな値になっています。病院ゼロの自治体は303ありますが、診療所もゼロの自治体はありません。"
      />

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

      <RankingCommentary slug="hospital" />

    </main>
  );
}
