import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_ID がありません");
}

// ------------------------------------
// e-Stat ID
// ------------------------------------

const POP_STATS = "0000020201";

async function fetchStats(
  statsId: string,
  code: string,
  type: "cat" | "tab"
) {
  const key =
    type === "cat"
      ? "cdCat01"
      : "cdTab";

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsId}` +
    `&${key}=${code}` +
    "&metaGetFlg=Y";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

function arr(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

type City = {
  code: string;
  name: string;

  population: number;

  childPopulation: number;

  elderlyPopulation: number;

  financeIndex: number | null;
};

const map = new Map<string, City>();

function ensure(code: string) {
  if (!map.has(code)) {
    map.set(code, {
      code,
      name: "",

      population: 0,

      childPopulation: 0,

      elderlyPopulation: 0,

      financeIndex: null,
    });
  }

  return map.get(code)!;
}

async function run() {

  console.log("人口取得...");

  const pop = await fetchStats(
    POP_STATS,
    "A1101",
    "cat"
  );

  const child = await fetchStats(
    POP_STATS,
    "A5101",
    "cat"
  );

  const old = await fetchStats(
    POP_STATS,
    "A5102",
    "cat"
  );

  const classObj = arr(
    pop.GET_STATS_DATA
      .STATISTICAL_DATA
      .CLASS_INF
      .CLASS_OBJ
  );

  const areaObj = classObj.find(
    (x: any) => x["@id"] === "area"
  );

  const areaMap = new Map<string, string>();

  for (const c of arr(areaObj.CLASS)) {
    areaMap.set(
      String(c["@code"]),
      String(c["@name"])
    );
  }

  // --------------------
  // 総人口
  // --------------------

  for (const r of arr(
    pop.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.population = Number(r["$"]);

  }

  // --------------------
  // 子ども人口
  // --------------------

  for (const r of arr(
    child.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.childPopulation =
      Number(r["$"]);

  }

  // --------------------
  // 高齢者人口
  // --------------------

  for (const r of arr(
    old.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.elderlyPopulation =
      Number(r["$"]);

  }
  // --------------------
  // JSON生成
  // --------------------

  const cities = Array.from(map.values())
    .map((c) => ({
      ...c,

      name:
        areaMap.get(c.code) ??
        c.code,
    }))
    .filter(
      (c) => c.population > 0
    )
    .sort(
      (a, b) =>
        b.population - a.population
    );

  fs.mkdirSync("data", {
    recursive: true,
  });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(
      cities,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `generated ${cities.length} cities`
  );

}

run().catch(console.error);