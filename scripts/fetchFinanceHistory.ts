import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 財政力指数の「経年推移」を取得し、data/cities.json に
// financeIndexHistory: [{ year: "2023", value: 1.65 }, ...] として
// マージする。
//
// 背景: lib/socialStat.ts の getFinanceIndex() は
//   statsDataId=0003172920 (地方財政状況調査), cdTab=100700 (財政力指数)
// を叩いており、このAPIレスポンス自体には複数年度の @time 行が
// 含まれているはずだが、scripts/mergeFinance.ts 側で
//   if (String(r["@time"]) !== latestTime) continue;
// と、最新年度以外を全て捨てていたため、経年推移データが一度も
// 保存されていなかった。このスクリプトは同じAPI呼び出しを流用し、
// 「最新年度だけ残す」フィルタを外して全年度を保持する。
//
// 【未検証】api.e-stat.go.jp への通信が必要なため、ローカル環境で
// 実行して動作確認すること。特に以下を確認:
//   1. レスポンスに実際に何年度分の @time が含まれているか
//      (ログに出力される「取得できた年度一覧」を確認)
//   2. lib/socialStat.ts の TIME = "2018100000" は cdTime指定用の
//      定数だが、このスクリプトでは cdTime を指定せず全年度を
//      要求する形にしている(下記 fetchAllYears 参照)。もし
//      e-Stat側が cdTime 未指定だと全件を返さない・エラーになる
//      仕様であれば、年度候補を配列で明示的に列挙して1年ずつ
//      呼び出す方式に切り替える必要がある。
// ------------------------------------------------------------------

const APP_ID = process.env.ESTAT_APP_ID!;
const BASE = "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";
const STATS_ID = "0003172920"; // 地方財政状況調査
const TAB = "100700"; // 財政力指数

async function fetchAllYears() {
  // cdTime を指定しないことで、全年度分のレコードを一括取得する。
  const url =
    `${BASE}` +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdTab=${TAB}` +
    `&metaGetFlg=Y`;

  console.log(url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

function toArray(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// e-Stat の @time コード(例: "2023100000")を表示用年度に変換
function timeCodeToYear(timeCode: string): string {
  return timeCode.slice(0, 4);
}

async function main() {
  console.log("財政力指数の経年推移を取得中...");

  const json = await fetchAllYears();

  const rows = toArray(
    json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE
  );

  const years = Array.from(
    new Set(rows.map((r: any) => String(r["@time"])))
  ).sort();

  console.log(`取得できた年度一覧(${years.length}件):`, years.map(timeCodeToYear));

  if (years.length <= 1) {
    console.warn(
      "警告: 年度が1件以下しか取得できませんでした。cdTime未指定では" +
        "最新年度しか返らない仕様の可能性があります。その場合は" +
        "年度候補を配列で列挙し、1年ずつ cdTime を指定して呼び出す" +
        "方式に書き換えてください(fetchPrefectureIncome.ts の" +
        "ループ処理パターンを参考にしてください)。"
    );
  }

  // area(市区町村コード) → { year: value } の履歴マップ
  const historyMap = new Map<string, { year: string; value: number }[]>();

  for (const r of rows) {
    const code = String(r["@area"]);
    const raw = Number(r["$"]);
    if (Number.isNaN(raw)) continue;

    const year = timeCodeToYear(String(r["@time"]));
    const value = raw / 100; // e-Statは95→0.95形式

    const list = historyMap.get(code) ?? [];
    list.push({ year, value });
    historyMap.set(code, list);
  }

  for (const list of historyMap.values()) {
    list.sort((a, b) => a.year.localeCompare(b.year));
  }

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;
  const merged = cities.map((city) => {
    const history = historyMap.get(city.code);
    if (history && history.length > 0) {
      matched++;
      return { ...city, financeIndexHistory: history };
    }
    return city;
  });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log(
    `cities.json 更新完了: ${matched}/${cities.length} 自治体で財政力指数の経年推移をマージ`
  );

  const meta = JSON.parse(fs.readFileSync("data/meta.json", "utf8"));
  fs.writeFileSync(
    "data/meta.json",
    JSON.stringify({ ...meta, updatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
