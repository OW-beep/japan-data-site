/* eslint-disable @typescript-eslint/no-explicit-any -- e-Stat APIのJSONは型がないため any を使う */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 令和7年国勢調査(人口等基本集計・確定値。2026年9月29日公表)から、
// 市区町村別の「総人口」「15歳未満人口」「65歳以上人口」を
// e-Stat API で取得し、data/population-2025.json に保存する。
//
// 統計表ID(statsDataId)は自動で探す:
//   1. getStatsList で「令和7年国勢調査・市区町村単位」の表を一覧にする
//   2. 表題で候補に点数をつけ、上位の表の getMetaInfo を調べて
//      「総人口」「15歳未満」「65歳以上」を取り出せる表を選ぶ
//   3. getStatsData で全市区町村分を取得する(ページ送りに対応)
//
// 【使い方】
//   npm run fetch:census2025                  … 自動で表を探して取得
//   npm run fetch:census2025 -- --list        … 候補の表と分類の中身を表示(診断用)
//   npm run fetch:census2025 -- --table=ID    … 統計表IDを指定して取得
//   (環境変数 CENSUS2025_TABLE_ID でも指定できる)
//
// 必要なもの: .env.local の ESTAT_APP_ID(これまでのスクリプトと同じ)
//
// 【取得後のチェック】
//   - サイトの自治体(data/cities.json)のうち95%以上のコードが見つかること
//   - 人口の合計が、人口速報集計の全国人口(123,049,524人)から0.5%以内であること
//   どちらかを満たさない場合は、ファイルを書き込まずにエラーで終了する。
//
// 【注意】Claude の実行環境から api.e-stat.go.jp へは到達できないため、
//   実際のAPIでは未検証です(e-Statの応答形式を模したモックで、
//   表の選択・取得・ページ送り・検証のロジックは検証済み)。
//   うまく選べなかった場合は --list の出力を共有してください。
// ------------------------------------------------------------------

const API_BASE =
  process.env.ESTAT_API_BASE ?? "https://api.e-stat.go.jp/rest/3.0/app/json";
const STATS_CODE = "00200521"; // 国勢調査
const SURVEY_YEAR = "2025";
/** 人口速報集計(令和8年5月29日公表)の全国人口。取得結果の妥当性チェックに使う。 */
const EXPECTED_NATIONAL = 123_049_524;
const TOLERANCE = 0.01;
const MIN_COVERAGE = 0.95;

const APP_ID = process.env.ESTAT_APP_ID;
const OUTPUT = path.join("data", "population-2025.json");

// ---------------------------------------------------------------- utils

const arr = <T,>(v: T | T[] | undefined | null): T[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

/** 全角数字などを半角にそろえる(「１５歳未満」→「15歳未満」) */
const norm = (s: unknown) => String(s ?? "").normalize("NFKC").trim();

/** TITLE は文字列のときとオブジェクト({ "$": "..." })のときがある */
function textOf(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "$" in v) return String(v["$"]);
  return String(v);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api(
  endpoint: string,
  params: Record<string, string | number | undefined>
): Promise<any> {
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

// ----------------------------------------------------- 1. 候補の表を探す

type Candidate = { id: string; title: string; name: string; score: number };

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

    const tables = arr<any>(json?.GET_STATS_LIST?.DATALIST_INF?.TABLE_INF);
    for (const t of tables) {
      const raw = JSON.stringify(t);
      if (raw.includes("不詳補完")) continue; // 参考表(補完値)は除く
      const title = textOf(t.TITLE);
      const name = textOf(t.STATISTICS_NAME);
      out.push({ id: String(t["@id"]), title, name, score: scoreTitle(title + " " + name) });
    }

    // 続きのキーは DATALIST_INF.RESULT_INF にある(古い書き方の位置も念のため見る)
    const next =
      json?.GET_STATS_LIST?.DATALIST_INF?.RESULT_INF?.NEXT_KEY ??
      json?.GET_STATS_LIST?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  // 同じIDが重複して返ることがあるので除く
  const seen = new Set<string>();
  return out
    .filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)))
    .sort((a, b) => b.score - a.score);
}

function scoreTitle(raw: string): number {
  const s = norm(raw);
  let score = 0;
  if (/年齢/.test(s)) score += 4;
  if (/年齢/.test(s) && /3区分|5歳階級|５歳階級/.test(s)) score += 4;
  if (/主な結果/.test(s)) score += 4;
  if (/人口/.test(s)) score += 2;
  if (/市区町村|市町村/.test(s)) score += 1;
  if (/総人口|男女別人口|人口，|人口、/.test(s)) score += 1;
  if (/世帯主|一般世帯|住宅|家族類型|世帯人員|就業|産業|職業|住居|親子|外国人|国籍|母子|父子|高齢者世帯|従業|通学|移動|夫婦|居住期間|教育|労働力|組替/.test(s)) score -= 8;
  if (/時系列/.test(s)) score -= 2;
  return score;
}

// ---------------------------------------- 2. 表の分類を調べて取得方法を決める

type ClassItem = { code: string; name: string };
type ClassObj = { id: string; name: string; items: ClassItem[] };

async function getClasses(statsDataId: string): Promise<ClassObj[]> {
  const json = await api("getMetaInfo", { statsDataId });
  const { status, msg } = statusOf(json, "GET_META_INFO");
  if (status >= 100) throw new Error(`getMetaInfo エラー: ${status} ${msg}`);
  const objs = arr<any>(json?.GET_META_INFO?.METADATA_INF?.CLASS_INF?.CLASS_OBJ);
  return objs.map((o) => ({
    id: String(o["@id"]),
    name: String(o["@name"] ?? ""),
    items: arr<any>(o.CLASS).map((c) => ({
      code: String(c["@code"]),
      name: norm(c["@name"]),
    })),
  }));
}

/** 年齢の分類から、総数・15歳未満・65歳以上の各コードを決める */
type AgePlan = { id: string; total: string; child: string[]; elderly: string[] };

type Plan = {
  statsDataId: string;
  tab: string | null;
  time: string | null;
  age?: AgePlan;
  /** 年齢以外の分類で選んだコード */
  fixed: Record<string, string>;
  hasAge: boolean;
  /** 地域コード → 地域名 */
  areaNames: Map<string, string>;
};

const TOTAL_RE = /^(総数|年齢総数|総人口|人口総数|男女総数|国籍総数|総数[（(].*[)）]|全国籍)$/;

function pickTotal(items: ClassItem[]): ClassItem | null {
  const hit = items.find((i) => TOTAL_RE.test(i.name));
  if (hit) return hit;
  if (items.length === 1) return items[0];
  return null;
}

/** 5歳階級などの名前から、階級の開始年齢を読む(「65〜69歳」→65、「100歳以上」→100) */
function startAge(name: string): number | null {
  const m = name.match(/^(\d+)(?:歳)?[〜～~-]\d+歳?$/) ?? name.match(/^(\d+)歳以上$/);
  return m ? Number(m[1]) : null;
}

function buildAge(c: ClassObj): AgePlan | null {
  const total = c.items.find((i) => /^(総数|年齢総数|総人口|人口総数|総数[（(].*[)）])$/.test(i.name));
  if (!total) return null;

  // (a) 年齢3区分: 15歳未満 / 65歳以上 がそのまま入っている
  const child3 = c.items.find((i) => /^(15歳未満|0[〜～~-]14歳)$/.test(i.name));
  const elderly3 = c.items.find((i) => /^65歳以上$/.test(i.name));
  if (child3 && elderly3) {
    return { id: c.id, total: total.code, child: [child3.code], elderly: [elderly3.code] };
  }

  // (b) 5歳階級: 0〜4・5〜9・10〜14歳を足して15歳未満、65歳以上の階級を足して65歳以上
  const aged = c.items
    .map((i) => ({ i, a: startAge(i.name) }))
    .filter((x): x is { i: ClassItem; a: number } => x.a != null);
  const childCodes = aged.filter((x) => x.a <= 10 && /[〜～~-]/.test(x.i.name)).map((x) => x.i.code);
  const exact65 = c.items.find((i) => /^65歳以上$/.test(i.name));
  let elderlyCodes: string[];
  if (exact65) {
    elderlyCodes = [exact65.code];
  } else {
    // 65歳以上の階級(65〜69歳, 70〜74歳, ...)を足す。「85歳以上」のような
    // 開いた階級は、それより細かい階級がないときだけ足す(二重計上を避ける)。
    const ranges = aged.filter((x) => x.a >= 65 && /[〜～~-]/.test(x.i.name));
    const opens = aged.filter((x) => x.a >= 65 && /^\d+歳以上$/.test(x.i.name));
    elderlyCodes = ranges.map((x) => x.i.code);
    for (const o of opens) {
      if (!ranges.some((r) => r.a >= o.a)) elderlyCodes.push(o.i.code);
    }
  }

  if (childCodes.length === 3 && (exact65 || elderlyCodes.length >= 4)) {
    return { id: c.id, total: total.code, child: childCodes, elderly: [...new Set(elderlyCodes)] };
  }
  return null;
}

function buildPlan(statsDataId: string, classes: ClassObj[]): Plan | null {
  const area = classes.find((c) => c.id === "area");
  if (!area || area.items.length < 1500) return null; // 市区町村単位の表のみ

  const timeCls = classes.find((c) => c.id === "time");
  let time: string | null = null;
  if (timeCls) {
    const hit = timeCls.items.filter((i) => /2025|令和7年/.test(i.name));
    if (hit.length === 0) return null;
    time = hit[hit.length - 1].code;
  }

  // 表章項目は「人口」でなければならない(世帯数などの表を誤って使わない)
  let tab: string | null = null;
  const tabCls = classes.find((c) => c.id === "tab");
  if (tabCls) {
    const hit =
      tabCls.items.find((i) => /^人口(（人）|\(人\))?$/.test(i.name)) ??
      tabCls.items.find(
        (i) => /人口/.test(i.name) && !/増減|密度|構成比|性比|世帯|率|平均|中位|割合/.test(i.name)
      );
    if (!hit) return null;
    tab = hit.code;
  }

  const fixed: Record<string, string> = {};
  let age: AgePlan | undefined;

  for (const c of classes.filter((c) => /^cat\d+$/.test(c.id))) {
    if (!age) {
      const a = buildAge(c);
      if (a) {
        age = a;
        continue;
      }
    }
    const pick = pickTotal(c.items);
    if (!pick) return null; // 総数を特定できない分類が残る表は使わない
    fixed[c.id] = pick.code;
  }

  const areaNames = new Map(area.items.map((i) => [i.code, i.name]));
  return { statsDataId, tab, time, age, fixed, hasAge: Boolean(age), areaNames };
}

// ------------------------------------------------------------- 3. 取得

type Value = { population: number | null; child: number | null; elderly: number | null };

function toNumber(v: unknown): number | null {
  const s = String(v ?? "").replace(/,/g, "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

const cdKey = (id: string) => `cd${id.charAt(0).toUpperCase()}${id.slice(1)}`;

async function fetchValues(plan: Plan): Promise<Map<string, Value>> {
  const params: Record<string, string | number | undefined> = {
    statsDataId: plan.statsDataId,
    cdTab: plan.tab ?? undefined,
    cdTime: plan.time ?? undefined,
    metaGetFlg: "N",
    limit: 100000,
  };
  for (const [id, code] of Object.entries(plan.fixed)) params[cdKey(id)] = code;
  if (plan.age) {
    params[cdKey(plan.age.id)] = [plan.age.total, ...plan.age.child, ...plan.age.elderly].join(",");
  }

  const childSet = new Set(plan.age?.child ?? []);
  const elderlySet = new Set(plan.age?.elderly ?? []);

  const result = new Map<string, Value>();
  const ensure = (code: string) => {
    let v = result.get(code);
    if (!v) result.set(code, (v = { population: null, child: null, elderly: null }));
    return v;
  };

  let start = 1;
  for (let page = 0; page < 50; page++) {
    const json = await api("getStatsData", { ...params, startPosition: start });
    const { status, msg } = statusOf(json, "GET_STATS_DATA");
    if (status >= 100) throw new Error(`getStatsData エラー: ${status} ${msg}`);

    const values = arr<any>(json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE);
    for (const r of values) {
      const code = String(r["@area"]);
      const num = toNumber(r["$"]);
      if (num == null) continue;
      const v = ensure(code);
      if (plan.age) {
        const k = String(r[`@${plan.age.id}`]);
        if (k === plan.age.total) v.population = num;
        else if (childSet.has(k)) v.child = (v.child ?? 0) + num;
        else if (elderlySet.has(k)) v.elderly = (v.elderly ?? 0) + num;
      } else {
        v.population = num;
      }
    }

    const next =
      json?.GET_STATS_DATA?.STATISTICAL_DATA?.RESULT_INF?.NEXT_KEY ??
      json?.GET_STATS_DATA?.RESULT_INF?.NEXT_KEY;
    if (!next) break;
    start = Number(next);
  }
  return result;
}

// ------------------------------------------------------------- 検証と保存

function siteCodes(): string[] | null {
  const p = path.join("data", "cities.json");
  if (!fs.existsSync(p)) return null;
  const cities = JSON.parse(fs.readFileSync(p, "utf-8")) as { code: string }[];
  return cities.map((c) => String(c.code));
}

type Check = {
  ok: boolean;
  reason: string;
  /** サイトの自治体(区を除く)のうち、値が取れた割合 */
  coverage: number;
  total: number;
  missing: string[];
  usedSiteCodes: boolean;
  /** 表の「全国」行の人口(なければ null) */
  nationalRow: number | null;
  /** 47都道府県の合計(47件そろわなければ null) */
  prefSum: number | null;
  /** 検証に使った全国人口(表の全国行 → 都道府県合計 → サイト自治体の合計 の順) */
  reference: number;
  referenceFrom: string;
  diff: number;
  /** サイトの自治体(区を除く)の人口合計と、全国人口に対する割合 */
  siteSum: number;
  siteShare: number;
  /** 表にあるのにサイトの自治体リストにない自治体(人口の多い順) */
  unmatched: { code: string; name: string; pop: number }[];
  childShare: number | null;
  elderlyShare: number | null;
  ageOk: boolean;
};

/** 全国・都道府県など、市区町村ではない集計行 */
const isAggregateCode = (code: string) => !/^\d{5}$/.test(code) || code.endsWith("000");

/**
 * 政令指定都市の区(例: 14101 横浜市鶴見区、14131 川崎市川崎区)かどうか。
 * 下3桁が101〜199で東京都(13)以外。ただし、川崎(14130)・相模原(14150)・浜松(22130)・
 * 堺(27140)・福岡(40130)のように、市全体のコード自体が101〜199にある市があるので、
 * 市全体のコードは区として扱わない。東京23区は自治体なので対象外。
 */
function isDesignatedCityWardCode(code: string): boolean {
  if (!/^\d{5}$/.test(code) || code.startsWith("13")) return false;
  if (PARENT_CODE_SET.has(code)) return false;
  const n = Number(code.slice(2));
  return n > 100 && n < 200;
}

/** 区のコードから、その区が属する政令指定都市の市全体のコードを返す(同じ県で、区より小さい最大の親コード) */
function parentOfWard(code: string): string | null {
  const parents = DESIGNATED_PARENTS.map(([c]) => c).filter((c) => c.startsWith(code.slice(0, 2)) && c < code);
  return parents.length > 0 ? parents[parents.length - 1] : null;
}

/** 政令指定都市20市の「市全体」の地域コード */
const DESIGNATED_PARENTS: [string, string][] = [
  ["01100", "札幌市"], ["04100", "仙台市"], ["11100", "さいたま市"], ["12100", "千葉市"],
  ["14100", "横浜市"], ["14130", "川崎市"], ["14150", "相模原市"], ["15100", "新潟市"],
  ["22100", "静岡市"], ["22130", "浜松市"], ["23100", "名古屋市"], ["26100", "京都市"],
  ["27100", "大阪市"], ["27140", "堺市"], ["28100", "神戸市"], ["33100", "岡山市"],
  ["34100", "広島市"], ["40100", "北九州市"], ["40130", "福岡市"], ["43100", "熊本市"],
];

const PARENT_CODE_SET = new Set(DESIGNATED_PARENTS.map(([c]) => c));

type ParentReport = {
  code: string;
  name: string;
  inSite: boolean;
  parentPop: number | null;
  wardCount: number;
  wardSum: number;
  filled: boolean;
};

/**
 * 表に政令指定都市の「市全体」の行がなく、区の行だけがあるとき、
 * 区の合計を市全体の値として補う(市の人口は区の人口の合計)。
 */
function fillDesignatedParents(
  values: Map<string, Value>,
  siteSet: Set<string> | null
): ParentReport[] {
  const wardSums = new Map<string, { pop: number; child: number; elderly: number; n: number; ageComplete: boolean }>();
  for (const [code, v] of values) {
    if (!isDesignatedCityWardCode(code) || v.population == null) continue;
    const parent = parentOfWard(code);
    if (!parent) continue;
    const cur = wardSums.get(parent) ?? { pop: 0, child: 0, elderly: 0, n: 0, ageComplete: true };
    cur.pop += v.population;
    cur.n++;
    if (v.child == null || v.elderly == null) cur.ageComplete = false;
    else {
      cur.child += v.child;
      cur.elderly += v.elderly;
    }
    wardSums.set(parent, cur);
  }

  const out: ParentReport[] = [];
  for (const [code, name] of DESIGNATED_PARENTS) {
    const w = wardSums.get(code);
    const existing = values.get(code)?.population ?? null;
    let filled = false;
    if (existing == null && w && w.n > 0) {
      values.set(code, {
        population: w.pop,
        child: w.ageComplete ? w.child : null,
        elderly: w.ageComplete ? w.elderly : null,
      });
      filled = true;
    }
    out.push({
      code,
      name,
      inSite: siteSet ? siteSet.has(code) : true,
      parentPop: existing,
      wardCount: w?.n ?? 0,
      wardSum: w?.pop ?? 0,
      filled,
    });
  }
  return out;
}

function validate(
  values: Map<string, Value>,
  hasAge: boolean,
  areaNames: Map<string, string>
): Check {
  const codes = siteCodes();
  const siteSet = codes ? new Set(codes) : null;
  const target = codes ?? [...values.keys()].filter((c) => !isAggregateCode(c));
  // 人口の合計では二重計上を避ける:
  //   - 特別区部(13100)は23区の合計
  //   - 政令指定都市の区は、親の市(xx100)の内訳
  const forSum = target.filter((c) => c !== "13100" && !isDesignatedCityWardCode(c));

  let matched = 0;
  let siteSum = 0;
  let childSum = 0;
  let elderlySum = 0;
  let ageBase = 0;
  const missing: string[] = [];
  for (const c of forSum) {
    const v = values.get(c);
    if (v?.population != null) {
      matched++;
      siteSum += v.population;
      if (v.child != null && v.elderly != null) {
        childSum += v.child;
        elderlySum += v.elderly;
        ageBase += v.population;
      }
    } else {
      missing.push(c);
    }
  }
  const coverage = forSum.length > 0 ? matched / forSum.length : 0;

  // 表そのものが「総人口」を表しているかは、サイトのリストに頼らず、
  // 表の「全国」行や47都道府県の合計で確かめる。
  const nationalRow = values.get("00000")?.population ?? null;
  const prefRows = [...values.entries()].filter(
    ([c, v]) => /^\d{2}000$/.test(c) && c !== "00000" && v.population != null
  );
  const prefSum = prefRows.length === 47 ? prefRows.reduce((t, [, v]) => t + (v.population ?? 0), 0) : null;

  let reference = siteSum;
  let referenceFrom = "サイトの自治体の合計";
  if (nationalRow != null) {
    reference = nationalRow;
    referenceFrom = "表の全国行";
  } else if (prefSum != null) {
    reference = prefSum;
    referenceFrom = "47都道府県の合計";
  }
  const diff = Math.abs(reference - EXPECTED_NATIONAL) / EXPECTED_NATIONAL;
  const innerGap =
    nationalRow != null && prefSum != null ? Math.abs(nationalRow - prefSum) / nationalRow : 0;

  const siteShare = reference > 0 ? siteSum / reference : 0;

  const unmatched: Check["unmatched"] = [];
  if (siteSet) {
    for (const [c, v] of values) {
      if (v.population == null || isAggregateCode(c)) continue;
      if (c === "13100" || isDesignatedCityWardCode(c) || siteSet.has(c)) continue;
      const name = areaNames.get(c) ?? "";
      // 「2000年市区町村含む」の表には「(旧:堺市)」のような合併前の自治体が入っている。
      // 現在の自治体ではないので、サイトに無くてよい。
      if (/^[（(]旧/.test(name)) continue;
      unmatched.push({ code: c, name, pop: v.population });
    }
    unmatched.sort((a, b) => b.pop - a.pop);
  }

  const childShare = ageBase > 0 ? childSum / ageBase : null;
  const elderlyShare = ageBase > 0 ? elderlySum / ageBase : null;
  // 年齢の集計が妥当か(日本の年少人口割合は約10〜13%、高齢化率は約28〜31%)
  const ageOk =
    !hasAge ||
    (childShare != null && elderlyShare != null &&
      childShare >= 0.09 && childShare <= 0.14 &&
      elderlyShare >= 0.26 && elderlyShare <= 0.33);

  let reason = "";
  if (coverage < MIN_COVERAGE) reason = `サイトの自治体コードの一致率が低い(${(coverage * 100).toFixed(1)}%)`;
  else if (diff > TOLERANCE) {
    reason = `全国人口が${reference.toLocaleString()}人(${referenceFrom})で、速報とずれている(${(diff * 100).toFixed(1)}%)`;
  } else if (innerGap > 0.005) reason = "表の全国行と都道府県の合計が合わない";
  else if (!ageOk) {
    reason = `年齢の割合が不自然(15歳未満${((childShare ?? 0) * 100).toFixed(1)}%・65歳以上${((elderlyShare ?? 0) * 100).toFixed(1)}%)`;
  }

  return {
    ok: reason === "",
    reason,
    coverage,
    total: forSum.length,
    missing,
    usedSiteCodes: Boolean(codes),
    nationalRow,
    prefSum,
    reference,
    referenceFrom,
    diff,
    siteSum,
    siteShare,
    unmatched,
    childShare,
    elderlyShare,
    ageOk,
  };
}

type Attempt = {
  plan: Plan;
  title: string;
  values: Map<string, Value>;
  check: Check;
  parents: ParentReport[];
};

async function attempt(plan: Plan, title: string): Promise<Attempt> {
  const values = await fetchValues(plan);
  const codes = siteCodes();
  const parents = fillDesignatedParents(values, codes ? new Set(codes) : null);
  return { plan, title, values, check: validate(values, plan.hasAge, plan.areaNames), parents };
}

function describe(a: Attempt) {
  const c = a.check;
  console.log(
    `  取得: ${values(a)}地域 / 全国人口 ${c.reference.toLocaleString()}人(${c.referenceFrom})` +
      ` / サイトの自治体との一致 ${(c.coverage * 100).toFixed(1)}%` +
      (a.plan.hasAge && c.childShare != null
        ? ` / 15歳未満 ${(c.childShare * 100).toFixed(1)}% / 65歳以上 ${((c.elderlyShare ?? 0) * 100).toFixed(1)}%`
        : "")
  );
}
const values = (a: Attempt) => a.values.size.toLocaleString();

async function main() {
  if (!APP_ID) {
    console.error("ESTAT_APP_ID が未設定です。.env.local に ESTAT_APP_ID=xxxx を追加してください。");
    process.exit(1);
  }

  const listOnly = process.argv.includes("--list");
  const verbose = process.argv.includes("--verbose") || listOnly;
  const tableArg = process.argv.find((a) => a.startsWith("--table="))?.split("=")[1];
  const forcedId = tableArg ?? process.env.CENSUS2025_TABLE_ID;

  let chosen: Attempt | null = null;

  if (forcedId) {
    const classes = await getClasses(forcedId);
    const plan = buildPlan(forcedId, classes);
    if (!plan) {
      console.error(`統計表 ${forcedId} から人口を取り出せませんでした。分類は次のとおりです:`);
      for (const c of classes) console.error(`  ${c.id} ${c.name} (${c.items.length}件) 例: ${c.items.slice(0, 5).map((i) => i.name).join(" / ")}`);
      process.exit(1);
    }
    console.log(`使用する表(指定): ${forcedId}`);
    chosen = await attempt(plan, `(指定) ${forcedId}`);
    describe(chosen);
  } else {
    console.log("令和7年国勢調査(市区町村単位)の統計表を検索中...");
    const candidates = await listCandidates();
    console.log(`候補: ${candidates.length} 表`);
    if (candidates.length === 0) {
      console.error("候補が0件でした。公表直後でAPIに反映されていない可能性があります。");
      process.exit(1);
    }
    if (verbose) {
      console.log("--- 点数の高い候補(上位40) ---");
      for (const c of candidates.slice(0, 40)) console.log(`${String(c.score).padStart(3)}  ${c.id}  ${c.title}`);
      console.log("---");
    }

    // 点数の高い順に、分類から「人口の表」を判定し、実際に取得して検証する。
    // 検証(自治体の一致率・人口の合計・年齢の割合)に通った最初の表を使う。
    const MAX_META = 400;
    const MAX_FETCH = 10;
    const log: string[] = [];
    const note = (id: string, outcome: string, title: string) =>
      log.push(`${id}\t${outcome}\t${title.slice(0, 70)}`);
    let fetched = 0;
    const populationOnly: { plan: Plan; title: string }[] = [];

    for (const c of candidates.slice(0, MAX_META)) {
      if (fetched >= MAX_FETCH) break;
      let classes: ClassObj[];
      try {
        classes = await getClasses(c.id);
      } catch (e) {
        note(c.id, `分類を取得できない(${String(e).slice(0, 30)})`, c.title);
        continue;
      }
      const plan = buildPlan(c.id, classes);
      if (!plan) {
        note(c.id, "対象外(人口の表でない/総数を特定できない)", c.title);
        continue;
      }
      if (!plan.hasAge) {
        populationOnly.push({ plan, title: c.title });
        note(c.id, "人口のみ(保留)", c.title);
        continue;
      }
      note(c.id, "年齢つき→検証", c.title);
      console.log(`候補を検証: ${c.id} ${c.title.slice(0, 60)}`);
      fetched++;
      const a = await attempt(plan, c.title);
      describe(a);
      if (a.check.ok) {
        chosen = a;
        break;
      }
      console.log(`  → 見送り: ${a.check.reason}`);
    }

    // 人口のみの表は「男女別人口」を優先し、上位5表まで検証する
    populationOnly.sort(
      (a, b) => Number(/^男女別人口/.test(b.title)) - Number(/^男女別人口/.test(a.title))
    );
    if (!chosen && !listOnly) {
      for (const p of populationOnly.slice(0, 5)) {
        console.log(`人口のみの表を検証: ${p.plan.statsDataId} ${p.title.slice(0, 60)}`);
        const a = await attempt(p.plan, p.title);
        describe(a);
        if (a.check.ok) {
          console.warn("年齢3区分まで取れる表が見つからなかったため、人口のみの表を使います。");
          chosen = a;
          break;
        }
        console.log(`  → 見送り: ${a.check.reason}`);
      }
    }

    // 年齢つきの表が選べなかったときも、理由を調べられるように一覧を出す
    if (listOnly || !chosen || !chosen.plan.hasAge) {
      console.log("\n--- 全候補の判定結果 (ID / 判定 / 表題) ---");
      for (const l of log) console.log(l);
      console.log("---");
    }
    if (listOnly) return;

    if (!chosen) {
      console.error(
        "検証に通る表を自動で選べませんでした。\n" +
          "  上の「全候補の判定結果」を共有してください。"
      );
      process.exit(1);
    }
  }

  const { plan, title, values: vals, check: v, parents } = chosen;
  console.log(`\n使用する表: ${plan.statsDataId} ${title}`);
  console.log(`  年齢の集計: ${plan.hasAge ? "あり" : "なし(人口のみ)"} / 時点コード: ${plan.time}`);
  console.log(
    `サイトの自治体との一致: ${(v.coverage * 100).toFixed(1)}% (${v.total - v.missing.length}/${v.total})` +
      `${v.usedSiteCodes ? "" : " ※data/cities.json が無いため全国の地域コードで集計"}`
  );
  console.log(
    `全国人口: ${v.reference.toLocaleString()}人(${v.referenceFrom}。速報 ${EXPECTED_NATIONAL.toLocaleString()}人との差 ${(v.diff * 100).toFixed(2)}%)`
  );
  if (v.nationalRow != null && v.prefSum != null) {
    console.log(`  47都道府県の合計: ${v.prefSum.toLocaleString()}人`);
  }
  console.log(
    `サイトの自治体(区を除く)の人口合計: ${v.siteSum.toLocaleString()}人 = 全国の ${(v.siteShare * 100).toFixed(1)}%`
  );
  const filled = parents.filter((p) => p.filled);
  if (filled.length > 0) {
    console.log(
      `政令指定都市のうち ${filled.length} 市は、表に「市全体」の行がなかったため、区の合計で補いました: ` +
        filled.map((p) => p.name).join("、")
    );
  }
  if (v.siteShare < 0.99 || parents.some((p) => !p.inSite || (p.parentPop == null && !p.filled))) {
    console.log("--- 政令指定都市の確認 (コード 市 / サイトに市全体の行 / 表の市全体 / 区の数・区の合計) ---");
    for (const p of parents) {
      console.log(
        `  ${p.code} ${p.name}\t サイト:${p.inSite ? "あり" : "なし"}\t 表:${p.parentPop != null ? p.parentPop.toLocaleString() : p.filled ? "なし→区の合計で補完" : "なし"}\t 区 ${p.wardCount}件 ${p.wardSum.toLocaleString()}人`
      );
    }
    console.log("---");
  }
  if (v.unmatched.length > 0) {
    console.warn(
      `注意: 現在の自治体で、表にあるのにサイトの自治体リスト(data/cities.json)にないものが ${v.unmatched.length} あります` +
        `(人口の合計 ${v.unmatched.reduce((t, u) => t + u.pop, 0).toLocaleString()}人)。上位:`
    );
    for (const u of v.unmatched.slice(0, 20)) {
      console.warn(`    ${u.code} ${u.name} ${u.pop.toLocaleString()}人`);
    }
  } else if (v.siteShare < 0.97) {
    console.warn("注意: サイトの自治体の人口合計が全国人口の97%未満ですが、表との照合では欠けた自治体を特定できませんでした。");
  }

  if (!v.ok) {
    console.error(`検証に通らないため、保存しませんでした: ${v.reason}`);
    console.error(`見つからなかったコードの例: ${v.missing.slice(0, 15).join(", ")}`);
    process.exit(1);
  }

  const codes = siteCodes();
  const codeSet = codes ? new Set(codes) : null;
  const keep = (c: string) => (codeSet ? codeSet.has(c) : /^\d{5}$/.test(c) && !c.endsWith("000"));
  const outValues: Record<string, [number, number | null, number | null]> = {};
  for (const [code, val] of [...vals.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!keep(code) || val.population == null) continue;
    outValues[code] = [val.population, val.child, val.elderly];
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(
    OUTPUT,
    JSON.stringify({
      meta: {
        source: "総務省統計局「令和7年国勢調査 人口等基本集計」",
        statsDataId: plan.statsDataId,
        title,
        hasAgeGroups: plan.hasAge,
        fetchedAt: new Date().toISOString(),
        coverage: Number(v.coverage.toFixed(4)),
        nationalPopulation: v.reference,
        siteShare: Number(v.siteShare.toFixed(4)),
      },
      // code -> [総人口, 15歳未満, 65歳以上]
      values: outValues,
    })
  );
  console.log(`保存しました: ${OUTPUT} (${Object.keys(outValues).length.toLocaleString()}自治体)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
