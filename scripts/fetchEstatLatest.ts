/* eslint-disable @typescript-eslint/no-explicit-any -- e-Stat APIのJSONは型がないため any を使う */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 新しい年の統計を e-Stat から取得して data/estat-latest.json に保存する。
// (cities.json は書き換えない。記事が使っている従来の値と混ざらないよう、別ファイルにする)
//
//   medical   … 医療施設調査 令和6年(2024)   病院(一般病院)数・一般診療所数・歯科診療所数
//   vital     … 人口動態調査 2024年          出生数・死亡数・婚姻件数・離婚件数
//   migration … 住民基本台帳人口移動報告 2025年  転入者数・転出者数(日本人移動者)
//
//   npm run fetch:estat-latest                    … 3つとも取得
//   npm run fetch:estat-latest -- --only=medical  … 1つだけ
//   npm run fetch:estat-latest -- --list          … 各統計表の分類の中身を表示(診断用)
//
// 保存したファイルは lib/city2025.ts が読み、令和7年国勢調査の人口を使うランキング
// (病院・自然増減・婚姻・離婚・入れ替わり率)に自動で反映される。
// ファイルが空(未取得)の項目は、従来の値(2023年など)のままで動く。
//
// 検証(満たさない項目は保存しない):
//   - サイトの市町村の 90% 以上で値があること
//   - 全国合計が想定の範囲にあること(下の SPECS の range)
//
// 【注意】Claude の実行環境から api.e-stat.go.jp へは到達できないため、実際のAPIでは未検証です
//   (e-Statの応答形式を模したモックで、表の選択・取得・検証・保存は検証済み)。
//   表の構造が想定と違って取れなかった項目は、--list の出力を共有してください。
// ------------------------------------------------------------------

const API_BASE = process.env.ESTAT_API_BASE ?? "https://api.e-stat.go.jp/rest/3.0/app/json";
const APP_ID = process.env.ESTAT_APP_ID;
const OUTPUT = path.join("data", "estat-latest.json");
const MIN_COVERAGE = 0.9;

type Field = {
  key: string;
  label: string;
  /** 表章項目(tab)の名前 */
  tab?: RegExp;
  /** 分類の中から取り出したい項目の名前(それ以外の分類は「総数」を選ぶ) */
  item?: RegExp;
  /**
   * 市区町村が並んでいる分類の名前。表によって area ではなく cat02 などに入っている
   * (医療施設調査は「R06二次医療圏・市区町村別」、住基移動報告は「…（現住地）」)。
   * 指定がなければ area を使う。
   */
  geo?: RegExp;
  /** 全国合計の想定範囲 */
  range: [number, number];
  /**
   * 表に政令指定都市の「市全体」の行がなく、区だけがあるとき、区の合計を市全体の値にする。
   * 件数(出生・死亡・婚姻・離婚・病院数)は区の合計で市全体になるので true。
   * 転入者数・転出者数は、区の間の移動(同じ市の中の引っ越し)まで足してしまうので false。
   */
  fillWards?: boolean;
  /**
   * 表に載っている市区町村で値がないものを 0 件として扱う。
   * 件数の表では、該当がない(病院が1つもない町村など)と、値が「-」になるか、行が出ない。
   * これを欠測にすると、全国の約4分の1の町村が「値なし」になってしまう。
   * 転入者数・転出者数のように、0 でなく欠測(秘匿など)の可能性があるものは false。
   */
  missingIsZero?: boolean;
};
type TableSpec = { id: string; fields: Field[] };
type Group = { name: string; label: string; year: number; yearRe: RegExp; tables: TableSpec[] };

const SPECS: Group[] = [
  {
    name: "medical",
    label: "医療施設調査 令和6年(2024)",
    year: 2024,
    yearRe: /2024|令和6年/,
    tables: [
      {
        id: "0004048437", // 第1表 病院数；病床数，病院－病床の種類・二次医療圏・市区町村別
        fields: [{ key: "hospitalCount", label: "一般病院数", item: /^病院施設数\(一般病院総数\)$/, geo: /市区町村/, range: [6_500, 7_800], fillWards: true, missingIsZero: true }],
      },
      {
        id: "0004048438", // 第2表 一般診療所数；歯科診療所数；病床数，病床の有無・二次医療圏・市区町村別
        fields: [
          { key: "clinicCount", label: "一般診療所数", item: /^一般診療所(施設)?数(総数)?$/, geo: /市区町村/, range: [95_000, 115_000], fillWards: true, missingIsZero: true },
          { key: "dentalClinicCount", label: "歯科診療所数", item: /^歯科診療所(施設)?数(総数)?$/, geo: /市区町村/, range: [60_000, 72_000], fillWards: true, missingIsZero: true },
        ],
      },
    ],
  },
  {
    name: "vital",
    label: "人口動態調査 2024年",
    year: 2024,
    yearRe: /2024|令和6年/,
    tables: [
      {
        id: "0003411564", // 中巻 人口動態総覧(件数),都道府県・市部-郡部-保健所-市区町村別
        fields: [
          { key: "births", label: "出生数", item: /^出生(数)?$/, range: [600_000, 780_000], fillWards: true, missingIsZero: true },
          { key: "deaths", label: "死亡数", item: /^死亡(数)?$/, range: [1_400_000, 1_800_000], fillWards: true, missingIsZero: true },
          { key: "marriages", label: "婚姻件数", item: /^婚姻(件数)?$/, range: [400_000, 560_000], fillWards: true, missingIsZero: true },
          { key: "divorces", label: "離婚件数", item: /^離婚(件数)?$/, range: [150_000, 230_000], fillWards: true, missingIsZero: true },
        ],
      },
    ],
  },
  {
    name: "migration",
    label: "住民基本台帳人口移動報告 2025年",
    year: 2025,
    yearRe: /2025|令和7年/,
    tables: [
      {
        id: "0004044330", // 移動前の住所地別転入者数 －都道府県，市区町村(移動者，日本人移動者，外国人移動者)(2025年)
        fields: [{ key: "inMigrants", label: "転入者数(日本人移動者)", item: /^日本人移動者$/, geo: /現住地/, range: [3_000_000, 7_500_000] }],
      },
      {
        id: "0004044331", // 移動後の住所地別転出者数
        fields: [{ key: "outMigrants", label: "転出者数(日本人移動者)", item: /^日本人移動者$/, geo: /前住地/, range: [3_000_000, 7_500_000] }],
      },
    ],
  },
];

// ---------------------------------------------------------------- utils

const arr = <T,>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const norm = (s: unknown) => String(s ?? "").normalize("NFKC").trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const cdKey = (id: string) => `cd${id.charAt(0).toUpperCase()}${id.slice(1)}`;

async function api(endpoint: string, params: Record<string, string | number | undefined>): Promise<any> {
  const qs = new URLSearchParams({ appId: APP_ID ?? "" });
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  let last: unknown;
  for (let i = 1; i <= 3; i++) {
    try {
      // 応答が返らないまま止まらないよう、1回の呼び出しは90秒で打ち切ってやり直す
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 90_000);
      try {
        const res = await fetch(`${API_BASE}/${endpoint}?${qs.toString()}`, { signal: ctl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    } catch (e) {
      last = e;
      await sleep(800 * i);
    }
  }
  throw new Error(`${endpoint} の呼び出しに失敗しました: ${String(last)}`);
}

const statusOf = (json: any, root: string) => ({
  status: Number(json?.[root]?.RESULT?.STATUS ?? 0),
  msg: String(json?.[root]?.RESULT?.ERROR_MSG ?? ""),
});

function toNumber(v: unknown): number | null {
  const s = String(v ?? "").replace(/,/g, "").trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
}

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

// ----------------------------------------------------------- 取得方法の決定

type Plan = {
  statsDataId: string;
  tab: string | null;
  time: string | null;
  fixed: Record<string, string>;
  /** 市区町村が並んでいる分類のID(area、または cat01/cat02…)と、その項目コード→5桁の団体コード */
  geoId: string;
  codeMap: Map<string, string>;
};

const TOTAL_RE = /^(総数|総数[（(].*[)）]|全体|計|合計)$/;
const pickTotal = (items: ClassItem[]) => items.find((i) => TOTAL_RE.test(i.name)) ?? (items.length === 1 ? items[0] : null);

/**
 * 項目から5桁の団体コードを読む。
 *  - nameMode(医療施設調査など): 項目コードは連番("01020")で、本当の団体コードは名前の先頭("01202 函館市")にある
 *  - それ以外(住基移動報告など): 項目コードがそのまま団体コード("01100"=札幌市)
 */
function muniCode(item: ClassItem, nameMode: boolean): string | null {
  if (nameMode) {
    const m = item.name.match(/^(\d{5})\s/);
    return m ? m[1] : null;
  }
  return /^\d{5}$/.test(item.code) ? item.code : null;
}

type PlanResult = { plan: Plan | null; reason?: string };

function buildPlan(statsDataId: string, classes: ClassObj[], f: Field, yearRe: RegExp): PlanResult {
  const no = (reason: string): PlanResult => ({ plan: null, reason });

  // 市区町村が並んでいる分類を探す(area とは限らない。件数が1,500以上の分類が候補)
  const cands = classes.filter((c) => c.items.length >= 1500);
  if (cands.length === 0) return no("市区町村単位(1,500件以上)の分類がありません");
  let geo: ClassObj | undefined;
  if (f.geo) geo = cands.find((c) => f.geo!.test(c.name));
  if (!geo) geo = cands.find((c) => c.id === "area") ?? (cands.length === 1 ? cands[0] : undefined);
  if (!geo) return no(`市区町村の分類を1つに決められません(候補: ${cands.map((c) => `${c.id}「${c.name}」`).join(" / ")})`);

  // 名前の先頭に団体コードが付いている分類か(過半数の項目が「5桁の数字+空白」で始まる)
  const nameMode = geo.items.filter((i) => /^\d{5}\s/.test(i.name)).length >= 1000;
  const codeMap = new Map<string, string>();
  for (const it of geo.items) {
    const code = muniCode(it, nameMode);
    if (code) codeMap.set(it.code, code);
  }
  if (codeMap.size < 1000) {
    return no(`分類 ${geo.id}(${geo.name})の項目から5桁の団体コードを読めたのが ${codeMap.size} 件だけです(例: ${geo.items.slice(0, 3).map((i) => `${i.code}=${i.name}`).join(" / ")})`);
  }

  let time: string | null = null;
  const timeCls = classes.find((c) => c.id === "time");
  if (timeCls) {
    const hit = timeCls.items.filter((i) => yearRe.test(i.name));
    if (hit.length === 0) return no(`時間軸に ${yearRe} に当たる年がありません(${timeCls.items.slice(0, 6).map((i) => i.name).join(" / ")})`);
    time = hit[hit.length - 1].code;
  }

  // 表章項目が1つだけの表は、それを使う(表によっては「病院数;病床数」のように1つにまとまっている)
  let tab: string | null = null;
  const tabCls = classes.find((c) => c.id === "tab");
  if (tabCls) {
    const hit = tabCls.items.length === 1 ? tabCls.items[0] : f.tab ? tabCls.items.find((i) => f.tab!.test(i.name)) : undefined;
    if (!hit) return no(`表章項目を決められません(${tabCls.items.slice(0, 8).map((i) => i.name).join(" / ")})`);
    tab = hit.code;
  }

  // 市区町村の分類以外は、取り出したい項目を指定した分類を除いて、すべて「総数」に固定する
  const fixed: Record<string, string> = {};
  let itemDone = !f.item;
  for (const c of classes) {
    if (c.id === geo.id || c.id === "tab" || c.id === "time") continue;
    if (f.item && !itemDone && /^cat\d+$/.test(c.id)) {
      const hit = c.items.find((i) => f.item!.test(i.name));
      if (hit) {
        fixed[c.id] = hit.code;
        itemDone = true;
        continue;
      }
    }
    const tot = pickTotal(c.items);
    if (!tot) return no(`分類 ${c.id}(${c.name})の「総数」を特定できません(${c.items.slice(0, 8).map((i) => i.name).join(" / ")})`);
    fixed[c.id] = tot.code;
  }
  if (!itemDone) return no(`どの分類にも ${f.item} に当たる項目がありません`);
  return { plan: { statsDataId, tab, time, fixed, geoId: geo.id, codeMap } };
}

async function fetchValues(plan: Plan): Promise<Map<string, number>> {
  const params: Record<string, string | number | undefined> = {
    statsDataId: plan.statsDataId,
    cdTab: plan.tab ?? undefined,
    cdTime: plan.time ?? undefined,
    metaGetFlg: "N",
    limit: 100000,
  };
  for (const [id, code] of Object.entries(plan.fixed)) params[cdKey(id)] = code;
  const out = new Map<string, number>();
  let start = 1;
  for (let page = 0; page < 50; page++) {
    const json = await api("getStatsData", { ...params, startPosition: start });
    if (page > 0) console.log(`    ...${page + 1}ページ目を取得中(${out.size}件)`);
    const { status, msg } = statusOf(json, "GET_STATS_DATA");
    if (status >= 100) throw new Error(`getStatsData エラー: ${status} ${msg}`);
    for (const r of arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE)) {
      const n = toNumber(r["$"]);
      const code = plan.codeMap.get(String(r[`@${plan.geoId}`]));
      if (n != null && code) out.set(code, n);
    }
    const next = json?.GET_STATS_DATA?.STATISTICAL_DATA?.RESULT_INF?.NEXT_KEY ?? json?.GET_STATS_DATA?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  return out;
}

// ------------------------------------------------------------- 政令指定都市の補完

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

/** 市全体の行がない政令指定都市について、区の合計を市全体の値にする。補った市の数を返す */
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

// ------------------------------------------------------------- 検証と保存

function siteMunicipalityCodes(): string[] {
  const p = path.join("data", "cities.json");
  const list = JSON.parse(fs.readFileSync(p, "utf-8")) as { code: string; name: string }[];
  return list.filter((c) => c.name.split(" ").length !== 3 && c.name !== "東京都 特別区部").map((c) => String(c.code));
}

type Store = { meta: Record<string, any> | null; values: Record<string, Record<string, number>> };

function loadStore(): Store {
  if (!fs.existsSync(OUTPUT)) return { meta: null, values: {} };
  const s = JSON.parse(fs.readFileSync(OUTPUT, "utf-8")) as Store;
  return { meta: s.meta ?? null, values: s.values ?? {} };
}

function checkField(f: Field, values: Map<string, number>, codes: string[]): string[] {
  const problems: string[] = [];
  const hit = codes.filter((c) => values.has(c));
  const coverage = hit.length / codes.length;
  if (coverage < MIN_COVERAGE) problems.push(`${f.label}: 値がある市町村が少なすぎます(${(coverage * 100).toFixed(1)}%)`);
  const sum = hit.reduce((s, c) => s + (values.get(c) ?? 0), 0);
  if (sum < f.range[0] || sum > f.range[1]) {
    problems.push(`${f.label}: 全国合計が想定の範囲外です(${sum.toLocaleString()}。想定 ${f.range[0].toLocaleString()}〜${f.range[1].toLocaleString()})`);
  }
  return problems;
}

// ---------------------------------------------------------------- main

function printClasses(id: string, classes: ClassObj[]) {
  console.error(`  [${id}] の分類(診断用):`);
  for (const k of classes) {
    console.error(`    ${k.id} (${k.name}): ${k.items.length}件 例: ${k.items.slice(0, 10).map((i) => i.name).join(" / ")}`);
    if (k.items.length >= 1500) console.error(`      (コード=名前の例: ${k.items.slice(0, 4).map((i) => `${i.code}=${i.name}`).join(" / ")})`);
  }
}

async function runGroup(g: Group, store: Store, codes: string[]): Promise<boolean> {
  console.log(`\n■ ${g.label}`);
  const results: { f: Field; values: Map<string, number>; tableId: string }[] = [];
  for (const t of g.tables) {
    let classes: ClassObj[];
    try {
      classes = await getClasses(t.id);
    } catch (e) {
      console.error(`  統計表 ${t.id}: ${String(e)}`);
      return false;
    }
    for (const f of t.fields) {
      const { plan, reason } = buildPlan(t.id, classes, f, g.yearRe);
      if (!plan) {
        console.error(`  ${f.label}: 統計表 ${t.id} から取り出す方法を決められませんでした`);
        console.error(`    理由: ${reason}`);
        printClasses(t.id, classes);
        return false;
      }
      const values = await fetchValues(plan);
      const filled = f.fillWards ? fillParents(values) : 0;
      // 政令指定都市の補完のあとで、表に載っているのに値がない市区町村を 0 にする(順番が逆だと、市全体が 0 になってしまう)
      let zeros = 0;
      if (f.missingIsZero) {
        for (const code of plan.codeMap.values()) {
          if (!values.has(code)) {
            values.set(code, 0);
            zeros++;
          }
        }
      }
      console.log(`  ${f.label}: 統計表 ${t.id} から ${values.size} 件取得${filled > 0 ? `(政令指定都市 ${filled}市を区の合計で補いました)` : ""}${zeros > 0 ? `(値がない ${zeros}市区町村を0件として扱いました)` : ""}`);
      results.push({ f, values, tableId: t.id });
    }
  }
  const problems = results.flatMap((r) => checkField(r.f, r.values, codes));
  if (problems.length > 0) {
    console.error("  検証に失敗したため、この統計は保存しません:");
    for (const p of problems) console.error("    - " + p);
    return false;
  }
  for (const r of results) {
    for (const [code, v] of r.values) {
      if (!/^\d{5}$/.test(code)) continue;
      (store.values[code] ??= {})[r.f.key] = v;
    }
  }
  store.meta = {
    ...(store.meta ?? {}),
    [g.name]: { year: g.year, source: g.label, tables: [...new Set(results.map((r) => r.tableId))], fetchedAt: new Date().toISOString() },
  };
  console.log(`  保存対象に加えました(${g.year}年)`);
  return true;
}

async function listAll() {
  for (const g of SPECS) {
    for (const t of g.tables) {
      try {
        const cls = await getClasses(t.id);
        console.log(`\n[${t.id}] ${g.label}`);
        for (const k of cls) {
          const head = k.items.slice(0, 8).map((i) => i.name).join(" / ");
          console.log(`  ${k.id} (${k.name}): ${k.items.length}件 例: ${head}`);
        }
        for (const f of t.fields) {
          const r = buildPlan(t.id, cls, f, g.yearRe);
          console.log(`  → ${f.label}: ${r.plan ? "取り出せる" : `取り出せない(${r.reason})`}`);
        }
      } catch (e) {
        console.log(`  (${t.id}: ${String(e)})`);
      }
    }
  }
}

async function main() {
  if (!APP_ID) throw new Error(".env.local に ESTAT_APP_ID がありません");
  if (process.argv.includes("--list")) return listAll();

  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
  const store = loadStore();
  const codes = siteMunicipalityCodes();
  let ok = 0;
  let ng = 0;
  for (const g of SPECS.filter((x) => !only || x.name === only)) {
    (await runGroup(g, store, codes)) ? ok++ : ng++;
  }
  if (ok > 0) {
    fs.writeFileSync(OUTPUT, JSON.stringify(store), "utf-8");
    console.log(`\n${OUTPUT} を保存しました(成功 ${ok} / 失敗 ${ng})`);
  }
  if (ng > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exitCode = 1;
});
