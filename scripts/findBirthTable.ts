import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_ID がありません");
}

const STATS_ID = "0003411564";

async function run() {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    "&metaGetFlg=Y";

  console.log(url);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const classObj =
    json.GET_STATS_DATA
      ?.STATISTICAL_DATA
      ?.CLASS_INF
      ?.CLASS_OBJ;

  const list = Array.isArray(classObj)
    ? classObj
    : [classObj];

  const cat01 = list.find(
    (x: any) => x["@id"] === "cat01"
  );

  console.log("========== cat01 ==========");

  console.log(
    JSON.stringify(cat01, null, 2)
  );
}

run().catch(console.error);