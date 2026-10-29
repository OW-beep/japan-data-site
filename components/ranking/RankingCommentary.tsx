import Link from "next/link";

import { COMMENTARY } from "@/lib/rankingCommentary";
import { COMPARE, compareWith } from "@/lib/rankingCompare";
import { articleEntries } from "@/lib/articles";
import { isReleased } from "@/lib/release";
import {
  bandStats,
  bigCityStats,
  describeCorrelation,
  describeRelation,
  median,
  outliersVsPopulation,
  populationCorrelation,
  prefectureStats,
  quantile,
  topConcentration,
} from "@/lib/rankingAnalysis";

/**
 * ランキングページ用の「データで読む」解説ブロック。
 * 設定は lib/rankingCommentary.ts。数値・文章はすべて、全自治体のデータから
 * ビルド時に計算する(ページ固有の内容になり、データ更新にも自動で追従する)。
 *
 * 「どのページも同じ型」にならないよう、分析の節は、そのデータで値の傾向が強く出ているものだけを
 * 選び、強い順に並べる。弱い観点は省くか、1文で触れるだけにする。
 * (人口規模・都道府県・大都市・他の指標との相関・人口から見た外れ値)
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

  // 都道府県単位のランキングでは、人口規模別・都道府県別・大都市の分析は意味がないので出さない
  const isPref = cfg.level === "prefecture";
  const noun = isPref ? "都道府県" : "自治体";
  const values = rows.map((r) => r.value);
  const med = median(values);
  const p10 = quantile(values, 0.1);
  const p90 = quantile(values, 0.9);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const iqr = Math.max(p90 - p10, 1e-9);

  const side1 = cfg.direction === "high" ? "高い" : "低い";
  const side2 = cfg.direction === "high" ? "低い" : "高い";

  // 導入の段落。言い回しは3通りから、ページごとに固定で選ぶ(同じ型の繰り返しを避ける)
  const scopeText = cfg.scope ? `(${cfg.scope})` : "";
  const gap =
    min > 0 && max / min >= 2
      ? `最大は最小の約${(max / min).toFixed(max / min >= 10 ? 0 : 1)}倍で、${noun}の間に大きな開きがあります。`
      : "";
  const N = rows.length.toLocaleString();
  const leads = [
    `対象は${N}${noun}${scopeText}です。中央値は${withUnit(med)}で、値の低い側10%の境目は${withUnit(p10)}、高い側10%の境目は${withUnit(p90)}です。最小は${withUnit(min)}、最大は${withUnit(max)}でした。${gap}`,
    `${noun}ごとの値は、最小の${withUnit(min)}から最大の${withUnit(max)}まで開いています。真ん中の${noun}は${withUnit(med)}です(対象は${N}${noun}${scopeText})。${gap}`,
    `${N}${noun}${scopeText}を比べると、中央値は${withUnit(med)}、最小は${withUnit(min)}、最大は${withUnit(max)}でした。値の低い側10%と高い側10%の境目は、${withUnit(p10)}と${withUnit(p90)}です。${gap}`,
  ];
  const lead = leads[hash(slug) % leads.length];

  const facts = cfg.facts ? cfg.facts(rows) : [];

  // ── 分析の節。salience(強さ)の大きい順に並べ、弱いものは省く ──
  const blocks: { key: string; salience: number; node: React.ReactNode }[] = [];

  // 人口規模
  if (!cfg.hideSizeAnalysis && !isPref) {
    const bands = bandStats(rows, cfg.minPopulation);
    const corr = populationCorrelation(rows);
    if (bands.length >= 2 && corr != null) {
      const bandSorted = [...bands].sort((a, b) =>
        cfg.direction === "high" ? b.median - a.median : a.median - b.median
      );
      const strong = Math.abs(corr) >= 0.3;
      blocks.push({
        key: "size",
        salience: strong ? Math.abs(corr) : 0.12,
        node: strong ? (
          <>
            <h3 style={h3}>人口規模で比べると</h3>
            <p style={p}>
              人口規模別の中央値を比べると、値が{side1}のは
              <strong>{bandSorted[0].label}</strong>({withUnit(bandSorted[0].median)})、{side2}のは
              <strong>{bandSorted[bandSorted.length - 1].label}</strong>(
              {withUnit(bandSorted[bandSorted.length - 1].median)})でした。人口(対数)との相関係数は
              {corr.toFixed(2)}で、{describeCorrelation(corr)}。
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
        ) : (
          <>
            <h3 style={h3}>人口規模との関係</h3>
            <p style={p}>
              人口(対数)との相関係数は{corr.toFixed(2)}で、{describeCorrelation(corr)}。この指標の高低は、
              人口の多い・少ないでは説明できません。
            </p>
          </>
        ),
      });
    }
  }

  // 都道府県
  if (!isPref) {
    const conc = topConcentration(rows, cfg.direction, 50);
    const prefStats = prefectureStats(rows, 5);
    if (conc.length > 0) {
      const prefSorted = [...prefStats].sort((a, b) =>
        cfg.direction === "high" ? b.median - a.median : a.median - b.median
      );
      const prefTop = prefSorted.slice(0, 3);
      const prefBottom = prefSorted.slice(-3).reverse();
      const topShare = conc[0].count / 50;
      const spread =
        prefStats.length >= 6
          ? (prefSorted[0].median - prefSorted[prefSorted.length - 1].median) / iqr
          : 0;
      const salience = Math.max(topShare * 2, Math.abs(spread));
      if (salience >= 1.0) {
        blocks.push({
          key: "pref",
          salience: salience * 0.8,
          node: (
            <>
              <h3 style={h3}>都道府県で比べると</h3>
              <p style={p}>
                ランキング上位50自治体(数値が{side1}側)は、{conc.length}都道府県に分かれています。最も多いのは
                {conc
                  .slice(0, 3)
                  .map((c) => `${c.pref}(${c.count}自治体)`)
                  .join("、")}
                です。
                {prefStats.length >= 6
                  ? `自治体が5つ以上ある都道府県ごとの中央値で見ると、値が${side1}側は${prefTop
                      .map((x) => `${x.pref}(${withUnit(x.median)})`)
                      .join("、")}、${side2}側は${prefBottom
                      .map((x) => `${x.pref}(${withUnit(x.median)})`)
                      .join("、")}でした。`
                  : ""}
              </p>
            </>
          ),
        });
      }
    }
  }

  // 大都市
  if (!isPref) {
    const big = bigCityStats(rows);
    const dDiff = big.designated ? Math.abs(big.designated.median - big.overallMedian) / iqr : 0;
    const wDiff = big.wards ? Math.abs(big.wards.median - big.overallMedian) / iqr : 0;
    const salience = Math.max(dDiff, wDiff);
    if ((big.designated || big.wards) && salience >= 0.4) {
      blocks.push({
        key: "big",
        salience: salience * 0.7,
        node: (
          <>
            <h3 style={h3}>大都市の位置づけ</h3>
            <p style={p}>
              対象全体の中央値は{withUnit(big.overallMedian)}です。
              {big.designated
                ? `政令指定都市(${big.designated.count}市)の中央値は${withUnit(
                    big.designated.median
                  )}で、全体の中央値と比べると${compare(big.designated.median, big.overallMedian)}`
                : ""}
              {big.wards
                ? `東京都の特別区(${big.wards.count}区)の中央値は${withUnit(big.wards.median)}です。`
                : ""}
            </p>
          </>
        ),
      });
    }
  }

  // 他の指標との関係(ページごとに比較対象が違う)
  const compares = (COMPARE[slug] ?? [])
    .map((v) => ({ v, res: compareWith(rows, v) }))
    .filter((x): x is { v: (typeof x)["v"]; res: { r: number; n: number } } => x.res != null);
  if (compares.length > 0) {
    const maxR = Math.max(...compares.map((x) => Math.abs(x.res.r)));
    blocks.push({
      key: "compare",
      salience: Math.max(maxR, 0.15),
      node: (
        <>
          <h3 style={h3}>ほかの指標との関係</h3>
          <ul style={ul}>
            {compares.map(({ v, res }) => (
              <li key={v.label}>
                {v.label}との相関係数は{res.r.toFixed(2)}(比較できた{res.n.toLocaleString()}自治体)で、
                {describeRelation(res.r, v.label)}。
              </li>
            ))}
          </ul>
          <p style={{ ...p, color: "#6b7280", fontSize: 14 }}>
            相関係数は、2つの値が一緒に動く傾向の強さを表すだけで、一方が他方の原因であることは意味しません。
          </p>
        </>
      ),
    });
  }

  // 人口規模から見た外れ値(人口との関係が強いときだけ)
  if (!cfg.hideSizeAnalysis && !isPref) {
    const corr = populationCorrelation(rows);
    if (corr != null && Math.abs(corr) >= 0.4) {
      const o = outliersVsPopulation(rows, 3);
      if (o) {
        const line = (xs: typeof o.above) =>
          xs.map((x) => `${x.name}(実際${withUnit(x.value)}、予想${withUnit(x.expected)})`).join("、");
        blocks.push({
          key: "outliers",
          salience: Math.abs(corr) * 0.9,
          node: (
            <>
              <h3 style={h3}>人口から見ると意外な自治体</h3>
              <p style={p}>
                {`人口規模だけから予想される値と実際の値を比べると、予想を大きく上回っているのは${line(o.above)}です。反対に、予想を大きく下回っているのは${line(o.below)}でした。人口以外の事情(産業や立地、地理など)が働いている可能性があり、個別に調べる価値があります。`}
              </p>
            </>
          ),
        });
      }
    }
  }

  blocks.sort((a, b) => b.salience - a.salience);

  const related = cfg.relatedArticles
    .map((s) => articleEntries.find((a) => a.slug === s))
    .filter((a): a is (typeof articleEntries)[number] => Boolean(a));

  return (
    <section style={wrap} aria-labelledby={`commentary-${slug}`}>
      <h2 id={`commentary-${slug}`} style={{ fontSize: 24, marginTop: 0 }}>
        データで読む{cfg.metricName}ランキング
      </h2>

      <p style={p}>{lead}</p>

      {facts.length > 0 && (
        <ul style={ul}>
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      {blocks.map((b) => (
        <div key={b.key}>{b.node}</div>
      ))}

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
            {cfg.relatedRankings
              .filter((r) => isReleased(r.href))
              .map((r) => (
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

/** スラッグから決まる数値(ページごとに言い回しを固定で選ぶために使う) */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
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
