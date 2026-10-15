import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import PopulationSummary from "../../../components/ranking/PopulationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";

import { getMunicipalitiesPop } from "../../../lib/cityPopulation";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/population" },
  // 「【最新版】」は、実際に最新(令和7年国勢調査)のデータでなければ名乗れない。
  // 先頭に検索語(市区町村 人口ランキング)、続けて「いつの調査か」を示す。
  title: "市区町村 人口ランキング【2025年国勢調査】全国TOP100",
  description:
    "令和7年国勢調査(確定値)に基づく、全国の市区町村の人口ランキング。上位100自治体を人口順に掲載し、2020年からの増減も確認できます。政令指定都市・県庁所在地から町村まで比較できます。",
};

export function generateMetadata() {
  return withTop1("population", baseMetadata);
}

export default function Page() {
  const { rows, label, use2025 } = getMunicipalitiesPop();
  const ranking = [...rows].sort((a, b) => b.population - a.population);

  // 上位100自治体を表示(以前は50。順位表が長いほど検索意図に応える)
  const top50 = ranking.slice(0, 100);

  const average =
    ranking.reduce((sum, c) => sum + c.population, 0) /
    ranking.length;

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
        全国自治体 人口ランキング
      </h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国の自治体人口をランキング形式で掲載しています。
        <br />
        東京都の特別区(千代田区など)は独立した自治体として個別に、
        政令指定都市の区(横浜市港北区など)は市の内訳として、各市のページに掲載しています。
      </p>

      <MetricBox
        title="人口とは？"
        unit="人"
        definition={`国勢調査による人口です(このページは${label})。住民基本台帳人口(役所への届出ベース)とは異なり、調査時点の実際の居住実態に基づいています。`}
        formula="人口 = 国勢調査人口"
        example={{
          name: top50[0].name,
          value: top50[0].population,
        }}
        source={dataSources.population}
      />

      <PopulationSummary
        average={average}
        cityCount={ranking.length}
        top3={top50.slice(0, 3).map((c) => ({
          name: c.name,
          population: c.population,
        }))}
      />

      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        📊{" "}
        <Link prefetch={false} href="/articles/million-cities" style={{ color: "#2563eb", textDecoration: "underline" }}>
          人口100万人以上の都市は全国に何市あるか、詳しい分析記事はこちら →
        </Link>
        <br />
        📈{" "}
        <Link prefetch={false} href="/articles/million-cities-population-change" style={{ color: "#2563eb", textDecoration: "underline" }}>
          100万人都市の人口は2020年から増えた?減った? →
        </Link>
        <br />
        🏙️{" "}
        <Link prefetch={false} href="/ranking/mid-cities" style={{ color: "#2563eb", textDecoration: "underline" }}>
          人口30万人以上の都市ランキング →
        </Link>
        <br />
        🌆{" "}
        <Link prefetch={false} href="/ranking/large-cities" style={{ color: "#2563eb", textDecoration: "underline" }}>
          人口50万人以上の都市(政令指定都市など)を人口順に一覧で見る →
        </Link>
      </div>

      <CompareCTA />

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
            value={city.population}
            unit="人"
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
          <Link prefetch={false} href="/ranking/birth-rate">
            出生率ランキング
          </Link>

          <Link prefetch={false} href="/ranking/aging">
            高齢化率ランキング
          </Link>

          <Link prefetch={false} href="/ranking/child">
            子ども人口ランキング
          </Link>

          <Link prefetch={false} href="/ranking/density">
            人口密度ランキング
          </Link>
        </div>
      </section>

      <RankingCommentary slug="population" />

    </main>
  );
}