import fs from "fs";

import cities from "../data/cities.json" assert { type: "json" };

import {
  getFinanceIndex,
  toArray,
} from "../lib/socialStat";

async function run() {
  console.log("財政力指数取得");

  const json = await getFinanceIndex();

  const rows = toArray(
    json?.GET_STATS_DATA
      ?.STATISTICAL_DATA
      ?.DATA_INF
      ?.VALUE
  );

  const financeMap = new Map<string, number>();
console.log(rows.filter((x: any) => x["@area"] === "13100"));
  for (const r of rows) {
    const code = String(r["@area"]);
    const raw = Number(r["$"]);

    if (Number.isNaN(raw)) continue;

    // 東京都だけ確認用（あとで消してOK）
    if (code === "13100") {
      console.log("東京都元データ");
      console.log(r);
    }

    // 候補を2つ作る
    const by100 = raw / 100;
    const by10000 = raw / 10000;

    let finance = raw;

    // 財政力指数は通常0〜3程度
    if (by100 >= 0 && by100 <= 3) {
      finance = by100;
    } else if (by10000 >= 0 && by10000 <= 3) {
      finance = by10000;
    }

    financeMap.set(code, finance);
  }

  const merged = (cities as any[]).map((c) => ({
    ...c,

    financeIndex:
  financeMap.has(c.code)
    ? financeMap.get(c.code)!
    : null
,
}));
  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log("財政力指数追加完了");
}

run().catch(console.error);