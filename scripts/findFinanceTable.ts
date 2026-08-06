import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const KEYWORD = "財政力";

async function main() {

  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsList" +
    `?appId=${APP_ID}` +
    `&searchWord=${encodeURIComponent(KEYWORD)}`;

  const res = await fetch(url);

  const json = await res.json();

  console.log(
    JSON.stringify(
      json,
      null,
      2
    )
  );

}

main();