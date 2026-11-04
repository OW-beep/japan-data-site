/**
 * 掛け合わせ分析用の指標の一覧。
 *
 * 全自治体のデータ(lib/municipalities.ts)から、1つの値を取り出す関数を、指標ごとに定義する。
 * 値が取れない(欠測・0除算)自治体は null を返し、分析の対象から外れる。
 * log: true の指標は、値の幅が非常に大きい(人口・面積・密度など)ため、図と相関を対数目盛で扱う。
 */
import { getMunicipalities } from "./municipalities";
import { estimateGap2025, getFuture, popIndex2050 } from "./futurePopulation";
import { getTax } from "./taxableIncome";

export type MunicipalCity = ReturnType<typeof getMunicipalities>[number];

export type Metric = {
  label: string;
  unit: string;
  digits: number;
  log?: boolean;
  get: (c: MunicipalCity) => number | null;
};

const ratio = (
  a: number | null | undefined,
  b: number | null | undefined,
  k = 1
): number | null => (a != null && b != null && b > 0 ? (a / b) * k : null);

const pos = (v: number | null | undefined): number | null => (v != null && v > 0 ? v : null);

export const METRICS = {
  population: { label: "人口", unit: "人", digits: 0, log: true, get: (c) => pos(c.population) },
  area: { label: "面積", unit: "km²", digits: 1, log: true, get: (c) => pos(c.area) },
  density: { label: "人口密度", unit: "人/km²", digits: 0, log: true, get: (c) => pos(c.populationDensity) },
  habitable: {
    label: "可住地人口密度",
    unit: "人/km²",
    digits: 0,
    log: true,
    get: (c) => pos(ratio(c.population, c.habitableArea != null ? c.habitableArea / 100 : null)),
  },
  aging: { label: "高齢化率", unit: "%", digits: 1, get: (c) => ratio(c.elderlyPopulation, c.population, 100) },
  child: { label: "子ども人口の割合", unit: "%", digits: 1, get: (c) => ratio(c.childPopulation, c.population, 100) },
  finance: { label: "財政力指数", unit: "", digits: 2, get: (c) => c.financeIndex ?? null },
  balance: { label: "経常収支比率", unit: "%", digits: 1, get: (c) => pos(c.ordinaryBalanceRatio) },
  debt: { label: "実質公債費比率", unit: "%", digits: 1, get: (c) => c.realDebtServiceRatio ?? null },
  taxShare: { label: "歳入に占める地方税の割合", unit: "%", digits: 1, get: (c) => ratio(c.localTax, c.totalRevenue, 100) },
  welfare: { label: "歳入に占める民生費の割合", unit: "%", digits: 1, get: (c) => ratio(c.welfareExpense, c.totalRevenue, 100) },
  education: {
    label: "住民1人あたり教育費",
    unit: "円",
    digits: 0,
    get: (c) => (c.educationExpense != null && c.population > 0 ? (c.educationExpense * 1000) / c.population : null),
  },
  secondary: {
    label: "第2次産業就業者の割合",
    unit: "%",
    digits: 1,
    get: (c) =>
      ratio(
        c.secondaryIndustryWorkers,
        (c.primaryIndustryWorkers ?? 0) + (c.secondaryIndustryWorkers ?? 0) + (c.tertiaryIndustryWorkers ?? 0),
        100
      ),
  },
  unemployment: {
    label: "完全失業率",
    unit: "%",
    digits: 1,
    get: (c) => ratio(c.unemployedCount, (c.laborForceCount ?? 0) + (c.unemployedCount ?? 0), 100),
  },
  daytime: {
    label: "昼夜間人口比率",
    unit: "%",
    digits: 1,
    log: true,
    get: (c) => pos(ratio(c.daytimePopulation, c.nighttimePopulation, 100)),
  },
  restaurant: { label: "住民あたり飲食店数", unit: "店/千人", digits: 1, get: (c) => ratio(c.restaurantCount, c.population, 1000) },
  retail: { label: "住民あたり小売店数", unit: "店/千人", digits: 1, get: (c) => ratio(c.retailStoreCount, c.population, 1000) },
  doctors: { label: "人口あたり医師数", unit: "人/10万人", digits: 0, get: (c) => ratio(c.doctorsCount, c.population, 100_000) },
  dentist: { label: "人口あたり歯科医師数", unit: "人/10万人", digits: 0, get: (c) => ratio(c.dentistsCount, c.population, 100_000) },
  pharmacist: { label: "人口あたり薬剤師数", unit: "人/10万人", digits: 0, get: (c) => ratio(c.pharmacistsCount, c.population, 100_000) },
  hospital: { label: "人口あたり病院数", unit: "施設/10万人", digits: 1, get: (c) => ratio(c.hospitalCount, c.population, 100_000) },
  daycare: {
    label: "子ども1,000人あたり保育施設数",
    unit: "施設",
    digits: 1,
    get: (c) => ratio(c.daycareCount, c.childPopulation, 1000),
  },
  elderlyHome: {
    label: "高齢者1,000人あたり老人ホーム数",
    unit: "施設",
    digits: 2,
    get: (c) => ratio(c.elderlyHomeCount, c.elderlyPopulation, 1000),
  },
  community: { label: "人口1万人あたり公民館数", unit: "館", digits: 1, get: (c) => ratio(c.communityCenterCount, c.population, 10_000) },
  library: { label: "人口1万人あたり図書館数", unit: "館", digits: 2, get: (c) => ratio(c.libraryCount, c.population, 10_000) },
  vacant: { label: "空き家率", unit: "%", digits: 1, get: (c) => ratio(c.vacantHouseCount, c.totalHousingCount, 100) },
  single: { label: "単独世帯の割合", unit: "%", digits: 1, get: (c) => ratio(c.singleHouseholds, c.households, 100) },
  foreign: { label: "外国人人口の割合", unit: "%", digits: 2, get: (c) => ratio(c.foreignPopulation, c.population, 100) },
  birth: { label: "出生率(人口千人あたり出生数)", unit: "人", digits: 1, get: (c) => ratio(c.births, c.population, 1000) },
  marriage: { label: "婚姻率(人口千人あたり)", unit: "件", digits: 1, get: (c) => ratio(c.marriages, c.population, 1000) },
  natural: {
    label: "自然増減率(人口千人あたり)",
    unit: "人",
    digits: 1,
    get: (c) =>
      c.births != null && c.deaths != null && c.population > 0 ? ((c.births - c.deaths) / c.population) * 1000 : null,
  },
  social: {
    label: "社会増減率",
    unit: "%",
    digits: 2,
    get: (c) =>
      c.inMigrants != null && c.outMigrants != null && c.population > 0
        ? ((c.inMigrants - c.outMigrants) / c.population) * 100
        : null,
  },
  youngNet: {
    label: "20代の純移動率(人口千人あたり)",
    unit: "人",
    digits: 1,
    get: (c) => (c.youngAdultNetMigration != null && c.population > 0 ? (c.youngAdultNetMigration / c.population) * 1000 : null),
  },
  index2050: {
    label: "2050年の推計人口(2020年=100)",
    unit: "",
    digits: 0,
    get: (c) => {
      const f = getFuture(c.code);
      return f ? popIndex2050(f) : null;
    },
  },
  aging2050: {
    label: "2050年の高齢化率(推計)",
    unit: "%",
    digits: 1,
    get: (c) => getFuture(c.code)?.elderly[6] ?? null,
  },
  estGap: {
    label: "2025年の人口:推計との差(実績が多いほどプラス)",
    unit: "%",
    digits: 1,
    get: (c) => estimateGap2025(c.code),
  },
  income: {
    label: "納税義務者1人あたり課税対象所得",
    unit: "万円",
    digits: 0,
    log: true,
    get: (c) => getTax(c.code)?.incomePerTaxpayer ?? null,
  },
  salaryShare: {
    label: "給与所得者の割合(住民税の納税義務者のうち)",
    unit: "%",
    digits: 1,
    get: (c) => {
      const t = getTax(c.code);
      return t && t.all > 0 ? (t.sal / t.all) * 100 : null;
    },
  },
  bizShare: {
    label: "営業等(自営業など)の所得者の割合",
    unit: "%",
    digits: 1,
    get: (c) => {
      const t = getTax(c.code);
      return t && t.all > 0 ? (t.biz / t.all) * 100 : null;
    },
  },
  farmShare: {
    label: "農業所得者の割合",
    unit: "%",
    digits: 1,
    get: (c) => {
      const t = getTax(c.code);
      return t && t.all > 0 ? (t.farm / t.all) * 100 : null;
    },
  },
  stockShare: {
    label: "株式等の所得が課税対象所得に占める割合",
    unit: "%",
    digits: 1,
    get: (c) => {
      const t = getTax(c.code);
      return t && t.ti > 0 ? (t.st / t.ti) * 100 : null;
    },
  },
  keiCar: {
    label: "軽自動車(四輪乗用・自家用)の台数(人口100人あたり)",
    unit: "台",
    digits: 1,
    get: (c) => {
      const t = getTax(c.code);
      return t && c.population > 0 ? (t.kei / c.population) * 100 : null;
    },
  },
  recycling: { label: "ごみのリサイクル率", unit: "%", digits: 1, get: (c) => pos(c.recyclingRate) },
} satisfies Record<string, Metric>;

export type MetricKey = keyof typeof METRICS;

export function formatMetric(key: MetricKey, v: number): string {
  const m: Metric = METRICS[key];
  const s = v.toLocaleString("ja-JP", {
    minimumFractionDigits: m.digits,
    maximumFractionDigits: m.digits,
  });
  return `${s}${m.unit}`;
}
