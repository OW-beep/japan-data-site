/**
 * ランキングページ用「固有の解説」の設定(単一の情報源)。
 *
 * 新しいランキングに解説を足すには:
 *   1. ここに slug のエントリを追加する(rows は対象自治体すべての値を返す)
 *   2. そのページに <RankingCommentary slug="..." /> を1行置く
 *
 * rows は「ランキングのページと同じ式・同じ除外条件」で作ること
 * (上位100件などに切り詰めず、対象の全自治体を返す)。
 * reading(読み方・注意点)は手書きの文章。データから言い切れないことは断定しない。
 */
import { getMunicipalities } from "./municipalities";
import type { AnalysisRow, Direction } from "./rankingAnalysis";
import { getAccidentByCode } from "./trafficAccident";
import { getPopulationBasis } from "./population2025";

export type CommentaryConfig = {
  metricName: string;
  unit: string;
  digits: number;
  direction: Direction;
  /** ランキングの対象範囲の説明(例:「人口10万人以上の自治体」) */
  scope?: string;
  rows: () => AnalysisRow[];
  /** ランキングの対象が「人口○人以上」のとき、その人口(人口規模別の区分名に反映する) */
  minPopulation?: number;
  /** 人口規模別・相関の分析を出さない(指標が人口そのものの場合など) */
  hideSizeAnalysis?: boolean;
  /** 追加の集計文(データから計算した事実) */
  facts?: (rows: AnalysisRow[]) => string[];
  /** 手書きの「読み方・注意点」 */
  reading: string[];
  /** 関連記事の slug(タイトルは lib/articles.ts から引く) */
  relatedArticles: string[];
  /** 関連ランキング */
  relatedRankings: { href: string; label: string }[];
};

type C = ReturnType<typeof getMunicipalities>[number];

function build(
  filter: (c: C) => boolean,
  value: (c: C) => number
): AnalysisRow[] {
  return getMunicipalities()
    .filter(filter)
    .map((c) => ({ name: c.name, population: c.population, value: value(c) }))
    .filter((r) => Number.isFinite(r.value));
}

const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

export const COMMENTARY: Record<string, CommentaryConfig> = {
  "traffic-accident-city": {
    metricName: "人口あたりの人身事故件数",
    unit: "件/1万人",
    digits: 1,
    direction: "high",
    scope: "人口1万人以上の市区町村",
    minPopulation: 10_000,
    rows: () => {
      const cities = getMunicipalities();
      const basis = getPopulationBasis(cities.map((c) => c.code));
      return cities
        .map((c) => ({
          name: c.name,
          population: basis.population(c.code, c.population),
          code: c.code,
        }))
        .filter((c) => c.population >= 10_000)
        .map((c) => ({
          name: c.name,
          population: c.population,
          value: (getAccidentByCode(c.code).accidents / c.population) * 10_000,
        }));
    },
    reading: [
      "人身事故は、死者または負傷者が出た事故です。物だけが壊れた物損事故は含まれません。",
      "事故は発生した場所の自治体で数えます。国道や高速道路が通る自治体では、住民以外の車の事故も含まれるため、人口の割に件数が多くなることがあります。",
      "東京都心の千代田区・中央区・港区などは、昼間に通勤・通学で多くの人と車が集まります。夜間に住んでいる人口で割るため、値が大きく出る傾向があります。",
      getPopulationBasis(getMunicipalities().map((c) => c.code)).yearNote,
      "人口の少ない自治体では、事故が数件増減するだけで値が大きく動きます。順位の小さな差を、安全性の優劣と受け取らないようにしてください。",
    ],
    relatedArticles: [
      "elderly-driver-accident-analysis",
      "icy-road-accident-analysis",
      "traffic-accident-analysis",
      "aging-top50",
    ],
    relatedRankings: [
      { href: "/ranking/traffic-accident-rate", label: "都道府県別 交通事故ランキング" },
      { href: "/ranking/icy-road-accident", label: "凍結・積雪路面の事故ランキング" },
      { href: "/ranking/density", label: "人口密度ランキング" },
    ],
  },

  population: {
    metricName: "人口",
    unit: "人",
    digits: 0,
    direction: "high",
    hideSizeAnalysis: true,
    rows: () => build(() => true, (c) => c.population),
    facts: (rows) => {
      const total = rows.reduce((s, r) => s + r.value, 0);
      const sorted = [...rows].sort((a, b) => b.value - a.value);
      const top10 = sorted.slice(0, 10).reduce((s, r) => s + r.value, 0);
      const big = rows.filter((r) => r.value >= 100_000);
      const bigSum = big.reduce((s, r) => s + r.value, 0);
      const small = rows.filter((r) => r.value < 10_000);
      const smallSum = small.reduce((s, r) => s + r.value, 0);
      return [
        `人口の多い上位10自治体だけで、対象全体の人口の約${pct(top10, total).toFixed(0)}%を占めています。`,
        `人口10万人以上の自治体は${big.length.toLocaleString()}で、全体の人口の約${pct(bigSum, total).toFixed(0)}%が暮らしています。`,
        `一方、人口1万人未満の自治体は${small.length.toLocaleString()}あり、合わせても全体の約${pct(smallSum, total).toFixed(1)}%にとどまります。`,
      ];
    },
    reading: [
      "人口は国勢調査に基づく数字で、役所に届け出た住民票ベースの人口とは一致しません。調査時点の居住実態を反映しています。",
      "東京都の特別区は独立した自治体として個別に順位がつきます。政令指定都市の区は市の内訳として扱われ、区ごとの順位には含まれません。",
      "人口の順位は、合併の有無や市域の広さにも影響されます。市域が広い自治体は、人口が多く見えやすくなります。",
      "人口の規模だけでなく、増減や年齢構成を合わせて見ると、自治体の姿がよく分かります。",
    ],
    relatedArticles: [
      "million-cities",
      "near-million-cities",
      "designated-cities-comparison",
      "population-top50",
      "population-about",
    ],
    relatedRankings: [
      { href: "/ranking/large-cities", label: "人口50万人以上の都市ランキング" },
      { href: "/ranking/decrease", label: "人口が少ない自治体ランキング" },
      { href: "/ranking/decline", label: "社会増減率ランキング" },
    ],
  },

  aging: {
    metricName: "高齢化率",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => !!c.elderlyPopulation && !!c.population,
        (c) => (c.elderlyPopulation / c.population) * 100
      ),
    reading: [
      "高齢化率は、総人口に占める65歳以上人口の割合です。令和2年国勢調査に基づきます。",
      "高齢化率が高いのは、高齢者が増えたからだけではありません。若い世代の進学・就職による転出や出生数の減少で、分母となる人口が小さくなることも大きく影響します。",
      "人口の少ない自治体では、数十人の増減でも割合が動きます。順位の小さな差に、大きな意味を持たせすぎないことが大切です。",
      "率が低い大都市でも、高齢者の人数そのものは多くなります。介護・医療の需要は、率と人数の両方で見る必要があります。",
    ],
    relatedArticles: [
      "aging-top50",
      "aging-gap",
      "density-aging",
      "aging-finance",
      "welfare-aging",
      "household-aging-ushape",
    ],
    relatedRankings: [
      { href: "/ranking/aging-gap", label: "少子高齢化ギャップランキング" },
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/elderly-home", label: "老人ホーム数ランキング" },
    ],
  },

  density: {
    metricName: "人口密度",
    unit: "人/km²",
    digits: 0,
    direction: "high",
    rows: () =>
      build(
        (c) => c.populationDensity != null,
        (c) => c.populationDensity ?? 0
      ),
    reading: [
      "人口密度は、人口を総面積で割った値です。可住地(住める土地)ではなく、山林や湖沼を含む総面積が基準です。",
      "市域に山地や農地が広く含まれる市は、市街地の実感より低い数値になります。市街地の密度を見たいときは、可住地人口密度のほうが実態に近くなります。",
      "東京都の特別区は1区ずつ集計されるため、市域が狭い区が上位に並びます。",
      "人口密度が高い=暮らしやすい、という意味ではありません。住宅事情や通勤混雑などの面も、別途確認が必要です。",
    ],
    relatedArticles: [
      "density-analysis",
      "density-aging",
      "density-finance",
      "habitable-density",
      "area-analysis",
    ],
    relatedRankings: [
      { href: "/ranking/habitable-density", label: "可住地人口密度ランキング" },
      { href: "/ranking/sparse-density", label: "人口密度が低い自治体ランキング" },
      { href: "/ranking/area", label: "面積ランキング" },
    ],
  },

  library: {
    metricName: "図書館1館あたり人口",
    unit: "人/館",
    digits: 0,
    direction: "low",
    scope: "人口10万人以上で図書館が1館以上ある自治体",
    rows: () =>
      build(
        (c) => c.libraryCount != null && c.libraryCount > 0 && c.population >= 100_000,
        (c) => c.population / (c.libraryCount ?? 1)
      ),
    reading: [
      "数値が小さいほど、人口に対して図書館の数が多く、アクセスしやすい目安になります。",
      "図書館の数だけの指標です。蔵書数、開館時間、貸出実績、司書の配置など、サービスの質は含まれていません。",
      "分館や分室の数え方は、自治体によって異なる可能性があります。館数の多さが、そのままサービスの充実を示すとは限りません。",
      "市域が広い自治体では、館数が多くても、住んでいる場所によっては図書館が遠いことがあります。",
    ],
    relatedArticles: ["library-child-ratio-analysis", "child-top50"],
    relatedRankings: [
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/education-expense", label: "教育費ランキング" },
      { href: "/ranking/community-center", label: "公民館数ランキング" },
    ],
  },

  "sparse-density": {
    metricName: "人口密度(低い順)",
    unit: "人/km²",
    digits: 1,
    direction: "low",
    rows: () =>
      build(
        (c) => c.populationDensity != null && c.populationDensity > 0,
        (c) => c.populationDensity ?? 0
      ),
    reading: [
      "人口を総面積で割った値が低い順のランキングです。面積が広く、人口が少ない自治体ほど上位になります。",
      "面積の大半が山林や原野の自治体は、住んでいる地域の実感より低い数値になります。集落の密度を見るには、可住地人口密度もあわせて確認してください。",
      "人口が少ない自治体でも、面積が小さければ人口密度は低くなりません。人口の少なさと人口密度の低さは別の指標です。",
    ],
    relatedArticles: ["density-analysis", "habitable-density", "area-analysis", "decline"],
    relatedRankings: [
      { href: "/ranking/density", label: "人口密度ランキング" },
      { href: "/ranking/habitable-density", label: "可住地人口密度ランキング" },
      { href: "/ranking/decrease", label: "人口が少ない自治体ランキング" },
    ],
  },

  "birth-rate": {
    metricName: "合計特殊出生率",
    unit: "",
    digits: 2,
    direction: "high",
    rows: () =>
      build(
        (c) => c.birthRate != null && c.birthRate > 0,
        (c) => c.birthRate ?? 0
      ),
    reading: [
      "合計特殊出生率は、1人の女性が生涯に産むと仮定した場合の子どもの数の目安です。",
      "小規模な自治体では、出生数が数人変わるだけで値が大きく動きます。一時点の順位だけで、子育て環境の優劣を判断することは避けてください。",
      "出生率が高い自治体が、必ずしも子どもの人数が多い自治体とは限りません。人口が少なければ、出生数そのものは小さくなります。",
      "出生率は、結婚のしやすさ、住宅事情、保育環境、就業など、多くの要因の結果として表れます。",
    ],
    relatedArticles: [
      "birth-rate",
      "marriage-birthrate-analysis",
      "daycare-birthrate-analysis",
      "child-top50",
    ],
    relatedRankings: [
      { href: "/ranking/marriage-rate", label: "婚姻率ランキング" },
      { href: "/ranking/natural-change", label: "自然増減率ランキング" },
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
    ],
  },

  "habitable-density": {
    metricName: "可住地人口密度",
    unit: "人/km²",
    digits: 0,
    direction: "high",
    rows: () =>
      build(
        (c) => c.habitableArea != null && c.habitableArea > 0 && c.population > 0,
        (c) => c.population / ((c.habitableArea ?? 1) / 100)
      ),
    reading: [
      "可住地面積は、総面積から林野や湖沼などを除いた面積です。可住地人口密度は、人が実際に住める土地にどれだけの人が暮らしているかを表します。",
      "総面積で測る人口密度より、市街地の込み具合に近い数値になります。山地の多い自治体ほど、二つの数値の差が大きくなります。",
      "可住地面積には農地も含まれるため、市街地だけの密度ではありません。",
    ],
    relatedArticles: ["habitable-density", "density-analysis", "density-aging"],
    relatedRankings: [
      { href: "/ranking/density", label: "人口密度ランキング" },
      { href: "/ranking/sparse-density", label: "人口密度が低い自治体ランキング" },
    ],
  },

  "school-crowding": {
    metricName: "小学校1校あたり子ども人口",
    unit: "人/校",
    digits: 0,
    direction: "high",
    rows: () =>
      build(
        (c) =>
          c.elementarySchoolCount != null &&
          c.elementarySchoolCount > 0 &&
          c.childPopulation != null,
        (c) => c.childPopulation / (c.elementarySchoolCount ?? 1)
      ),
    reading: [
      "0〜14歳の人口を小学校の数で割った値で、学校の規模の目安です。小学生の人数そのものではありません。",
      "数値が大きいほど、1校あたりの子どもが多く、大規模校になりやすいといえます。逆に小さいほど、小規模な学校が多いことを示します。",
      "校舎の広さ、学級数、通学区域の設定などは含まれていません。数値が大きくても、実際の混雑は学校ごとに異なります。",
    ],
    relatedArticles: ["school-crowding", "child-top50", "child-finance"],
    relatedRankings: [
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/daycare", label: "保育施設ランキング" },
    ],
  },

  daycare: {
    metricName: "保育施設1つあたり子ども人口",
    unit: "人/施設",
    digits: 0,
    direction: "low",
    scope: "子ども人口500人以上で保育施設が1つ以上ある自治体",
    rows: () =>
      build(
        (c) => c.daycareCount != null && c.daycareCount > 0 && c.childPopulation >= 500,
        (c) => c.childPopulation / (c.daycareCount ?? 1)
      ),
    reading: [
      "数値が小さいほど、子どもの数に対して保育施設の数に余裕がある目安です。",
      "施設数だけの指標です。定員、実際の入所状況、待機児童の有無、施設の規模は含まれていません。",
      "子どもの数が少ない自治体では、施設が1つ増減するだけで値が大きく変わります。",
      "実際に入所できるかどうかは、自治体の公表する待機児童数や入所の申込状況で確認してください。",
    ],
    relatedArticles: ["daycare-access", "daycare-birthrate-analysis"],
    relatedRankings: [
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
    ],
  },

  "marriage-rate": {
    metricName: "婚姻率(人口1,000人あたり)",
    unit: "件/千人",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上の自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.marriages != null && !Number.isNaN(c.marriages) && c.population >= 3000,
        (c) => ((c.marriages ?? 0) / c.population) * 1000
      ),
    reading: [
      "人口1,000人あたりの年間婚姻件数です。人口3,000人未満の自治体は、数値が不安定になるため対象外としています。",
      "婚姻届は、住所地以外の市区町村でも提出できます。そのため、観光地や、届出に人気のある自治体で高く出ることがあります。",
      "婚姻率は、その自治体に住む人の結婚のしやすさだけを表すものではありません。年齢構成(結婚する年代の人口の多さ)にも左右されます。",
    ],
    relatedArticles: [
      "marriage-rate-analysis",
      "marriage-birthrate-analysis",
      "divorce-rate-analysis",
    ],
    relatedRankings: [
      { href: "/ranking/divorce-rate", label: "離婚率ランキング" },
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
    ],
  },

  "vacant-house": {
    metricName: "空き家率",
    unit: "%",
    digits: 1,
    direction: "high",
    scope: "市・区および人口1万5千人以上の町村",
    rows: () =>
      build(
        (c) =>
          c.vacantHouseCount != null &&
          c.totalHousingCount != null &&
          c.totalHousingCount > 0,
        (c) => ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100
      ),
    reading: [
      "空き家率は、総住宅数に占める空き家の割合です。令和5年住宅・土地統計調査に基づく推計値です。",
      "空き家には、賃貸や売却のために空いている住宅、別荘などの二次的住宅も含まれます。空き家率が高い=放置された空き家が多い、とは限りません。",
      "この調査は抽出調査のため、数値には誤差があります。人口の少ない町村は調査の対象外です。",
    ],
    relatedArticles: [
      "vacant-house-analysis",
      "vacant-house-furusato-nozei-analysis",
      "real-estate-single-household-analysis",
    ],
    relatedRankings: [
      { href: "/ranking/real-estate-price", label: "不動産価格ランキング" },
      { href: "/ranking/household", label: "単独世帯割合ランキング" },
    ],
  },

  child: {
    metricName: "子ども人口割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.childPopulation != null && c.population > 0,
        (c) => (c.childPopulation / c.population) * 100
      ),
    reading: [
      "総人口に占める15歳未満(0〜14歳)人口の割合です。令和2年国勢調査に基づきます。",
      "子どもの割合が高い理由は、出生が多いことと、子育て世帯が転入していることの両方があり得ます。数字だけでは、どちらが主因かは分かりません。",
      "人口の少ない自治体では、少数の世帯の動きでも割合が変わります。",
    ],
    relatedArticles: [
      "child-top50",
      "youngest-municipalities",
      "child-finance",
      "migration-child",
      "aging-gap",
    ],
    relatedRankings: [
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/aging-gap", label: "少子高齢化ギャップランキング" },
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
    ],
  },
};
