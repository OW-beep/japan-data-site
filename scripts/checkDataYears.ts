/* eslint-disable @typescript-eslint/no-explicit-any -- e-Stat APIのJSONは型がないため any を使う */
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// e-Stat で「いま、どの年のデータまで取れるか」を調べる診断スクリプト。
// データは変更しない(読むだけ)。結果は data-year-report.txt にも保存する。
//
//   npm run check:data-years
//
// 調べるもの:
//   A. 地方財政状況調査(財政力指数など。サイトの取得元 statsDataId=0003172920)
//      … 表に入っている年度の一覧と、サイトの取得設定(cdTime)が指す年度
//   B. 社会・人口統計体系(statsDataId=0000020201)の、サイトが使っている項目
//      … 項目ごとに、取れる年の一覧(田原市・札幌市・東京特別区で確認)
//   C. 新しい年の統計表があるか(キーワード検索)
//   D. 社会・人口統計体系の分野別の表(0000020201〜12)から、財政の項目(財政力指数など)の場所を探す
//      … 医師・歯科医師・薬剤師統計、医療施設調査、住民基本台帳人口移動報告、人口動態調査 など
//
// 【注意】Claude の実行環境から api.e-stat.go.jp へは到達できないため、実際のAPIでは未検証です
//   (e-Statの応答形式を模したモックで、集計のロジックは検証済み)。
//   出力(data-year-report.txt)を共有してもらえれば、更新に必要な統計表IDを確定できます。
// ------------------------------------------------------------------

const API_BASE = process.env.ESTAT_API_BASE ?? "https://api.e-stat.go.jp/rest/3.0/app/json";
const APP_ID = process.env.ESTAT_APP_ID;

const arr = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const textOf = (v: any): string => (v == null ? "" : typeof v === "string" ? v : typeof v === "object" && "$" in v ? String(v["$"]) : String(v));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const lines: string[] = [];
const out = (s = "") => {
  console.log(s);
  lines.push(s);
};

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
      await sleep(600 * i);
    }
  }
  throw new Error(String(last));
}

/** 時間軸のコード(例: 2020100000)から年を読む。先頭4桁 */
const yearOf = (code: string) => code.slice(0, 4);

// ---------------------------------------------------------- A. 財政
async function checkFinance() {
  out("【A】地方財政状況調査(statsDataId=0003172920)");
  try {
    const json = await api("getMetaInfo", { statsDataId: "0003172920" });
    const cls = arr<any>(json?.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ).find((o) => String(o["@id"]) === "time");
    const items = arr<any>(cls?.CLASS).map((c) => ({ code: String(c["@code"]), name: String(c["@name"]) }));
    out(`  表に入っている時間軸: ${items.length}件`);
    for (const t of items) out(`    ${t.code}  ${t.name}`);
    const latest = items.map((t) => t.code).sort().pop();
    out(`  最新: ${latest ?? "(なし)"}`);
    out("  サイトの取得設定(lib/socialStat.ts)の cdTime: 2018100000  ← これが最新でなければ、取得年が古いままの可能性があります");
  } catch (e) {
    out(`  取得できませんでした: ${String(e)}`);
  }
  out();
}

// ---------------------------------------------------------- B. 体系
const SYSTEM_ITEMS: [string, string][] = [
  ["A1101", "総人口"],
  ["A1301", "15歳未満人口"],
  ["A1303", "65歳以上人口"],
  ["A5101", "転入者数"],
  ["A5102", "転出者数"],
  ["A7101", "世帯数"],
  ["A810105", "単独世帯数"],
  ["A9101", "婚姻件数"],
  ["A9201", "離婚件数"],
];
const SAMPLE_AREAS = "01100,13101,23231";

async function checkSystem() {
  out("【B】社会・人口統計体系(statsDataId=0000020201)の項目別の年(札幌市・千代田区・田原市で確認)");
  for (const [code, label] of SYSTEM_ITEMS) {
    try {
      const json = await api("getStatsData", {
        statsDataId: "0000020201",
        cdCat01: code,
        cdArea: SAMPLE_AREAS,
        metaGetFlg: "N",
        limit: 200,
      });
      const times = new Set<string>();
      for (const v of arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE)) {
        if (String(v["$"] ?? "").trim() !== "" && !Number.isNaN(Number(String(v["$"]).replace(/,/g, "")))) times.add(yearOf(String(v["@time"])));
      }
      const ys = [...times].sort();
      out(`  ${code.padEnd(8)} ${label.padEnd(10)} 最新: ${ys[ys.length - 1] ?? "(取得できず)"}  / 取れる年: ${ys.join(",") || "-"}`);
    } catch (e) {
      out(`  ${code} ${label}: 取得できませんでした(${String(e)})`);
    }
  }
  out();
}

// ---------------------------------------------------------- C. 新しい年の表
const SEARCHES: { label: string; word: string; years: string }[] = [
  { label: "医師・歯科医師・薬剤師統計(令和6年)", word: "医師・歯科医師・薬剤師統計 市区町村", years: "2024" },
  { label: "医療施設調査(令和6年)", word: "医療施設調査 市区町村", years: "2024" },
  { label: "住民基本台帳人口移動報告(2025年)", word: "住民基本台帳人口移動報告 市区町村", years: "2025" },
  { label: "人口動態調査(2024年)", word: "人口動態調査 市区町村", years: "2024" },
  { label: "社会教育調査(令和6年度)", word: "社会教育調査 市区町村", years: "2024" },
  { label: "学校基本調査(2025年)", word: "学校基本調査 市区町村", years: "2025" },
  { label: "地方財政状況調査 市町村別決算(令和6年度)", word: "地方財政状況調査 市町村 決算状況", years: "2024" },
];

async function checkNewTables() {
  out("【C】新しい年の統計表があるか(キーワード検索。上位10件)");
  for (const s of SEARCHES) {
    out(`  ■ ${s.label}`);
    try {
      const json = await api("getStatsList", { searchWord: s.word, surveyYears: s.years, limit: 10 });
      const tables = arr<any>(json?.GET_STATS_LIST?.DATALIST_INF?.TABLE_INF);
      if (tables.length === 0) out("    (該当なし。まだ e-Stat に登録されていない可能性があります)");
      for (const t of tables) {
        const id = String(t["@id"]);
        const title = textOf(t.TITLE);
        const area = textOf(t.COLLECT_AREA ?? "");
        out(`    ${id}  ${title}${area ? `  [${area}]` : ""}  (調査年月 ${textOf(t.SURVEY_DATE)})`);
      }
    } catch (e) {
      out(`    検索できませんでした: ${String(e)}`);
    }
  }
  out();
}

// ---------------------------------------------------------- D. 体系の財政の項目
// 社会・人口統計体系は分野別に別の統計表(0000020201〜0000020212)になっている。
// 「財政力指数」などの財政の項目が、どの表のどのコードにあるかを探す。
async function checkSystemFinanceItems() {
  out("【D】社会・人口統計体系の分野別の表から、財政の項目を探す");
  for (let n = 1; n <= 12; n++) {
    const id = `00000202${String(n).padStart(2, "0")}`;
    try {
      const json = await api("getMetaInfo", { statsDataId: id });
      const cls = arr<any>(json?.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ).find((o) => String(o["@id"]) === "cat01");
      const hits = arr<any>(cls?.CLASS)
        .map((c) => ({ code: String(c["@code"]), name: String(c["@name"]).normalize("NFKC") }))
        .filter((i) => /財政力指数|経常収支比率|実質公債費比率/.test(i.name));
      if (hits.length > 0) {
        out(`  ${id}`);
        for (const h of hits) out(`    ${h.code}  ${h.name}`);
      }
    } catch (e) {
      out(`  ${id}: 取得できませんでした(${String(e)})`);
    }
  }
  out();
}

async function main() {
  if (!APP_ID) throw new Error(".env.local に ESTAT_APP_ID がありません");
  out(`データの年の確認 ${new Date().toISOString()}`);
  out();
  await checkFinance();
  await checkSystem();
  await checkNewTables();
  await checkSystemFinanceItems();
  fs.writeFileSync("data-year-report.txt", lines.join("\n"), "utf-8");
  out("結果を data-year-report.txt に保存しました。");
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exitCode = 1;
});
