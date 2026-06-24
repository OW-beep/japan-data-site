import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;
if (!APP_ID) throw new Error("ESTAT_APP_IDが未設定です");

const URL =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
  `?appId=${APP_ID}` +
  "&statsDataId=0000020201" +
  "&cdCat01=A1101" +
  "&metaGetFlg=Y";

async function run() {
  console.log("fetching...");

  const res = await fetch(URL);
  const json = await res.json();

  const stat = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!stat) throw new Error("データなし");

  // -----------------------------
  // ① 地域マスタ（ここが重要）
  // -----------------------------
  const classObj = stat?.CLASS_INF?.CLASS_OBJ ?? [];

  const areaObj = Array.isArray(classObj)
    ? classObj.find((c: any) => c["@id"] === "area")
    : null;

  const areaList = areaObj?.CLASS ?? [];

  const areaArray = Array.isArray(areaList)
    ? areaList
    : [areaList];

  const areaMap = new Map<string, string>();

  for (const a of areaArray) {
    if (a?.["@code"] && a?.["@name"]) {
      areaMap.set(String(a["@code"]), String(a["@name"]));
    }
  }

  // -----------------------------
  // ② データ本体
  // -----------------------------
  const values = stat?.DATA_INF?.VALUE ?? [];
  const rows = Array.isArray(values) ? values : [values];

  // 最新値だけ抽出
  const latest = new Map<string, any>();

  for (const r of rows) {
    const area = r["@area"];
    const time = Number(r["@time"] ?? 0);

    if (!area) continue;

    const cur = latest.get(area);

    if (!cur || time > Number(cur["@time"] ?? 0)) {
      latest.set(area, r);
    }
  }

  // -----------------------------
  // ③ 成形（ここが修正ポイント）
  // -----------------------------
  const cities = [...latest.values()]
    .map((r) => {
      const code = String(r["@area"]);

      return {
        code,
        name: areaMap.get(code) ?? code, // ★ここが本修正
        population: Number(r["$"] ?? 0),
      };
    })
    .filter((c) => c.population > 0)
    .sort((a, b) => b.population - a.population);

  // -----------------------------
  // ④ 出力
  // -----------------------------
  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(cities, null, 2),
    "utf8"
  );

  console.log("generated", cities.length);
  console.log("sample:", cities.slice(0, 10));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});