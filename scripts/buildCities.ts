import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;
if (!APP_ID) throw new Error("ESTAT_APP_IDが未設定です");

const BASE_URL =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

async function fetchEstat(url: string) {
  const res = await globalThis.fetch(url); // ★これが重要

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
}

async function run() {
  console.log("fetching...");

  const url =
    `${BASE_URL}?appId=${APP_ID}` +
    `&statsDataId=0000020201` +
    `&cdCat01=A1101` +
    `&metaGetFlg=Y`;

  const json = await fetchEstat(url);

  const stat = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!stat) throw new Error("データ取得失敗");

  const values = stat?.DATA_INF?.VALUE ?? [];
  const rows = Array.isArray(values) ? values : [values];

  const latest = new Map<string, any>();

  for (const r of rows) {
    const area = r["@area"];
    const time = Number(r["@time"] ?? 0);

    if (!area) continue;

    const cur = latest.get(area);

    if (!cur || time > Number(cur["@time"] ?? 0)) {
      latest.set(area, r);
    }
  }

  const cities = [...latest.values()]
    .map((r) => ({
      code: String(r["@area"]),
      name: String(r["@areaName"] ?? r["@area"]),
      population: Number(r["$"] ?? 0),
    }))
    .filter((c) => c.population > 0)
    .sort((a, b) => b.population - a.population);

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(cities, null, 2),
    "utf8"
  );

  console.log("generated", cities.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});