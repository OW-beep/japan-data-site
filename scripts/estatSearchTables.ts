import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// e-Stat の統計表を検索するための汎用ヘルパースクリプト。
//
// 新しいランキング用データを追加したいとき、まずこれで
// 目的の統計表の statsDataId を特定してから、
// fetchXxx.ts 側にその ID をセットして実行する、という
// 2段階の使い方を想定している。
//
// 【使い方】
//   npx tsx scripts/estatSearchTables.ts "空き家 市区町村"
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。ローカル環境で
// ESTAT_APP_ID を .env.local に設定した上で実行してください。
// アプリケーションIDは https://www.e-stat.go.jp/mypage/app
// から無料で取得できます(要ユーザ登録)。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  const keyword = process.argv[2];

  if (!keyword) {
    console.error(
      '検索キーワードを指定してください。例: npx tsx scripts/estatSearchTables.ts "空き家 市区町村"'
    );
    process.exit(1);
  }

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList" +
    `?appId=${APP_ID}` +
    `&searchWord=${encodeURIComponent(keyword)}` +
    `&limit=30`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`e-Stat API エラー: HTTP ${res.status}`);
  }

  const json = await res.json();

  const result = json.GET_STATS_LIST?.DATALIST_INF;

  if (!result) {
    console.log("結果が見つかりませんでした。レスポンス:");
    console.log(JSON.stringify(json, null, 2));
    return;
  }

  const tables = Array.isArray(result.TABLE_INF)
    ? result.TABLE_INF
    : [result.TABLE_INF];

  console.log(`${tables.length} 件ヒット\n`);

  for (const t of tables) {
    console.log("----------------------------------------");
    console.log("statsDataId :", t["@id"]);
    console.log("統計名      :", t.STAT_NAME?.$ ?? t.STAT_NAME);
    console.log("表題        :", t.TITLE?.$ ?? t.TITLE);
    console.log("公開年月    :", t.SURVEY_DATE);
    console.log(
      "地域区分    :",
      t.OVERALL_TOTAL_NUMBER ?? "(不明)"
    );
  }

  console.log(
    "\n目的の表が見つかったら、statsDataId を fetchXxx.ts の" +
      "\n該当する定数にセットして実行してください。"
  );
}

main();
