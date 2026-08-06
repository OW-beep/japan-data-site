import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const STATS_ID = "0003172920";

async function main() {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getMetaInfo" +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}`;

  const res = await fetch(url);
  const json = await res.json();

  const objs =
    json.GET_META_INFO.METADATA_INF.CLASS_INF.CLASS_OBJ;

  for (const obj of objs) {
    console.log("==========");
    console.log(obj["@id"], obj["@name"]);

    const list = Array.isArray(obj.CLASS)
      ? obj.CLASS
      : [obj.CLASS];

    for (const c of list.slice(0, 20)) {
      console.log(
        c["@code"],
        c["@name"]
      );
    }
  }
}

main();