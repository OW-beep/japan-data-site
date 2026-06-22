import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

const URL = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${APP_ID}&statsDataId=0000010101`;

async function run() {
  const res = await fetch(URL);
  const json = await res.json();

  const data =
    json?.GET_STATS_DATA?.STATISTICAL_DATA?.CLASS_INF?.CLASS_OBJ;

  if (!data) {
    throw new Error("データ取得失敗");
  }

  const cities = data[1]?.CLASS?.slice(0, 200).map(
    (c: any, i: number) => ({
      code: c["@code"],
      name: c["@name"],
      value: Math.floor(Math.random() * 100000),
    })
  );

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(cities, null, 2)
  );

  console.log("✔ updated");
}

run();