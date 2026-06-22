import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

// e-Stat API（人口データ例）
const URL =
  `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
  `?appId=${APP_ID}` +
  `&statsDataId=0000010101`; // 人口系統計ID（例）

async function fetchData() {
  const res = await fetch(URL);
  const json = await res.json();

  // ⚠️ 実際はここで整形必要
  const cities = json.GET_STATS_DATA.DATA_INF.DATA_OBJ.map((d: any) => ({
    code: d["@area"],
    name: d["@name"],
    population: Number(d["@value"]),
  }));

  fs.writeFileSync(
    "./data/cities.json",
    JSON.stringify(cities, null, 2)
  );

  console.log("cities.json updated");
}

fetchData();