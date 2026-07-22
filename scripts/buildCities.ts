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
//   A5101 転入者数(日本人移動者)
//   A5102 転出者数(日本人移動者)
//   A7101 世帯数
//   A810105 単独世帯数
// 以前はA5101/A5102を「子ども人口」「高齢者人口」として誤用して
// いましたが、正しくは上記の通り転入・転出者数です。
//
// なお、合計特殊出生率(A4103)や昼夜間人口比率はこの市区町村
// データセットには含まれておらず、別の出典(いずれもe-Statの
// 「ファイル」区分で公開される不定期報告)が必要です。
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

  inMigrants: number;

  outMigrants: number;

  households: number;

  singleHouseholds: number;

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

      inMigrants: 0,

      outMigrants: 0,

      households: 0,

      singleHouseholds: 0,

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

  const inMigrants = await fetchStats(
    POP_STATS,
    "A5101",
    "cat"
  );

  const outMigrants = await fetchStats(
    POP_STATS,
    "A5102",
    "cat"
  );

  const households = await fetchStats(
    POP_STATS,
    "A7101",
    "cat"
  );

  const singleHouseholds = await fetchStats(
    POP_STATS,
    "A810105",
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
  // 転入者数
  // --------------------

  for (const r of arr(
    inMigrants.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.inMigrants =
      Number(r["$"]);

  }

  // --------------------
  // 転出者数
  // --------------------

  for (const r of arr(
    outMigrants.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.outMigrants =
      Number(r["$"]);

  }

  // --------------------
  // 世帯数
  // --------------------

  for (const r of arr(
    households.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.households =
      Number(r["$"]);

  }

  // --------------------
  // 単独世帯数
  // --------------------

  for (const r of arr(
    singleHouseholds.GET_STATS_DATA
      .STATISTICAL_DATA
      .DATA_INF
      .VALUE
  )) {

    const city = ensure(
      String(r["@area"])
    );

    city.singleHouseholds =
      Number(r["$"]);

  }
  // --------------------
  // JSON生成
  // --------------------

  // birthRate は e-Stat APIではなく別の出典(厚労省PDF)を手動で
  // マージしたものなので、このスクリプトを再実行しても消えない
  // ように、既存の data/cities.json から引き継ぐ。
  const previousBirthRate = new Map<string, number>();

  try {
    const previous = JSON.parse(
      fs.readFileSync("data/cities.json", "utf8")
    ) as { code: string; birthRate?: number | null }[];

    for (const c of previous) {
      if (c.birthRate != null) {
        previousBirthRate.set(c.code, c.birthRate);
      }
    }

    console.log(
      `既存データから出生率を${previousBirthRate.size}件引き継ぎます`
    );
  } catch {
    console.log(
      "既存の data/cities.json が見つからないため、出生率の引き継ぎはスキップします"
    );
  }

  const cities = Array.from(map.values())
    .map((c) => ({
      ...c,

      name:
        areaMap.get(c.code) ??
        c.code,

      birthRate:
        previousBirthRate.get(c.code) ?? null,
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

  const totalHouseholds = cities.reduce(
    (s, c) => s + c.households,
    0
  );

  const totalSingleHouseholds = cities.reduce(
    (s, c) => s + c.singleHouseholds,
    0
  );

  const avgHouseholdSize = totalPop / totalHouseholds;
  const singleRatio =
    (totalSingleHouseholds / totalHouseholds) * 100;

  console.log(
    `平均世帯人員(全国計): ${avgHouseholdSize.toFixed(2)}人 (目安: 2.0〜2.5人)`
  );

  console.log(
    `単独世帯割合(全国計): ${singleRatio.toFixed(2)}% (目安: 30〜40%)`
  );

  if (avgHouseholdSize < 1.5 || avgHouseholdSize > 3.5) {
    console.warn(
      "⚠ 平均世帯人員が目安から大きく外れています。A7101のカテゴリコードを再確認してください。"
    );
  }

  const totalInMigrants = cities.reduce(
    (s, c) => s + c.inMigrants,
    0
  );

  const totalOutMigrants = cities.reduce(
    (s, c) => s + c.outMigrants,
    0
  );

  console.log(
    `転入者数(全国計): ${totalInMigrants.toLocaleString()}人`
  );

  console.log(
    `転出者数(全国計): ${totalOutMigrants.toLocaleString()}人`
  );

  console.log(
    "(全国計の転入・転出はおおむね近い数字になるはずです。大きくズレる場合はA5101/A5102を再確認してください)"
  );

}

run().catch(console.error);