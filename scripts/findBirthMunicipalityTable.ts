import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const url =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
  `?appId=${APP_ID}` +
  "&statsDataId=0000010101" +
  "&metaGetFlg=Y";

async function run() {

  const json = await fetch(url).then(r => r.json());

  fs.writeFileSync(
    "classInfo.json",
    JSON.stringify(
      json.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF,
      null,
      2
    ),
    "utf8"
  );

  console.log("classInfo.json を出力しました");

}

run().catch(console.error);