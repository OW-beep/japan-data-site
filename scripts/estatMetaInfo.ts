import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 指定した statsDataId の「区分コード定義」を取得するツール。
//
// 統計表のレスポンスに出てくる @cat01, @cat02, @area などの
// コード(例: "100", "110"...)が実際に何を意味するのかは、
// レスポンス本体には含まれておらず、別の getMetaInfo API で
// 調べる必要がある。このスクリプトはそれを一覧表示する。
//
// 【使い方】
//   npx tsx scripts/estatMetaInfo.ts 0004003060
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  const statsDataId = process.argv[2];

  if (!statsDataId) {
    console.error(
      "statsDataId を指定してください。例: npx tsx scripts/estatMetaInfo.ts 0004003060"
    );
    process.exit(1);
  }

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getMetaInfo" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsDataId}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`e-Stat API エラー: HTTP ${res.status}`);
  }

  const json = await res.json();

  const objs = json.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ;

  if (!objs) {
    console.log("メタ情報が見つかりませんでした。レスポンス:");
    console.log(JSON.stringify(json, null, 2).slice(0, 3000));
    return;
  }

  const list = Array.isArray(objs) ? objs : [objs];

  for (const obj of list) {
    console.log("==========================================");
    console.log(`分類ID: ${obj["@id"]}  分類名: ${obj["@name"]}`);
    console.log("------------------------------------------");

    const classes = Array.isArray(obj.CLASS) ? obj.CLASS : [obj.CLASS];

    for (const c of classes) {
      // area(地域)は件数が多いので、先頭10件だけ表示
      if (obj["@id"] === "area" && classes.indexOf(c) >= 10) continue;
      console.log(`  ${c["@code"]}  =  ${c["@name"]}`);
    }

    if (obj["@id"] === "area" && classes.length > 10) {
      console.log(`  ...ほか ${classes.length - 10} 件(地域コードは省略)`);
    }
  }

  console.log(
    "\n上の一覧から、目的の区分(例:夜間人口/昼間人口)に対応する" +
      "\nコードを探し、fetchXxx.ts 側の定数に反映してください。"
  );
}

main();
