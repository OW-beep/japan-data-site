import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 「社会・人口統計体系」から、市区町村別のごみのリサイクル率
// (H5614)を取得し、cities.json に recyclingRate として追加する。
//
// H5614は「一般廃棄物処理事業実態調査」に基づく、既に計算済みの
// 比率(%)のため、追加の分母データを取得する必要がない。
//
// 【統計表IDについて - 確認済み(2026-08-09)】
// npm run estat:meta -- 0000020208 の結果より。
//   statsDataId: 0000020208 (社会・人口統計体系 Ｈ 居住・市区町村)
//   cat01: H5614 (ごみのリサイクル率)
//   time : 2024100000(2024年度、最新)を優先。薄ければ
//          2023年度・2022年度の順にフォールバックする。
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0000020208";
const CAT01_CODE = "H5614"; // ごみのリサイクル率
const TIME_CANDIDATES = ["2024100000", "2023100000", "2022100000"];

async function fetchYear(timeCode: string): Promise<Map<string, number>> {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdCat01=${CAT01_CODE}` +
    `&cdTime=${timeCode}`;

  const res = await fetch(url);
  const json = await res.json();

  const status = json.GET_STATS_DATA?.RESULT?.STATUS;
  if (status !== 0 && status !== undefined) {
    console.log(
      `  [${timeCode}] データなし(STATUS=${status}: ${json.GET_STATS_DATA?.RESULT?.ERROR_MSG})`
    );
    return new Map();
  }

  const allRows = json.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  const rows: any[] = allRows ? (Array.isArray(allRows) ? allRows : [allRows]) : [];

  const map = new Map<string, number>();
  for (const row of rows) {
    const areaCode = row["@area"];
    const value = Number(row["$"]);
    if (!areaCode || !Number.isFinite(value)) continue;
    map.set(areaCode, value);
  }
  return map;
}

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  let chosenTime: string | null = null;
  let map: Map<string, number> = new Map();

  for (const timeCode of TIME_CANDIDATES) {
    console.log(`${timeCode} を試行中...`);
    const m = await fetchYear(timeCode);
    console.log(`  ${m.size} 件取得`);
    if (m.size > 1000) {
      chosenTime = timeCode;
      map = m;
      break;
    }
    console.log(`  → データが薄いため、次の年を試します。`);
  }

  if (!chosenTime) {
    console.error("有効なデータが見つかりませんでした。");
    return;
  }

  console.log(`\n採用した年度: ${chosenTime}(${map.size} 件)`);
  console.log("サンプル(東京都豊島区 13116):", map.get("13116") ?? "(データなし)");

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    const recyclingRate = map.get(city.code) ?? null;
    if (recyclingRate != null) matched++;
    return { ...city, recyclingRate };
  });

  console.log(`\n${matched} / ${cities.length} 自治体でマッチ`);

  if (matched < cities.length * 0.3) {
    console.warn(
      "マッチ率が低すぎます。地域コードの形式を確認してください。" +
        "(保存はスキップしました)"
    );
    return;
  }

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log("data/cities.json を更新しました。");
}

main();
