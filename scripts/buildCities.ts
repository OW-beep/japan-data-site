import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

async function run() {
  console.log("fetching...");

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    "&statsDataId=0000020201" +
    "&cdCat01=A1101" +
    "&metaGetFlg=Y";

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();

  const stat = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  // ----------------------------
  // ① 地域マスタ（正しい取り方）
  // ----------------------------
  const classObj = stat?.CLASS_INF?.CLASS_OBJ ?? [];

  const areaObj = Array.isArray(classObj)
    ? classObj.find((c) => c["@id"] === "area")
    : null;

  const areaListRaw = areaObj?.CLASS ?? [];

  const areaList = Array.isArray(areaListRaw)
    ? areaListRaw
    : [areaListRaw];

  const areaMap = new Map<string, string>();

  for (const a of areaList) {
    if (!a?.["@code"]) continue;

    areaMap.set(
      String(a["@code"]),
      String(a["@name"] ?? a["@code"])
    );
  }

  // ----------------------------
  // ② データ本体
  // ----------------------------
  const values = stat?.DATA_INF?.VALUE ?? [];
  const rows = Array.isArray(values) ? values : [values];

  // 最新値だけ残す
  const latest = new Map<string, any>();

  for (const r of rows) {
    const area = String(r["@area"]);
    const time = Number(r["@time"] ?? 0);

    const prev = latest.get(area);

    if (!prev || time > Number(prev["@time"] ?? 0)) {
      latest.set(area, r);
    }
  }

  // ----------------------------
  // ③ 成形
  // ----------------------------
  const cities = Array.from(latest.values()).map((r) => {
    const code = String(r["@area"]);

    return {
      code,
      name: areaMap.get(code) || "不明",
      population: Number(r["$"] ?? 0),
    };
  });

  const filtered = cities
    .filter((c) => c.population > 0)
    .sort((a, b) => b.population - a.population);

  // ----------------------------
  // ④ 出力
  // ----------------------------
  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(filtered, null, 2),
    "utf8"
  );

  console.log("generated:", filtered.length);
  console.log(filtered.slice(0, 10));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});