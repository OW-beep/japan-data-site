/**
 * 令和7年国勢調査(確定値)の市区町村別 総世帯数・単独世帯数。
 *
 * データの作り方: `npm run fetch:households2025`(scripts/fetchHouseholds2025.ts)
 *   → data/households-2025.json に [総世帯数, 単独世帯数] を保存する。
 *
 * ファイルが空(未取得)のときは、すべて「令和2年の人口・世帯数」の動きに戻るので、
 * 取得前でもサイトは壊れない。取得すると、使っているページが自動で令和7年に切り替わる。
 *
 * 世帯数のページは「人口÷世帯数」などの割り算なので、人口と世帯数の年は必ずそろえる。
 * 世帯数が令和2年のままのとき、人口だけを令和7年にしない(だから専用の関数を通す)。
 */
import raw from "@/data/households-2025.json";
import { getMunicipalities2025 } from "./city2025";
import { getMunicipalities } from "./municipalities";
import type { City } from "./City";

type Raw = {
  meta: { source: string; statsDataId: string; fetchedAt: string; coverage: number } | null;
  values: Record<string, [number, number | null]>;
};
const data = raw as unknown as Raw;

const MIN_SHARE = 0.9;

export type HouseholdBasis = { list: City[]; use2025: boolean; label: string };

/**
 * 世帯数を使うランキング用の自治体一覧。
 * @param needSingle 単独世帯数も必要か(単独世帯割合のランキングは true)
 */
export function getMunicipalitiesForHouseholds(needSingle: boolean): HouseholdBasis {
  const base = getMunicipalities2025();
  const ok = (c: City) => {
    const v = data.values[c.code];
    return !!v && v[0] > 0 && (!needSingle || (v[1] != null && v[1] > 0));
  };
  const covered = base.filter(ok);
  if (base.length > 0 && covered.length / base.length >= MIN_SHARE) {
    return {
      use2025: true,
      label: "令和7年国勢調査(確定値)",
      list: covered.map((c) => ({
        ...c,
        households: data.values[c.code][0],
        singleHouseholds: needSingle ? (data.values[c.code][1] as number) : (data.values[c.code][1] ?? c.singleHouseholds),
      })),
    };
  }
  return { use2025: false, label: "令和2年国勢調査", list: getMunicipalities() };
}
