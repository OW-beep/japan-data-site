import "dotenv/config";
import fs from "fs";

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
  const json = await res.json();

  const statData = json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!statData) {
    console.log(JSON.stringify(json, null, 2));
    throw new Error("データ取得失敗");
  }

  const classObj = statData?.CLASS_INF?.CLASS_OBJ ?? [];

  const areaClass = Array.isArray(classObj)
    ? classObj.find((x) => x?.["@id"] === "area")
    : null;

  const areaListRaw = areaClass?.CLASS ?? [];

  const areaList = Array.isArray(areaListRaw)
    ? areaListRaw
    : [areaListRaw];

  const areaMap = new Map<string, string>();

  for (const area of areaList) {
    if (!area?.["@code"]) continue;
    areaMap.set(String(area["@code"]), String(area["$"]));
  }

  const values = statData?.DATA_INF?.VALUE ?? [];
  const rows = Array.isArray(values) ? values : [values];

  // 最新値だけ抽出
  const latestMap = new Map<string, any>();

  for (const row of rows) {
    const area = String(row?.["@area"] ?? "");
    const time = Number(row?.["@time"] ?? 0);

    if (!area) continue;

    const current = latestMap.get(area);

    if (!current || time > Number(current?.["@time"] ?? 0)) {
      latestMap.set(area, row);
    }
  }

  const cities = [];

  for (const row of latestMap.values()) {
    const code = String(row?.["@area"] ?? "");
    const name = areaMap.get(code) ?? code;

    // ❌ 特別区まとめ除外
    if (name.includes("特別区部")) continue;

    cities.push({
      code,
      name,
      population: Number(row?.["$"] ?? 0),
    });
  }

  const filtered = cities
    .filter((c) => c.population > 0)
    .sort((a, b) => b.population - a.population);

  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(filtered, null, 2),
    "utf8"
  );

  console.log("generated", filtered.length, "cities");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});