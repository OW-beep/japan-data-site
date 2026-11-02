import Link from "next/link";
import {
  FUTURE_META,
  FUTURE_YEARS,
  HAMADORI_NAMES,
  futureRank,
  getFuture,
  popIndex2050,
} from "@/lib/futurePopulation";

/**
 * 自治体ページの「2050年までの将来人口」。
 *
 * 国立社会保障・人口問題研究所の推計(令和2年国勢調査を基準、出生中位・死亡中位)を、棒グラフと表で示す。
 * 文章の数字は、すべて推計データから計算する(自治体ごとに内容が変わる)。
 * 推計は「将来の見通し」であって、確定した未来ではない。令和7年国勢調査の実績が分かる場合は、2025年の推計と比べる。
 */
export default function CityFuture({
  code,
  name,
  actual2025,
}: {
  code: string;
  /** 「都道府県 市区町村」の形の名前 */
  name: string;
  /** 令和7年国勢調査の人口(分かる場合) */
  actual2025?: number;
}) {
  const f = getFuture(code);
  const parts = name.trim().split(/\s+/);
  const city = parts[parts.length - 1];

  if (!f) {
    if (parts[0] === "福島県" && HAMADORI_NAMES.includes(city)) {
      return (
        <section style={wrap} aria-label="将来人口">
          <h2 style={h2}>{city}の将来人口</h2>
          <p style={p}>
            {city}は、福島県「浜通り地域」の13市町村の1つです。東日本大震災に伴う原子力発電所の事故の影響が
            大きく、長期に及んでいるため、国立社会保障・人口問題研究所の将来推計では、市町村ごとの推計がなく、
            13市町村をまとめた1つの地域として推計されています。
          </p>
        </section>
      );
    }
    return null;
  }

  const fmt = (v: number) => (v >= 10_000 ? `${(v / 10_000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万人` : `${v.toLocaleString("ja-JP")}人`);
  const idx = popIndex2050(f);
  const diff = f.pop[6] - f.pop[0];
  const eld20 = f.elderly[0];
  const eld50 = f.elderly[6];
  const rank = futureRank(code);
  const est25 = f.pop[1];
  const gap = actual2025 != null && est25 > 0 ? ((actual2025 - est25) / est25) * 100 : null;

  // 棒グラフ
  const W = 640;
  const H = 230;
  const padL = 12;
  const padR = 12;
  const padT = 34;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxV = Math.max(...f.pop, actual2025 ?? 0) * 1.05;
  const slot = plotW / f.pop.length;
  const barW = slot * 0.58;
  const y = (v: number) => padT + plotH - (v / maxV) * plotH;
  const r1 = (v: number) => Math.round(v * 10) / 10;

  const summary = `${city}の推計人口。2020年${fmt(f.pop[0])}から、2050年には${fmt(f.pop[6])}(2020年の${idx.toFixed(0)}%)になる推計です。`;

  // 読者向けの手がかり(数字から決まる)
  const hints: string[] = [];
  if (eld50 >= 40) hints.push("2050年に、住民の4割以上が65歳以上になる推計です。介護・医療・移動の支援の計画を、自治体の高齢者向けの計画(介護保険事業計画など)で確認してください。");
  else if (eld50 >= 35) hints.push("高齢化が進む推計です。介護や見守りの体制の計画を、自治体の高齢者向けの計画で確認してください。");
  if (idx < 80) hints.push("2050年までに、人口が2割以上減る推計です。公共サービスをどう維持するかの計画は、自治体の総合計画や人口ビジョンで確認できます。");
  else if (idx >= 100) hints.push("人口が保たれる(増える)推計です。保育や学校、道路などの整備が、人口に追いつくかを、自治体の計画で確認してください。");
  if (f.child[6] < f.child[0] - 2) hints.push("子ども(0〜14歳)の割合が、2ポイント以上下がる推計です。学校の統廃合や、子育て支援の計画を、教育委員会や自治体の公式サイトで確認してください。");

  return (
    <section style={wrap} aria-labelledby={`future-${code}`}>
      <h2 id={`future-${code}`} style={h2}>
        {city}の将来人口(2050年まで)
      </h2>

      <p style={p}>
        国立社会保障・人口問題研究所の推計では、{city}の人口は、2020年の{fmt(f.pop[0])}から、2050年には
        <strong>{fmt(f.pop[6])}</strong>(2020年の{idx.toFixed(0)}%、{fmt(Math.abs(diff))}{diff < 0 ? "の減少" : "の増加"})になります。
        65歳以上の割合は、{eld20.toFixed(1)}%から{eld50.toFixed(1)}%
        {eld50 >= eld20 ? "へ上がる" : "へ下がる"}推計で、0〜14歳の割合は、{f.child[0].toFixed(1)}%から{f.child[6].toFixed(1)}%になります。
        {rank && (
          <>
            {" "}
            2050年の人口が2020年の何%になるかを、推計のある{rank.total.toLocaleString()}市区町村で比べると、
            {city}は高い方から{rank.rank.toLocaleString()}位です(中央値は{rank.median.toFixed(0)}%)。
          </>
        )}
      </p>

      <figure style={{ margin: "14px 0 6px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} style={{ width: "100%", height: "auto", display: "block", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <title>{summary}</title>
          <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#cbd5e1" />
          {f.pop.map((v, i) => {
            const cx = padL + slot * i + slot / 2;
            const top = y(v);
            const isBase = i === 0;
            return (
              <g key={FUTURE_YEARS[i]}>
                <rect x={r1(cx - barW / 2)} y={r1(top)} width={r1(barW)} height={r1(padT + plotH - top)} fill={isBase ? "#475569" : "#60a5fa"} rx={3} />
                <text x={r1(cx)} y={r1(top) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">
                  {fmt(v)}
                </text>
                <text x={r1(cx)} y={H - 12} textAnchor="middle" fontSize={12} fill="#475569">
                  {FUTURE_YEARS[i]}年
                </text>
              </g>
            );
          })}
          {actual2025 != null && (
            <line
              x1={r1(padL + slot * 1 + slot / 2 - barW / 2 - 3)}
              x2={r1(padL + slot * 1 + slot / 2 + barW / 2 + 3)}
              y1={r1(y(actual2025))}
              y2={r1(y(actual2025))}
              stroke="#dc2626"
              strokeWidth={3}
            />
          )}
        </svg>
        <figcaption style={cap}>
          灰色は令和2年国勢調査の実績、青は推計です。
          {actual2025 != null && "2025年の赤い線は、令和7年国勢調査の実績です。"}
        </figcaption>
      </figure>

      {gap != null && (
        <p style={p}>
          令和7年国勢調査の実績は{fmt(actual2025!)}で、2025年の推計({fmt(est25)})より、{Math.abs(gap).toFixed(1)}%
          {gap >= 0 ? "多く" : "少なく"}なりました。
        </p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={thL}>年</th>
              <th style={th}>総人口</th>
              <th style={th}>2020年比</th>
              <th style={th}>0〜14歳</th>
              <th style={th}>65歳以上</th>
              <th style={th}>75歳以上</th>
            </tr>
          </thead>
          <tbody>
            {FUTURE_YEARS.map((yr, i) => (
              <tr key={yr}>
                <td style={tdL}>{yr}年{i === 0 ? "(実績)" : "(推計)"}</td>
                <td style={td}>{f.pop[i].toLocaleString("ja-JP")}人</td>
                <td style={td}>{((f.pop[i] / f.pop[0]) * 100).toFixed(1)}%</td>
                <td style={td}>{f.child[i].toFixed(1)}%</td>
                <td style={td}>{f.elderly[i].toFixed(1)}%</td>
                <td style={td}>{f.old75[i].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hints.length > 0 && (
        <>
          <h3 style={h3}>この見通しの使い方</h3>
          <ul style={ul}>
            {hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}

      <p style={cap}>
        この推計は、令和2(2020)年の国勢調査を基準に、{FUTURE_META.assumption}の仮定でつくった「将来の見通し」で、
        確定した未来ではありません。出典:
        <a href={FUTURE_META.url} target="_blank" rel="noopener noreferrer" style={link}>
          国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5(2023)年推計)」(外部サイト)
        </a>
        。ほかの自治体との比較は、
        <Link prefetch={false} href="/compare" style={link}>
          自治体比較ツール
        </Link>
        が使えます。
      </p>
    </section>
  );
}

const wrap: React.CSSProperties = { margin: "28px 0", padding: "20px 18px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 10px" };
const h3: React.CSSProperties = { fontSize: 17, fontWeight: 700, margin: "18px 0 6px" };
const p: React.CSSProperties = { margin: "0 0 12px", lineHeight: 1.9, color: "#374151" };
const ul: React.CSSProperties = { margin: "0 0 10px", paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const cap: React.CSSProperties = { fontSize: 13, color: "#6b7280", lineHeight: 1.8, margin: "6px 0 0" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 480, fontSize: 14, background: "#fff" };
const th: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e2e8f0", background: "#f1f5f9", fontWeight: 700, textAlign: "right" };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e2e8f0", textAlign: "right", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
