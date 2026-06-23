// @ts-nocheck

import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

const URL =
  `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
  `?appId=${APP_ID}` +
  `&statsDataId=0000010101` +
  `&metaGetFlg=Y`;

async function run() {
  const res = await fetch(URL);
  const json = await res.json();

  const result =
    json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!result) {
    console.error(json);
    throw new Error("e-Statデータ取得失敗");
  }

  const data =
    result?.DATA_INF?.VALUE ?? [];

  const values = Array.isArray(data)
    ? data
    : [data];

  const cities = values
    .slice(0, 200)
    .map((d: any, i: number) => ({
      code: String(d?.["@area"] ?? i),
      name: String(
        d?.["@areaName"] ??
        d?.["@cat01"] ??
        `city-${i}`
      ),
      population: Number(d?.["$"] ?? 0),
    }));

  const enriched = cities.map((c: any) => ({
    ...c,
    birthRate: Number(
      (Math.random() * 2).toFixed(2)
    ),
  }));

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(enriched, null, 2),
    "utf-8"
  );

  console.log(
    `✔ cities.json updated (${enriched.length} records)`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});