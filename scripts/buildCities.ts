import "dotenv/config";
import fs from "fs";

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

const URL =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
  `?appId=${APP_ID}` +
  "&statsDataId=0000020201" +
  "&cdCat01=A1101" +
  "&metaGetFlg=Y";

type Area = {
  "@code": string;
  "@name"?: string;
};

type Row = {
  "@area": string;
  "@time": string;
  "$": string;
};

async function run() {
  console.log("fetching...");

  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const statData =
    json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!statData) {
    console.log(json);
    throw new Error("統計データ取得失敗");
  }

  // ---------------------------
  // 地域マスタ
  // ---------------------------
  const areaObj =
    statData?.CLASS_INF?.CLASS_OBJ;

  const areaList = (
    Array.isArray(areaObj)
      ? areaObj
      : [areaObj]
  ).find((x: any) => x?.["@id"] === "area")
    ?.CLASS;

  const areas: Area[] = Array.isArray(areaList)
    ? areaList
    : areaList
    ? [areaList]
    : [];

  const areaMap = new Map<string, string>();

  for (const a of areas) {
    if (!a?.["@code"]) continue;

    areaMap.set(
      String(a["@code"]),
      String(a["@name"] ?? a["@code"])
    );
  }

  console.log("areaMap size =", areaMap.size);

  // ---------------------------
  // データ
  // ---------------------------
  const values =
    statData?.DATA_INF?.VALUE ?? [];

  const rows: Row[] = Array.isArray(values)
    ? values
    : [values];

  console.log("rows =", rows.length);

  // ---------------------------
  // 最新値だけ採用
  // ---------------------------
  const latestMap = new Map<string, Row>();

  for (const row of rows) {
    const area = row?.["@area"];
    const time = Number(row?.["@time"] ?? 0);

    if (!area) continue;

    const current = latestMap.get(area);

    if (
      !current ||
      time > Number(current["@time"] ?? 0)
    ) {
      latestMap.set(area, row);
    }
  }

  // ---------------------------
  // 整形
  // ---------------------------
  const cities = Array.from(
    latestMap.values()
  )
    .map((row) => {
      const code = String(row["@area"]);

      const name =
        areaMap.get(code) ?? code;

      const population = Number(row["$"] ?? 0);

      return {
        code,
        name,
        population,
      };
    })
    .filter((c) => {
      // 無効データ除外
      if (!c.population) return false;
      if (!c.name) return false;

      // 特別区部などのノイズ除外
      if (c.name === "特別区部") return false;

      return true;
    })
    .sort(
      (a, b) =>
        (b.population ?? 0) -
        (a.population ?? 0)
    );

  // ---------------------------
  // 出力
  // ---------------------------
  fs.mkdirSync("data", { recursive: true });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(cities, null, 2),
    "utf-8"
  );

  console.log("generated", cities.length);

  console.log("TOP 10:");
  console.log(cities.slice(0, 10));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});