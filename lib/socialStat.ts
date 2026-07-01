import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const BASE =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

export async function getFinanceIndex() {

  const url =
    `${BASE}` +
    `?appId=${APP_ID}` +
    `&statsDataId=0000020104`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}`
    );
  }

  return res.json();

}

export function toArray(v:any){

    if(!v) return [];

    return Array.isArray(v)
        ? v
        : [v];

}