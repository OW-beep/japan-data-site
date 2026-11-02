import Link from "next/link";
import { getMunicipalities2025 } from "@/lib/city2025";
import { isDesignatedCity } from "@/lib/designatedCities";
import { METRICS, formatMetric, type MetricKey, type MunicipalCity } from "@/lib/metrics";
import { shortName } from "@/lib/crossAnalysis";

/**
 * 都市を、暮らしの指標で並べて比べる表(「100万人都市」「80〜90万人都市」「政令指定都市」の記事用)。
 *
 * 検索で一覧を知りたい人が最も多い入口なので、「どの都市に住むか迷っている」という悩みに答える形にする。
 * 人口・子ども・高齢者は令和7年国勢調査(lib/city2025.ts)にそろえてある。ほかの項目の年次は、項目ごとに異なる。
 * 濃い色は、その列の中で値が大きいことを表す(良い・悪いの評価ではない)。
 * 東京23区は区ごとのデータのため、含めない。
 */
type Kind = "million" | "near" | "designated";

const COLUMNS: { key: MetricKey; short: string }[] = [
  { key: "aging", short: "高齢化率" },
  { key: "child", short: "子ども(15歳未満)の割合" },
  { key: "finance", short: "財政力指数" },
  { key: "density", short: "人口密度" },
  { key: "daycare", short: "子ども1,000人あたり保育施設" },
  { key: "doctors", short: "人口10万人あたり医師" },
  { key: "vacant", short: "空き家率" },
  { key: "social", short: "社会増減率(転入−転出)" },
];

function pick(kind: Kind, all: MunicipalCity[]): MunicipalCity[] {
  const list =
    kind === "million"
      ? all.filter((c) => c.population >= 1_000_000)
      : kind === "near"
        ? all.filter((c) => c.population >= 700_000 && c.population < 1_000_000)
        : all.filter((c) => isDesignatedCity(c.name));
  return list.sort((a, b) => b.population - a.population);
}

export default function CityCompareTable({
  kind,
  heading,
  lead,
}: {
  kind: Kind;
  heading: string;
  lead: string;
}) {
  const cities = pick(kind, getMunicipalities2025());
  if (cities.length < 3) return null;

  // 列ごとの最小・最大(濃淡と「最大・最小」の表示に使う)
  const stats = COLUMNS.map((col) => {
    const m = METRICS[col.key] as { get: (c: MunicipalCity) => number | null };
    const vals = cities.map((c) => m.get(c));
    const nums = vals.filter((v): v is number => v != null && Number.isFinite(v));
    return {
      col,
      vals,
      min: nums.length ? Math.min(...nums) : 0,
      max: nums.length ? Math.max(...nums) : 0,
    };
  });

  const shade = (v: number | null, min: number, max: number) => {
    if (v == null || max === min) return undefined;
    const t = (v - min) / (max - min);
    return `rgba(14, 116, 144, ${(0.06 + t * 0.4).toFixed(2)})`;
  };

  return (
    <section aria-labelledby={`compare-${kind}`} style={wrap}>
      <h2 id={`compare-${kind}`} style={h2}>
        {heading}
      </h2>
      <p style={p}>{lead}</p>

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={thLeft}>都市</th>
              <th style={th}>人口(令和7年)</th>
              {COLUMNS.map((c) => (
                <th key={c.key} style={th}>
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((c, i) => (
              <tr key={c.code}>
                <td style={tdLeft}>
                  <Link prefetch={false} href={`/city/${c.code}`} style={link}>
                    {shortName(c.name)}
                  </Link>
                </td>
                <td style={td}>{c.population.toLocaleString()}人</td>
                {stats.map((s) => {
                  const v = s.vals[i];
                  return (
                    <td key={s.col.key} style={{ ...td, background: shade(v, s.min, s.max) }}>
                      {v == null ? "—" : formatMetric(s.col.key, v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={note}>
        濃い色は、その列の中で値が大きいことを表します(良い・悪いの評価ではありません)。人口・子ども・高齢者は
        令和7年国勢調査、そのほかの項目は、公表年が項目ごとに異なります。東京23区は、区ごとのデータのため、
        この表には含めていません。「—」は、データがない項目です。
      </p>

      <h3 style={h3}>この表から読み取れること</h3>
      <ul style={ul}>
        {stats.map((s) => {
          const withV = cities
            .map((c, i) => ({ c, v: s.vals[i] }))
            .filter((x): x is { c: MunicipalCity; v: number } => x.v != null && Number.isFinite(x.v));
          if (withV.length < 3) return null;
          const hi = withV.reduce((a, b) => (b.v > a.v ? b : a));
          const lo = withV.reduce((a, b) => (b.v < a.v ? b : a));
          return (
            <li key={s.col.key}>
              <strong>{s.col.short}</strong>は、{shortName(hi.c.name)}({formatMetric(s.col.key, hi.v)})が最も高く、
              {shortName(lo.c.name)}({formatMetric(s.col.key, lo.v)})が最も低くなっています。
            </li>
          );
        })}
      </ul>
      <p style={note}>
        2つの都市を、さらに詳しく比べたいときは、
        <Link prefetch={false} href="/compare" style={link}>
          自治体比較ツール
        </Link>
        が使えます。
      </p>
    </section>
  );
}

const wrap: React.CSSProperties = { margin: "40px 0 24px", padding: "22px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 10px" };
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "22px 0 8px" };
const p: React.CSSProperties = { margin: "0 0 14px", lineHeight: 1.9, color: "#374151" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 760, fontSize: 14, background: "#fff" };
const th: React.CSSProperties = { padding: "8px 10px", border: "1px solid #e2e8f0", background: "#f1f5f9", fontWeight: 700, textAlign: "right", verticalAlign: "bottom", lineHeight: 1.4 };
const thLeft: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "8px 10px", border: "1px solid #e2e8f0", textAlign: "right", whiteSpace: "nowrap" };
const tdLeft: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const ul: React.CSSProperties = { margin: "0 0 10px", paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const note: React.CSSProperties = { margin: "10px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
