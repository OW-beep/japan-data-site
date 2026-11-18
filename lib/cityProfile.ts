/**
 * 自治体ページ用の「プロフィール分析」の材料。
 *
 * CityNarrative が人口と年齢構成を数字で読むのに対し、こちらは指標の組み合わせから
 * その自治体の「タイプ」を判定し、タイプに応じた考察と、将来推計の読み解き、
 * 際立つ指標のメモを返す。文章はタイプ別の型に、その自治体の実数(順位・全国平均との差)を
 * 流し込んで作るので、自治体ごとに中身が変わる。
 *
 * 数字はすべて既存の lib(cityInsight / ageRates / futurePopulation / taxableIncome と
 * municipalities の各項目)から計算する。外部データや、統計にない地域知識
 * (駅・商業施設・企業・歴史など)は使わない。
 * バリアントの選択は自治体コードの文字コード合計から決める(ビルドが安定するよう乱数は使わない)。
 */
import { getAgeRows, type AgeRow } from "./ageRates";
import { getCityInsight } from "./cityInsight";
import { FUTURE_YEARS, futureRank, getFuture, popIndex2050 } from "./futurePopulation";
import { allTax, getTax, incomeRank, nationalIncomePerTaxpayer } from "./taxableIncome";

export type IndicatorNote = { label: string; text: string };

export type CityProfile = {
  code: string;
  short: string;
  /** 主タイプのラベル(例: 成長都市型) */
  typeLabel: string;
  /** 副タイプのラベル(なければ null) */
  secondaryLabel: string | null;
  /** 考察文2段落 */
  paragraphs: string[];
  /** 将来の読み解き1段落(推計がない自治体は null) */
  future: string | null;
  /** 将来の軌道の分類ラベル */
  futureClass: string | null;
  /** 際立つ指標メモ(2件) */
  notes: IndicatorNote[];
};

type TypeKey = "growth" | "bedtown" | "hub" | "medical" | "industry" | "tourism" | "aging" | "balance";

const TYPE_LABEL: Record<TypeKey, string> = {
  growth: "成長都市型",
  bedtown: "ベッドタウン型",
  hub: "雇用・商業集積型",
  medical: "医療・福祉の拠点型",
  industry: "産業都市型",
  tourism: "観光・交流型",
  aging: "高齢化先行型",
  balance: "バランス型",
};

/* ---------- 表示用の整形 ---------- */
const n = (v: number) => Math.round(v).toLocaleString("ja-JP");
const f1 = (v: number) => v.toFixed(1);
const sgn = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`;
const sgnN = (v: number) => `${v > 0 ? "+" : ""}${n(v)}`;

/* ---------- 全国分布(パーセンタイル・中央値・順位の計算用) ---------- */
type Dist = { sorted: number[]; median: number };

function makeDist(values: number[]): Dist {
  const sorted = [...values].sort((a, b) => a - b);
  return { sorted, median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0 };
}
/** v より小さい値の割合(%)。100に近いほど全国の上位 */
function pctBelow(d: Dist, v: number): number {
  let lo = 0;
  let hi = d.sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (d.sorted[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return d.sorted.length ? (lo / d.sorted.length) * 100 : 0;
}
/** 大きい順の順位(同値は同じ位置に寄せる概算) */
function rankDesc(d: Dist, v: number): number {
  return d.sorted.filter((x) => x > v).length + 1;
}
/** 「上位○%」の○(最小1) */
const topPct = (pct: number) => Math.max(1, Math.ceil(100 - pct));

type IndKey =
  | "dayNight" | "doctors" | "secondary" | "retail" | "restaurant" | "accom"
  | "vacant" | "unemp" | "foreign" | "single" | "daycare" | "obr" | "rdsr" | "income";

function indValue(key: IndKey, r: AgeRow): number | null {
  const p = r.population; // 令和2年国勢調査の人口(SSDSE系の分母はこちらにそろえる)
  switch (key) {
    case "dayNight":
      return r.daytimePopulation != null && r.nighttimePopulation != null && r.nighttimePopulation > 0
        ? (r.daytimePopulation / r.nighttimePopulation) * 100
        : null;
    case "doctors":
      return r.doctorsCount != null && p > 0 ? (r.doctorsCount / p) * 100000 : null;
    case "secondary": {
      const pri = r.primaryIndustryWorkers ?? 0;
      const sec = r.secondaryIndustryWorkers ?? 0;
      const ter = r.tertiaryIndustryWorkers ?? 0;
      return r.secondaryIndustryWorkers != null && pri + sec + ter > 0 ? (sec / (pri + sec + ter)) * 100 : null;
    }
    case "retail":
      return r.retailStoreCount != null && p > 0 ? (r.retailStoreCount / p) * 10000 : null;
    case "restaurant":
      return r.restaurantCount != null && p > 0 ? (r.restaurantCount / p) * 10000 : null;
    case "accom":
      return r.accommodationFoodEstablishments != null && p > 0 ? (r.accommodationFoodEstablishments / p) * 10000 : null;
    case "vacant":
      return r.vacantHouseCount != null && r.totalHousingCount != null && r.totalHousingCount > 0
        ? (r.vacantHouseCount / r.totalHousingCount) * 100
        : null;
    case "unemp":
      return r.unemployedCount != null && r.laborForceCount != null && r.laborForceCount > 0
        ? (r.unemployedCount / r.laborForceCount) * 100
        : null;
    case "foreign":
      return r.foreignPopulation != null && p > 0 ? (r.foreignPopulation / p) * 100 : null;
    case "single":
      return r.singleHouseholds != null && r.households != null && r.households > 0
        ? (r.singleHouseholds / r.households) * 100
        : null;
    case "daycare":
      return r.daycareCount != null && r.childPopulation > 0 ? (r.daycareCount / r.childPopulation) * 1000 : null;
    case "obr":
      return r.ordinaryBalanceRatio ?? null;
    case "rdsr":
      return r.realDebtServiceRatio ?? null;
    case "income":
      return null; // 課税所得は自治体データではなく税データ側で扱う
  }
}

const IND_KEYS: IndKey[] = [
  "dayNight", "doctors", "secondary", "retail", "restaurant", "accom",
  "vacant", "unemp", "foreign", "single", "daycare", "obr", "rdsr",
];

type Ctx = {
  code: string;
  short: string;
  use2025: boolean;
  pop: number;
  chg: number;
  chgRank: number;
  popRank: number;
  total: number;
  social: number | null;
  natural: number | null;
  births: number | null;
  deaths: number | null;
  young: number | null;
  dayNight: number | null;
  dayPop: number | null;
  elderlyRate: number;
  elderlyNat: number;
  elderlyPop: number;
  elderlyRank: number;
  childRate: number;
  childNat: number;
  workingRatio: number | null; // 高齢者1人あたりの現役世代(15〜64歳)の人数
  finance: number | null;
  financeRank: number | null;
  financeCount: number;
  income: number | null;
  incomeRank: number | null;
  incomeTotal: number | null;
  incomeNat: number;
  incomeMedian: number | null;
  ind: Partial<Record<IndKey, { v: number; pct: number; rank: number; median: number }>>;
  futureElderly2050: number | null;
};

let cache: { rows: Map<string, AgeRow>; dists: Map<IndKey, Dist>; incomeDist: Dist } | null = null;

function buildCache() {
  const { rows } = getAgeRows();
  const dists = new Map<IndKey, Dist>();
  for (const key of IND_KEYS) {
    const vals = rows.map((r) => indValue(key, r)).filter((v): v is number => v != null && Number.isFinite(v));
    dists.set(key, makeDist(vals));
  }
  const incomeDist = makeDist(allTax().map((t) => t.incomePerTaxpayer));
  cache = { rows: new Map(rows.map((r) => [r.code, r])), dists, incomeDist };
  return cache;
}

function buildCtx(code: string): Ctx | null {
  const c = cache ?? buildCache();
  const r = c.rows.get(code);
  const ins = getCityInsight(code);
  if (!r || !ins) return null;

  const ind: Ctx["ind"] = {};
  for (const key of IND_KEYS) {
    const v = indValue(key, r);
    if (v == null) continue;
    const d = c.dists.get(key)!;
    ind[key] = { v, pct: pctBelow(d, v), rank: rankDesc(d, v), median: d.median };
  }

  const tax = getTax(code);
  const iRank = tax ? incomeRank(code) : null;
  if (tax) {
    ind.income = {
      v: tax.incomePerTaxpayer,
      pct: pctBelow(c.incomeDist, tax.incomePerTaxpayer),
      rank: iRank?.rank ?? rankDesc(c.incomeDist, tax.incomePerTaxpayer),
      median: iRank?.median ?? c.incomeDist.median,
    };
  }

  const social = r.inMigrants != null && r.outMigrants != null ? r.inMigrants - r.outMigrants : null;
  const natural = r.births != null && r.deaths != null ? r.births - r.deaths : null;
  const working = r.pop - r.elderly - r.child;
  const f = getFuture(code);

  return {
    code,
    short: ins.short,
    use2025: ins.use2025,
    pop: ins.pop,
    chg: ins.popChangePct,
    chgRank: ins.popChangeRank,
    popRank: ins.popRank,
    total: ins.total,
    social,
    natural,
    births: r.births ?? null,
    deaths: r.deaths ?? null,
    young: r.youngAdultNetMigration ?? null,
    dayNight: ind.dayNight?.v ?? null,
    dayPop: r.daytimePopulation ?? null,
    elderlyRate: ins.elderlyRate,
    elderlyNat: ins.elderlyNat,
    elderlyPop: r.elderly,
    elderlyRank: ins.elderlyRank,
    childRate: ins.childRate,
    childNat: ins.childNat,
    workingRatio: r.elderly > 0 ? working / r.elderly : null,
    finance: ins.financeIndex,
    financeRank: ins.financeRank,
    financeCount: ins.financeCount,
    income: tax?.incomePerTaxpayer ?? null,
    incomeRank: iRank?.rank ?? null,
    incomeTotal: iRank?.total ?? null,
    incomeNat: nationalIncomePerTaxpayer(),
    incomeMedian: iRank?.median ?? null,
    ind,
    futureElderly2050: f ? f.elderly[6] : null,
  };
}

/* ---------- タイプ判定 ---------- */
// 人口増減率の全国分布(成長都市型のスコア用)
let chgDistCache: Dist | null = null;
function chgDist(): Dist {
  if (!chgDistCache) {
    const c = cache ?? buildCache();
    const vals = [...c.rows.values()].map((r) => (r.population > 0 ? ((r.pop - r.population) / r.population) * 100 : 0));
    chgDistCache = makeDist(vals);
  }
  return chgDistCache;
}

function judgeType(x: Ctx): { primary: TypeKey; secondary: TypeKey | null } {
  const score = new Map<TypeKey, number>();
  const set = (k: TypeKey, v: number) => score.set(k, Math.max(score.get(k) ?? 0, v));

  // 成長都市型: 人口が増え、20代の転入超過がある
  if (x.use2025 && x.chg > 0 && x.young != null && x.young > 0) {
    set("growth", 55 + pctBelow(chgDist(), x.chg) * 0.45);
  } else if (x.use2025 && x.chg > 0) {
    set("growth", 30);
  }
  // ベッドタウン型: 昼間人口比率が低く、社会増がある
  if (x.dayNight != null && x.dayNight < 90 && x.social != null && x.social > 0) {
    set("bedtown", 55 + Math.min(25, (90 - x.dayNight) * 1.2));
  } else if (x.dayNight != null && x.dayNight < 90) {
    set("bedtown", 35);
  }
  // 雇用・商業集積型: 昼間人口比率100%以上、または小売・飲食の密度が上位1/4
  if (x.dayNight != null && x.dayNight >= 100) {
    set("hub", 58 + Math.min(30, (x.dayNight - 100) * 0.5));
  } else if ((x.ind.retail?.pct ?? 0) >= 75 && (x.ind.restaurant?.pct ?? 0) >= 75) {
    set("hub", 58 + (Math.min(x.ind.retail!.pct, x.ind.restaurant!.pct) - 75));
  }
  // 医療・福祉の拠点型: 医師数が上位(上位1割で強く、上位1/4だけでは主タイプにしない)
  const docPct = x.ind.doctors?.pct;
  if (docPct != null) {
    if (docPct >= 90) set("medical", 60 + (docPct - 90));
    else if (docPct >= 85) set("medical", 52 + (docPct - 85) * 1.2);
    else if (docPct >= 75) set("medical", 40 + (docPct - 75) * 0.8);
  }
  // 産業都市型: 第2次産業の就業者比率が上位1/4
  const secPct = x.ind.secondary?.pct;
  if (secPct != null && secPct >= 75) set("industry", 55 + (secPct - 75));
  // 観光・交流型: 宿泊・飲食の密度が高い、または空き家率が突出(別荘・セカンドハウス)
  const accPct = x.ind.accom?.pct;
  const vacPct = x.ind.vacant?.pct;
  if (accPct != null && accPct >= 75) set("tourism", 55 + (accPct - 75));
  if (vacPct != null && vacPct >= 90) set("tourism", 58 + (vacPct - 90));
  // 高齢化先行型: 高齢化率が上位1/4(順位から換算)
  const eldPct = x.total > 0 ? (1 - (x.elderlyRank - 1) / x.total) * 100 : 0;
  if (eldPct >= 75) set("aging", 55 + (eldPct - 75));

  const ranked = [...score.entries()].sort((a, b) => b[1] - a[1]);
  // 最も強い型でも50未満なら、突出した型はないとしてバランス型にする
  const primary: TypeKey = ranked.length && ranked[0][1] >= 50 ? ranked[0][0] : "balance";
  const secondary: TypeKey | null =
    primary !== "balance" && ranked.length > 1 && ranked[1][1] >= 55 ? ranked[1][0] : null;
  return { primary, secondary };
}

/* ---------- 考察文の材料 ---------- */
function hashOf(code: string): number {
  let s = 0;
  for (const ch of code) s += ch.charCodeAt(0);
  return s;
}

const ageClause = (x: Ctx) =>
  `高齢化率は${f1(x.elderlyRate)}%(全国平均${f1(x.elderlyNat)}%)、子ども(15歳未満)の割合は${f1(x.childRate)}%(全国${f1(x.childNat)}%)`;
const chgClause = (x: Ctx) =>
  x.use2025
    ? `人口は2020年から2025年で${sgn(x.chg)}%変化し、増減率は全国${x.chgRank}位でした`
    : `人口は${n(x.pop)}人で、全国${x.popRank}位です`;
const socialClause = (x: Ctx) =>
  x.social == null
    ? ""
    : x.social > 0
      ? `転入が転出を${n(x.social)}人上回る転入超過`
      : x.social < 0
        ? `転出が転入を${n(-x.social)}人上回る転出超過`
        : `転入と転出がほぼ釣り合っている状態`;
const finClause = (x: Ctx) =>
  x.finance != null && x.financeRank != null
    ? `財政力指数は${x.finance.toFixed(2)}(全国${x.financeRank}位/${n(x.financeCount)})`
    : "";
const incomeClause = (x: Ctx) =>
  x.income != null ? `納税者1人あたりの課税所得は約${n(x.income)}万円(全国平均は約${n(x.incomeNat)}万円)` : "";
/** 句読点ごと出し分けるための補助(空なら何も出さない) */
const sent = (s: string) => (s ? `${s}。` : "");
const desu = (s: string) => (s ? `${s}です。` : "");

type ParaBuilder = (x: Ctx, v: number) => [string, string];

const PARA: Record<TypeKey, ParaBuilder> = {
  growth: (x, v) => {
    const s = x.short;
    const p1 =
      v === 0
        ? `${s}は、人口が増えている側の大都市です。${chgClause(x)}。増加の中心は、${socialClause(x)}という社会増にあり、20代の転入超過は${x.young != null ? `${sgnN(x.young)}人` : "プラス"}${x.young != null && x.young >= 1000 ? "と大きく" : ""}、進学・就職の世代を引きつける力が人口の伸びを支えていると読めます。`
        : `${s}の人口は${n(x.pop)}人で、${chgClause(x)}。${x.natural != null && x.natural < 0 ? `出生${n(x.births ?? 0)}人・死亡${n(x.deaths ?? 0)}人と自然減が続く中での増加であり、` : ""}${socialClause(x)}が増加を生んでいます。20代の転入超過は${x.young != null ? `${sgnN(x.young)}人` : "プラス"}で、若い世代に選ばれていることが数字に表れています。`;
    const p2 =
      v === 0
        ? `年齢構成にも若さが表れていて、${ageClause(x)}です。若い世代の流入が続くことで、年齢構成の若さが保たれている形と読めます。${sent(incomeClause(x))}人口が増える局面では、保育や学校、住宅の供給が増加に追いつくかが焦点になります。`
        : `${ageClause(x)}と、年齢構成は全国より若い側にあります。単身世帯率は${x.ind.single ? `${f1(x.ind.single.v)}%` : "一定の水準"}で、若い単身・少人数世帯の受け皿になっている面もあります。${sent(finClause(x))}増えた人口を定着させられるかが、次の焦点です。`;
    return [p1, p2];
  },

  bedtown: (x, v) => {
    const s = x.short;
    const dn = x.dayNight != null ? f1(x.dayNight) : "";
    const p1 =
      v === 0
        ? `${s}は、昼間の人口が大きく減る住宅都市です。昼間人口は${x.dayPop != null ? `${n(x.dayPop)}人` : ""}で、夜間人口に対する比率は${dn}%にとどまります。働く場や通学先の多くは市外にある一方、${socialClause(x)}となっていて、「住む場所」として選ばれ続けていることが分かります。`
        : `昼間人口比率${dn}%が示すように、${s}は市外へ通勤・通学する住民の多いベッドタウン型の自治体です。それでも${socialClause(x)}で、20代の純移動も${x.young != null ? `${sgnN(x.young)}人` : "一定の水準"}と、住宅地としての需要は底堅くあります。昼間の消費や雇用は市外に流れる一方、住宅地としての選ばれ方が人口を支える構造です。`;
    const p2 =
      v === 0
        ? `年齢構成は、${ageClause(x)}です。昼間に市外へ出る人が多い構造では、市内の消費は夜間と休日に寄ります。小売店は人口1万人あたり${x.ind.retail ? `${f1(x.ind.retail.v)}店(全国の中央値${f1(x.ind.retail.median)}店)` : "一定数"}あり、日常の買い物の受け皿の厚さが暮らしの利便性を左右します。`
        : `昼間の消費や雇用が市外に流れる分、市の財政は住民税に支えられる面が強くなります。${finClause(x) ? `${finClause(x)}で、` : ""}${sent(incomeClause(x))}通勤の利便性と住環境のバランスが、このタイプの自治体を見る物差しになります。`;
    return [p1, p2];
  },

  hub: (x, v) => {
    const s = x.short;
    const dn = x.dayNight != null ? f1(x.dayNight) : "";
    const p1 =
      x.dayNight != null && x.dayNight >= 100
        ? `${s}は、昼間人口(${x.dayPop != null ? `${n(x.dayPop)}人` : ""})が夜間人口を上回る、雇用と商業の拠点型の自治体です。昼間人口比率は${dn}%で、市外から働き手や買い物客が集まっています。小売店は人口1万人あたり${x.ind.retail ? `${f1(x.ind.retail.v)}店` : ""}、飲食店は${x.ind.restaurant ? `${f1(x.ind.restaurant.v)}店` : ""}と、商業の集積が数字にも表れています。`
        : `${s}は商業の集積が際立つ自治体です。小売店は人口1万人あたり${x.ind.retail ? `${f1(x.ind.retail.v)}店で全国の上位${topPct(x.ind.retail.pct)}%` : ""}に入り、飲食店も${x.ind.restaurant ? `${f1(x.ind.restaurant.v)}店` : ""}あります。昼間人口比率は${dn}%で、買い物や仕事で市外から人が集まる構造がうかがえます。`;
    const p2 =
      v === 0
        ? `拠点性は人口の動きにも表れていて、${chgClause(x)}。${desu(finClause(x))}ただし、住民税は住んでいる自治体に納める仕組みのため、昼間のにぎわいがそのまま住民の税負担力にはつながりません。${incomeClause(x) ? `${incomeClause(x)}と、` : ""}拠点性と住民の所得水準は分けて見る必要があります。`
        : `年齢構成は、${ageClause(x)}です。昼間に集まる人と住む人の両方を相手にするため、交通や昼間のサービスへの需要が大きいタイプです。${sent(incomeClause(x))}働く場の集積が、周辺の住宅地の人口を支える関係も読み取れます。`;
    return [p1, p2];
  },

  medical: (x, v) => {
    const s = x.short;
    const doc = x.ind.doctors;
    const p1 =
      v === 0
        ? `${s}の人口10万人あたり医師数は${doc ? `${n(doc.v)}人` : ""}で、全国の市区町村の上位${doc ? topPct(doc.pct) : ""}%(全国${doc ? doc.rank : ""}位)に入ります。病院や診療所の集積があり、市内の住民だけでなく、周辺自治体からの受診も集める医療の拠点としての性格が強い自治体です。`
        : `医療資源の厚みが${s}の特徴です。医師数は人口10万人あたり${doc ? `${n(doc.v)}人(全国の中央値は${n(doc.median)}人)` : ""}で、全国${doc ? doc.rank : ""}位です。医療機関の集積は、周辺地域を含めた広域の受け皿になっていることを示しています。`;
    const p2 =
      v === 0
        ? `${ageClause(x)}です。将来推計では2050年に高齢化率が${x.futureElderly2050 != null ? `${f1(x.futureElderly2050)}%` : "さらに上昇"}まで上がる見通しで、医療・介護の需要は今後も高まります。医療の集積はその受け皿として意味を持つ一方、診療科の偏りや医師の年齢構成までは、この統計からは分かりません。`
        : `${s}の医療の厚みは、人口の動きとも無関係ではありません。${chgClause(x)}。医療や福祉の働く場があることは、雇用の受け皿にもなります。ただし、施設の数がそのまま医療の質を示すものではなく、周辺自治体との役割分担とあわせて読む指標です。`;
    return [p1, p2];
  },

  industry: (x, v) => {
    const s = x.short;
    const sec = x.ind.secondary;
    const p1 =
      v === 0
        ? `${s}は、製造業などの第2次産業が雇用を支える産業都市型の自治体です。就業者に占める第2次産業の割合は${sec ? `${f1(sec.v)}%` : ""}で、全国の上位${sec ? topPct(sec.pct) : ""}%に入ります。昼間人口比率は${x.dayNight != null ? `${f1(x.dayNight)}%` : ""}と、働く場所が市内にあることが数字にも表れています。`
        : `雇用の軸がはっきりしているのが${s}の特徴で、第2次産業の就業者比率は${sec ? `${f1(sec.v)}%(全国の中央値${f1(sec.median)}%)` : ""}です。${chgClause(x)}。産業の盛衰が人口の動きに直結しやすい構造で、${socialClause(x)}という人の動きも、その表れと読めます。`;
    const p2 =
      v === 0
        ? `完全失業率は${x.ind.unemp ? `${f1(x.ind.unemp.v)}%(全国の中央値${f1(x.ind.unemp.median)}%)` : ""}です。年齢構成は、${ageClause(x)}。産業の集積は財政面の数字の支えにもなっていると読めます。${finClause(x) ? `${finClause(x)}で、` : ""}${sent(incomeClause(x))}ただし、特定の産業の動向に左右されやすい面は、押さえておきたい点です。`
        : `20代の純移動は${x.young != null ? `${sgnN(x.young)}人` : ""}でした。若い働き手を引きつけ続けられるかが、人口の安定の鍵になります。年齢構成は、${ageClause(x)}。雇用の受け皿の明確さが、このタイプの強みです。`;
    return [p1, p2];
  },

  tourism: (x, v) => {
    const s = x.short;
    const acc = x.ind.accom;
    const vac = x.ind.vacant;
    const byVacant = vac != null && vac.pct >= 90 && (acc == null || vac.pct - 90 >= acc.pct - 75);
    const p1 = byVacant
      ? `${s}の空き家率は${vac ? `${f1(vac.v)}%` : ""}と、全国の中央値(${vac ? `${f1(vac.median)}%` : ""})を大きく上回ります。住宅の総数に対して空き家の割合が高い数字で、別荘やセカンドハウスを含む住宅ストックの厚さがうかがえます。定住人口の統計だけでは、この街の実際の使われ方はつかみきれません。`
      : `${s}は、観光や交流の受け皿が厚い自治体です。宿泊・飲食サービス業の事業所は人口1万人あたり${acc ? `${f1(acc.v)}か所` : ""}で、全国の上位${acc ? topPct(acc.pct) : ""}%に入ります。定住人口${n(x.pop)}人に対して飲食店も${x.ind.restaurant ? `${f1(x.ind.restaurant.v)}店(人口1万人あたり)` : ""}あり、訪れる人向けの機能が集積しています。`;
    const p2 =
      v === 0
        ? `交流で訪れる人の多さは、定住人口の統計には表れにくい強みです。一方で、住む人の姿は別にあり、${ageClause(x)}です。訪れる人の動きと定住者の暮らしの両方を見ることが、このタイプの読み解きでは大切です。`
        : `${finClause(x) ? `${finClause(x)}で、` : ""}昼間人口比率は${x.dayNight != null ? `${f1(x.dayNight)}%` : ""}でした。訪問者の消費のような「外から入るお金」は住民の所得統計とは別の動きをするため、にぎわいと住民サービスの水準は、別の物差しで見る必要があります。`;
    return [p1, p2];
  },

  aging: (x, v) => {
    const s = x.short;
    const eldPctTop = Math.max(1, Math.ceil((x.elderlyRank / x.total) * 100));
    const p1 =
      v === 0
        ? `${s}は、年齢構成の変化が先行して進んできた自治体です。高齢化率は${f1(x.elderlyRate)}%で、全国の市区町村の上位${eldPctTop}%に入り、65歳以上は${n(x.elderlyPop)}人です。子ども割合は${f1(x.childRate)}%で、${chgClause(x)}。年齢構成の移り変わりに、地域の仕組みをどう合わせていくかが焦点になるタイプです。`
        : `高齢化率${f1(x.elderlyRate)}%(全国平均${f1(x.elderlyNat)}%)という数字が、${s}の現在地を示しています。65歳以上は${n(x.elderlyPop)}人で、現役世代(15〜64歳)との比率では、高齢者1人を現役世代約${x.workingRatio != null ? `${f1(x.workingRatio)}人` : ""}で支える計算になります。年齢構成の変化に合わせたサービスの組み替えが進む局面です。`;
    const p2 =
      v === 0
        ? `受け皿の面では、医師は人口10万人あたり${x.ind.doctors ? `${n(x.ind.doctors.v)}人` : ""}です。将来推計では2050年に高齢化率が${x.futureElderly2050 != null ? `${f1(x.futureElderly2050)}%` : "さらに上昇"}まで上がる見通しで、医療・介護・移動の支援をどう組み立てるかが焦点になります。年齢構成の変化は、地域の助け合いの仕組みを見直す機会でもあります。`
        : `単身世帯率は${x.ind.single ? `${f1(x.ind.single.v)}%` : ""}で、見守りの仕組みが大切になる構成です。${finClause(x) ? `${finClause(x)}と、` : ""}サービスを維持する土台の数字もあわせて確認したいところです。経験を持つ世代が厚いことは、地域の担い手の面では強みにもなります。`;
    return [p1, p2];
  },

  balance: (x, v) => {
    const s = x.short;
    const p1 =
      v === 0
        ? `${s}は、主要な指標の多くが全国の中央値の近くに集まる、偏りの小さい自治体です。人口は${n(x.pop)}人(全国${x.popRank}位)で、${x.use2025 ? `増減率は${sgn(x.chg)}%、` : ""}高齢化率は${f1(x.elderlyRate)}%(全国平均${f1(x.elderlyNat)}%)です。1つの型に強く寄らない分、数字の出方は穏やかで、突出した偏りが少ない構成と読めます。`
        : `際立った偏りが少ないことが、${s}の特徴です。昼間人口比率は${x.dayNight != null ? `${f1(x.dayNight)}%` : ""}、${finClause(x) ? `${finClause(x)}、` : ""}医師数は10万人あたり${x.ind.doctors ? `${n(x.ind.doctors.v)}人` : ""}と、働く場・財政・医療の顔をそれぞれ持ちながら、1つの性格に寄り切らない構成です。`;
    const p2 =
      v === 0
        ? `偏りが小さい分、変化は緩やかに進みます。${socialClause(x)}で、20代の純移動は${x.young != null ? `${sgnN(x.young)}人` : ""}でした。${incomeClause(x) ? `${incomeClause(x)}と、所得面でも中位です。` : ""}大きな強みと大きな伸びしろが同居しない、安定した構成と読めます。`
        : `このタイプは、1つの数字では語りにくい代わりに、全体のバランスが暮らしの土台になります。年齢構成は、${ageClause(x)}です。変化の方向は、将来推計の読み解きで確認できます。`;
    return [p1, p2];
  },
};

/* ---------- 将来の読み解き ---------- */
function futureText(x: Ctx): { text: string; cls: string } | null {
  const f = getFuture(x.code);
  if (!f || f.pop[0] <= 0) return null;
  const idx = popIndex2050(f);
  let peakI = 0;
  f.pop.forEach((p, i) => {
    if (p > f.pop[peakI]) peakI = i;
  });
  const peakYear = FUTURE_YEARS[peakI];
  const cls = idx >= 103 ? "増加が続く" : idx >= 95 ? "高位で安定" : idx >= 80 ? "緩やかに減少" : "減少が大きい";

  const peakTxt =
    peakI === 6
      ? "2050年にかけて増え続け"
      : peakI === 0
        ? "2020年をピークに、その後は減っていき"
        : `${peakYear}年の約${n(f.pop[peakI])}人をピークに、その後は緩やかに減っていき`;
  const interp =
    cls === "増加が続く"
      ? "人口が増え続ける分、住宅や保育・学校といった受け皿の整備が追いつくかが焦点になります"
      : cls === "高位で安定"
        ? "人口の規模は保たれる一方で年齢構成は確実に変わるため、サービスの量より、中身の組み替えが焦点になります"
        : cls === "緩やかに減少"
          ? "減少は緩やかなペースで、施設やサービスの再配置を計画的に進める時間的な余裕があるタイプと読めます"
          : "減少の幅が大きいため、公共施設や交通など、サービスをどう維持・再編するかが早い段階から焦点になります";
  const eldJump = f.elderly[6] - f.elderly[0];
  const rank = futureRank(x.code);

  const text =
    `国立社会保障・人口問題研究所の推計では、${x.short}の人口は${peakTxt}、2050年には${n(f.pop[6])}人(2020年の${f1(idx)}%)になる見通しです。` +
    `65歳以上の割合は${f1(f.elderly[0])}%から${f1(f.elderly[6])}%へ、0〜14歳の割合は${f1(f.child[0])}%から${f1(f.child[6])}%へと変わります。` +
    `${interp}。` +
    (eldJump >= 8 ? `とくに高齢化の進み方が速く、医療・介護の需要の比重が高まります。` : "") +
    (rank ? `2050年の人口が2020年の何%になるかでは、推計のある${n(rank.total)}市区町村の中で${rank.rank}位です。` : "");
  return { text, cls };
}

/* ---------- 際立つ指標メモ ---------- */
function noteFor(key: IndKey | "finance", x: Ctx): { label: string; text: string; dist: number; group: string } | null {
  const g = (x.ind[key as IndKey]);
  switch (key) {
    case "finance": {
      if (x.finance == null || x.financeRank == null) return null;
      const pct = (1 - (x.financeRank - 0.5) / x.financeCount) * 100;
      const text =
        x.finance >= 1
          ? `${x.finance.toFixed(2)}で全国${x.financeRank}位/${n(x.financeCount)}。1.0を超えており、普通交付税の不交付団体となる水準です。税収の自立度が高い分、景気や大口の納税者の動向の影響を受けやすい面があります。`
          : x.finance >= 0.7
            ? `${x.finance.toFixed(2)}で全国${x.financeRank}位/${n(x.financeCount)}と比較的高い水準です。自主財源の厚みを示す数字で、経常収支比率とあわせると財政の自由度が読めます。`
            : `${x.finance.toFixed(2)}で全国${x.financeRank}位/${n(x.financeCount)}。地方交付税などへの依存度が高い構成で、財政は国の制度との関わりが大きい自治体です。借入の負担(実質公債費比率)とあわせて見る指標です。`;
      return { label: "財政力指数", text, dist: Math.abs(pct - 50), group: "fiscal" };
    }
    case "obr": {
      if (!g) return null;
      const text =
        g.v >= 95
          ? `${f1(g.v)}%と、100%に近い水準です。人件費や扶助費など、毎年の経常的な支出の割合が高く、自由に使途を決められる余地が小さいことを示します。財政の硬直度を見る指標です。`
          : g.v >= 85
            ? `${f1(g.v)}%で、経常的な支出の割合は中程度です。政策に使える余地が一定程度残る水準で、財政力指数とあわせて財政の自由度を読む指標です。`
            : `${f1(g.v)}%と比較的低く、経常的な支出に余裕がある水準です。財政の自由度を見る指標として、財政力指数とあわせて読みます。`;
      return { label: "経常収支比率", text, dist: Math.abs(g.pct - 50), group: "fiscal" };
    }
    case "rdsr": {
      if (!g) return null;
      const text =
        g.v >= 10
          ? `${f1(g.v)}%で、借入金の返済負担が歳入に対して重い側にあります(財政健全化の早期健全化基準は25%)。将来の投資余力を見る際に確認したい水準です。`
          : g.v >= 5
            ? `${f1(g.v)}%で、借入金の返済負担は中程度の水準です(早期健全化基準は25%)。財政の健全度を見る指標の1つです。`
            : `${f1(g.v)}%と低く、借入金の返済負担は軽い水準です(早期健全化基準は25%)。財政の健全度を見る指標の1つです。`;
      return { label: "実質公債費比率", text, dist: Math.abs(g.pct - 50), group: "fiscal" };
    }
    case "doctors": {
      if (!g) return null;
      const text =
        g.pct >= 90
          ? `${n(g.v)}人で全国${g.rank}位(中央値${n(g.median)}人)。周辺自治体からも受診が集まる拠点性がうかがえます。施設の数だけでなく、診療科の構成とあわせて見たい指標です。`
          : `${n(g.v)}人で全国${g.rank}位(中央値${n(g.median)}人)。実際の受診は市町村の境界を越えて行われるため、近隣の医療拠点との関係で読む指標です。`;
      return { label: "医師数(人口10万人あたり)", text, dist: Math.abs(g.pct - 50), group: "life" };
    }
    case "daycare": {
      if (!g) return null;
      const cmp = g.v > g.median * 1.1 ? "高い" : g.v < g.median * 0.9 ? "低い" : "同程度の";
      const text = `子ども(15歳未満)1,000人あたり${f1(g.v)}か所で、全国の中央値(${f1(g.median)}か所)と比べて${cmp}水準です。保育の受け皿の量の目安ですが、待機児童の有無や年齢別の定員までは、この数字からは分かりません。`;
      return { label: "保育所(子ども1,000人あたり)", text, dist: Math.abs(g.pct - 50), group: "life" };
    }
    case "dayNight": {
      if (!g) return null;
      const text =
        g.v >= 110
          ? `${f1(g.v)}%と、昼間に市外から多くの人が集まる水準です。雇用や商業の拠点性を示す代表的な指標です。`
          : g.v >= 100
            ? `${f1(g.v)}%と、昼間人口が夜間人口を上回ります。働く場としての性格を持つことを示す指標です。`
            : g.v >= 90
              ? `${f1(g.v)}%と、昼と夜の人口がほぼ釣り合っています。住む場と働く場のバランスを見る指標です。`
              : `${f1(g.v)}%と、夜間人口を下回ります。通勤・通学で市外に出る住民が多い住宅都市の姿を示し、市内の昼間の消費やサービス需要を読む際の目安になります。`;
      return { label: "昼間人口比率", text, dist: Math.abs(g.pct - 50), group: "structure" };
    }
    case "income": {
      if (!g || x.income == null) return null;
      const text = `納税者1人あたり約${n(g.v)}万円で、全国${g.rank}位(平均は約${n(x.incomeNat)}万円)。住民の所得水準の目安ですが、株式の売却益なども含むため年によってぶれることがあり、給与所得だけを見る「平均年収」とは数字が異なります。`;
      return { label: "課税所得(納税者1人あたり)", text, dist: Math.abs(g.pct - 50), group: "fiscal" };
    }
    case "vacant": {
      if (!g) return null;
      const text =
        g.pct >= 75
          ? `${f1(g.v)}%で、全国の中央値(${f1(g.median)}%)を上回ります。別荘やセカンドハウスが多い地域では高くなりやすく、数字だけで住宅事情は判断できません。活用と管理の両面が焦点になる指標です。`
          : `${f1(g.v)}%で、全国の中央値(${f1(g.median)}%)と比べて低い側です。住宅の需要と供給のバランスを見る指標で、空き家の心配が小さい状態を示します。`;
      return { label: "空き家率", text, dist: Math.abs(g.pct - 50), group: "structure" };
    }
    case "unemp": {
      if (!g) return null;
      const cmp = g.v > g.median ? "高い" : g.v < g.median ? "低い" : "同程度の";
      const text = `${f1(g.v)}%で、全国の中央値(${f1(g.median)}%)と比べて${cmp}水準です。雇用の受け皿の厚さを見る目安で、産業構成(第2次産業の比率など)とあわせて読むと、地域の仕事の姿が見えてきます。`;
      return { label: "完全失業率", text, dist: Math.abs(g.pct - 50), group: "structure" };
    }
    case "foreign": {
      if (!g) return null;
      const text =
        g.pct >= 75
          ? `${f1(g.v)}%で全国${g.rank}位と、外国人住民の割合が高い自治体です。行政サービスの多言語対応や、多文化共生の取り組みが具体的な論点になる水準です。`
          : `${f1(g.v)}%で全国${g.rank}位です。工場や学校などの立地と連動して変わりやすい指標で、住民の構成の多様さを見る目安になります。`;
      return { label: "外国人比率", text, dist: Math.abs(g.pct - 50), group: "structure" };
    }
    case "single": {
      if (!g) return null;
      const text =
        g.pct >= 75
          ? `${f1(g.v)}%で全国${g.rank}位と、単身世帯の割合が高い自治体です。単身向けの住宅需要や、見守り・孤立防止の仕組みが大切になる構成を示します。`
          : `${f1(g.v)}%で全国${g.rank}位です。世帯の規模は、住宅の広さや買い物の単位にも影響する、暮らしの基本的な構成を示す指標です。`;
      return { label: "単身世帯率", text, dist: Math.abs(g.pct - 50), group: "structure" };
    }
    default:
      return null;
  }
}

function buildNotes(x: Ctx): IndicatorNote[] {
  const keys: (IndKey | "finance")[] = [
    "finance", "obr", "rdsr", "doctors", "daycare", "dayNight",
    "income", "vacant", "unemp", "foreign", "single",
  ];
  const cands = keys
    .map((k) => noteFor(k, x))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .sort((a, b) => b.dist - a.dist);
  const picked: typeof cands = [];
  for (const c of cands) {
    if (picked.length >= 2) break;
    // 財政系が2件並ぶ場合は、ほかに際立つ指標があればそちらを優先する
    if (picked.length === 1 && picked[0].group === "fiscal" && c.group === "fiscal") {
      const alt = cands.find((o) => o.group !== "fiscal" && o.dist >= 12 && !picked.includes(o));
      if (alt) {
        picked.push(alt);
        break;
      }
    }
    picked.push(c);
  }
  return picked.map(({ label, text }) => ({ label, text }));
}

/* ---------- 本体 ---------- */
export function getCityProfile(code: string): CityProfile | null {
  const x = buildCtx(code);
  if (!x) return null;
  const { primary, secondary } = judgeType(x);
  const v = hashOf(code) % 2;
  const paragraphs = PARA[primary](x, v);
  const fut = futureText(x);
  return {
    code,
    short: x.short,
    typeLabel: TYPE_LABEL[primary],
    secondaryLabel: secondary ? TYPE_LABEL[secondary] : null,
    paragraphs,
    future: fut?.text ?? null,
    futureClass: fut?.cls ?? null,
    notes: buildNotes(x),
  };
}
