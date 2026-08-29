import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 都道府県別「平均寿命(男女別)」を e-Stat から取得し、
// data/prefectureStats.json に lifeExpectancyMale /
// lifeExpectancyFemale フィールドとしてマージする。
//
// 【統計表IDについて - 未確認】
// 候補は厚生労働省「都道府県別生命表」(5年ごと公表、最新は
// 令和2年(2020年)版)。以下のコマンドで実際の statsDataId を
// 検索してから、STATS_ID に設定すること。
//
//   npm run estat:search -- "都道府県別生命表"
//
// 【使い方】
//   1. 上記コマンドで STATS_ID を特定し、下の定数を書き換える
//   2. .env.local に ESTAT_APP_ID を設定
//   3. npx tsx scripts/fetchLifeExpectancy.ts
//
// 【注意】api.e-stat.go.jp への通信が必要。Claude の実行環境
// (サンドボックス)からはこのドメインへ到達できないため、
// このスクリプトは未実行・未検証です。5年に1度しか更新されない
// 統計のため、他のランキングと違い「更新日」の扱いに注意
// (meta.json の updatedAt とは別に、この指標だけの調査年を
// MetricBox の source.dataYear で明示すること)。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0000000000"; // ← estat:search で調べた実際のIDに書き換える

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

async function main() {
  if (!APP_ID) {
    console.error(
      "ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。"
    );
    process.exit(1);
  }

  if (STATS_ID === "0000000000") {
    console.error(
      "STATS_ID が未設定のままです。npm run estat:search -- \"都道府県別生命表\" " +
        "で調べてから、このファイル冒頭の STATS_ID を書き換えてください。"
    );
    process.exit(1);
  }

  const url =
    `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
    `?appId=${APP_ID}&statsDataId=${STATS_ID}`;

  console.log("取得中:", url);

  const res = await fetch(url);
  const json = await res.json();

  const values =
    json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE ?? [];

  if (!Array.isArray(values) || values.length === 0) {
    console.error(
      "データが取得できませんでした。statsDataId・パラメータを見直してください。"
    );
    console.log(JSON.stringify(json).slice(0, 500));
    return;
  }

  // 男女別の区分がメタ情報のどのコードに対応するかは、実際の
  // レスポンスを見て調整が必要(@cat01 が性別区分という想定で
  // 仮実装している)。
  const maleByPref = new Map<string, number>();
  const femaleByPref = new Map<string, number>();

  for (const v of values) {
    const areaName: string | undefined = v["@areaname"] ?? v["@area"];
    const sexCode: string | undefined = v["@cat01"];
    const value = Number(v["$"]);
    if (!areaName || Number.isNaN(value)) continue;

    const matched = PREFECTURES.find((p) => areaName.includes(p));
    if (!matched) continue;

    if (sexCode === "1") maleByPref.set(matched, value);
    if (sexCode === "2") femaleByPref.set(matched, value);
  }

  console.log(
    `\n男性: ${maleByPref.size} / 47、女性: ${femaleByPref.size} / 47 都道府県でマッチ`
  );

  if (maleByPref.size < 40 || femaleByPref.size < 40) {
    console.warn(
      "マッチ率が低すぎます。@cat01 の意味(性別コード)を " +
        "npm run estat:meta -- <statsDataId> で確認してください。(保存はスキップしました)"
    );
    console.log(JSON.stringify(values[0], null, 2));
    return;
  }

  let stats: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync("data/prefectureStats.json")) {
    stats = JSON.parse(fs.readFileSync("data/prefectureStats.json", "utf8"));
  }

  for (const pref of PREFECTURES) {
    stats[pref] = {
      ...(stats[pref] ?? {}),
      lifeExpectancyMale: maleByPref.get(pref) ?? null,
      lifeExpectancyFemale: femaleByPref.get(pref) ?? null,
    };
  }

  fs.writeFileSync(
    "data/prefectureStats.json",
    JSON.stringify(stats, null, 2),
    "utf8"
  );

  console.log(
    "data/prefectureStats.json を更新しました。(lifeExpectancyMale / lifeExpectancyFemale)"
  );
}

main();
