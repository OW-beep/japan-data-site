import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const url =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
  `?appId=${APP_ID}` +
  "&statsDataId=0000010101" +
  "&cdCat01=A4103" +
  "&metaGetFlg=N";

const res = await fetch(url);

const json = await res.json();

console.log(
  JSON.stringify(
    json.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE.slice(0, 20),
    null,
    2
  )
);