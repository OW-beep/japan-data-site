import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const WORDS = [
  "人口動態 市区町村",
  "人口動態 市町村",
  "出生率 市区町村",
  "合計特殊出生率 市区町村",
  "人口動態統計 市区町村",
];

async function search(word: string) {

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList" +
    `?appId=${APP_ID}` +
    `&searchWord=${encodeURIComponent(word)}` +
    "&limit=20";

  console.log("\n======================");
  console.log(word);
  console.log("======================");

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const list =
    json?.GET_STATS_LIST
      ?.DATALIST_INF
      ?.TABLE_INF;

  const tables = Array.isArray(list)
    ? list
    : list
    ? [list]
    : [];

  console.log("件数:", tables.length);

  for (const t of tables) {

    console.log("================================");

    console.log(
      "統計ID:",
      t["@id"]
    );

    console.log(
      "統計名:",
      t.STAT_NAME?.["$"] ??
      t.STAT_NAME
    );

    console.log(
      "表名:",
      t.TITLE?.["$"] ??
      t.TITLE
    );

    console.log("--------------------------------");

  }

}

async function run() {

  for (const word of WORDS) {

    await search(word);

  }

}

run().catch(console.error);