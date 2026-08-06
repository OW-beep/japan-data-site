import type { City } from "@/lib/City";

export type MetricRow = {
  key: string;
  label: string;
  unit: string;
  value: number | null;
  format: (v: number) => string;
  // "high" = larger number shown first/highlighted, "low" = smaller number highlighted,
  // "neutral" = no highlighting (value isn't inherently better/worse)
  direction: "high" | "low" | "neutral";
  // 指標が何を表すかの短い補足説明(比較表の項目名の下に小さく表示)
  description: string;
};

function fmtInt(v: number) {
  return Math.round(v).toLocaleString();
}
function fmt1(v: number) {
  return v.toFixed(1);
}
function fmt2(v: number) {
  return v.toFixed(2);
}

export function computeCityMetrics(city: City): MetricRow[] {
  const population = city.population;
  const agingRate =
    city.elderlyPopulation != null && population > 0
      ? (city.elderlyPopulation / population) * 100
      : null;
  const childRatio =
    city.childPopulation != null && population > 0
      ? (city.childPopulation / population) * 100
      : null;
  const density = city.populationDensity ?? null;
  const habitableDensity =
    city.habitableArea != null && city.habitableArea > 0
      ? population / (city.habitableArea / 100)
      : null;
  const avgHouseholdSize =
    city.households != null && city.households > 0
      ? population / city.households
      : null;
  const singleRatio =
    city.households != null &&
    city.households > 0 &&
    city.singleHouseholds != null
      ? (city.singleHouseholds / city.households) * 100
      : null;
  const doctorsPer10k =
    city.doctorsCount != null && population > 0
      ? (city.doctorsCount / population) * 100000
      : null;
  const unemploymentRate =
    city.unemployedCount != null && city.laborForceCount != null
      ? (city.unemployedCount /
          (city.laborForceCount + city.unemployedCount)) *
        100
      : null;
  const foreignRatio =
    city.foreignPopulation != null && population > 0
      ? (city.foreignPopulation / population) * 100
      : null;
  const taxRatio =
    city.localTax != null &&
    city.totalRevenue != null &&
    city.totalRevenue > 0
      ? (city.localTax / city.totalRevenue) * 100
      : null;
  const naturalRate =
    city.births != null && city.deaths != null && population > 0
      ? ((city.births - city.deaths) / population) * 1000
      : null;
  const netMigrationRate =
    city.inMigrants != null && city.outMigrants != null
      ? ((city.inMigrants - city.outMigrants) / population) * 100
      : null;

  return [
    {
      key: "population",
      label: "人口",
      unit: "人",
      value: population,
      format: fmtInt,
      direction: "neutral",
      description:
        "住民基本台帳に基づく総人口",
    },
    {
      key: "area",
      label: "面積",
      unit: "km²",
      value: city.area,
      format: fmt1,
      direction: "neutral",
      description:
        "自治体の総面積",
    },
    {
      key: "density",
      label: "人口密度",
      unit: "人/km²",
      value: density,
      format: fmtInt,
      direction: "neutral",
      description:
        "面積1km²あたりの人口。市街地の混み具合の目安",
    },
    {
      key: "habitableDensity",
      label: "可住地人口密度",
      unit: "人/km²",
      value: habitableDensity,
      format: fmtInt,
      direction: "neutral",
      description:
        "山林・湖沼を除いた「住める土地」あたりの人口。体感の混雑度に近い指標",
    },
    {
      key: "agingRate",
      label: "高齢化率",
      unit: "%",
      value: agingRate,
      format: fmt1,
      direction: "low",
      description:
        "総人口に占める65歳以上の割合。低いほど若い街",
    },
    {
      key: "childRatio",
      label: "子ども人口割合",
      unit: "%",
      value: childRatio,
      format: fmt1,
      direction: "high",
      description:
        "総人口に占める15歳未満の割合。高いほど子育て世代が多い街",
    },
    {
      key: "birthRate",
      label: "出生率",
      unit: "",
      value: city.birthRate ?? null,
      format: fmt2,
      direction: "high",
      description:
        "1人の女性が生涯に産む子どもの推定人数（合計特殊出生率）",
    },
    {
      key: "naturalRate",
      label: "自然増減率",
      unit: "‰",
      value: naturalRate,
      format: fmt1,
      direction: "high",
      description:
        "人口千人あたりの「出生数－死亡数」。プラスなら自然増",
    },
    {
      key: "netMigrationRate",
      label: "社会増減率",
      unit: "%",
      value: netMigrationRate,
      format: fmt2,
      direction: "high",
      description:
        "転入者数から転出者数を引いた割合。プラスなら人が流入している",
    },
    {
      key: "avgHouseholdSize",
      label: "平均世帯人員",
      unit: "人",
      value: avgHouseholdSize,
      format: fmt2,
      direction: "neutral",
      description:
        "1世帯あたりの平均人数",
    },
    {
      key: "singleRatio",
      label: "単独世帯割合",
      unit: "%",
      value: singleRatio,
      format: fmt1,
      direction: "neutral",
      description:
        "全世帯のうち一人暮らし世帯が占める割合",
    },
    {
      key: "financeIndex",
      label: "財政力指数",
      unit: "",
      value: city.financeIndex,
      format: fmt2,
      direction: "high",
      description:
        "自治体の財政の豊かさを示す指数。1に近い・超えるほど自主財源で運営できている",
    },
    {
      key: "taxRatio",
      label: "地方税自主財源比率",
      unit: "%",
      value: taxRatio,
      format: fmt1,
      direction: "high",
      description:
        "歳入全体に占める地方税収の割合。高いほど自主財源への依存度が高い",
    },
    {
      key: "doctorsPer10k",
      label: "医師数(人口10万人あたり)",
      unit: "人",
      value: doctorsPer10k,
      format: fmtInt,
      direction: "high",
      description:
        "人口10万人あたりの医師数。医療アクセスの目安",
    },
    {
      key: "unemploymentRate",
      label: "完全失業率",
      unit: "%",
      value: unemploymentRate,
      format: fmt1,
      direction: "low",
      description:
        "労働力人口に占める完全失業者の割合",
    },
    {
      key: "foreignRatio",
      label: "外国人人口比率",
      unit: "%",
      value: foreignRatio,
      format: fmt1,
      direction: "neutral",
      description:
        "総人口に占める外国人住民の割合",
    },
  ];
}
