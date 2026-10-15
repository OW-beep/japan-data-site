import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import AgingSummary from "../../../components/ranking/AgingSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";

import { getAgeRows, nationalRates } from "../../../lib/ageRates";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/aging" },
  title: "高齢化率ランキング【2025年国勢調査】市町村別TOP100",
  description:
    "令和7年国勢調査(確定値)に基づく、全国の市区町村の高齢化率(65歳以上人口の割合)ランキング。上位100自治体を掲載し、2020年からの全国の変化も確認できます。",
};

export function generateMetadata() {
  return withTop1("aging", baseMetadata);
}

export default function Page() {
  const { rows, label, use2025 } = getAgeRows();
  const nat = nationalRates(rows);
  const ranking = rows
    .map((c) => ({ ...c, rate: c.elderlyRate }))
    .sort((a, b) => b.rate - a.rate);

  // 上位100自治体を表示(以前は50)
  const top50 = ranking.slice(0, 100);

  const average =
    ranking.reduce(
      (sum, c) => sum + c.rate,
      0
    ) / ranking.length;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        全国自治体 高齢化率ランキング
      </h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国自治体の高齢化率を比較しています。
        高齢化率は65歳以上人口が総人口に占める割合です。
        {use2025 && (
          <>
            全自治体を合わせた全国の高齢化率は{nat.elderly.toFixed(1)}%で、2020年の
            {nat.elderly2020.toFixed(1)}%から{(nat.elderly - nat.elderly2020).toFixed(1)}ポイントの
            {nat.elderly >= nat.elderly2020 ? "上昇" : "低下"}です。
          </>
        )}
      </p>

      <MetricBox
        title="高齢化率とは？"
        definition="総人口に占める65歳以上人口の割合"
        unit="%"
        formula="高齢化率 = 高齢者人口 ÷ 総人口 ×100"
        example={{
          name: top50[0].name,
          value: Number(
            top50[0].rate.toFixed(2)
          ),
        }}
      source={dataSources["aging"]}
      />

      <AgingSummary
        average={average}
        cityCount={ranking.length}
        top3={top50.slice(0, 3).map((c) => ({
          name: c.name,
          rate: c.rate,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 40,
        }}
      >
        {top50.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.rate.toFixed(2)}
            unit="%"
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
            gap: 15,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <Link prefetch={false} href="/ranking/population">
            人口ランキング
          </Link>

          <Link prefetch={false} href="/ranking/birth-rate">
            出生率ランキング
          </Link>

          <Link prefetch={false} href="/ranking/child">
            子ども人口ランキング
          </Link>

          <Link prefetch={false} href="/ranking/density">
            人口密度ランキング
          </Link>
        </div>
      </section>

      <RankingCommentary slug="aging" />

    </main>
  );
}