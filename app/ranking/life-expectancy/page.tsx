import type { Metadata } from "next";

import DataAsOf from "../../../components/DataAsOf";
import AdSense from "../../../components/AdSense";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import {
  getPrefectureStats,
  hasPrefectureStatsData,
} from "../../../lib/prefectureStats";

import { hasPrefectureStatsData as checkReady } from "../../../lib/prefectureStats";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/life-expectancy" },
  title: "都道府県別 平均寿命ランキング",
  description:
    "都道府県別生命表(厚生労働省)をもとにした、男女別の平均寿命ランキングです。",
  robots: checkReady() ? undefined : { index: false, follow: true },
};

export default function LifeExpectancyRankingPage() {
  const ready = hasPrefectureStatsData();

  const ranking = getPrefectureStats()
    .filter((r) => r.stats.lifeExpectancyFemale != null)
    .sort(
      (a, b) =>
        (b.stats.lifeExpectancyFemale ?? 0) -
        (a.stats.lifeExpectancyFemale ?? 0)
    );

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🧓 都道府県別 平均寿命ランキング
      </h1>

      <DataAsOf />

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
          準備中です。
          <code>npm run merge:life-expectancy</code>{" "}
          を実行してデータを取得すると、このページに自動的に
          ランキングが表示されます。
        </div>
      ) : (
        <>
          <AdSense />

          <RankingInsightFAQ
            metricName="平均寿命(女性)"
            unitLabel="都道府県"
            items={ranking.map((r) => ({
              name: r.pref,
              displayValue: `女性${r.stats.lifeExpectancyFemale?.toFixed(
                2
              )}歳 / 男性${r.stats.lifeExpectancyMale?.toFixed(2)}歳`,
            }))}
            topNote="女性の平均寿命が全国で最も長いことを示します。"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={th}>女性</th>
                <th style={th}>男性</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{r.pref}</td>
                  <td style={td}>{r.stats.lifeExpectancyFemale?.toFixed(2)}歳</td>
                  <td style={td}>{r.stats.lifeExpectancyMale?.toFixed(2)}歳</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
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
