import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_ID がありません");
}

// ------------------------------------------------------------------
// 「住民基本台帳に基づく人口、人口動態及び世帯数調査」
// (buildCities.ts が総人口・子ども人口・高齢者人口の取得に
//  使っているのと同じ統計表 ID)
//
// 社会・人口統計体系(SSDS)のコード体系では、人口増減率は
// 通常 "A1501"(人口増減率) というカテゴリコードで提供されています。
// ただし、この統計表(0000020201)で実際に使われているコード体系は
// buildCities.ts 内の A5101 / A5102 の使われ方(通常は「転入者数」
// 「転出者数」を指すコード)を見る限り、標準のSSDSコード表と
// 完全には一致していない可能性があります。
//
// ★ 実行前に必ず以下の手順で確認してください ★
// 1. 一度 `npx tsx scripts/buildDeclineRate.ts --list-categories` を実行し、
//    このスクリプトが出力する cat01 の一覧(コードと名前)を確認する
// 2. 「人口増減率」に該当するコードを探し、
//    下の RATE_CATEGORY_CODE を書き換える
// ------------------------------------------------------------------

const POP_STATS = "0000020201";

// 暫定値。実行前に必ず --list-categories で確認・修正してください。
const RATE_CATEGORY_CODE = "A1501";

async function fetchStats(
  statsId: string,
  code: string,
  type: "cat" | "tab"
) {
  const key = type === "cat" ? "cdCat01" : "cdTab";

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsId}` +
    `&${key}=${code}` +
    "&metaGetFlg=Y";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

async function fetchAllCategories(statsId: string) {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsId}` +
    "&metaGetFlg=Y&limit=1";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

function arr(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

async function listCategories() {
  console.log("カテゴリ一覧を取得中...");

  const meta = await fetchAllCategories(POP_STATS);

  const classObj = arr(
    meta.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  );

  const cat01 = classObj.find((x: any) => x["@id"] === "cat01");

  if (!cat01) {
    console.log("cat01 が見つかりませんでした。");
    return;
  }

  for (const c of arr(cat01.CLASS)) {
    console.log(`${c["@code"]}\t${c["@name"]}`);
  }

  console.log("");
  console.log(
    "↑ このリストから「人口増減率」に該当するコードを探し、"
  );
  console.log(
    "  RATE_CATEGORY_CODE 定数を書き換えてから再実行してください。"
  );
}

type City = {
  code: string;
  name: string;
  declineRate: number;
};

async function run() {
  console.log("人口増減率を取得中...");

  const rate = await fetchStats(
    POP_STATS,
    RATE_CATEGORY_CODE,
    "cat"
  );

  const classObj = arr(
    rate.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  );

  const areaObj = classObj.find((x: any) => x["@id"] === "area");

  const areaMap = new Map<string, string>();

  for (const c of arr(areaObj.CLASS)) {
    areaMap.set(String(c["@code"]), String(c["@name"]));
  }

  const cities: City[] = [];

  for (const r of arr(
    rate.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
  )) {
    const code = String(r["@area"]);

    cities.push({
      code,
      name: areaMap.get(code) ?? code,
      declineRate: Number(r["$"]),
    });
  }

  fs.writeFileSync(
    "data/declineRate.json",
    JSON.stringify(cities, null, 2)
  );

  console.log(
    `${cities.length}件の人口増減率データを data/declineRate.json に保存しました。`
  );
  console.log(
    "次に scripts/mergeData.ts と同様の方法で cities.json にマージしてください" +
      "(declineRate フィールドは lib/City.ts に既に定義済みです)。"
  );
}

if (process.argv.includes("--list-categories")) {
  listCategories();
} else {
  run();
}
