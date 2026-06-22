import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

// e-Stat（人口系）
const URL =
  `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
  `?appId=${APP_ID}` +
  `&statsDataId=0000010101` +
  `&metaGetFlg=Y` +
  `&cdCat01=A1101`; // 総人口

async function run() {
  const res = await fetch(URL);
  const json = await res.json();

  const result = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!result) {
    throw new Error("e-Statデータ取得失敗");
  }

  const classObj = result.CLASS_INF?.CLASS_OBJ;
  const data = result.DATA_INF?.VALUE;

  if (!data) {
    throw new Error("VALUEデータなし");
  }

  // 都道府県 or 市区町村単位で整形
  const cities = data.slice(0, 200).map((d: any, i: number) => {
    return {
      code: d["@area"] ?? String(i),
      name: d["@areaName"] ?? `city-${i}`,
      population: Number(d["$"] ?? 0),
    };
  });

  // 出生率は仮計算（後で拡張可能）
  const enriched = cities.map((c) => ({
    ...c,
    birthRate: Number((Math.random() * 2).toFixed(2)),
  }));

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(enriched, null, 2),
    "utf-8"
  );

  console.log("✔ cities.json updated from e-Stat");
}

run();