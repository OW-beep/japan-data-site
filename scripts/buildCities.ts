import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

const URL = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${APP_ID}&statsDataId=0000010101`;

async function run() {
  const res = await fetch(URL);
  const json = await res.json();

  const values =
    json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;

  if (!values) {
    throw new Error("データ取得失敗");
  }

  const cities = values[1]?.CLASS?.slice(0, 200).map(
    (item: any, i: number) => ({
      code: item["@code"],
      name: item["@name"],
      value: Math.floor(Math.random() * 100000), // 仮（後で人口に差し替え）
    })
  );

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(cities, null, 2)
  );

  console.log("✔ cities.json updated");
}

run();