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

// tab=10/12(所定内給与額・年間賞与)は空だったため、同じ内容の
// 別系列である tab=42/44 を使う(estat:metaで両方"所定内給与額"
// 等の同名ラベルが重複しているうち、42/44側に実データがあった)。
const TAB_MONTHLY = "42"; // 所定内給与額
const TAB_BONUS = "44"; // 年間賞与その他特別給与額

// cat02(年齢階級)は 01=年齢計 が空の場合に備えて候補を用意。
// 01が使えれば全年齢の平均、ダメなら30～34歳(現役世代の目安)で代替する。
const AGE_CANDIDATES = ["01", "05"];

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

async function fetchTab(
  tab: string
): Promise<{ age: string; values: Map<string, number> } | null> {
  for (const age of AGE_CANDIDATES) {
    const url =
      `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
      `?appId=${APP_ID}&statsDataId=${STATS_ID}` +
      `&cdTab=${tab}` +
      `&cdCat01=01` + // 男女計
      `&cdCat02=${age}` +
      `&cdCat03=01` + // 企業規模計(10人以上)
      `&cdCat04=01` + // 産業計
      `&cdTime=${TIME_CODE}`;

    console.log("  URL:", url);

    const res = await fetch(url);
    const json = await res.json();

    const result = json?.GET_STATS_DATA?.RESULT;
    if (result && result.STATUS !== 0) {
      console.log("  API STATUS:", result.STATUS, result.ERROR_MSG);
    }

    const values = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? [];
    const list: unknown[] = Array.isArray(values) ? values : [values];
    console.log(`  年齢コード${age}: 取得件数(生) ${list.length}`);

    if (list.length === 0) continue;

    const byPref = new Map<string, number>();
    for (const raw of list) {
      const v = raw as Record<string, string>;
      const areaCode = v["@area"];
      const value = Number(v["$"]);
      if (!areaCode || Number.isNaN(value)) continue;
      const idx = PREFECTURES.findIndex(
        (_, i) => String((i + 1) * 1000).padStart(5, "0") === areaCode
      );
      if (idx >= 0) byPref.set(PREFECTURES[idx], value);
    }

    if (byPref.size >= 40) {
      console.log(`  年齢コード${age}で確定: ${byPref.size} / 47 都道府県`);
      return { age, values: byPref };
    }
  }
  return null;
}

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  console.log("所定内給与額(月額)を取得中...");
  const monthly = await fetchTab(TAB_MONTHLY);

  console.log("年間賞与その他特別給与額を取得中...");
  const bonus = await fetchTab(TAB_BONUS);

  if (!monthly || !bonus) {
    console.warn(
      "十分なデータが取得できませんでした。tabコードや年齢コードの" +
        "候補を見直してください。(保存はスキップしました)"
    );
    return;
  }

  if (monthly.age !== bonus.age) {
    console.warn(
      `月額給与(年齢コード${monthly.age})と賞与(年齢コード${bonus.age})で` +
        "異なる年齢区分が使われています。年収の算出には適さないため中止します。"
    );
    return;
  }

  console.log(
    `\n年齢区分コード ${monthly.age} (${
      monthly.age === "01" ? "年齢計" : "30〜34歳"
    }) のデータを使用します。`
  );

  let stats: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync("data/prefectureStats.json")) {
    stats = JSON.parse(
      fs.readFileSync("data/prefectureStats.json", "utf8").replace(/^\uFEFF/, "")
    );
  }

  for (const pref of PREFECTURES) {
    const m = monthly.values.get(pref);
    const b = bonus.values.get(pref);
    const income = m != null && b != null ? Math.round(m * 12 + b) : null;
    stats[pref] = {
      ...(stats[pref] ?? {}),
      income,
      incomeAgeGroup: monthly.age === "01" ? "全年齢" : "30〜34歳",
    };
  }

  fs.writeFileSync(
    "data/prefectureStats.json",
    "\uFEFF" + JSON.stringify(stats, null, 2),
    "utf8"
  );

  console.log("\ndata/prefectureStats.json を更新しました。(income)");
}

main();
