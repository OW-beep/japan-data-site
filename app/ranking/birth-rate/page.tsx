import Link from "next/link";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import BirthRateSummary from "../../../components/ranking/BirthRateSummary";

import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
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
      (sum, c) => sum + c.birthRate,
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
      />

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
            value={city.birthRate.toFixed(2)}
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