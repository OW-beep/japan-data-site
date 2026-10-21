/* eslint-disable @typescript-eslint/no-explicit-any -- e-Stat APIのJSONは型がないため any を使う */
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 財政力指数を、e-Stat「社会・人口統計体系」の「財政力指数」の項目から取得して、
// data/cities.json の financeIndex を更新する。
// 体系は分野ごとに別の統計表になっている。財政は「D 行政基盤」(0000020204)にあるので、
// まずそこを探し、なければ A 人口・世帯(0000020201)も探す(--table=ID で指定もできる)。
//
// 背景:
//   これまでの取得元(地方財政状況調査の表 0003172920)は 2018年度までしか更新されておらず、
//   画面に「2023年度決算」と表示していたのは実際と違っていた(2026-10 の診断 npm run check:data-years で判明)。
//   SSDSE-A-2026 にも財政力指数の列はなかった。そこで、体系の項目から最新年を取る。
//
// 流れ:
//   1. getMetaInfo で、項目名が「財政力指数」の項目コードを探す(複数あれば --item=コード で指定)
//   2. 札幌市・千代田区・田原市で、その項目の取れる年を調べ、最新年を決める
//   3. 最新年の全市区町村分を取得(ページ送り対応)
//   4. 検証して cities.json の financeIndex を更新し、meta.json に financeIndexYear を保存
//
//   npm run merge:finance-index              … 取得して保存
//   npm run merge:finance-index -- --dry     … 取得と検証だけ(保存しない)
//   npm run merge:finance-index -- --table=0000020204 --item=D2201 --year=2022   … 項目と年を指定
//
// 検証(満たさなければ保存せずに終了):
//   - 市町村(政令市の区・東京特別区部を除く)の 90% 以上で値が取れること
//   - 値の中央値が 0.15〜1.0 の範囲(単位が百分率なら100で割る)
// 保存の方針: 新しい年の値が無い自治体は null にする(2018年度と新しい年が混ざらないようにするため)
//
// 【注意】Claude の実行環境から api.e-stat.go.jp へは到達できないため、実際のAPIでは未検証です
//   (e-Statの応答形式を模したモックで、項目の探索・年の判定・取得・検証・保存は検証済み)。
// ------------------------------------------------------------------

const API_BASE = process.env.ESTAT_API_BASE ?? "https://api.e-stat.go.jp/rest/3.0/app/json";
const APP_ID = process.env.ESTAT_APP_ID;
// 体系の統計表(分野別)。財政力指数は D 行政基盤にある見込み。順に探す
const TABLE_CANDIDATES = ["0000020204", "0000020201"];
const SAMPLE_AREAS = "01100,13101,23231";

const arr = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const arg = (name: string) => process.argv.find((x) => x.startsWith(`--${name}=`))?.slice(name.length + 3);

async function api(endpoint: string, params: Record<string, string | number | undefined>): Promise<any> {
  const qs = new URLSearchParams({ appId: APP_ID ?? "" });
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  let last: unknown;
  for (let i = 1; i <= 3; i++) {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      last = e;
      await sleep(700 * i);
    }
  }
  throw new Error(`${endpoint} の呼び出しに失敗しました: ${String(last)}`);
}

const num = (v: unknown): number | null => {
  const s = String(v ?? "").replace(/,/g, "").trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};

type Found = { table: string; code: string; name: string };

async function findItem(): Promise<Found> {
  const forcedTable = arg("table");
  const forced = arg("item");
  if (forced) return { table: forcedTable ?? TABLE_CANDIDATES[0], code: forced, name: "(指定)" };
  const tables = forcedTable ? [forcedTable] : TABLE_CANDIDATES;
  for (const table of tables) {
    const json = await api("getMetaInfo", { statsDataId: table });
    const cls = arr<any>(json?.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ).find((o) => String(o["@id"]) === "cat01");
    const items = arr<any>(cls?.CLASS).map((c) => ({ code: String(c["@code"]), name: String(c["@name"]).normalize("NFKC") }));
    const hits = items.filter((i) => /財政力指数/.test(i.name));
    console.log(`統計表 ${table}: 項目 ${items.length}件、「財政力指数」を含む項目 ${hits.length}件`);
    if (hits.length === 0) continue;
    for (const h of hits) console.log(`  ${h.code}  ${h.name}`);
    // 市町村財政の項目を優先(都道府県財政の項目は市区町村の値を持たない)
    const pick = hits.find((h) => /市町村/.test(h.name)) ?? (hits.length === 1 ? hits[0] : null);
    if (!pick) throw new Error("財政力指数の項目が複数あり、市町村のものを特定できません。--item=コード で指定してください");
    return { table, code: pick.code, name: pick.name };
  }
  throw new Error(`体系(${tables.join(", ")})に「財政力指数」の項目が見つかりません。npm run check:data-years の【D】で候補を確認してください`);
}

/** 取れる最新の時間軸コード(例: 2022100000)を返す。年は先頭4桁 */
async function latestTime(table: string, code: string): Promise<string> {
  const json = await api("getStatsData", { statsDataId: table, cdCat01: code, cdArea: SAMPLE_AREAS, metaGetFlg: "N", limit: 300 });
  const times = new Set<string>();
  for (const v of arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE)) {
    if (num(v["$"]) != null) times.add(String(v["@time"]));
  }
  const ts = [...times].sort();
  if (ts.length === 0) throw new Error(`項目 ${code} は、確認用の自治体で値が取れませんでした`);
  console.log(`取れる年: ${ts.map((t) => t.slice(0, 4)).join(", ")}`);
  const forced = arg("year");
  if (forced) {
    const hit = ts.find((t) => t.startsWith(forced));
    if (!hit) throw new Error(`${forced}年の値は取れません(取れる年: ${ts.map((t) => t.slice(0, 4)).join(", ")})`);
    return hit;
  }
  return ts[ts.length - 1];
}

async function fetchAll(table: string, code: string, time: string): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  let start = 1;
  for (let page = 0; page < 50; page++) {
    const json = await api("getStatsData", {
      statsDataId: table,
      cdCat01: code,
      cdTime: time,
      metaGetFlg: "N",
      limit: 100000,
      startPosition: start,
    });
    for (const v of arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE)) {
      const n = num(v["$"]);
      if (n != null) out.set(String(v["@area"]), n);
    }
    const next = json?.GET_STATS_DATA?.STATISTICAL_DATA?.RESULT_INF?.NEXT_KEY ?? json?.GET_STATS_DATA?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  return out;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};

async function main() {
  if (!APP_ID) throw new Error(".env.local に ESTAT_APP_ID がありません");
  const item = await findItem();
  console.log(`項目: ${item.table} / ${item.code} ${item.name}`);
  const time = await latestTime(item.table, item.code);
  const year = time.slice(0, 4);
  console.log(`最新年: ${year}`);
  const values = await fetchAll(item.table, item.code, time);

  const cities = JSON.parse(fs.readFileSync("data/cities.json", "utf-8")) as any[];
  // 市町村(政令市の区・東京特別区部を除く)
  const munis = cities.filter((c) => c.name.split(" ").length !== 3 && c.name !== "東京都 特別区部");
  const hit = munis.filter((c) => values.has(String(c.code)));
  const coverage = hit.length / munis.length;
  const raw = hit.map((c) => values.get(String(c.code)) as number);
  const scale = median(raw) > 5 ? 100 : 1; // 単位が「%」で入っている場合は100で割る
  const med = median(raw) / scale;
  console.log(`値が取れた市町村: ${hit.length}/${munis.length}(${(coverage * 100).toFixed(1)}%)、中央値 ${med.toFixed(2)}(単位補正 ÷${scale})`);

  const problems: string[] = [];
  if (coverage < 0.9) problems.push(`値が取れた市町村が少なすぎます(${(coverage * 100).toFixed(1)}%)`);
  if (!(med >= 0.15 && med <= 1.0)) problems.push(`中央値が想定の範囲外です(${med.toFixed(2)}。想定 0.15〜1.0)`);
  if (problems.length > 0) {
    console.error("検証に失敗したため、ファイルは書き込みません:");
    for (const p of problems) console.error("  - " + p);
    // 終了コードは exitCode で指定する(exit関数を直接呼ぶと、Windows で終了時に libuv のエラー表示が出ることがあるため)
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes("--dry")) {
    console.log("--dry のため保存しません");
    return;
  }

  let changed = 0;
  const merged = cities.map((c) => {
    const v = values.get(String(c.code));
    const next = v == null ? null : Math.round((v / scale) * 100) / 100;
    if (next !== c.financeIndex) changed++;
    return { ...c, financeIndex: next };
  });
  fs.writeFileSync("data/cities.json", JSON.stringify(merged, null, 2), "utf-8");

  const metaPath = "data/meta.json";
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf-8")) : {};
  meta.financeIndexYear = Number(year);
  meta.financeIndexItem = `${item.table}/${item.code}`;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
  console.log(`cities.json の財政力指数を ${year}年度の値に更新しました(${changed}自治体で値が変わりました)。meta.json に financeIndexYear=${year} を保存しました`);
  console.log("画面の「データ年度」は、この年に自動で切り替わります(lib/dataSources.ts)。");
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exitCode = 1;
});
