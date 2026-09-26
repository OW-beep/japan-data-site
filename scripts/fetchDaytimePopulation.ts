import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 「令和2年国勢調査」の市区町村別 昼間人口・夜間人口を取得し、
// cities.json に daytimePopulation / nighttimePopulation として
// 追加するスクリプト。
//
// なぜこの指標か:
// 「通勤時間」は社会生活基本調査(サンプル調査)でしか取れず、
// 都道府県・都市階級レベルまでしか公表されていないため、
// 市区町村単位では取得不可能と判断した。代わりに、同じ
// 「通勤・通学による人の移動」を映す指標として、国勢調査の
// 昼間人口・夜間人口(昼夜間人口比率)を採用する。飲食店密度
// 分析の記事で触れた「昼間人口」の実データがこれで揃う。
//
// 【統計表IDについて - 確認済み(2026-08-07)】
// npm run estat:search -- "従業地 通学地 市区町村" で確認。
//   0004003060
//   「常住地又は従業地・通学地別人口（夜間人口・昼間人口）－
//    全国，都道府県，市区町村（令和2年）」(公開年月 202001-202012)
//
// ただし、区分コード(@cat01 等)の中身(夜間人口・昼間人口を
// どう見分けるか)は、実行時のログ出力で確認済み。
//
// 【実行済み】既に実行済みで、data/cities.json の
// daytimePopulation / nighttimePopulation への反映は完了して
// いる。e-Stat側の統計が更新されない限り、再実行しても結果は
// 変わらない(冪等)。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;

const STATS_ID = "0004003060";

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`e-Stat API エラー: HTTP ${res.status}`);
  }

  const json = await res.json();

  const result = json.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!result) {
    console.error("想定外のレスポンス形式です:");
    console.error(JSON.stringify(json, null, 2).slice(0, 2000));
    return;
  }

  const values = result.DATA_INF.VALUE;
  const rows = Array.isArray(values) ? values : [values];

  console.log(`${rows.length} 行取得。先頭5件(区分コードの意味を確認):`);
  console.log(JSON.stringify(rows.slice(0, 5), null, 2));

  // 区分コード(@cat01)の値ごとに件数を集計して、
  // 「夜間人口」「昼間人口」がそれぞれ何個のコードに
  // 対応しているのか把握しやすくする。
  const cat01Counts = new Map<string, number>();
  for (const row of rows) {
    const key = row["@cat01"] ?? "(none)";
    cat01Counts.set(key, (cat01Counts.get(key) ?? 0) + 1);
  }
  console.log("\n@cat01 コードごとの件数(この中から夜間/昼間人口の");
  console.log("コードを目視で特定し、下の DAYTIME_CAT01 /");
  console.log("NIGHTTIME_CAT01 を書き換えてから再実行してください):");
  console.log(JSON.stringify(Object.fromEntries(cat01Counts), null, 2));

  // ✅ 確認済み(npm run estat:meta -- 0004003060 の結果より)
  const DAYTIME_CAT01 = "180"; // 従業地・通学地による人口_総数(昼間人口)
  const NIGHTTIME_CAT01 = "100"; // 常住地による人口_総数(夜間人口)

  const daytimeMap = new Map<string, number>();
  const nighttimeMap = new Map<string, number>();

  for (const row of rows) {
    const areaCode = row["@area"];
    const value = Number(row["$"]);
    if (!areaCode || !Number.isFinite(value)) continue;

    if (row["@cat01"] === DAYTIME_CAT01) {
      daytimeMap.set(areaCode, value);
    } else if (row["@cat01"] === NIGHTTIME_CAT01) {
      nighttimeMap.set(areaCode, value);
    }
  }

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    const daytimePopulation = daytimeMap.get(city.code) ?? null;
    const nighttimePopulation = nighttimeMap.get(city.code) ?? null;

    if (daytimePopulation != null && nighttimePopulation != null) {
      matched++;
    }

    return {
      ...city,
      daytimePopulation,
      nighttimePopulation,
    };
  });

  console.log(`\n${matched} / ${cities.length} 自治体でマッチ`);

  if (matched < cities.length * 0.5) {
    console.warn(
      "マッチ率が低いです。DAYTIME_CAT01 / NIGHTTIME_CAT01 の" +
        "値が実際のコードと違う可能性が高いので、上のログを" +
        "見て書き換えてから再実行してください。"
    );
    console.warn(
      "(まだ data/cities.json は書き換えていません。安全のため、" +
        "マッチ率が低い場合は保存をスキップします。)"
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
