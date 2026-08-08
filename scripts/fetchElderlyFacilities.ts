import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 「社会・人口統計体系」から、市区町村別の老人ホーム数
// (介護老人福祉施設+養護老人ホーム+有料老人ホームの合算)を
// 取得し、cities.json に elderlyHomeCount として追加する。
//
// 【経緯・確認済み(2026-08-08)】
// 当初候補にしていた J232101(老人ホーム数・合算)は2007年度
// までしかデータがなく古すぎたため、診断の結果、以下3項目が
// いずれも2023年度・全1913件で揃っていることを確認した。
// この3つを合算することで、最新かつ「老人ホーム数(合算)」に
// 近い実態を再現する。
//   - J230127 介護老人福祉施設数(基本票)
//   - J230411 養護老人ホーム数(基本票)
//   - J230421 有料老人ホーム数(基本票)
//   time: 2023100000 (2023年度)
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0000020210";
const TIME_CODE = "2023100000";

const CATEGORIES = [
  { code: "J230127", label: "介護老人福祉施設数" },
  { code: "J230411", label: "養護老人ホーム数" },
  { code: "J230421", label: "有料老人ホーム数" },
];

async function fetchCategory(code: string): Promise<Map<string, number>> {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdCat01=${code}` +
    `&cdTime=${TIME_CODE}`;

  const res = await fetch(url);
  const json = await res.json();

  const status = json.GET_STATS_DATA?.RESULT?.STATUS;
  if (status !== 0 && status !== undefined) {
    throw new Error(
      `e-Stat APIエラー(${code}, STATUS=${status}): ${json.GET_STATS_DATA?.RESULT?.ERROR_MSG}`
    );
  }

  const allRows = json.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  const rows: any[] = Array.isArray(allRows) ? allRows : [allRows];

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

  const maps: Map<string, number>[] = [];

  for (const { code, label } of CATEGORIES) {
    console.log(`${label}(${code})を取得中...`);
    const map = await fetchCategory(code);
    console.log(`  ${map.size} 件取得`);
    maps.push(map);
  }

  // サンプル確認: 東京都千代田区(13101)の内訳を表示
  console.log("\nサンプル(東京都千代田区 13101)の内訳:");
  CATEGORIES.forEach(({ label }, i) => {
    console.log(`  ${label}: ${maps[i].get("13101") ?? "(データなし)"}`);
  });

  const allAreaCodes = new Set<string>();
  for (const map of maps) {
    for (const code of map.keys()) allAreaCodes.add(code);
  }

  const summed = new Map<string, number>();
  for (const areaCode of allAreaCodes) {
    let total = 0;
    let hasAny = false;
    for (const map of maps) {
      const v = map.get(areaCode);
      if (v != null) {
        total += v;
        hasAny = true;
      }
    }
    if (hasAny) summed.set(areaCode, total);
  }

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    const elderlyHomeCount = summed.get(city.code) ?? null;
    if (elderlyHomeCount != null) matched++;
    return { ...city, elderlyHomeCount };
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
