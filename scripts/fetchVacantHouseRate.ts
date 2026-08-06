import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 「令和5年住宅・土地統計調査」から、市区町村別の空き家数・
// 総住宅数を取得し、cities.json に vacantHouseCount /
// totalHousingCount として追加するスクリプト。
//
// なぜ空き家率か:
// 「空き家問題」は近年の日本で最も検索・関心が集まる自治体
// データの1つでありながら、本サイトではまだ扱っていない
// テーマ。総務省統計局「住宅・土地統計調査」(5年ごと実施)を
// 使えば、全国の自治体を横断的に比較できる。
//
// 【重要な制約】
// この調査で市区町村単位の結果が公表されるのは「市・区、
// および人口1万5千人以上の町村」のみで、それ未満の小規模な
// 町村は対象外(総務省統計局の公表方針による)。そのため
// data/cities.json の全1,910行が埋まるわけではない点に
// 注意すること。
//
// 【統計表IDについて - 確認済み(2026-08-06)】
// npm run estat:search で実際に検索し、令和5年(2023年)
// 住宅・土地統計調査・市区町村単位のデータであることを
// 確認済み。
//   - 空き家数: 0004021631
//     「腐朽･破損の有無 空き家の種類(4区分)、腐朽・破損の
//      有無(2区分)、建て方(2区分)、構造(2区分)別空き家数－
//      全国、都道府県、市区町村」(公開年月 202310)
//   - 総住宅数: 0004021421
//     「住宅及び世帯総数 居住世帯の有無(8区分)別住宅数－
//      全国、都道府県、市区町村」(公開年月 202310)
//
// ただし、実際にレスポンスを取得して中身(区分コードの
// 絞り込みが必要かどうか、地域コードの桁数)を確認するのは
// 未検証。fetchStatsData() 内のログ出力を必ず確認しながら
// 実行すること。
//
// 実行前に、必ず scripts/estatSearchTables.ts で
//   npx tsx scripts/estatSearchTables.ts "空き家 市区町村"
//   npx tsx scripts/estatSearchTables.ts "住宅総数 市区町村"
// を実行し、正しい statsDataId に置き換えてから使うこと。
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。ローカル環境で実行し、
// 取得件数・値の妥当性を確認してから data/cities.json への
// マージを反映してください。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;

// 確認済み(上記コメント参照)。
const VACANT_HOUSE_STATS_ID = "0004021631";
const TOTAL_HOUSING_STATS_ID = "0004021421";

type StatRow = {
  areaCode: string;
  value: number;
};

async function fetchStatsData(
  statsDataId: string
): Promise<StatRow[]> {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsDataId}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `e-Stat API エラー(${statsDataId}): HTTP ${res.status}`
    );
  }

  const json = await res.json();

  const result = json.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!result) {
    console.error(
      "想定外のレスポンス形式です。手動で確認してください:"
    );
    console.error(JSON.stringify(json, null, 2).slice(0, 2000));
    return [];
  }

  const values = result.DATA_INF.VALUE;
  const rows = Array.isArray(values) ? values : [values];

  // 「総数」以外の区分(腐朽・破損あり/なし等)が混在している
  // 可能性が高いテーブルなので、実際に取得できたレスポンスを
  // 見ながら、目的の行(通常は各区分コードが "00" = 総数と
  // なっている行)だけを絞り込む必要がある。ここでは仮に
  // area コードごとに最初に見つかった値を採用しているが、
  // 必ず1件ログ出力して中身を確認すること。
  console.log(
    "サンプル行(先頭3件、区分コードの絞り込みが必要か確認):"
  );
  console.log(JSON.stringify(rows.slice(0, 3), null, 2));

  const map = new Map<string, number>();

  for (const row of rows) {
    const areaCode = row["@area"];
    const value = Number(row["$"]);

    if (!areaCode || !Number.isFinite(value)) continue;
    if (map.has(areaCode)) continue; // 最初の1件を仮採用

    map.set(areaCode, value);
  }

  return Array.from(map.entries()).map(([areaCode, value]) => ({
    areaCode,
    value,
  }));
}

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  if (!TOTAL_HOUSING_STATS_ID) {
    console.error(
      "TOTAL_HOUSING_STATS_ID が未設定です。" +
        "scripts/estatSearchTables.ts で「住宅総数 市区町村」を検索し、" +
        "このファイル冒頭の定数にセットしてから再実行してください。"
    );
    process.exit(1);
  }

  console.log("空き家数を取得中...");
  const vacantRows = await fetchStatsData(VACANT_HOUSE_STATS_ID);
  console.log(`${vacantRows.length} 件取得`);

  console.log("総住宅数を取得中...");
  const totalRows = await fetchStatsData(TOTAL_HOUSING_STATS_ID);
  console.log(`${totalRows.length} 件取得`);

  const vacantMap = new Map(
    vacantRows.map((r) => [r.areaCode, r.value])
  );
  const totalMap = new Map(
    totalRows.map((r) => [r.areaCode, r.value])
  );

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    // e-Stat の地域コードは5桁(例: "13101")。
    // cities.json の code もゼロ埋め5桁のはずだが、
    // 実際のレスポンスのコード桁数は必ず確認すること。
    const vacantHouseCount = vacantMap.get(city.code) ?? null;
    const totalHousingCount = totalMap.get(city.code) ?? null;

    if (vacantHouseCount != null && totalHousingCount != null) {
      matched++;
    }

    return {
      ...city,
      vacantHouseCount,
      totalHousingCount,
    };
  });

  console.log(`${matched} / ${cities.length} 自治体でマッチ`);

  if (matched < cities.length * 0.3) {
    console.warn(
      "マッチ率が低すぎます。地域コードの桁数・形式が" +
        "一致していない可能性が高いので、マージ前に" +
        "サンプル行のログを見て areaCode の形式を確認してください。"
    );
  }

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log("data/cities.json を更新しました。");
}

main();
