import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 「住民基本台帳人口移動報告」から、市区町村別の20代(20〜24歳+
// 25〜29歳)の転入超過数を取得し、cities.json に
// youngAdultNetMigration として追加するスクリプト。
//
// 「進学・就職を機に若者がどこへ移動しているか」を示す指標。
// 婚姻率・単独世帯割合ランキングの記事とテーマ的に近い。
//
// 【統計表IDについて - 確認済み(2026-08-09)】
// npm run estat:meta -- 0003419945 の結果より。
//   statsDataId: 0003419945
//   「住民基本台帳人口移動報告」年齢(5歳階級)別 市区町村
//   tab   : 04 (転入超過数)
//   cat01 : 205(20〜24歳) + 206(25〜29歳) を合算
//   cat02 : 0 (男女総数)
//   cat03 : 60000 (移動者総数、日本人+外国人)
//   time  : 2025年を優先。データが薄ければ2024年にフォールバック。
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0003419945";

const AGE_CODES = ["205", "206"]; // 20〜24歳, 25〜29歳
const TIME_CANDIDATES = ["2025000000", "2024000000"];

async function fetchAgeGroup(
  ageCode: string,
  timeCode: string
): Promise<Map<string, number>> {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdTab=04` +
    `&cdCat01=${ageCode}` +
    `&cdCat02=0` +
    `&cdCat03=60000` +
    `&cdTime=${timeCode}`;

  const res = await fetch(url);
  const json = await res.json();

  const status = json.GET_STATS_DATA?.RESULT?.STATUS;
  if (status !== 0 && status !== undefined) {
    console.log(
      `  [${ageCode} / ${timeCode}] データなし(STATUS=${status}: ${json.GET_STATS_DATA?.RESULT?.ERROR_MSG})`
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
  let combined: Map<string, number> = new Map();

  for (const timeCode of TIME_CANDIDATES) {
    console.log(`\n${timeCode} を試行中...`);
    const maps: Map<string, number>[] = [];
    for (const ageCode of AGE_CODES) {
      const m = await fetchAgeGroup(ageCode, timeCode);
      console.log(`  年齢コード${ageCode}: ${m.size} 件`);
      maps.push(m);
    }

    if (maps.every((m) => m.size > 1000)) {
      // 20〜24歳・25〜29歳の両方を合算
      const allAreas = new Set<string>();
      for (const m of maps) for (const a of m.keys()) allAreas.add(a);

      const sum = new Map<string, number>();
      for (const area of allAreas) {
        let total = 0;
        let hasAny = false;
        for (const m of maps) {
          const v = m.get(area);
          if (v != null) {
            total += v;
            hasAny = true;
          }
        }
        if (hasAny) sum.set(area, total);
      }

      chosenTime = timeCode;
      combined = sum;
      break;
    } else {
      console.log(`  → ${timeCode} はデータが薄いため、次の年を試します。`);
    }
  }

  if (!chosenTime) {
    console.error("有効なデータが見つかりませんでした。");
    return;
  }

  console.log(`\n採用した年: ${chosenTime}(${combined.size} 件)`);

  console.log("\nサンプル(東京都豊島区 13116 / 秋田県 05000):");
  console.log("  豊島区:", combined.get("13116") ?? "(データなし)");

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    const youngAdultNetMigration = combined.get(city.code) ?? null;
    if (youngAdultNetMigration != null) matched++;
    return { ...city, youngAdultNetMigration };
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
