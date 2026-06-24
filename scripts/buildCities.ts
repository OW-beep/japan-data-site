import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;
if (!APP_ID) throw new Error("ESTAT_APP_IDが未設定です");

const URL =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

async function fetch(cat: string) {
  const res = await fetch(
    `${URL}?appId=${APP_ID}` +
      `&statsDataId=0000020201` +
      `&cdCat01=${cat}` +
      `&metaGetFlg=Y`
  );

  const json = await res.json();
  return json?.GET_STATS_DATA?.STATISTICAL_DATA;
}

function toMap(values: any[]) {
  const arr = Array.isArray(values) ? values : [values];
  const map = new Map();

  for (const r of arr) {
    const area = r["@area"];
    const time = Number(r["@time"] ?? 0);

    if (!area) continue;

    const current = map.get(area);

    if (!current || time > Number(current["@time"] ?? 0)) {
      map.set(area, r);
    }
  }

  return map;
}

function buildAreaMap(statData: any) {
  const classObj = statData?.CLASS_INF?.CLASS_OBJ ?? [];

  const areaObj = classObj.find(
    (x: any) => x?.["@id"] === "area"
  );

  const list = areaObj?.CLASS ?? [];

  const arr = Array.isArray(list) ? list : [list];

  const map = new Map<string, string>();

  for (const a of arr) {
    map.set(String(a["@code"]), String(a["@name"]));
  }

  return map;
}

async function run() {
  console.log("fetching...");

  const stat = await fetch("A1101");

  if (!stat) throw new Error("データ取得失敗");

  const areaMap = buildAreaMap(stat);

  const values = stat?.DATA_INF?.VALUE ?? [];
  const rows = Array.isArray(values) ? values : [values];

  const latest = toMap(rows);

  const cities: any[] = [];

  for (const [code, row] of latest.entries()) {
    const population = Number(row["$"] ?? 0);

    if (!population) continue;

    cities.push({
      code,
      name: areaMap.get(code) ?? "不明", // ★ここが修正ポイント
      population,
    });
  }

  const filtered = cities
    .filter((c) => c.name && c.name !== "不明")
    .sort((a, b) => b.population - a.population);

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(filtered, null, 2),
    "utf8"
  );

  console.log("generated", filtered.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});