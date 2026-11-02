/**
 * 記事で並べて比べる都市の集合(100万人都市・70〜100万人都市・政令指定都市)。
 * 令和7年国勢調査にそろえた自治体データ(lib/city2025.ts)から選ぶ。東京23区は区ごとのデータなので含めない。
 */
import { getMunicipalities2025 } from "@/lib/city2025";
import { isDesignatedCity } from "@/lib/designatedCities";
import type { MunicipalCity } from "@/lib/metrics";

export type CitySetKind = "million" | "near" | "designated";

export function pickCities(kind: CitySetKind): MunicipalCity[] {
  const all = getMunicipalities2025();
  const list =
    kind === "million"
      ? all.filter((c) => c.population >= 1_000_000)
      : kind === "near"
        ? all.filter((c) => c.population >= 700_000 && c.population < 1_000_000)
        : all.filter((c) => isDesignatedCity(c.name));
  return list.sort((a, b) => b.population - a.population);
}
