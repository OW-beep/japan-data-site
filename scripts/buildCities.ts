// @ts-nocheck

import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
  path: ".env.local",
});

const APP_ID = process.env.ESTAT_APP_ID;

if (!APP_ID) {
  throw new Error("ESTAT_APP_IDが未設定です");
}

async function run() {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    "&statsDataId=0000020201" +
    "&cdCat01=A1101" +
    "&metaGetFlg=Y";

  console.log("fetching...");

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const statData =
    json?.GET_STATS_DATA?.STATISTICAL_DATA;

  if (!statData) {
    console.log(JSON.stringify(json, null, 2));
    throw new Error("統計データ取得失敗");
  }

  // -------------------------
  // 自治体コード → 自治体名
  // -------------------------

  const classObj =
    statData?.CLASS_INF?.CLASS_OBJ ?? [];

  const classList = Array.isArray(classObj)
    ? classObj
    : [classObj];

  const areaClass = classList.find(
    (x) => x?.["@id"] === "area"
  );

  const areaItems =
    areaClass?.CLASS ?? [];

  const areaList = Array.isArray(areaItems)
    ? areaItems
    : [areaItems];

  const areaMap = new Map();

  for (const area of areaList) {
    areaMap.set(
      String(area["@code"]),
      String(area["@name"])
    );
  }

  console.log(
    "船橋市確認:",
    areaMap.get("12204")
  );

  // -------------------------
  // 人口データ
  // -------------------------

  const values =
    statData?.DATA_INF?.VALUE ?? [];

  const rows = Array.isArray(values)
    ? values
    : [values];

  console.log(
    "rows =",
    rows.length
  );

  // 自治体ごとに最新年だけ残す

  const latestMap = new Map();

  for (const row of rows) {
    const area = String(
      row["@area"]
    );

    const time = Number(
      row["@time"] ?? 0
    );

    const current =
      latestMap.get(area);

    if (
      !current ||
      time >
        Number(
          current["@time"] ?? 0
        )
    ) {
      latestMap.set(
        area,
        row
      );
    }
  }

  const cities = [];

  for (const row of latestMap.values()) {
    const code = String(
      row["@area"]
    );

    const fullName =
      areaMap.get(code) ?? code;

    const cityName =
      fullName.includes(" ")
        ? fullName.split(" ").slice(1).join(" ")
        : fullName;

    cities.push({
      code,
      name: cityName,
      population: Number(
        row["$"] ?? 0
      ),
    });
  }

  const filtered = cities
    .filter(
      (c) => c.population > 0
    )
    .sort(
      (a, b) =>
        b.population -
        a.population
    );

  fs.mkdirSync("data", {
    recursive: true,
  });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(
      filtered,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    "generated",
    filtered.length,
    "cities"
  );

  console.log(
    filtered.slice(0, 20)
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});