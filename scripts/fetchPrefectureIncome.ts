import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 都道府県別「平均年収」を e-Stat から取得し、
// data/prefectureStats.json に income フィールドとしてマージする。
//
// 【統計表ID確認済み】0003426933
//   賃金構造基本統計調査「令和2年以降 一般_都道府県別_年齢階級別DB」
//   (npm run estat:meta -- 0003426933 で確認)
//
// 年収は「所定内給与額(月額) × 12か月 + 年間賞与その他特別給与額」
// で概算する。対象は男女計・年齢計・企業規模計(10人以上)・産業計。
//
// 【使い方】
//   npx tsx scripts/fetchPrefectureIncome.ts
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0003426933";
const TIME_CODE = "2023000000"; // 2023年(最新)

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

async function fetchTab(tab: string): Promise<Map<string, number>> {
  const url =
    `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
    `?appId=${APP_ID}&statsDataId=${STATS_ID}` +
    `&cdTab=${tab}` + // 10=所定内給与額 / 12=年間賞与その他特別給与額
    `&cdCat01=01` + // 男女計
    `&cdCat02=01` + // 年齢計
    `&cdCat03=01` + // 企業規模計(10人以上)
    `&cdCat04=01` + // 産業計
    `&cdTime=${TIME_CODE}`;

  const res = await fetch(url);
  const json = await res.json();

  const values = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? [];
  const list: unknown[] = Array.isArray(values) ? values : [values];

  const byPref = new Map<string, number>();
  for (const raw of list) {
    const v = raw as Record<string, string>;
    const areaName = v["@areaname"] ?? v["@area"];
    const value = Number(v["$"]);
    if (!areaName || Number.isNaN(value)) continue;
    const matched = PREFECTURES.find((p) => areaName.includes(p));
    if (matched) byPref.set(matched, value);
  }
  return byPref;
}

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  console.log("所定内給与額(月額)を取得中...");
  const monthly = await fetchTab("10");
  console.log(`  ${monthly.size} / 47 都道府県でマッチ`);

  console.log("年間賞与その他特別給与額を取得中...");
  const bonus = await fetchTab("12");
  console.log(`  ${bonus.size} / 47 都道府県でマッチ`);

  if (monthly.size < 40 || bonus.size < 40) {
    console.warn(
      "マッチ率が低すぎます。cdTime(年)を見直すか、estat:meta で" +
        "分類コードを再確認してください。(保存はスキップしました)"
    );
    return;
  }

  let stats: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync("data/prefectureStats.json")) {
    stats = JSON.parse(fs.readFileSync("data/prefectureStats.json", "utf8"));
  }

  for (const pref of PREFECTURES) {
    const m = monthly.get(pref);
    const b = bonus.get(pref);
    const income = m != null && b != null ? Math.round(m * 12 + b) : null;
    stats[pref] = {
      ...(stats[pref] ?? {}),
      income,
    };
  }

  fs.writeFileSync(
    "data/prefectureStats.json",
    JSON.stringify(stats, null, 2),
    "utf8"
  );

  console.log("\ndata/prefectureStats.json を更新しました。(income)");
}

main();
