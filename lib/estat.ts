import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

export async function getStat(
  statsDataId: string,
  cdCat01: string
) {
  const url =
    "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData" +
    `?appId=${APP_ID}` +
    `&statsDataId=${statsDataId}` +
    `&cdCat01=${cdCat01}` +
    "&metaGetFlg=Y";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export function toArray(v: any) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}