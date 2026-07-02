import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const APP_ID = process.env.ESTAT_APP_ID!;

const BASE =
  "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData";

// 地方財政状況調査
const STATS_ID = "0003172920";

// 財政力指数
const TAB = "100700";

// 最新年度
const TIME = "2018100000";

export async function getFinanceIndex() {

  const url =
    `${BASE}` +
    `?appId=${APP_ID}` +
    `&statsDataId=${STATS_ID}` +
    `&cdTab=${TAB}` +
    `&cdTime=${TIME}` +
    `&metaGetFlg=Y`;

  console.log(url);

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