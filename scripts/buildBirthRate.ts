import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const BASE =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

// 社会・人口統計体系
const STATS_ID = "0000010101";

// 合計特殊出生率
const CAT = "A4103";

async function fetchBirthRate() {
  const url =
    `${BASE}` +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdCat01=${CAT}` +
    `&metaGetFlg=Y`;

  console.log(url);

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

async function run() {

  const json = await fetchBirthRate();

  const classObj = arr(
    json.GET_STATS_DATA
      ?.STATISTICAL_DATA
      ?.CLASS_INF
      ?.CLASS_OBJ
  );

  const areaObj = classObj.find(
    (x: any) => x["@id"] === "area"
  );

  const areaMap = new Map<string,string>();

  for (const c of arr(areaObj.CLASS)) {
    areaMap.set(c["@code"], c["@name"]);
  }

  const rows = arr(
    json.GET_STATS_DATA
      ?.STATISTICAL_DATA
      ?.DATA_INF
      ?.VALUE
  );

  console.log("件数", rows.length);

  const birthMap = new Map<string,number>();

  for (const r of rows) {

    const code = String(r["@area"]);

    const value = Number(r["$"]);

    if (Number.isNaN(value)) continue;

    birthMap.set(code, value);

  }

  const cities =
    JSON.parse(
      fs.readFileSync(
        "data/cities.json",
        "utf8"
      )
    );

  const merged = cities.map((c:any)=>({

    ...c,

    birthRate:
      birthMap.has(c.code)
        ? birthMap.get(c.code)
        : null

  }));

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged,null,2),
    "utf8"
  );

  console.log("出生率追加完了");

}

run().catch(console.error);