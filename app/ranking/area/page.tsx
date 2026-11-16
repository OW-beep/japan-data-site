import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";

import AreaSummary from "../../../components/ranking/AreaSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";

import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import Link from "next/link";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/area" },
  title: "全国自治体 面積ランキング",
  description:
    "全国自治体の面積(国土地理院公表値)をランキング形式で比較。面積が広い自治体・狭い自治体の特徴がわかります。",
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

      <DataAsOf />

      <a
        href="/articles/area-analysis"
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
        📖 なぜ北海道と山間部が上位に多いのか、分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="km²"
        definition="国土地理院が公表する自治体面積です。"
        formula="自治体面積（平方キロメートル）"
        example={{
          name: ranking[0].name,
          value: ranking[0].area ?? 0,
        }}
      source={dataSources["area"]}
      />

      <AreaSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.area ?? 0,
        }))}
      />

      <AdSense />

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          最も面積が広いのは岐阜県高山市で2,177.61km²。東京都全体
          (約2,194km²)にほぼ匹敵する広さです。最も狭い富山県
          舟橋村(3.47km²)との差は約630倍。上位には浜松市・
          日光市など、平成の大合併で生まれた市が並び、この
          ランキングは実質的に「合併の歴史ランキング」でもあります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          ただし面積の広さは暮らしの広さとは別物です。広い自治体ほど
          山林の割合が高く、人が住める土地は限られます。実態に近い
          広さを見たいときは、可住地面積で割った
          <Link prefetch={false} href="/ranking/habitable-density" style={{ color: "#2563eb", textDecoration: "underline" }}>
            可住地人口密度ランキング
          </Link>
          とあわせてご覧ください。
        </p>
      </RankingEditorial>

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

      <RankingCommentary slug="area" />

    </main>
  );
}