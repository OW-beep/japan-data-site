import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;
if (!APP_ID) throw new Error("ESTAT_APP_IDが未設定です");

const BASE_URL =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

async function fetchData(cat: string) {
  const url =
    `${BASE_URL}?appId=${APP_ID}` +
    `&statsDataId=0000020201` +
    `&cdCat01=${cat}` +
    `&metaGetFlg=Y`;

  const res = await fetch(url);
  const json = await res.json();

  return json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? [];
}

function normalize(values: any[]) {
  const rows = Array.isArray(values) ? values : [values];

  const latest = new Map<string, any>();

  for (const r of rows) {
    const area = r["@area"];
    const time = Number(r["@time"] ?? 0);

    if (!area) continue;

    const current = latest.get(area);

    if (!current || time > Number(current["@time"] ?? 0)) {
      latest.set(area, r);
    }
  }

  return latest;
}

async function run() {
  console.log("fetching real e-Stat data...");

  // 👶 子ども人口
  const childRaw = await fetchData("A1301");
  const childMap = normalize(childRaw);

  // 🧓 高齢者人口
  const agedRaw = await fetchData("A1303");
  const agedMap = normalize(agedRaw);

  // 🧍 総人口
  const popRaw = await fetchData("A1101");
  const popMap = normalize(popRaw);

  const cities: any[] = [];

  for (const [code, row] of popMap.entries()) {
    const population = Number(row["$"] ?? 0);

    const child = Number(childMap.get(code)?.["$"] ?? 0);
    const aged = Number(agedMap.get(code)?.["$"] ?? 0);

    if (!population) continue;

    cities.push({
      code,
      name: String(row["@areaName"] ?? code),
      population,
      childPopulation: child,
      agedPopulation: aged,
      childRate: child / population,
      agedRate: aged / population,
    });
  }

  const filtered = cities
    .filter((c) => c.population > 0)
    .sort((a, b) => b.population - a.population);

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(filtered, null, 2),
    "utf8"
  );

  console.log("generated:", filtered.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});