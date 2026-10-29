/**
 * ランキングページ用「固有の解説」の設定(追加分)。
 *
 * lib/rankingCommentary.ts の COMMENTARY に、ここの EXTRA_COMMENTARY が合流する。
 * 書き方は rankingCommentary.ts の冒頭コメントと同じ:
 *   - rows は「ランキングのページと同じ式・同じ除外条件」で、対象の全自治体の値を返す
 *     (上位50件・100件などに切り詰めない)
 *   - facts は、rows から計算できる事実だけを書く(数値は必ずデータから出す)
 *   - reading は手書きの「読み方・注意点」。データから言い切れないことは断定しない
 *
 * 数値・文章の組み立ては components/ranking/RankingCommentary.tsx が行う。
 */
import type { CommentaryConfig } from "./rankingCommentary";
import { getMunicipalities } from "./municipalities";
import { getMunicipalities2025 } from "./city2025";
import { getMunicipalitiesForHouseholds } from "./households2025";
import type { AnalysisRow, Direction } from "./rankingAnalysis";
import {
  getBedroomTownFinanceScores,
  getElderlySupportScores,
  getFiscalHealthScores,
  getIndustryDiversityScores,
  getLivingInfrastructureScores,
  getYoungFamilyAttractivenessScores,
} from "./compositeScores";

export type C = ReturnType<typeof getMunicipalities>[number];

export function build(filter: (c: C) => boolean, value: (c: C) => number): AnalysisRow[] {
  return getMunicipalities()
    .filter(filter)
    .map((c) => ({ name: c.name, population: c.population, value: value(c) }))
    .filter((r) => Number.isFinite(r.value));
}

/** 令和7年国勢調査にそろえた版(lib/city2025.ts)。ページ本体が2025基準のランキング用 */
export function build25(filter: (c: C) => boolean, value: (c: C) => number): AnalysisRow[] {
  return getMunicipalities2025()
    .filter(filter)
    .map((c) => ({ name: c.name, population: c.population, value: value(c) }))
    .filter((r) => Number.isFinite(r.value));
}

export const n = (x: number) => x.toLocaleString();
export const pctOf = (k: number, total: number) => (total > 0 ? (k / total) * 100 : 0);

export function sortedBy(rows: AnalysisRow[], dir: Direction): AnalysisRow[] {
  return [...rows].sort((a, b) => (dir === "high" ? b.value - a.value : a.value - b.value));
}

/** ランキング上位の自治体に、人口の少ない自治体がどれだけ混じっているか(値のぶれやすさの目安) */
export function smallTop(dir: Direction, top = 10, threshold = 10_000) {
  return (rows: AnalysisRow[]): string[] => {
    const head = sortedBy(rows, dir).slice(0, top);
    const k = head.filter((r) => r.population < threshold).length;
    const th = `${(threshold / 10_000).toLocaleString()}万人`;
    return [
      k > 0
        ? `ランキング上位${top}自治体のうち、人口${th}未満の自治体は${k}です。人口が少ないと、少数の増減で値が大きく動くため、順位も入れ替わりやすくなります。`
        : `ランキング上位${top}自治体のうち、人口${th}未満の自治体はありません。`,
    ];
  };
}

/** 「しきい値以上(以下)の自治体は○で、全体の○%」を1文にする */
export function share(label: string, pred: (v: number) => boolean) {
  return (rows: AnalysisRow[]): string => {
    const k = rows.filter((r) => pred(r.value)).length;
    return `${label}は${n(k)}自治体で、対象の約${pctOf(k, rows.length).toFixed(1)}%です。`;
  };
}

export const EXTRA_COMMENTARY_A: Record<string, CommentaryConfig> = {
  // ───────────── 財政 ─────────────
  finance: {
    metricName: "財政力指数",
    unit: "",
    digits: 2,
    direction: "high",
    rows: () => build((c) => c.financeIndex != null, (c) => c.financeIndex ?? 0),
    facts: (rows) => [
      share("財政力指数が1以上の自治体", (v) => v >= 1)(rows),
      share("財政力指数が0.3未満の自治体", (v) => v < 0.3)(rows),
    ],
    reading: [
      "財政力指数は、標準的な行政サービスに必要な財源(基準財政需要額)に対して、標準的な収入(基準財政収入額)がどれだけあるかを示します。1を超えると、収入が需要を上回ります。",
      "1を超える自治体は、国から普通交付税を受けない「不交付団体」になることが多いとされます。逆に、数値が小さい自治体ほど、交付税などの国からの財源に頼る割合が大きくなります。",
      "人口が少ない自治体でも、大規模な工場や発電施設などからの税収が大きいと、指数が高くなることがあります。数値の高さは、住民の豊かさや財政運営のうまさをそのまま示すものではありません。",
      "指数は「収入の力」を測るもので、借金返済の負担や支出の硬直化は含みません。経常収支比率や実質公債費比率とあわせて見ると、財政の姿がつかみやすくなります。",
    ],
    relatedArticles: [
      "finance-analysis",
      "population-finance",
      "density-finance",
      "aging-finance",
      "fiscal-health-composite",
      "tax-composition",
    ],
    relatedRankings: [
      { href: "/ranking/balance-ratio", label: "経常収支比率ランキング" },
      { href: "/ranking/debt-service-ratio", label: "実質公債費比率ランキング" },
      { href: "/ranking/tax-ratio", label: "地方税自主財源比率ランキング" },
      { href: "/ranking/fiscal-health-composite", label: "財政健全度スコアランキング" },
    ],
  },

  "balance-ratio": {
    metricName: "経常収支比率",
    unit: "%",
    digits: 1,
    direction: "low",
    rows: () =>
      build(
        (c) => c.ordinaryBalanceRatio != null && c.ordinaryBalanceRatio > 0,
        (c) => c.ordinaryBalanceRatio ?? 0
      ),
    facts: (rows) => [
      share("経常収支比率が90%以上の自治体", (v) => v >= 90)(rows),
      share("経常収支比率が100%以上の自治体", (v) => v >= 100)(rows),
    ],
    reading: [
      "経常収支比率は、毎年入ってくる収入(地方税や普通交付税など)のうち、人件費や扶助費、公債費のように毎年必ず出ていく支出に、どれだけ使っているかの割合です。",
      "数値が低いほど、新しい施策や公共施設の更新に回せる余力が大きいと説明されます。100%を超えると、毎年の収入だけでは経常的な支出をまかなえていない状態です。",
      "このランキングは数値が低い順です。1位は「余裕がある」自治体ですが、余裕がある理由は、支出を抑えているからだけでなく、収入が特別に大きいからという場合もあります。",
      "年度ごとの一時的な収入や支出の影響を受けるため、1年の数字だけで財政の良し悪しは決められません。複数年の推移も確認してください。",
    ],
    relatedArticles: [
      "balance-ratio-analysis",
      "fiscal-health-composite",
      "debt-service-ratio-analysis",
      "finance-analysis",
      "bedroom-town-finance-analysis",
    ],
    relatedRankings: [
      { href: "/ranking/finance", label: "財政力指数ランキング" },
      { href: "/ranking/debt-service-ratio", label: "実質公債費比率ランキング" },
      { href: "/ranking/fiscal-health-composite", label: "財政健全度スコアランキング" },
    ],
  },

  "debt-service-ratio": {
    metricName: "実質公債費比率",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.realDebtServiceRatio != null,
        (c) => c.realDebtServiceRatio ?? 0
      ),
    facts: (rows) => [
      share("実質公債費比率が18%以上の自治体", (v) => v >= 18)(rows),
      share("実質公債費比率が25%以上の自治体", (v) => v >= 25)(rows),
    ],
    reading: [
      "実質公債費比率は、借金の返済(公債費)などに使うお金が、自治体の標準的な収入規模に対してどれだけの割合かを示します。数値が高いほど、返済の負担が重いことになります。",
      "18%以上になると、地方債を発行するときに国や都道府県の許可が必要になります。25%以上は「早期健全化基準」、35%以上は「財政再生基準」にあたり、財政を立て直す計画づくりが求められます。",
      "この指標が高いのは、学校や庁舎、下水道などの大きな事業を借入で進めた時期の影響であることが多く、高い自治体が直ちに「財政が悪い」とは限りません。",
      "このランキングは数値が高い順です。1位は「負担が最も重い」自治体という意味で、「良い」という意味ではありません。",
    ],
    relatedArticles: [
      "debt-service-ratio-analysis",
      "balance-ratio-analysis",
      "fiscal-health-composite",
      "finance-analysis",
    ],
    relatedRankings: [
      { href: "/ranking/balance-ratio", label: "経常収支比率ランキング" },
      { href: "/ranking/finance", label: "財政力指数ランキング" },
      { href: "/ranking/fiscal-health-composite", label: "財政健全度スコアランキング" },
    ],
  },

  "tax-ratio": {
    metricName: "地方税の割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.totalRevenue != null && c.localTax != null && c.totalRevenue > 0,
        (c) => ((c.localTax ?? 0) / (c.totalRevenue ?? 1)) * 100
      ),
    facts: (rows) => [
      share("地方税が歳入の半分以上を占める自治体", (v) => v >= 50)(rows),
      share("地方税が歳入の20%に満たない自治体", (v) => v < 20)(rows),
    ],
    reading: [
      "歳入の総額のうち、住民税や固定資産税などの地方税が占める割合です。このページでは、自主財源のうち地方税だけを取り出して計算しています。",
      "割合が低い自治体は、地方交付税や国・都道府県の支出金、借入(地方債)など、外から入る財源の比重が大きいことになります。",
      "歳入の総額が大きく変わる年は、比率も動きます。災害復旧や大型事業で国の支出金や借入が増えると、地方税の収入が変わらなくても比率は下がります。",
      "比率が高い=財政が豊かとは限りません。税収が大きい自治体でも、人口規模や行政需要が大きければ、財政力指数や経常収支比率の評価は変わります。",
    ],
    relatedArticles: ["tax-composition", "finance-analysis", "population-finance", "fiscal-health-composite"],
    relatedRankings: [
      { href: "/ranking/finance", label: "財政力指数ランキング" },
      { href: "/ranking/balance-ratio", label: "経常収支比率ランキング" },
      { href: "/ranking/welfare-ratio", label: "民生費比率ランキング" },
    ],
  },

  "welfare-ratio": {
    metricName: "民生費の割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.totalRevenue != null && c.welfareExpense != null && c.totalRevenue > 0,
        (c) => ((c.welfareExpense ?? 0) / (c.totalRevenue ?? 1)) * 100
      ),
    facts: (rows) => [
      share("民生費が歳入の半分以上にあたる自治体", (v) => v >= 50)(rows),
    ],
    reading: [
      "民生費は、児童福祉・高齢者福祉・障害者福祉・生活保護など、福祉のために使うお金です。このページでは、歳入の総額に対する民生費の割合を比べています。",
      "割合が高い理由は、福祉が手厚いからだけではありません。高齢者や子どもの人数が多い、生活保護を受ける世帯が多いなど、対象となる人が多いことも大きく影響します。",
      "割合が高いほど福祉が充実している、とは言えません。同じ金額でも、対象の人数が違えば、1人あたりに届くサービスの量は変わります。",
      "自治体の規模や税収の大きさが違うため、割合を単純に比べにくい面があります。高齢化率や財政力指数とあわせて読んでください。",
    ],
    relatedArticles: ["welfare-aging", "aging-finance", "child-finance", "tax-composition"],
    relatedRankings: [
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/tax-ratio", label: "地方税自主財源比率ランキング" },
      { href: "/ranking/elderly-home", label: "高齢者施設数ランキング" },
    ],
  },

  "education-expense": {
    metricName: "住民1人あたり教育費",
    unit: "円",
    digits: 0,
    direction: "high",
    scope: "人口3,000人以上の自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.educationExpense != null && c.population >= 3000,
        (c) => ((c.educationExpense ?? 0) * 1000) / c.population
      ),
    facts: smallTop("high"),
    reading: [
      "教育費の決算額を、自治体の人口全体で割った金額です。子ども1人あたりではなく、住民全員で割っている点に注意してください。",
      "学校の新築・改築・大規模改修や、給食センターの建設などがあった年は、金額が一時的に大きくなります。1年の順位だけで、教育にどれだけ力を入れているかは判断できません。",
      "子どもの割合が高い自治体は、住民全体で割った金額も大きくなりやすい傾向があります。子ども人口割合のランキングとあわせて見ると、背景が分かります。",
      "高い=質の高い教育、という意味ではありません。教育費には、学校の建物にかかる費用も含まれます。",
    ],
    relatedArticles: ["education-expense-analysis", "child-finance", "child-top50", "library-child-ratio-analysis"],
    relatedRankings: [
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/school-crowding", label: "小学校1校あたり子ども人口ランキング" },
      { href: "/ranking/library", label: "図書館数ランキング" },
    ],
  },

  // ───────────── 産業・雇用・経済 ─────────────
  unemployment: {
    metricName: "完全失業率",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.unemployedCount != null && c.laborForceCount != null,
        (c) => {
          const labor = (c.laborForceCount ?? 0) + (c.unemployedCount ?? 0);
          return labor > 0 ? ((c.unemployedCount ?? 0) / labor) * 100 : 0;
        }
      ),
    facts: (rows) => [share("完全失業率が5%以上の自治体", (v) => v >= 5)(rows)],
    reading: [
      "完全失業率は、働く意思があり仕事を探している人(完全失業者)が、働いている人と合わせた労働力人口のうち、どれだけを占めるかの割合です。",
      "自治体ごとの失業率は国勢調査で把握します。毎月公表される全国の失業率とは調査の仕組みが違うため、数字を直接比べることはできません。",
      "人口の少ない自治体では、数人の違いで率が大きく動きます。大学の所在地など若い世代が多い自治体では、就職活動中の人の影響も受けます。",
      "失業率が高い自治体と産業構造との関係は、「産業構造」の記事で確認できます。",
    ],
    relatedArticles: ["unemployment-analysis", "industry-structure", "young-adult-migration-analysis", "industry-diversity-index"],
    relatedRankings: [
      { href: "/ranking/manufacturing", label: "第2次産業就業者比率ランキング" },
      { href: "/ranking/industry-diversity-index", label: "産業の多様性指数ランキング" },
      { href: "/ranking/young-adult-migration", label: "20代純移動率ランキング" },
    ],
  },

  manufacturing: {
    metricName: "第2次産業就業者の割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) =>
          c.primaryIndustryWorkers != null &&
          c.secondaryIndustryWorkers != null &&
          c.tertiaryIndustryWorkers != null,
        (c) => {
          const total =
            (c.primaryIndustryWorkers ?? 0) +
            (c.secondaryIndustryWorkers ?? 0) +
            (c.tertiaryIndustryWorkers ?? 0);
          return total > 0 ? ((c.secondaryIndustryWorkers ?? 0) / total) * 100 : 0;
        }
      ),
    facts: (rows) => [
      share("第2次産業の就業者が4割以上の自治体", (v) => v >= 40)(rows),
      ...smallTop("high")(rows),
    ],
    reading: [
      "この割合は、第1次・第2次・第3次産業の就業者の合計のうち、第2次産業の就業者が占める割合です。第2次産業には、製造業のほか、建設業と鉱業が含まれます。製造業だけの割合ではありません。",
      "国勢調査の就業者は、通常は「住んでいる場所」で集計します。通勤で別の市の工場に通う人は、住んでいる自治体の数字に入ります。工場が多い自治体と、工場の従業者が住む自治体は、一致しないことがあります。",
      "第2次産業の割合が高い自治体は、特定の企業や工場の動向に、雇用や税収が左右されやすい面があります。産業の偏りは、産業の多様性指数でも確認できます。",
    ],
    relatedArticles: ["industry-structure", "industry-diversity-index", "unemployment-analysis", "corporate-growth-analysis"],
    relatedRankings: [
      { href: "/ranking/industry-diversity-index", label: "産業の多様性指数ランキング" },
      { href: "/ranking/unemployment", label: "完全失業率ランキング" },
      { href: "/ranking/corporate-growth", label: "新設法人の純増数ランキング" },
    ],
  },

  "daytime-ratio": {
    metricName: "昼夜間人口比率",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.daytimePopulation != null && c.nighttimePopulation != null && c.nighttimePopulation > 0,
        (c) => ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100
      ),
    facts: (rows) => [
      share("昼夜間人口比率が100%を超える自治体", (v) => v > 100)(rows),
      share("昼夜間人口比率が90%を下回る自治体", (v) => v < 90)(rows),
    ],
    reading: [
      "昼夜間人口比率は、昼間人口を夜間人口(住んでいる人の数)で割った値です。昼間人口は、住んでいる人から通勤・通学で出ていく人を引き、他の自治体から通ってくる人を足して求めます。",
      "100%を超える自治体は、通勤・通学で人が集まる都市、100%を下回る自治体は、住むために選ばれるベッドタウンといえます。",
      "上位には、オフィスが集まる東京都心の区が並びます。住んでいる人が少ない自治体に職場が集中すると、比率は極端に大きくなります。",
      "昼間人口には、買い物や観光で訪れる人は含まれません。国勢調査の通勤・通学のデータから計算した値です。",
    ],
    relatedArticles: ["daytime-ratio-analysis", "daytime-restaurant-density-analysis", "bedroom-town-finance-analysis", "accident-daytime-population"],
    relatedRankings: [
      { href: "/ranking/restaurant", label: "飲食店密度ランキング" },
      { href: "/ranking/bedroom-town-finance", label: "ベッドタウン財政力ランキング" },
      { href: "/ranking/density", label: "人口密度ランキング" },
    ],
  },

  restaurant: {
    metricName: "住民1,000人あたり飲食店数",
    unit: "店/千人",
    digits: 1,
    direction: "high",
    scope: "人口3,000人以上で飲食店がある自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.restaurantCount != null && c.restaurantCount > 0 && c.population >= 3000,
        (c) => ((c.restaurantCount ?? 0) / c.population) * 1000
      ),
    facts: smallTop("high"),
    reading: [
      "飲食店の数を、住んでいる人の数(夜間人口)で割った値です。住民1,000人あたり何店あるかを示します。",
      "オフィス街や観光地、温泉地は、住んでいる人は少なくても、働く人や訪れる人が多いため、値が大きく出ます。住民が飲食店に恵まれているかどうかとは別の話です。",
      "店舗の規模(席数・売上)は反映されません。小さなスナックと大型チェーンも、同じ1店として数えます。",
      "飲食店が多い=外食しやすい、とは限りません。昼間人口との関係は、昼夜間人口比率の記事で確認できます。",
    ],
    relatedArticles: ["restaurant-density", "daytime-restaurant-density-analysis", "daytime-ratio-analysis", "shopping-access"],
    relatedRankings: [
      { href: "/ranking/daytime-ratio", label: "昼夜間人口比率ランキング" },
      { href: "/ranking/retail-store", label: "大型小売店数ランキング" },
      { href: "/ranking/living-infrastructure-index", label: "生活基盤充実度指数ランキング" },
    ],
  },

  "retail-store": {
    metricName: "人口1万人あたり大型小売店数",
    unit: "店/万人",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上で大型小売店がある自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.largeRetailStoreCount != null && (c.largeRetailStoreCount ?? 0) > 0 && c.population >= 3000,
        (c) => ((c.largeRetailStoreCount ?? 0) / c.population) * 10_000
      ),
    facts: (rows) => {
      const zero = getMunicipalities().filter(
        (c) => c.largeRetailStoreCount != null && c.population >= 3000 && c.largeRetailStoreCount === 0
      ).length;
      return [
        `人口3,000人以上で、大型小売店が1店もない自治体は${n(zero)}あり、このランキングの対象には入っていません。`,
        ...smallTop("high")(rows),
      ];
    },
    reading: [
      "大型小売店の数を、人口1万人あたりに直した値です。店舗の数であり、売り場面積や売上は反映されません。",
      "大型店は、近隣の自治体からの買い物客も集めます。住民1人あたりで見ると、人口が少ない自治体で値が大きくなりやすく、商圏の広さまでは分かりません。",
      "店舗が1つもない自治体は、割合を計算できないため、ランキングの対象外としています。",
      "買い物のしやすさは、店舗の数だけでなく、距離や交通手段にも左右されます。高齢者の買い物環境は、高齢者あたり小売店数のランキングで確認できます。",
    ],
    relatedArticles: ["shopping-access", "restaurant-density", "household-aging-ushape"],
    relatedRankings: [
      { href: "/ranking/retail-access", label: "高齢者あたり小売店数ランキング" },
      { href: "/ranking/restaurant", label: "飲食店密度ランキング" },
      { href: "/ranking/living-infrastructure-index", label: "生活基盤充実度指数ランキング" },
    ],
  },

  "retail-access": {
    metricName: "高齢者1,000人あたり小売店数",
    unit: "店/千人",
    digits: 1,
    direction: "low",
    scope: "人口5,000人超の自治体",
    minPopulation: 5_000,
    rows: () =>
      build(
        (c) =>
          c.retailStoreCount != null &&
          c.elderlyPopulation != null &&
          c.elderlyPopulation > 0 &&
          c.population > 5000,
        (c) => ((c.retailStoreCount ?? 0) / (c.elderlyPopulation ?? 1)) * 1000
      ),
    reading: [
      "小売店の数を、65歳以上の人口1,000人あたりに直した値です。このランキングは、数値が小さい順(高齢者に対して小売店が少ない順)に並べています。",
      "小売店の数だけの指標です。店の規模、品ぞろえ、自宅からの距離は含まれていません。数が少なくても、近くに店がある地域はありますし、その逆もあります。",
      "移動販売、宅配、ネット通販などの買い物手段は数えていません。数値が小さい自治体が、そのまま「買い物に困る地域」とは言えません。",
      "高齢化率が高い自治体ほど、分母(高齢者の人数)が大きくなる点にも注意が必要です。",
    ],
    relatedArticles: ["shopping-access", "household-aging-ushape", "aging-top50", "aging-finance"],
    relatedRankings: [
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/retail-store", label: "大型小売店数ランキング" },
      { href: "/ranking/elderly-home", label: "高齢者施設数ランキング" },
    ],
  },

};
