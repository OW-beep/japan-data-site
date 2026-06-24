import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

/**
 * e-Stat statsDataId（人口系）
 * ※このIDはデータセットで変わる可能性あり
 */
const STATS_ID = "0000020201";

/**
 * カテゴリ（重要）
 * A1101 = 総人口
 * A5101 = 年少人口（0-14歳）
 * A5102 = 老年人口（65歳以上）
 */

async function fetchData(cat: string) {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdCat01=${cat}` +
    "&metaGetFlg=Y";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

function toArray(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

async function run() {
  console.log("fetching e-Stat...");

  const popJson = await fetchData("A1101");
  const childJson = await fetchData("A5101");
  const elderlyJson = await fetchData("A5102");

  const popRows =
    toArray(popJson?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE);

  const childRows =
    toArray(childJson?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE);

  const elderlyRows =
    toArray(elderlyJson?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE);

  const popClass =
    popJson?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;

  const classList = toArray(popClass);

  const areaClass = classList.find(
    (x: any) => x?.["@id"] === "area"
  );

  const areaList = toArray(areaClass?.CLASS);

  const areaMap = new Map<string, string>();

  for (const a of areaList) {
    if (!a) continue;

    areaMap.set(
      String(a["@code"]),
      String(a["@name"])
    );
  }

  /**
   * 統合マップ
   */
  const map = new Map<
    string,
    {
      code: string;
      population: number;
      childPopulation: number;
      elderlyPopulation: number;
    }
  >();

  function ensure(code: string) {
    if (!map.has(code)) {
      map.set(code, {
        code,
        population: 0,
        childPopulation: 0,
        elderlyPopulation: 0,
      });
    }
    return map.get(code)!;
  }

  /**
   * 総人口
   */
  for (const r of popRows) {
    const code = String(r["@area"]);
    ensure(code).population = Number(r["$"] ?? 0);
  }

  /**
   * 子ども人口
   */
  for (const r of childRows) {
    const code = String(r["@area"]);
    ensure(code).childPopulation = Number(r["$"] ?? 0);
  }

  /**
   * 高齢者人口
   */
  for (const r of elderlyRows) {
    const code = String(r["@area"]);
    ensure(code).elderlyPopulation = Number(r["$"] ?? 0);
  }

  const cities = Array.from(map.values())
    .map((c) => ({
      code: c.code,
      name: areaMap.get(c.code) ?? c.code,
      population: c.population,
      childPopulation: c.childPopulation,
      elderlyPopulation: c.elderlyPopulation,
    }))
    .filter((c) => c.population > 0);

  /**
   * ソートはUIでやらない（重要）
   * → データ側で整形
   */
  const sorted = cities.sort(
    (a, b) => b.population - a.population
  );

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(sorted, null, 2),
    "utf8"
  );

  console.log("generated:", sorted.length, "cities");
  console.log(sorted.slice(0, 10));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});