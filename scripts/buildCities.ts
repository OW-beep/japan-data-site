import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_ID がありません");
}

// ------------------------------------
// e-Stat ID
//
// 0000020201 は「社会・人口統計体系」の市区町村データ(通称
// SSDSE-市区町村)そのもの。項目コードは統計センターの公式解説
// (SSDSE-A の解説PDF)で確認済み:
//   A1101 総人口
//   A1301 15歳未満人口 (子ども人口)
//   A1303 65歳以上人口 (高齢者人口)
// 以前はA5101/A5102を使っていましたが、これらは実際には
// 「転入者数」「転出者数」(住民基本台帳人口移動報告)のコードで、
// 子ども人口・高齢者人口としては誤りでした。
//
// なお、合計特殊出生率(A4103)はこの市区町村データセットには
// 含まれておらず、別の出典(人口動態統計 市区町村編、5年に1度公表)
// が必要です。birthRateフィールドが常にnullなのはこのためです。
// ------------------------------------

const POP_STATS = "0000020201";

async function fetchStats(
  statsId: string,
  code: string,
  type: "cat" | "tab"
) {
  const key =
    type === "cat"
      ? "cdCat01"
      : "cdTab";

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

function arr(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

type City = {
  code: string;
  name: string;

  population: number;

  childPopulation: number;

  elderlyPopulation: number;

};

const map = new Map<string, City>();

function ensure(code: string) {
  if (!map.has(code)) {
    map.set(code, {
      code,
      name: "",

      population: 0,

      childPopulation: 0,

      elderlyPopulation: 0,

    });
  }

  return map.get(code)!;
}

async function run() {

  console.log("人口取得...");

  const pop = await fetchStats(
    POP_STATS,
    "A1101",
    "cat"
  );

  const child = await fetchStats(
    POP_STATS,
    "A1301",
    "cat"
  );

  const old = await fetchStats(
    POP_STATS,
    "A1303",
    "cat"
  );

  const classObj = arr(
    pop.GET_STATS_DATA
      .STATISTICAL_DATA
      .CLASS_INF
      .CLASS_OBJ
  );

  const areaObj = classObj.find(
    (x: any) => x["@id"] === "area"
  );

  const areaMap = new Map<string, string>();

  for (const c of arr(areaObj.CLASS)) {
    areaMap.set(
      String(c["@code"]),
      String(c["@name"])
    );
  }

  // --------------------
  // 総人口
  // --------------------

  for (const r of arr(
    pop.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.population = Number(r["$"]);

  }

  // --------------------
  // 子ども人口
  // --------------------

  for (const r of arr(
    child.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.childPopulation =
      Number(r["$"]);

  }

  // --------------------
  // 高齢者人口
  // --------------------

  for (const r of arr(
    old.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.elderlyPopulation =
      Number(r["$"]);

  }
  // --------------------
  // JSON生成
  // --------------------

  const cities = Array.from(map.values())
    .map((c) => ({
      ...c,

      name:
        areaMap.get(c.code) ??
        c.code,
    }))
    .filter(
      (c) => c.population > 0
    )
    .sort(
      (a, b) =>
        b.population - a.population
    );

  fs.mkdirSync("data", {
    recursive: true,
  });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(
      cities,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `generated ${cities.length} cities`
  );

  // --------------------
  // 簡易サニティチェック
  // 実際の日本は 子ども比率 約11%、高齢化率 約29% 前後のはず。
  // この範囲から大きく外れる場合はカテゴリコードが
  // 間違っている可能性が高い。
  // --------------------

  const totalPop = cities.reduce(
    (s, c) => s + c.population,
    0
  );

  const totalChild = cities.reduce(
    (s, c) => s + c.childPopulation,
    0
  );

  const totalElderly = cities.reduce(
    (s, c) => s + c.elderlyPopulation,
    0
  );

  const childRatio = (totalChild / totalPop) * 100;
  const elderlyRatio = (totalElderly / totalPop) * 100;

  console.log(
    `子ども比率(全国計): ${childRatio.toFixed(2)}% (目安: 8〜13%)`
  );

  console.log(
    `高齢化率(全国計): ${elderlyRatio.toFixed(2)}% (目安: 25〜35%)`
  );

  if (childRatio < 5 || childRatio > 20) {
    console.warn(
      "⚠ 子ども比率が目安から大きく外れています。A1301のカテゴリコードを再確認してください。"
    );
  }

  if (elderlyRatio < 15 || elderlyRatio > 45) {
    console.warn(
      "⚠ 高齢化率が目安から大きく外れています。A1303のカテゴリコードを再確認してください。"
    );
  }

}

run().catch(console.error);