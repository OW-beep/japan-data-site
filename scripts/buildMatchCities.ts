/**
 * 街えらびマッチング(/tools/match)用のコンパクトな静的JSONを生成する。
 * 実行: npx tsx scripts/buildMatchCities.ts
 * 対象は index 対象の自治体(isCityIndexable)のみ。数値はすべて既存 lib の
 * 実データから算出し、丸めて data/match-cities.json に書き出す(150KB未満)。
 */
import { writeFileSync } from "fs";
import path from "path";
import { getMunicipalities2025 } from "../lib/city2025";
import { isCityIndexable } from "../lib/indexPolicy";
import { getTax } from "../lib/taxableIncome";
import { getRealEstatePriceRanking } from "../lib/realEstatePrice";

const round1 = (v: number) => Math.round(v * 10) / 10;
const round2 = (v: number) => Math.round(v * 100) / 100;

function buildPriceMap(): Map<string, number> {
  const map = new Map<string, number>();
  const wards = new Map<string, number[]>();
  getRealEstatePriceRanking().forEach((r) => {
    if (r.landPricePerSqm == null) return;
    map.set(r.code, r.landPricePerSqm);
    if (!r.code.endsWith("00")) {
      const cityCode = r.code.slice(0, 3) + "00";
      wards.set(cityCode, [...(wards.get(cityCode) ?? []), r.landPricePerSqm]);
    }
  });
  wards.forEach((v, k) => {
    if (!map.has(k)) map.set(k, v.reduce((a, b) => a + b, 0) / v.length);
  });
  return map;
}

function main() {
  const priceMap = buildPriceMap();
  const rows = getMunicipalities2025()
    .filter((c) => isCityIndexable(c.code))
    .map((c) => {
      const [pref, ...rest] = c.name.split(" ");
      const tax = getTax(c.code);
      return {
        c: c.code,
        n: rest.join(" ") || c.name,
        p: pref ?? "",
        pop: c.population,
        ag: round1(c.agingRate ?? (c.elderlyPopulation / c.population) * 100),
        inc: tax ? Math.round(tax.incomePerTaxpayer) : null,
        doc:
          c.doctorsCount != null
            ? Math.round((c.doctorsCount / c.population) * 100000)
            : null,
        land: priceMap.has(c.code) ? Math.round(priceMap.get(c.code)!) : null,
        fis: c.financeIndex != null ? round2(c.financeIndex) : null,
        day:
          c.daytimePopulation != null && c.nighttimePopulation
            ? Math.round((c.daytimePopulation / c.nighttimePopulation) * 100)
            : null,
        ch: round1((c.childPopulation / c.population) * 100),
        dc:
          c.daycareCount != null && c.daycareCount > 0
            ? Math.round(c.childPopulation / c.daycareCount)
            : null,
        ret:
          c.retailStoreCount != null
            ? round1((c.retailStoreCount / c.population) * 10000)
            : null,
      };
    })
    .sort((a, b) => b.pop - a.pop);

  const out = path.join(process.cwd(), "data", "match-cities.json");
  const json = JSON.stringify(rows);
  writeFileSync(out, json);
  console.log(`wrote ${rows.length} cities, ${(json.length / 1024).toFixed(1)} KB -> ${out}`);
}

main();
