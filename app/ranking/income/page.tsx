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
  alternates: { canonical: "/ranking/income" },
  title: "都道府県別 平均年収ランキング",
  description:
    "都道府県別の平均年収(賃金構造基本統計調査ベース)をランキング形式で比較します。",
  robots: checkReady() ? undefined : { index: false, follow: true },
};

export default function IncomeRankingPage() {
  const ready = hasPrefectureStatsData();

  const ranking = getPrefectureStats()
    .filter((r) => r.stats.income != null)
    .sort((a, b) => (b.stats.income ?? 0) - (a.stats.income ?? 0));

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        💰 都道府県別 平均年収ランキング
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
          <code>npm run merge:prefecture-income</code>{" "}
          を実行してデータを取得すると、このページに自動的に
          ランキングが表示されます。
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
            厚生労働省「賃金構造基本統計調査」(2023年、一般労働者・
            男女計・全年齢・企業規模計)の所定内給与額(月額)×12か月＋
            年間賞与その他特別給与額から算出した推計年収です。
            市区町村単位のデータは公表されていないため、都道府県単位
            のみの掲載です。
          </p>

          <AdSense />

          <RankingInsightFAQ
            metricName="平均年収"
            unitLabel="都道府県"
            items={ranking.map((r) => ({
              name: r.pref,
              displayValue: `${((r.stats.income ?? 0) / 100).toFixed(1)}万円`,
            }))}
            topNote="厚生労働省「賃金構造基本統計調査」ベースの推計年収が全国で最も高いことを示します。"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={th}>推計年収</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{r.pref}</td>
                  <td style={td}>
                    {((r.stats.income ?? 0) / 100).toFixed(1)}万円
                  </td>
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
