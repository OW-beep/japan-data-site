/**
 * 新しい年の統計(医療施設調査2024・人口動態調査2024・住民基本台帳人口移動報告2025)。
 * data/estat-latest.json は `npm run fetch:estat-latest`(scripts/fetchEstatLatest.ts)が作る。
 *
 * cities.json は書き換えず、令和7年国勢調査の人口を使うページ(lib/city2025.ts)にだけ重ねる。
 * こうすると、分子(件数)と分母(人口)の年が近くなり、従来の値を使う記事とも混ざらない。
 *
 * 1つのグループ(medical / vital / migration)は、ほぼ全市町村の値が揃っているときだけ使う。
 * 揃っていなければ、そのグループは従来の値のまま(取得前でも動く)。
 */
import raw from "@/data/estat-latest.json";
import type { City } from "./City";

export type EstatGroup = "medical" | "vital" | "migration";

const KEYS: Record<EstatGroup, (keyof City)[]> = {
  medical: ["hospitalCount", "clinicCount", "dentalClinicCount"],
  vital: ["births", "deaths", "marriages", "divorces"],
  migration: ["inMigrants", "outMigrants"],
};

type Raw = {
  meta: Record<string, { year: number }> | null;
  values: Record<string, Record<string, number>>;
};
const data = raw as unknown as Raw;

/** 値がほぼ全市町村(約1,740のうち1,500以上)にあるグループだけ「使える」とみなす */
const MIN_CODES = 1500;

const applied = new Map<EstatGroup, number>();
for (const g of Object.keys(KEYS) as EstatGroup[]) {
  const year = data.meta?.[g]?.year;
  if (!year) continue;
  const first = KEYS[g][0] as string;
  const n = Object.values(data.values).filter((v) => v[first] != null).length;
  if (n >= MIN_CODES) applied.set(g, year);
}

/** そのグループの新しい年(使えない場合は null) */
export function estatLatestYear(g: EstatGroup): number | null {
  return applied.get(g) ?? null;
}

/** 使えるグループの値を、自治体に重ねる(値がない自治体は null にして、年が混ざらないようにする) */
export function applyEstatLatest(city: City): City {
  if (applied.size === 0) return city;
  const out: Record<string, unknown> = { ...city };
  const v = data.values[city.code];
  for (const g of applied.keys()) {
    for (const k of KEYS[g]) out[k as string] = v?.[k as string] ?? null;
  }
  return out as unknown as City;
}
