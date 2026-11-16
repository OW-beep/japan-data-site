import type { Metadata } from "next";
import Link from "next/link";

import DataAsOf from "../../../components/DataAsOf";
import AdSense from "../../../components/AdSense";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import {
  getPrefectureStats,
  hasPrefectureStatsData,
  hasPrefectureStatsData as checkReady,
} from "../../../lib/prefectureStats";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/traffic-accident-rate" },
  title: "都道府県別 交通事故発生件数ランキング｜人口10万人あたり",
  description:
    "総務省「社会・人口統計体系」をもとにした、人口10万人あたりの交通事故発生件数の都道府県別ランキングです。",
  robots: checkReady() ? undefined : { index: false, follow: true },
};

export default function TrafficAccidentRankingPage() {
  const ready = hasPrefectureStatsData();

  const ranking = getPrefectureStats()
    .filter((r) => r.stats.trafficAccidentRate != null)
    .sort(
      (a, b) =>
        (b.stats.trafficAccidentRate ?? 0) - (a.stats.trafficAccidentRate ?? 0)
    );

  const year = ranking[0]?.stats.trafficAccidentRateYear?.slice(0, 4);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🚗 都道府県別 交通事故発生件数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/traffic-accident-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eef2ff",
          color: "#4338ca",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 交通事故発生件数ランキング分析記事を読む →
      </a>

      {!ready || ranking.length === 0 ? (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
            padding: 20,
            color: "#92400e",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          準備中です。<code>npm run merge:safety-stats</code>{" "}
          を実行してデータを取得すると、このページに自動的にランキングが表示されます。
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
            総務省「社会・人口統計体系(K 安全)」({year}年度)をもとにした、
            人口10万人あたりの交通事故発生件数です。市区町村単位のデータは
            公表されていないため、都道府県単位のみの掲載です。
          </p>

          <AdSense />

          <RankingEditorial>
            <p style={{ margin: "0 0 10px" }}>
              人口10万人あたりの事故件数は、静岡県(494.5件)が最も多く、
              島根県(107.8件)の約4.6倍です。ただしこの数字は「その県で起きた
              事故」を「住民の数」で割ったもの。通過交通が多い県は、
              住民の実感より高く出ます。静岡は東名・新東名・国道1号が
              県を横断する「通過の県」で、上位の群馬県(479.3件)も
              車への依存度が高い県です。
            </p>
            <p style={{ margin: "0 0 10px" }}>
              逆に下位は島根・秋田・鳥取・岩手・新潟と、交通量そのものが
              少ない県が並びます。つまりこのランキングは「運転の荒さ」
              というより「車の量と流れ」を映したもの。住民1人あたりの
              事故リスクを知りたいなら、運転者数あたり・走行距離あたりの
              統計とあわせて見る必要があります。
            </p>
          </RankingEditorial>

          <RankingInsightFAQ
            metricName="交通事故発生件数(人口10万人あたり)"
            unitLabel="都道府県"
            items={ranking.map((r) => ({
              name: r.pref,
              displayValue: `${r.stats.trafficAccidentRate?.toFixed(1)}件/10万人`,
            }))}
            topNote="人口10万人あたりの交通事故発生件数が最も多いことを示します。"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={th}>交通事故発生件数(人口10万人あたり)</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{r.pref}</td>
                  <td style={td}>{r.stats.trafficAccidentRate?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <p style={{ marginTop: 28, lineHeight: 1.9 }}>
        🚗{" "}
        <Link
          prefetch={false}
          href="/ranking/traffic-accident-city"
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          市区町村別の交通事故(人身事故)ランキングはこちら →
        </Link>
      </p>

      {ready && ranking.length > 0 && <RankingCommentary slug="traffic-accident-rate" />}

    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
