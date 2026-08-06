import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const KEYWORD = "出生";

async function run() {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList" +
    `?appId=${APP_ID}` +
    `&searchWord=${encodeURIComponent(KEYWORD)}` +
    "&limit=100";

  console.log(url);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const list =
    json?.GET_STATS_LIST?.DATALIST_INF?.TABLE_INF;

  const tables = Array.isArray(list)
    ? list
    : list
    ? [list]
    : [];

  console.log(`件数: ${tables.length}`);
  console.log("======================================");

  for (const t of tables) {
    console.log("統計ID :", t["@id"]);
    console.log("統計名 :", t.STAT_NAME?.["$"]);
    console.log("表名   :", t.TITLE?.["$"]);
    console.log("--------------------------------------");
  }
}

run().catch(console.error);