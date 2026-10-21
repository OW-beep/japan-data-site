/* eslint-disable @typescript-eslint/no-explicit-any -- e-Stat APIのJSONは型がないため any を使う */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 令和7年国勢調査(人口等基本集計・確定値。2026年9月29日公表)から、
// 市区町村別の「総世帯数」と「単独世帯数」を e-Stat API で取得し、
// data/households-2025.json に保存する。
//
// サイトの現在の値(令和2年)は、社会・人口統計体系の A7101(世帯数=総世帯数)と
// A810105(単独世帯数)で、全国合計は 55,830,154 世帯 / 21,151,042 世帯(一般世帯のうち単独)。
// 同じ意味の値(総世帯数・単独世帯数)を、令和7年の国勢調査から取る。
//
// 統計表ID(statsDataId)は scripts/fetchCensus2025.ts と同じ方法で自動で探す:
//   1. getStatsList で「令和7年国勢調査・市区町村単位」の表を一覧にする
//   2. 表題で候補に点数をつけ、上位の表の getMetaInfo を調べて
//      「総世帯数を取り出せる表」「単独世帯数を取り出せる表」をそれぞれ選ぶ
//   3. getStatsData で全市区町村分を取得する(ページ送りに対応)
//
// 【使い方】
//   npm run fetch:households2025                     … 自動で表を探して取得
//   npm run fetch:households2025 -- --list           … 候補の表と分類の中身を表示(診断用)
//   npm run fetch:households2025 -- --total=ID --single=ID  … 統計表IDを指定して取得
//
// 必要なもの: .env.local の ESTAT_APP_ID
//
// 【取得後のチェック】どれかを満たさないときは、ファイルを書き込まずにエラーで終了する。
//   - サイトの自治体のうち 95% 以上のコードで総世帯数が見つかること
//   - 総世帯数の合計が 5,400万〜5,900万世帯 であること(令和2年は 5,583万)
//   - 単独世帯の割合が 32%〜46% であること(令和2年は 37.9%)
//   - 単独世帯は取れなかった場合、総世帯数だけを保存する(単独世帯の割合ランキングは更新されない)
//
// 【注意】Claude の実行環境から api.e-stat.go.jp へは到達できないため、
//   このスクリプトは実際のAPIでは未検証です。fetchCensus2025.ts(実際のAPIで動いたもの)の
//   部品を流用していますが、表の選び方(世帯の表)は初めてです。
//   うまく選べなかった場合は、--list の出力を共有してください。
// ------------------------------------------------------------------

const API_BASE = process.env.ESTAT_API_BASE ?? "https://api.e-stat.go.jp/rest/3.0/app/json";
const STATS_CODE = "00200521"; // 国勢調査
const SURVEY_YEAR = "2025";
const MIN_COVERAGE = 0.95;
const TOTAL_RANGE: [number, number] = [54_000_000, 59_000_000];
const SINGLE_SHARE_RANGE: [number, number] = [0.32, 0.46];

const APP_ID = process.env.ESTAT_APP_ID;
const OUTPUT = path.join("data", "households-2025.json");

// ---------------------------------------------------------------- utils

const arr = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const norm = (s: unknown) => String(s ?? "").normalize("NFKC").trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function textOf(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "$" in v) return String(v["$"]);
  return String(v);
}

async function api(endpoint: string, params: Record<string, string | number | undefined>): Promise<any> {
  const qs = new URLSearchParams({ appId: APP_ID ?? "" });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const url = `${API_BASE}/${endpoint}?${qs.toString()}`;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      await sleep(800 * attempt);
    }
  }
  throw new Error(`${endpoint} の呼び出しに失敗しました: ${String(lastErr)}`);
}

function statusOf(json: any, root: string) {
  const r = json?.[root]?.RESULT;
  return { status: Number(r?.STATUS ?? 0), msg: String(r?.ERROR_MSG ?? "") };
}

function toNumber(v: unknown): number | null {
  const s = String(v ?? "").replace(/,/g, "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

const cdKey = (id: string) => `cd${id.charAt(0).toUpperCase()}${id.slice(1)}`;

// ----------------------------------------------------- 1. 候補の表を探す

type Candidate = { id: string; title: string; score: number };

function scoreTitle(raw: string): number {
  const s = norm(raw);
  let score = 0;
  if (/世帯/.test(s)) score += 5;
  if (/世帯の種類|世帯の家族類型|家族類型/.test(s)) score += 4;
  if (/主な結果/.test(s)) score += 2;
  if (/市区町村|市町村/.test(s)) score += 1;
  // 世帯の表でも、年齢別・住宅・就業などの細かい表は使わない
  if (/年齢|住宅|住居|就業|産業|職業|従業|通学|外国人|国籍|世帯主|母子|父子|高齢者世帯|夫婦|親子|居住期間|労働力|組替|不詳補完/.test(s)) score -= 6;
  if (/時系列/.test(s)) score -= 2;
  return score;
}

async function listCandidates(): Promise<Candidate[]> {
  const out: Candidate[] = [];
  let start = 1;
  for (let page = 0; page < 30; page++) {
    const json = await api("getStatsList", {
      statsCode: STATS_CODE,
      surveyYears: SURVEY_YEAR,
      collectArea: 3, // 市区町村
      limit: 1000,
      startPosition: start,
    });
    const { status, msg } = statusOf(json, "GET_STATS_LIST");
    if (status >= 100) throw new Error(`getStatsList エラー: ${status} ${msg}`);
    for (const t of arr<any>(json?.GET_STATS_LIST?.DATALIST_INF?.TABLE_INF)) {
      const title = textOf(t.TITLE) + " " + textOf(t.STATISTICS_NAME);
      out.push({ id: String(t["@id"]), title: textOf(t.TITLE), score: scoreTitle(title) });
    }
    const next =
      json?.GET_STATS_LIST?.DATALIST_INF?.RESULT_INF?.NEXT_KEY ?? json?.GET_STATS_LIST?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  const seen = new Set<string>();
  return out.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true))).sort((a, b) => b.score - a.score);
}

// ---------------------------------------- 2. 表の分類を調べて取得方法を決める

type ClassItem = { code: string; name: string };
type ClassObj = { id: string; name: string; items: ClassItem[] };

async function getClasses(statsDataId: string): Promise<ClassObj[]> {
  const json = await api("getMetaInfo", { statsDataId });
  const { status, msg } = statusOf(json, "GET_META_INFO");
  if (status >= 100) throw new Error(`getMetaInfo エラー: ${status} ${msg}`);
  return arr<any>(json?.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ).map((o) => ({
    id: String(o["@id"]),
    name: String(o["@name"] ?? ""),
    items: arr<any>(o.CLASS).map((c) => ({ code: String(c["@code"]), name: norm(c["@name"]) })),
  }));
}

type Plan = {
  statsDataId: string;
  tab: string | null;
  time: string | null;
  /** 取り出したい値が入っている分類と、その中で選んだコード */
  targetClass: string;
  targetCode: string;
  /** それ以外の分類で選んだコード(総数) */
  fixed: Record<string, string>;
};

const TOTAL_RE = /^(総数|総数[（(].*[)）]|全世帯|世帯総数|総世帯|世帯数)$/;

function pickTotal(items: ClassItem[]): ClassItem | null {
  return items.find((i) => TOTAL_RE.test(i.name)) ?? (items.length === 1 ? items[0] : null);
}

type Target = { kind: "total" | "single"; match: (items: ClassItem[]) => ClassItem | null };

const TARGETS: Record<"total" | "single", Target> = {
  // 総世帯数: 「世帯の種類」の分類(総数・一般世帯・施設等の世帯)の「総数」
  total: {
    kind: "total",
    match: (items) => {
      const hasGeneral = items.some((i) => /^一般世帯$/.test(i.name));
      const hasInstitution = items.some((i) => /施設等の世帯/.test(i.name));
      if (!hasGeneral || !hasInstitution) return null;
      return items.find((i) => /^総数$/.test(i.name)) ?? null;
    },
  },
  // 単独世帯数: 「世帯の家族類型」の分類の「単独世帯」(「うち高齢」などは除く)
  single: {
    kind: "single",
    match: (items) => items.find((i) => /^単独世帯$/.test(i.name)) ?? null,
  },
};

function buildPlan(statsDataId: string, classes: ClassObj[], kind: "total" | "single"): Plan | null {
  const area = classes.find((c) => c.id === "area");
  if (!area || area.items.length < 1500) return null; // 市区町村単位の表のみ

  let time: string | null = null;
  const timeCls = classes.find((c) => c.id === "time");
  if (timeCls) {
    const hit = timeCls.items.filter((i) => /2025|令和7年/.test(i.name));
    if (hit.length === 0) return null;
    time = hit[hit.length - 1].code;
  }

  // 表章項目は「世帯数」でなければならない(人口などの表を誤って使わない)
  let tab: string | null = null;
  const tabCls = classes.find((c) => c.id === "tab");
  if (tabCls) {
    const hit =
      tabCls.items.find((i) => /^世帯数(（世帯）|\(世帯\))?$/.test(i.name)) ??
      tabCls.items.find((i) => /世帯数/.test(i.name) && !/増減|密度|構成比|割合|平均|1世帯|人員|率/.test(i.name));
    if (!hit) return null;
    tab = hit.code;
  }

  const catClasses = classes.filter((c) => /^cat\d+$/.test(c.id));
  let targetClass = "";
  let targetCode = "";
  for (const c of catClasses) {
    const hit = TARGETS[kind].match(c.items);
    if (hit) {
      targetClass = c.id;
      targetCode = hit.code;
      break;
    }
  }
  if (!targetClass) return null;

  const fixed: Record<string, string> = {};
  for (const c of catClasses) {
    if (c.id === targetClass) continue;
    const pick = pickTotal(c.items);
    if (!pick) return null; // 総数を特定できない分類が残る表は使わない
    fixed[c.id] = pick.code;
  }
  return { statsDataId, tab, time, targetClass, targetCode, fixed };
}

// ------------------------------------------------------------- 3. 取得

async function fetchValues(plan: Plan): Promise<Map<string, number>> {
  const params: Record<string, string | number | undefined> = {
    statsDataId: plan.statsDataId,
    cdTab: plan.tab ?? undefined,
    cdTime: plan.time ?? undefined,
    metaGetFlg: "N",
    limit: 100000,
    [cdKey(plan.targetClass)]: plan.targetCode,
  };
  for (const [id, code] of Object.entries(plan.fixed)) params[cdKey(id)] = code;

  const out = new Map<string, number>();
  let start = 1;
  for (let page = 0; page < 50; page++) {
    const json = await api("getStatsData", { ...params, startPosition: start });
    const { status, msg } = statusOf(json, "GET_STATS_DATA");
    if (status >= 100) throw new Error(`getStatsData エラー: ${status} ${msg}`);
    for (const r of arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE)) {
      const num = toNumber(r["$"]);
      if (num != null) out.set(String(r["@area"]), num);
    }
    const next =
      json?.GET_STATS_DATA?.STATISTICAL_DATA?.RESULT_INF?.NEXT_KEY ?? json?.GET_STATS_DATA?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  return out;
}

// ------------------------------------------------------------- 検証と保存

function siteCodes(): string[] | null {
  const p = path.join("data", "cities.json");
  if (!fs.existsSync(p)) return null;
  return (JSON.parse(fs.readFileSync(p, "utf-8")) as { code: string }[]).map((c) => String(c.code));
}

/** 政令指定都市20市の「市全体」の地域コード */
const DESIGNATED_PARENTS: string[] = [
  "01100", "04100", "11100", "12100", "14100", "14130", "14150", "15100", "22100", "22130",
  "23100", "26100", "27100", "27140", "28100", "33100", "34100", "40100", "40130", "43100",
];
const PARENT_SET = new Set(DESIGNATED_PARENTS);

function isDesignatedWard(code: string): boolean {
  if (!/^\d{5}$/.test(code) || code.startsWith("13") || PARENT_SET.has(code)) return false;
  const n = Number(code.slice(2));
  return n > 100 && n < 200;
}

function parentOfWard(code: string): string | null {
  const ps = DESIGNATED_PARENTS.filter((c) => c.startsWith(code.slice(0, 2)) && c < code);
  return ps.length > 0 ? ps[ps.length - 1] : null;
}

/** 表に政令指定都市の「市全体」の行がなく区だけがあるとき、区の合計を市全体の値として補う */
function fillParents(values: Map<string, number>): number {
  const sums = new Map<string, number>();
  for (const [code, v] of values) {
    if (!isDesignatedWard(code)) continue;
    const p = parentOfWard(code);
    if (p) sums.set(p, (sums.get(p) ?? 0) + v);
  }
  let filled = 0;
  for (const [p, sum] of sums) {
    if (!values.has(p)) {
      values.set(p, sum);
      filled++;
    }
  }
  return filled;
}

type Result = { total: Map<string, number>; single: Map<string, number> | null; ids: { total: string; single: string | null } };

function check(total: Map<string, number>, single: Map<string, number> | null): string[] {
  const problems: string[] = [];
  const codes = siteCodes();
  const target = (codes ?? [...total.keys()]).filter((c) => /^\d{5}$/.test(c) && c !== "13100" && !isDesignatedWard(c));
  const hit = target.filter((c) => total.has(c));
  const coverage = target.length > 0 ? hit.length / target.length : 0;
  if (coverage < MIN_COVERAGE) problems.push(`総世帯数が見つかった自治体が少なすぎます(${(coverage * 100).toFixed(1)}%)`);

  const sum = hit.reduce((s, c) => s + (total.get(c) ?? 0), 0);
  if (sum < TOTAL_RANGE[0] || sum > TOTAL_RANGE[1]) {
    problems.push(`総世帯数の合計が想定の範囲外です(${sum.toLocaleString()}世帯。想定 ${TOTAL_RANGE[0].toLocaleString()}〜${TOTAL_RANGE[1].toLocaleString()})`);
  }
  if (single) {
    const sHit = hit.filter((c) => single.has(c));
    const sSum = sHit.reduce((s, c) => s + (single.get(c) ?? 0), 0);
    const tSum = sHit.reduce((s, c) => s + (total.get(c) ?? 0), 0);
    const share = tSum > 0 ? sSum / tSum : 0;
    if (share < SINGLE_SHARE_RANGE[0] || share > SINGLE_SHARE_RANGE[1]) {
      problems.push(`単独世帯の割合が想定の範囲外です(${(share * 100).toFixed(1)}%。想定 32〜46%)`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------- main

function argValue(name: string): string | undefined {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : undefined;
}

async function findPlan(kind: "total" | "single", candidates: Candidate[], forcedId?: string): Promise<Plan | null> {
  const ids = forcedId ? [forcedId] : candidates.filter((c) => c.score > 0).slice(0, 12).map((c) => c.id);
  for (const id of ids) {
    try {
      const plan = buildPlan(id, await getClasses(id), kind);
      if (plan) return plan;
    } catch (e) {
      console.warn(`  (${id} は調べられませんでした: ${String(e)})`);
    }
  }
  return null;
}

async function main() {
  if (!APP_ID) throw new Error(".env.local に ESTAT_APP_ID がありません");

  const listOnly = process.argv.includes("--list");
  const candidates = await listCandidates();

  if (listOnly) {
    console.log("候補の表(点数順の上位30):");
    for (const c of candidates.slice(0, 30)) console.log(`  ${String(c.score).padStart(3)}  ${c.id}  ${c.title}`);
    for (const c of candidates.filter((x) => x.score > 0).slice(0, 8)) {
      try {
        const cls = await getClasses(c.id);
        console.log(`\n[${c.id}] ${c.title}`);
        for (const k of cls) console.log(`  ${k.id} (${k.name}): ${k.items.length}件 例: ${k.items.slice(0, 6).map((i) => i.name).join(" / ")}`);
        console.log(`  → 総世帯数の取り出し: ${buildPlan(c.id, cls, "total") ? "できる" : "できない"} / 単独世帯: ${buildPlan(c.id, cls, "single") ? "できる" : "できない"}`);
      } catch (e) {
        console.log(`  (${c.id}: ${String(e)})`);
      }
    }
    return;
  }

  const totalPlan = await findPlan("total", candidates, argValue("total"));
  if (!totalPlan) throw new Error("総世帯数を取り出せる表が見つかりません。--list の出力を確認して --total=ID で指定してください");
  console.log(`総世帯数: 統計表 ${totalPlan.statsDataId} を使います`);
  const singlePlan = await findPlan("single", candidates, argValue("single"));
  console.log(singlePlan ? `単独世帯数: 統計表 ${singlePlan.statsDataId} を使います` : "単独世帯数: 取り出せる表が見つかりませんでした(総世帯数だけ保存します)");

  const total = await fetchValues(totalPlan);
  const single = singlePlan ? await fetchValues(singlePlan) : null;
  const f1 = fillParents(total);
  const f2 = single ? fillParents(single) : 0;
  if (f1 + f2 > 0) console.log(`政令指定都市の市全体の値を、区の合計で補いました(総世帯 ${f1}市 / 単独世帯 ${f2}市)`);

  const problems = check(total, single);
  if (problems.length > 0) {
    console.error("検証に失敗したため、ファイルは書き込みません:");
    for (const p of problems) console.error("  - " + p);
    // 終了コードは exitCode で指定する(exit関数を直接呼ぶと、Windows で終了時に libuv のエラー表示が出ることがあるため)
    process.exitCode = 1;
    return;
  }

  const values: Record<string, [number, number | null]> = {};
  for (const [code, v] of total) {
    if (!/^\d{5}$/.test(code)) continue;
    values[code] = [v, single?.get(code) ?? null];
  }
  const siteList = siteCodes();
  const coverage = siteList ? siteList.filter((c) => values[c]).length / siteList.length : 1;
  const res: Result = { total, single, ids: { total: totalPlan.statsDataId, single: singlePlan?.statsDataId ?? null } };
  fs.writeFileSync(
    OUTPUT,
    JSON.stringify({
      meta: {
        source: "令和7年国勢調査 人口等基本集計(確定値)",
        statsDataId: res.ids.total + (res.ids.single ? `,${res.ids.single}` : ""),
        fetchedAt: new Date().toISOString(),
        coverage: Number(coverage.toFixed(4)),
      },
      values,
    }),
    "utf-8"
  );
  console.log(`保存しました: ${OUTPUT}(${Object.keys(values).length}件、サイトの自治体の ${(coverage * 100).toFixed(1)}%)`);
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exitCode = 1;
});
