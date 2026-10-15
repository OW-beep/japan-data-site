/**
 * 自治体ページ用の「その自治体だけの」数字と文章の材料。
 *
 * 全国・都道府県内での順位、2020→2025年の変化、全国平均との差を、令和7年国勢調査から計算する。
 * 順位は「ランキングページと同じ対象(政令市の区・特別区部の集計行を除く)」で数える。
 * 政令指定都市の区(3語の名前)は対象外で、null を返す。
 */
import { getAgeRows, nationalRates, type AgeRow } from "./ageRates";

export type Insight = {
  code: string;
  name: string;
  short: string;
  pref: string;
  use2025: boolean;
  label: string;
  pop: number;
  pop2020: number;
  popChangePct: number;
  popRank: number;
  popRankInPref: number;
  prefCount: number;
  popChangeRank: number;
  total: number;
  elderlyRate: number;
  elderlyRate2020: number;
  elderlyRank: number;
  elderlyPref: number;
  elderlyNat: number;
  childRate: number;
  childRate2020: number;
  childRank: number;
  childPref: number;
  childNat: number;
  density: number | null;
  densityRank: number | null;
  financeIndex: number | null;
  financeRank: number | null;
  financeCount: number;
  /** 全国の中で際立つ指標(上位・下位10%以内)。最大3つ */
  standouts: { label: string; rank: number; of: number; top: boolean }[];
};

let cache: Map<string, Insight> | null = null;

function rankMap(rows: AgeRow[], value: (r: AgeRow) => number | null, desc = true) {
  const list = rows
    .map((r) => ({ code: r.code, v: value(r) }))
    .filter((x): x is { code: string; v: number } => x.v != null && Number.isFinite(x.v))
    .sort((a, b) => (desc ? b.v - a.v : a.v - b.v));
  const m = new Map<string, number>();
  list.forEach((x, i) => m.set(x.code, i + 1));
  return { rank: m, n: list.length };
}

function build(): Map<string, Insight> {
  const { rows, label, use2025 } = getAgeRows();
  const nat = nationalRates(rows);
  const total = rows.length;

  const change = (r: AgeRow) => (r.population > 0 ? ((r.pop - r.population) / r.population) * 100 : null);
  const density = (r: AgeRow) => (r.area && r.area > 0 ? r.pop / r.area : null);

  const pop = rankMap(rows, (r) => r.pop);
  const chg = rankMap(rows, change);
  const eld = rankMap(rows, (r) => r.elderlyRate);
  const chd = rankMap(rows, (r) => r.childRate);
  const den = rankMap(rows, density);
  const fin = rankMap(rows, (r) => r.financeIndex);

  // 都道府県ごとの合算
  const prefAgg = new Map<string, { pop: number; eld: number; chd: number; codes: string[] }>();
  for (const r of rows) {
    const p = r.name.split(" ")[0];
    const a = prefAgg.get(p) ?? { pop: 0, eld: 0, chd: 0, codes: [] };
    a.pop += r.pop;
    a.eld += r.elderly;
    a.chd += r.child;
    a.codes.push(r.code);
    prefAgg.set(p, a);
  }
  const prefPopRank = new Map<string, number>();
  for (const [, a] of prefAgg) {
    const sorted = a.codes.map((c) => rows.find((r) => r.code === c)!).sort((x, y) => y.pop - x.pop);
    sorted.forEach((r, i) => prefPopRank.set(r.code, i + 1));
  }

  const out = new Map<string, Insight>();
  for (const r of rows) {
    const pref = r.name.split(" ")[0];
    const short = r.name.split(" ").slice(1).join(" ");
    const a = prefAgg.get(pref)!;
    const ch = change(r) ?? 0;
    const d = density(r);

    const cand: { label: string; rank: number; of: number }[] = [
      { label: "人口", rank: pop.rank.get(r.code)!, of: pop.n },
      { label: "人口の増減率(2020→2025年)", rank: chg.rank.get(r.code)!, of: chg.n },
      { label: "高齢化率", rank: eld.rank.get(r.code)!, of: eld.n },
      { label: "子ども人口割合", rank: chd.rank.get(r.code)!, of: chd.n },
    ];
    if (d != null) cand.push({ label: "人口密度", rank: den.rank.get(r.code)!, of: den.n });
    if (r.financeIndex != null) cand.push({ label: "財政力指数", rank: fin.rank.get(r.code)!, of: fin.n });

    const standouts = cand
      .filter((c) => c.rank <= c.of * 0.1 || c.rank > c.of * 0.9)
      .map((c) => ({ ...c, top: c.rank <= c.of * 0.1 }))
      // 順位が両端に近いものを優先
      .sort((x, y) => Math.min(x.rank, x.of - x.rank) - Math.min(y.rank, y.of - y.rank))
      .slice(0, 3);

    out.set(r.code, {
      code: r.code,
      name: r.name,
      short,
      pref,
      use2025,
      label,
      pop: r.pop,
      pop2020: r.population,
      popChangePct: ch,
      popRank: pop.rank.get(r.code)!,
      popRankInPref: prefPopRank.get(r.code)!,
      prefCount: a.codes.length,
      popChangeRank: chg.rank.get(r.code)!,
      total,
      elderlyRate: r.elderlyRate,
      elderlyRate2020: r.elderlyRate2020,
      elderlyRank: eld.rank.get(r.code)!,
      elderlyPref: (a.eld / a.pop) * 100,
      elderlyNat: nat.elderly,
      childRate: r.childRate,
      childRate2020: r.childRate2020,
      childRank: chd.rank.get(r.code)!,
      childPref: (a.chd / a.pop) * 100,
      childNat: nat.child,
      density: d,
      densityRank: d != null ? den.rank.get(r.code)! : null,
      financeIndex: r.financeIndex,
      financeRank: r.financeIndex != null ? fin.rank.get(r.code)! : null,
      financeCount: fin.n,
      standouts,
    });
  }
  return out;
}

export function getCityInsight(code: string): Insight | null {
  if (!cache) cache = build();
  return cache.get(code) ?? null;
}
