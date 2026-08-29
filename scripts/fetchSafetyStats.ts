import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 都道府県別「刑法犯認知件数(人口千人あたり)」と
// 「交通事故発生件数(人口10万人あたり)」を e-Stat から取得し、
// data/prefectureStats.json に crimeRate / trafficAccidentRate
// フィールドとしてマージする。
//
// 【統計表ID確認済み】0000010211
//   社会・人口統計体系「K 安全」
//   (npm run estat:meta -- 0000010211 で確認)
//   #K06101 = 刑法犯認知件数(人口千人当たり)
//   #K04101 = 交通事故発生件数(人口10万人当たり)
//   都道府県単位のみ(市区町村単位のデータはない)。
//   2024年度まで収録されている比較的新しい統計。
//
// 【使い方】
//   npx tsx scripts/fetchSafetyStats.ts
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_ID = "0000010211";
const TIME_CANDIDATES = ["2024100000", "2023100000", "2022100000"];

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

async function fetchIndicator(
  cat01: string
): Promise<{ time: string; values: Map<string, number> } | null> {
  for (const time of TIME_CANDIDATES) {
    const url =
      `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData` +
      `?appId=${APP_ID}&statsDataId=${STATS_ID}` +
      `&cdCat01=${cat01}` +
      `&cdTime=${time}`;

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

    if (byPref.size >= 40) {
      console.log(`  ${time}: ${byPref.size} / 47 都道府県でマッチ`);
      return { time, values: byPref };
    }
    console.log(`  ${time}: データが薄い(${byPref.size}件)ため次の年を試します`);
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

  console.log("刑法犯認知件数(人口千人あたり)を取得中...");
  const crime = await fetchIndicator("%23K06101");

  console.log("交通事故発生件数(人口10万人あたり)を取得中...");
  const traffic = await fetchIndicator("%23K04101");

  if (!crime || !traffic) {
    console.warn(
      "十分なデータが取得できませんでした。cdCat01の指定方法" +
        "(#記号のURLエンコード)を見直してください。(保存はスキップしました)"
    );
    return;
  }

  let stats: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync("data/prefectureStats.json")) {
    stats = JSON.parse(fs.readFileSync("data/prefectureStats.json", "utf8"));
  }

  for (const pref of PREFECTURES) {
    stats[pref] = {
      ...(stats[pref] ?? {}),
      crimeRate: crime.values.get(pref) ?? null,
      crimeRateYear: crime.time,
      trafficAccidentRate: traffic.values.get(pref) ?? null,
      trafficAccidentRateYear: traffic.time,
    };
  }

  fs.writeFileSync(
    "data/prefectureStats.json",
    JSON.stringify(stats, null, 2),
    "utf8"
  );

  console.log(
    "\ndata/prefectureStats.json を更新しました。(crimeRate / trafficAccidentRate)"
  );
}

main();
