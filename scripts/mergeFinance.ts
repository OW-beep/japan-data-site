import fs from "fs";
import cities from "../data/cities.json" assert { type: "json" };

import {
  getFinanceIndex,
  toArray,
} from "../lib/socialStat";

async function run() {
  console.log("財政力指数取得...");

  const json = await getFinanceIndex();

  const rows = toArray(
    json?.GET_STATS_DATA
      ?.STATISTICAL_DATA
      ?.DATA_INF
      ?.VALUE
  );

  // areaコード → 財政力指数
  const financeMap = new Map<string, number>();

  for (const r of rows) {
    // 最新年度のみ
    if (r["@time"] !== "2018100000") continue;

    const code = String(r["@area"]);

    const raw = Number(r["$"]);

    if (Number.isNaN(raw)) continue;

    // e-Statは95→0.95なので100で割る
    financeMap.set(code, raw / 100);
  }

  const merged = (cities as any[]).map((city) => ({
    ...city,

    financeIndex: financeMap.has(city.code)
      ? financeMap.get(city.code)!
      : null,
  }));

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log(
    `財政力指数反映: ${financeMap.size}自治体`
  );

  const noFinance = merged.filter(
    (c) => c.financeIndex == null
  );

  console.log(
    `財政力指数なし: ${noFinance.length}自治体`
  );

  console.log("mergeFinance 完了");
}

run().catch(console.error);