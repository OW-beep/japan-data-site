/**
 * 市町村ページ(/city/[code])用の「令和7年国勢調査にそろえた」自治体データ。
 *
 * 人口・人口密度・子ども人口・65歳以上人口・高齢化率を令和7年(確定値)に差し替える。
 * 面積・出生率・財政力指数など、国勢調査ではない項目はそのまま(公表年は項目ごとに異なる)。
 *
 * ・2025年の人口が9割以上の自治体で取れていないときは、2020年のままにする(混在させない)。
 * ・agingRate(高齢化率)は元データ(cities.json)に入っていなかった(全自治体で未設定)ため、
 *   ここで 65歳以上人口 ÷ 人口 から作る。これで、ページの「高齢化率 -」が数字になり、順位も付く。
 */
import { getCities } from "./getCities";
import { getMunicipalities } from "./municipalities";
import { getAgeGroups2025, getPopulationBasis } from "./population2025";
import { applyEstatLatest, estatLatestYear } from "./estatLatest";
import type { City } from "./City";

type Built = {
  all: City[];
  byCode: Map<string, City>;
  municipalities: City[];
  use2025: boolean;
};

let cache: Built | null = null;

function build(): Built {
  const base = getCities();
  const basis = getPopulationBasis(base.map((c) => c.code));

  const all = base.map((c): City => {
    const out: City = { ...c };
    if (basis.use2025) {
      const pop = basis.population(c.code, c.population);
      out.population = pop;
      if (c.area != null && c.area > 0) out.populationDensity = Math.round(pop / c.area);
      const g = getAgeGroups2025(c.code);
      if (g) {
        out.childPopulation = g.child;
        out.elderlyPopulation = g.elderly;
      }
    }
    if (out.population > 0 && out.elderlyPopulation != null) {
      out.agingRate = Math.round((out.elderlyPopulation / out.population) * 1000) / 10;
    }
    // 新しい年の件数(病院・出生など)があれば重ねる(lib/estatLatest.ts)。人口は令和7年なので、年が近くなる
    return applyEstatLatest(out);
  });

  const byCode = new Map(all.map((c) => [c.code, c]));
  // ランキングページと同じ基準(政令指定都市の区・東京都特別区部の集計行を除く)
  const muniCodes = new Set(getMunicipalities().map((c) => c.code));
  const municipalities = all.filter((c) => muniCodes.has(c.code));
  return { all, byCode, municipalities, use2025: basis.use2025 };
}

function get(): Built {
  if (!cache) cache = build();
  return cache;
}

export function getCities2025(): City[] {
  return get().all;
}

export function getMunicipalities2025(): City[] {
  return get().municipalities;
}

export function getCity2025(code: string): City | undefined {
  return get().byCode.get(code);
}

export function uses2025(): boolean {
  return get().use2025;
}

/**
 * 転入者数・転出者数を使うランキング(入れ替わり率)用。
 * 2025年の転入・転出が取得済みなら「2025年の転入出 ÷ 令和7年の人口」、
 * 未取得なら従来どおり令和2年の人口の一覧に戻す(年がずれた割り算にしないため)。
 */
export function getMunicipalitiesForMigration(): { list: City[]; use2025: boolean } {
  if (estatLatestYear("migration") != null) return { list: getMunicipalities2025(), use2025: true };
  return { list: getMunicipalities(), use2025: false };
}
