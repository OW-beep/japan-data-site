import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const url =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
  `?appId=${APP_ID}` +
  "&statsDataId=0000010101" +
  "&metaGetFlg=Y";

async function run() {

  const res = await fetch(url);

  const json = await res.json();

  const objs =
    json.GET_STATS_DATA
      .STATISTICAL_DATA
      .CLASS_INF
      .CLASS_OBJ;

  for (const obj of objs) {

    console.log("\n==========");

    console.log(obj["@id"]);

    console.log("==========");

    if (!obj.CLASS) continue;

    const list = Array.isArray(obj.CLASS)
      ? obj.CLASS
      : [obj.CLASS];

    for (const c of list.slice(0,100)) {

      console.log(
        c["@code"],
        c["@name"]
      );

    }

  }

}

run();