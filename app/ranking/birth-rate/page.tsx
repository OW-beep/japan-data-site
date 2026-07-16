import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import BirthRateSummary from "../../../components/ranking/BirthRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";

import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 出生率ランキング【合計特殊出生率】",
  description:
    "全国自治体の合計特殊出生率をランキング形式で比較。出生率が高い自治体・低い自治体の傾向や地域差がわかります。",
};

export default function Page() {
  const ranking = getMunicipalities()
  .filter(
    (c) =>
      c.birthRate != null &&
      c.birthRate > 0
  )
  .sort(
    (a, b) =>
      (b.birthRate ?? 0) -
      (a.birthRate ?? 0)
  );

const top50 = ranking.slice(0, 50);

  const average =
    ranking.reduce(
      (sum, c) => sum + (c.birthRate ?? 0),
      0
    ) / ranking.length;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        出生率ランキング
      </h1>

      <DataAsOf />

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国自治体の合計特殊出生率を比較しています。
        数値が高いほど、女性一人あたりが生涯に産む子どもの人数が多いことを示します。
      </p>

      <MetricBox
        title="指標定義"
        definition="合計特殊出生率"
        unit=""
        formula="15〜49歳女性の年齢別出生率を合計した指標"
        example={{
          name: top50[0]?.name ?? "",
          value: Number(
            top50[0]?.birthRate?.toFixed(2) ?? 0
          ),
        }}
      />

      <BirthRateSummary
        average={average}
        cityCount={ranking.length}
        top3={top50.slice(0, 3).map((c) => ({
          name: c.name,
          rate: c.birthRate ?? 0,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 35,
        }}
      >
        {top50.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.birthRate ?? 0).toFixed(2)}
            unit=""
          />
        ))}
      </div>

      <section
        style={{
          marginTop: 60,
        }}
      >
        <h2>関連ランキング</h2>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 18,
          }}
        >
          <Link href="/ranking/population">
            人口ランキング
          </Link>

          <Link href="/ranking/child">
            子ども人口ランキング
          </Link>

          <Link href="/ranking/aging">
            高齢化率ランキング
          </Link>

          <Link href="/ranking/density">
            人口密度ランキング
          </Link>
        </div>
      </section>
    </main>
  );
}