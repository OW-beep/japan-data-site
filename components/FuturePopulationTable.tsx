import Link from "next/link";
import { pickCities, type CitySetKind } from "@/lib/citySets";
import { estimateGap2025, getFuture, popIndex2050 } from "@/lib/futurePopulation";
import { shortName } from "@/lib/crossAnalysis";

/**
 * 「2050年の姿」の表(「100万人都市」「80〜90万人都市」「政令指定都市」の記事用)。
 * 国立社会保障・人口問題研究所の推計(令和2年国勢調査を基準、出生中位・死亡中位)から、
 * 都市ごとの将来の人口と高齢化率を並べ、2025年の推計と、令和7年国勢調査の実績の差も示す。
 * 推計は「将来の見通し」であり、確定した未来ではない。東京23区は区ごとのデータのため含めない。
 */
export default function FuturePopulationTable({
  kind,
  heading,
  lead,
}: {
  kind: CitySetKind;
  heading: string;
  lead: string;
}) {
  const rows = pickCities(kind)
    .map((c) => ({ c, f: getFuture(c.code), gap: estimateGap2025(c.code) }))
    .filter((r): r is { c: (typeof r)["c"]; f: NonNullable<(typeof r)["f"]>; gap: number | null } => r.f != null);
  if (rows.length < 3) return null;

  const man = (v: number) => `${(v / 10_000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万人`;
  const line = (r: (typeof rows)[number]) => shortName(r.c.name);

  const byIndex = [...rows].sort((a, b) => popIndex2050(b.f) - popIndex2050(a.f));
  const keep = byIndex[0];
  const drop = byIndex[byIndex.length - 1];
  const grow = rows.filter((r) => popIndex2050(r.f) >= 100);

  // 100万人都市: 2050年も100万人以上を保つか
  const threshold = kind === "million" ? 1_000_000 : null;
  const stay = threshold ? rows.filter((r) => r.f.pop[6] >= threshold) : [];
  const fall = threshold ? rows.filter((r) => r.f.pop[6] < threshold) : [];

  const gapRows = rows.filter((r) => r.gap != null) as (typeof rows[number] & { gap: number })[];
  const gapUp = gapRows.length ? gapRows.reduce((a, b) => (b.gap > a.gap ? b : a)) : null;
  const gapDown = gapRows.length ? gapRows.reduce((a, b) => (b.gap < a.gap ? b : a)) : null;

  return (
    <section aria-labelledby={`future-${kind}`} style={wrap}>
      <h2 id={`future-${kind}`} style={h2}>
        {heading}
      </h2>
      <p style={p}>{lead}</p>

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={thL}>都市</th>
              <th style={th}>2025年(実績)</th>
              <th style={th}>2035年(推計)</th>
              <th style={th}>2050年(推計)</th>
              <th style={th}>2050年の指数(2020年=100)</th>
              <th style={th}>2050年の65歳以上の割合</th>
              <th style={th}>2025年の推計との差</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const idx = popIndex2050(r.f);
              return (
                <tr key={r.c.code}>
                  <td style={tdL}>
                    <Link prefetch={false} href={`/city/${r.c.code}`} style={link}>
                      {line(r)}
                    </Link>
                  </td>
                  <td style={td}>{man(r.c.population)}</td>
                  <td style={td}>{man(r.f.pop[3])}</td>
                  <td style={{ ...td, fontWeight: 700, color: threshold && r.f.pop[6] < threshold ? "#b91c1c" : undefined }}>
                    {man(r.f.pop[6])}
                  </td>
                  <td style={{ ...td, background: idx >= 100 ? "#dcfce7" : idx < 85 ? "#fee2e2" : undefined }}>{idx.toFixed(0)}</td>
                  <td style={td}>{r.f.elderly[6].toFixed(1)}%</td>
                  <td style={td}>{r.gap == null ? "—" : `${r.gap >= 0 ? "+" : ""}${r.gap.toFixed(1)}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={note}>
        指数は、2050年の推計人口が、2020年の人口の何%にあたるかです(100を超えると、増える推計)。
        「2025年の推計との差」は、令和7年国勢調査の実績が、2025年の推計より何%多かったか(マイナスは少なかった)を表します。
        「—」は、データがない項目です。東京23区は、区ごとのデータのため、この表には含めていません。
      </p>

      <h3 style={h3}>この表から読み取れること</h3>
      <ul style={ul}>
        {threshold && (
          <li>
            2050年も100万人以上を保つ推計の都市は、{stay.map((r) => line(r)).join("、") || "ありません"}です。
            {fall.length > 0 && (
              <>
                {" "}
                100万人を割る推計の都市は、
                {fall.map((r) => `${line(r)}(${man(r.c.population)}→${man(r.f.pop[6])})`).join("、")}です。
              </>
            )}
          </li>
        )}
        <li>
          2050年の人口が最も保たれる推計の都市は{line(keep)}(2020年の{popIndex2050(keep.f).toFixed(0)}%)、
          最も減る推計の都市は{line(drop)}(同{popIndex2050(drop.f).toFixed(0)}%)です。
          {grow.length > 0 && <> 2020年より増える推計の都市は、{grow.map((r) => line(r)).join("、")}です。</>}
        </li>
        {gapUp && gapDown && gapRows.length >= 3 && (
          <li>
            2025年の実績が、推計を最も上回ったのは{line(gapUp)}(+{gapUp.gap.toFixed(1)}%)、最も下回ったのは{line(gapDown)}(
            {gapDown.gap.toFixed(1)}%)です。推計は、5年間の動きを予想したものなので、実際の人口の動きとは、ずれることがあります。
          </li>
        )}
      </ul>
      {kind === "million" && (
        <p style={{ ...note, fontSize: 14 }}>
          <Link prefetch={false} href="/articles/future-million-cities" style={link}>
            くわしい分析: 100万人都市は2050年にどうなる?(75歳以上の増加、全国の市の見通しも) →
          </Link>
        </p>
      )}
      <p style={note}>
        この推計は、令和2(2020)年の国勢調査を基準に、出生中位・死亡中位の仮定でつくった「将来の見通し」で、確定した未来ではありません。
        出典:国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5(2023)年推計)」。
      </p>
    </section>
  );
}

const wrap: React.CSSProperties = { margin: "40px 0 24px", padding: "22px 20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 10px" };
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "22px 0 8px" };
const p: React.CSSProperties = { margin: "0 0 14px", lineHeight: 1.9, color: "#374151" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 760, fontSize: 14, background: "#fff" };
const th: React.CSSProperties = { padding: "8px 10px", border: "1px solid #d1d5db", background: "#f1f5f9", fontWeight: 700, textAlign: "right", verticalAlign: "bottom", lineHeight: 1.4 };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "8px 10px", border: "1px solid #d1d5db", textAlign: "right", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const ul: React.CSSProperties = { margin: "0 0 10px", paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const note: React.CSSProperties = { margin: "10px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
