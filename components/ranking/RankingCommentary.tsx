import Link from "next/link";

import { COMMENTARY } from "@/lib/rankingCommentary";
import { articleEntries } from "@/lib/articles";
import {
  bandStats,
  bigCityStats,
  describeCorrelation,
  median,
  populationCorrelation,
  prefectureStats,
  quantile,
  topConcentration,
} from "@/lib/rankingAnalysis";

/**
 * ランキングページ用の「データで読む」解説ブロック。
 * 設定は lib/rankingCommentary.ts。数値・文章はすべて、全自治体のデータから
 * ビルド時に計算する(ページ固有の内容になり、データ更新にも自動で追従する)。
 */
export default function RankingCommentary({ slug }: { slug: string }) {
  const cfg = COMMENTARY[slug];
  if (!cfg) return null;

  const rows = cfg.rows();
  if (rows.length < 20) return null;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: cfg.digits,
      maximumFractionDigits: cfg.digits,
    });
  const withUnit = (v: number) => `${fmt(v)}${cfg.unit}`;

  const values = rows.map((r) => r.value);
  const med = median(values);
  const p10 = quantile(values, 0.1);
  const p90 = quantile(values, 0.9);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const side1 = cfg.direction === "high" ? "高い" : "低い";
  const side2 = cfg.direction === "high" ? "低い" : "高い";

  // 分布
  const distribution = `対象は${rows.length.toLocaleString()}自治体${
    cfg.scope ? `(${cfg.scope})` : ""
  }です。中央値は${withUnit(med)}で、ちょうど真ん中の自治体の値を表します。上位・下位の各10%の境目は${withUnit(
    p10
  )}と${withUnit(p90)}で、最小は${withUnit(min)}、最大は${withUnit(max)}でした。${
    min > 0 && max / min >= 2
      ? `最大は最小の約${(max / min).toFixed(max / min >= 10 ? 0 : 1)}倍で、自治体の間に大きな開きがあります。`
      : ""
  }`;

  // 人口規模別
  const bands = cfg.hideSizeAnalysis ? [] : bandStats(rows);
  const corr = cfg.hideSizeAnalysis ? null : populationCorrelation(rows);
  const bandSorted = [...bands].sort((a, b) =>
    cfg.direction === "high" ? b.median - a.median : a.median - b.median
  );

  // 都道府県別
  const conc = topConcentration(rows, cfg.direction, 50);
  const prefStats = prefectureStats(rows, 5);
  const prefSorted = [...prefStats].sort((a, b) =>
    cfg.direction === "high" ? b.median - a.median : a.median - b.median
  );
  const prefTop = prefSorted.slice(0, 3);
  const prefBottom = prefSorted.slice(-3).reverse();

  // 大都市
  const big = bigCityStats(rows);

  const facts = cfg.facts ? cfg.facts(rows) : [];

  const related = cfg.relatedArticles
    .map((s) => articleEntries.find((a) => a.slug === s))
    .filter((a): a is (typeof articleEntries)[number] => Boolean(a));

  return (
    <section style={wrap} aria-labelledby={`commentary-${slug}`}>
      <h2 id={`commentary-${slug}`} style={{ fontSize: 24, marginTop: 0 }}>
        データで読む{cfg.metricName}ランキング
      </h2>

      <p style={p}>{distribution}</p>

      {facts.length > 0 && (
        <ul style={ul}>
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      {bands.length >= 2 && (
        <>
          <h3 style={h3}>人口規模で比べると</h3>
          <p style={p}>
            人口規模別の中央値を比べると、値が{side1}のは
            <strong>{bandSorted[0].label}</strong>
            ({withUnit(bandSorted[0].median)})、{side2}のは
            <strong>{bandSorted[bandSorted.length - 1].label}</strong>
            ({withUnit(bandSorted[bandSorted.length - 1].median)})でした。
            {corr != null
              ? `人口(対数)との相関係数は${corr.toFixed(2)}で、${describeCorrelation(corr)}。`
              : ""}
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>人口規模</th>
                  <th style={thNum}>自治体数</th>
                  <th style={thNum}>中央値</th>
                </tr>
              </thead>
              <tbody>
                {bands.map((b) => (
                  <tr key={b.label}>
                    <td style={td}>{b.label}</td>
                    <td style={tdNum}>{b.count.toLocaleString()}</td>
                    <td style={tdNum}>{withUnit(b.median)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {conc.length > 0 && (
        <>
          <h3 style={h3}>都道府県で比べると</h3>
          <p style={p}>
            ランキング上位50自治体(数値が{side1}側)は、{conc.length}
            都道府県に分かれています。最も多いのは
            {conc
              .slice(0, 3)
              .map((c) => `${c.pref}(${c.count}自治体)`)
              .join("、")}
            です。
            {prefStats.length >= 6
              ? `自治体が5つ以上ある都道府県ごとの中央値で見ると、値が${side1}側は${prefTop
                  .map((s) => `${s.pref}(${withUnit(s.median)})`)
                  .join("、")}、${side2}側は${prefBottom
                  .map((s) => `${s.pref}(${withUnit(s.median)})`)
                  .join("、")}でした。`
              : ""}
          </p>
        </>
      )}

      {(big.designated || big.wards) && (
        <>
          <h3 style={h3}>大都市の位置づけ</h3>
          <p style={p}>
            対象全体の中央値は{withUnit(big.overallMedian)}です。
            {big.designated
              ? `政令指定都市(${big.designated.count}市)の中央値は${withUnit(
                  big.designated.median
                )}で、全体の中央値と比べると${compare(
                  big.designated.median,
                  big.overallMedian
                )}`
              : ""}
            {big.wards
              ? `東京都の特別区(${big.wards.count}区)の中央値は${withUnit(
                  big.wards.median
                )}です。`
              : ""}
          </p>
        </>
      )}

      <h3 style={h3}>読み方と注意点</h3>
      <ul style={ul}>
        {cfg.reading.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {(related.length > 0 || cfg.relatedRankings.length > 0) && (
        <>
          <h3 style={h3}>あわせて読みたい</h3>
          <ul style={ul}>
            {related.map((a) => (
              <li key={a.slug}>
                <Link prefetch={false} href={`/articles/${a.slug}`} style={link}>
                  {a.title}
                </Link>
                <span style={{ color: "#6b7280" }}> — {a.desc}</span>
              </li>
            ))}
            {cfg.relatedRankings.map((r) => (
              <li key={r.href}>
                <Link prefetch={false} href={r.href} style={link}>
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

const wrap: React.CSSProperties = {
  marginTop: 40,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: "24px 26px",
};
/** 中央値どうしの比較を文章にする(差が2%未満なら「ほぼ同じ水準」) */
function compare(a: number, base: number): string {
  if (!(base > 0)) return "大きな差は見られません。";
  const diff = (a - base) / base;
  if (Math.abs(diff) < 0.02) return "ほぼ同じ水準です。";
  return a > base ? "大きくなっています。" : "小さくなっています。";
}

const p: React.CSSProperties = { lineHeight: 1.9, margin: "10px 0" };
const ul: React.CSSProperties = { lineHeight: 1.9, paddingLeft: 22, margin: "10px 0" };
const h3: React.CSSProperties = { fontSize: 18, margin: "24px 0 6px" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const table: React.CSSProperties = {
  width: "100%",
  minWidth: 420,
  borderCollapse: "collapse",
  fontSize: 14,
  marginTop: 8,
};
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  background: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f1f5f9" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
