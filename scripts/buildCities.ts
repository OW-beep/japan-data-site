import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

console.log("APP_ID =", APP_ID);

const URL =
  `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
  `?appId=${APP_ID}` +
  `&statsDataId=0000010101`;

async function run() {
  const res = await fetch(URL);
  const json = await res.json();

  console.log("=== API RESULT STATUS ===");
  console.log(json.GET_STATS_DATA.RESULT);

  const stat = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!stat) {
    console.error("❌ STATISTICAL_DATAが存在しない");
    return;
  }

  // ■ メタ情報（何のデータか）
  console.log("=== TABLE INFO ===");
  console.log(stat.TABLE_INF?.TITLE);

  // ■ 観測値（今はここが重要）
  const classes = stat.CLASS_INF?.CLASS_OBJ;

  console.log("=== CLASS INF SAMPLE ===");

  if (Array.isArray(classes)) {
    console.log(JSON.stringify(classes.slice(0, 5), null, 2));
  } else {
    console.log(classes);
  }

  // ■ 仮データ生成（まだランキング用ではない）
  const cities = (Array.isArray(classes) ? classes : [])
    .flatMap((obj: any) => {
      const list = obj.CLASS;

      if (!Array.isArray(list)) return [];

      return list.map((c: any) => ({
        code: c["@code"],
        name: c["@name"],
        unit: c["@unit"] || null,
        value: null, // ←まだ人口値は別取得が必要
      }));
    })
    .filter(Boolean);

  fs.writeFileSync(
    "./data/cities.json",
    JSON.stringify(cities, null, 2)
  );

  console.log("✅ temporary cities.json generated:", cities.length);
}

run();