/**
 * ランキングページ用「固有の解説」の設定(追加分その2)。
 * 書き方・方針は lib/rankingCommentaryExtra.ts の冒頭コメントと同じ。
 * 医療・福祉 / 世帯 / 人口・人口動態 / 環境 / 独自指数(複合スコア) を扱う。
 */
import type { CommentaryConfig } from "./rankingCommentary";
import { getMunicipalities } from "./municipalities";
import { getMunicipalities2025 } from "./city2025";
import { getMunicipalitiesForHouseholds } from "./households2025";
import type { AnalysisRow } from "./rankingAnalysis";
import {
  getBedroomTownFinanceScores,
  getElderlySupportScores,
  getFiscalHealthScores,
  getIndustryDiversityScores,
  getLivingInfrastructureScores,
  getYoungFamilyAttractivenessScores,
} from "./compositeScores";
import { build, build25, n, share, smallTop, sortedBy } from "./rankingCommentaryExtra";
import { getPrefectureStats, type PrefectureStats } from "./prefectureStats";
import { getCorporateGrowthRanking } from "./corporateRegistration";
import { getRealEstatePriceRanking } from "./realEstatePrice";
import { getCapitalElevationRanking } from "./capitalElevation";

const toRows = <T extends { name: string; population: number }>(
  list: T[],
  value: (c: T) => number
): AnalysisRow[] =>
  list
    .map((c) => ({ name: c.name, population: c.population, value: value(c) }))
    .filter((r) => Number.isFinite(r.value));


/** 都道府県ランキング用: 指標の値を47行の AnalysisRow にする(人口は使わないので0) */
const prefRows = (pick: (s: PrefectureStats) => number | null | undefined, scale = 1): AnalysisRow[] =>
  getPrefectureStats()
    .map((r) => ({ name: r.pref, population: 0, value: (pick(r.stats) ?? NaN) * scale }))
    .filter((r) => Number.isFinite(r.value));

/** 上位3・下位3の都道府県と値を1文ずつにする */
const topBottom =
  (dir: "high" | "low", fmt: (v: number) => string) =>
  (rows: AnalysisRow[]): string[] => {
    const sorted = sortedBy(rows, dir);
    const list = (xs: AnalysisRow[]) => xs.map((r) => `${r.name}(${fmt(r.value)})`).join("、");
    return [
      `ランキングの上位3都道府県は、${list(sorted.slice(0, 3))}です。`,
      `ランキングの下位3都道府県は、${list(sorted.slice(-3).reverse())}です。`,
    ];
  };

export const EXTRA_COMMENTARY_B: Record<string, CommentaryConfig> = {
  // ───────────── 医療・福祉 ─────────────
  doctors: {
    metricName: "人口10万人あたり医師数",
    unit: "人/10万人",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.doctorsCount != null && c.population > 0,
        (c) => ((c.doctorsCount ?? 0) / c.population) * 100_000
      ),
    facts: (rows) => [
      `対象のうち、医師が0人なのは${n(rows.filter((r) => r.value === 0).length)}自治体です。`,
      ...smallTop("high")(rows),
    ],
    reading: [
      "医師の数を、人口10万人あたりに直した値です。人口の少ない町村では、医師が1人増減するだけで値が大きく動きます。順位の小さな差を、医療の充実度の差と受け取らないでください。",
      "医師は、勤務している場所の自治体で数えるのが一般的です。大学病院や大きな病院のある自治体で値が高くなり、その周辺の自治体から通院する人の分も含めた「受け皿」の大きさを表します。",
      "住民が受けられる医療の量を直接表すものではありません。診療科の偏りや、休日・夜間の対応、医療機関までの距離は含まれていません。",
      "人口の少なさのために数字が上下に振れやすい点は、このランキングを読むうえでいちばん大切な注意点です。",
    ],
    relatedArticles: ["doctors-analysis", "hospital-access-analysis", "dentist-access-analysis", "elderly-support-composite"],
    relatedRankings: [
      { href: "/ranking/hospital", label: "病院数ランキング" },
      { href: "/ranking/dentist", label: "歯科医師数ランキング" },
      { href: "/ranking/pharmacist", label: "薬剤師数ランキング" },
      { href: "/ranking/elderly-support-composite", label: "高齢者支援体制スコアランキング" },
    ],
  },

  dentist: {
    metricName: "人口10万人あたり歯科医師数",
    unit: "人/10万人",
    digits: 1,
    direction: "high",
    scope: "人口3,000人以上で歯科医師がいる自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.dentistsCount != null && c.population >= 3000 && (c.dentistsCount ?? 0) > 0,
        (c) => ((c.dentistsCount ?? 0) / c.population) * 100_000
      ),
    facts: (rows) => {
      const zero = getMunicipalities().filter(
        (c) => c.dentistsCount != null && c.population >= 3000 && c.dentistsCount === 0
      ).length;
      return [
        `人口3,000人以上で、歯科医師が0人の自治体は${n(zero)}あり、このランキングの対象には入っていません。`,
        ...smallTop("high")(rows),
      ];
    },
    reading: [
      "歯科医師の数を、人口10万人あたりに直した値です。歯科医師が0人の自治体は、割合が計算できないため、ランキングの対象外としています。",
      "歯科医師も、勤務している場所の自治体で数えます。都市部に集中する傾向があり、周辺の自治体から通院する人の分も含んだ数字になります。",
      "歯科診療所の数や診療時間、訪問診療の有無は含まれていません。歯科医師が多い自治体で、そのまま通いやすいとは限りません。",
      "人口が少ない自治体では、歯科医師が1人違うだけで値が大きく変わります。",
    ],
    relatedArticles: ["dentist-access-analysis", "doctors-analysis", "pharmacist-access-analysis", "hospital-access-analysis"],
    relatedRankings: [
      { href: "/ranking/doctors", label: "医師数ランキング" },
      { href: "/ranking/pharmacist", label: "薬剤師数ランキング" },
      { href: "/ranking/hospital", label: "病院数ランキング" },
    ],
  },

  pharmacist: {
    metricName: "人口10万人あたり薬剤師数",
    unit: "人/10万人",
    digits: 1,
    direction: "high",
    scope: "人口3,000人以上で薬剤師がいる自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.pharmacistsCount != null && c.population >= 3000 && (c.pharmacistsCount ?? 0) > 0,
        (c) => ((c.pharmacistsCount ?? 0) / c.population) * 100_000
      ),
    facts: (rows) => {
      const zero = getMunicipalities().filter(
        (c) => c.pharmacistsCount != null && c.population >= 3000 && c.pharmacistsCount === 0
      ).length;
      return [
        `人口3,000人以上で、薬剤師が0人の自治体は${n(zero)}あり、このランキングの対象には入っていません。`,
        ...smallTop("high")(rows),
      ];
    },
    reading: [
      "薬剤師の数を、人口10万人あたりに直した値です。薬剤師は、薬局や病院などの勤務先の所在地で数えます。",
      "病院が集まる自治体では、院内で働く薬剤師も含まれるため、薬局の数だけでは説明できない値になります。",
      "薬局までの距離や、開局時間、在宅医療への対応は含まれていません。薬剤師が多い=薬が受け取りやすい、とは限りません。",
      "人口が少ない自治体では、1人の増減で値が大きく動きます。",
    ],
    relatedArticles: ["pharmacist-access-analysis", "doctors-analysis", "dentist-access-analysis", "hospital-access-analysis"],
    relatedRankings: [
      { href: "/ranking/doctors", label: "医師数ランキング" },
      { href: "/ranking/dentist", label: "歯科医師数ランキング" },
      { href: "/ranking/hospital", label: "病院数ランキング" },
    ],
  },

  hospital: {
    metricName: "人口10万人あたり病院数",
    unit: "施設/10万人",
    digits: 1,
    direction: "high",
    scope: "人口3,000人以上で病院がある自治体",
    minPopulation: 3_000,
    rows: () =>
      build25(
        (c) =>
          c.hospitalCount != null &&
          c.clinicCount != null &&
          c.population >= 3000 &&
          (c.hospitalCount ?? 0) > 0,
        (c) => ((c.hospitalCount ?? 0) / c.population) * 100_000
      ),
    facts: (rows) => {
      const zero = getMunicipalities2025().filter(
        (c) => c.hospitalCount != null && c.clinicCount != null && c.population >= 3000 && c.hospitalCount === 0
      ).length;
      return [
        `人口3,000人以上で、病院が1つもない自治体は${n(zero)}あり、このランキングの対象には入っていません。`,
        ...smallTop("high")(rows),
      ];
    },
    reading: [
      "医療法では、入院用のベッドが20床以上ある施設を「病院」、19床以下または入院施設のない施設を「診療所」と区別します。このランキングは、病院の数を人口10万人あたりに直したものです。",
      "病院の規模(病床数)や診療科は反映されません。小さな病院と大きな総合病院が、同じ1つとして数えられます。",
      "病院が1つもない自治体は、割合が計算できないため対象外です。病院がなくても、診療所や近隣自治体の病院でカバーされている場合があります。",
      "人口が少ない自治体では、病院が1つあるだけで値が大きくなります。順位の高さが、医療体制の手厚さを直接示すわけではありません。",
    ],
    relatedArticles: ["hospital-access-analysis", "doctors-analysis", "elderly-home-analysis", "elderly-support-composite"],
    relatedRankings: [
      { href: "/ranking/doctors", label: "医師数ランキング" },
      { href: "/ranking/dentist", label: "歯科医師数ランキング" },
      { href: "/ranking/elderly-home", label: "高齢者施設数ランキング" },
    ],
  },

  "elderly-home": {
    metricName: "高齢者施設1つあたりの高齢者数",
    unit: "人/施設",
    digits: 0,
    direction: "low",
    scope: "高齢者施設が1つ以上ある自治体",
    rows: () =>
      build25(
        (c) => c.elderlyHomeCount != null && c.elderlyPopulation > 0 && (c.elderlyHomeCount ?? 0) > 0,
        (c) => c.elderlyPopulation / (c.elderlyHomeCount ?? 1)
      ),
    facts: (rows) => {
      const zero = getMunicipalities2025().filter(
        (c) => c.elderlyHomeCount != null && c.elderlyPopulation > 0 && c.elderlyHomeCount === 0
      ).length;
      return [
        `高齢者施設が1つもない自治体は${n(zero)}あり、このランキングの対象には入っていません。`,
        ...smallTop("low")(rows),
      ];
    },
    reading: [
      "65歳以上の人口を、高齢者施設の数で割った値です。数値が小さいほど、高齢者の人数に対して施設の数が多いことになります。1位は「施設1つあたりの高齢者が最も少ない」自治体です。",
      "施設の数だけの指標です。定員、入所待ちの状況、施設の種類やサービスの質は含まれていません。",
      "施設がある自治体の住民だけが入所するとは限りません。近隣自治体の施設を使う人も多く、住民の入所状況とは一致しません。",
      "人口が少ない自治体では、施設が1つ増減するだけで値が大きく動きます。",
    ],
    relatedArticles: ["elderly-home-analysis", "aging-top50", "elderly-support-composite", "household-aging-ushape"],
    relatedRankings: [
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/hospital", label: "病院数ランキング" },
      { href: "/ranking/elderly-support-composite", label: "高齢者支援体制スコアランキング" },
    ],
  },

  // ───────────── 世帯 ─────────────
  household: {
    metricName: "単独世帯の割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () => {
      const { list } = getMunicipalitiesForHouseholds(true);
      return toRows(
        list.filter((c) => c.households != null && c.households > 0),
        (c) => ((c.singleHouseholds ?? 0) / (c.households ?? 1)) * 100
      );
    },
    facts: (rows) => [
      share("単独世帯が4割以上を占める自治体", (v) => v >= 40)(rows),
      ...smallTop("high")(rows),
    ],
    reading: [
      "単独世帯は、1人だけで暮らしている世帯です。この割合は、世帯の総数のうち、単独世帯がどれだけを占めるかを示します。",
      "割合が高くなる理由は、地域によって違います。大学や企業が集まる都市では若い単身者、高齢化が進んだ地域では高齢の1人暮らしが、それぞれ数字を押し上げます。",
      "同じ「高い」でも意味が異なるため、高齢化率や20代の転入出とあわせて読むことが大切です。単独世帯の割合が高い=孤立している、という意味ではありません。",
      "人口の少ない自治体では、少数の世帯の動きで割合が変わります。",
    ],
    relatedArticles: ["household-analysis", "household-aging-ushape", "single-household-crime-analysis", "real-estate-single-household-analysis"],
    relatedRankings: [
      { href: "/ranking/household-size", label: "平均世帯人員ランキング" },
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/young-adult-migration", label: "20代純移動率ランキング" },
    ],
  },

  "household-size": {
    metricName: "平均世帯人員",
    unit: "人",
    digits: 2,
    direction: "high",
    rows: () => {
      const { list } = getMunicipalitiesForHouseholds(false);
      return toRows(
        list.filter((c) => c.households != null && c.households > 0),
        (c) => c.population / (c.households ?? 1)
      );
    },
    reading: [
      "人口を世帯数で割った値で、1世帯あたり何人で暮らしているかを表します。数値が大きいほど、大人数で暮らす世帯が多いといえます。",
      "数値が大きい自治体では、親と子と孫など、複数の世代が同居する世帯が多い傾向があります。小さい自治体は、1人暮らしや夫婦のみの世帯が多くなります。",
      "平均世帯人員は、単独世帯の割合と裏返しの関係にあります。単独世帯が増えると、平均世帯人員は小さくなります。",
      "世帯のかたちは、住宅事情や就業環境、高齢化の度合いに左右されます。数字の高低が、そのまま暮らしやすさを示すものではありません。",
    ],
    relatedArticles: ["household-analysis", "household-aging-ushape", "real-estate-single-household-analysis"],
    relatedRankings: [
      { href: "/ranking/household", label: "単独世帯割合ランキング" },
      { href: "/ranking/child", label: "子ども人口割合ランキング" },
      { href: "/ranking/vacant-house", label: "空き家率ランキング" },
    ],
  },

  "community-center": {
    metricName: "公民館1館あたり人口",
    unit: "人/館",
    digits: 0,
    direction: "low",
    scope: "人口3,000人以上で公民館がある自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.communityCenterCount != null && c.population >= 3000 && (c.communityCenterCount ?? 0) > 0,
        (c) => c.population / (c.communityCenterCount ?? 1)
      ),
    facts: (rows) => {
      const zero = getMunicipalities().filter(
        (c) => c.communityCenterCount != null && c.population >= 3000 && c.communityCenterCount === 0
      ).length;
      return [`人口3,000人以上で、公民館が0館の自治体は${n(zero)}あり、このランキングの対象には入っていません。`];
    },
    reading: [
      "人口を公民館の数で割った値です。数値が小さいほど、人口に対して公民館の数が多いことになります。",
      "公民館は、地域の学習や集会の拠点です。集落ごとに公民館がある自治体では、館数が多くなり、値が小さくなります。",
      "「公民館」ではなく「コミュニティセンター」「交流センター」などの名称で同じ役割の施設を置く自治体は、この数に入っていない可能性があります。館数の多さと、地域活動の活発さは別の話です。",
      "面積が広い自治体では、館数が多くても、住んでいる場所によっては遠いことがあります。",
    ],
    relatedArticles: ["community-center-analysis", "library-child-ratio-analysis", "living-infrastructure-index"],
    relatedRankings: [
      { href: "/ranking/library", label: "図書館数ランキング" },
      { href: "/ranking/living-infrastructure-index", label: "生活基盤充実度指数ランキング" },
      { href: "/ranking/density", label: "人口密度ランキング" },
    ],
  },

  // ───────────── 人口・人口動態 ─────────────
  decrease: {
    metricName: "人口(少ない順)",
    unit: "人",
    digits: 0,
    direction: "low",
    hideSizeAnalysis: true,
    rows: () => build25((c) => c.population > 0, (c) => c.population),
    facts: (rows) => [
      share("人口が1,000人に満たない自治体", (v) => v < 1000)(rows),
      share("人口が5,000人に満たない自治体", (v) => v < 5000)(rows),
    ],
    reading: [
      "令和7年国勢調査にもとづく人口を、少ない順に並べたランキングです。住民票の人口ではなく、調査時点で実際に住んでいる人の数です。",
      "人口の少ない自治体は、離島や山間部の村に多く見られます。小さな自治体が多く残っているのは、市町村合併の対象にならなかった町村が多いためです。",
      "人口が少ない=財政が苦しい、とは限りません。大規模な発電施設などの税収で、財政力指数が高い小規模自治体もあります。",
      "人口の少なさと、人口の減り方の速さは別の指標です。減少の速さは、社会増減率や自然増減率で確認できます。",
    ],
    relatedArticles: ["youngest-municipalities", "city-town-village-population", "population-change-2025", "population-top50", "aging-top50"],
    relatedRankings: [
      { href: "/ranking/population", label: "人口ランキング" },
      { href: "/ranking/smallest-cities", label: "人口が少ない市ランキング" },
      { href: "/ranking/sparse-density", label: "人口密度が低い自治体ランキング" },
      { href: "/ranking/decline", label: "社会増減率ランキング" },
    ],
  },

  area: {
    metricName: "面積",
    unit: "km²",
    digits: 1,
    direction: "high",
    rows: () => build((c) => !!c.area, (c) => c.area ?? 0),
    facts: (rows) => {
      const sorted = [...rows].sort((a, b) => b.value - a.value);
      const hk = sorted.slice(0, 10).filter((r) => r.name.startsWith("北海道")).length;
      return [
        `面積が広い上位10自治体のうち、北海道の自治体は${hk}です。`,
        ...smallTop("high")(rows),
      ];
    },
    reading: [
      "自治体の総面積(km²)を大きい順に並べたランキングです。総面積には、山林や湖沼など、人が住まない土地も含まれます。",
      "市町村合併で広がった市は、面積が大きくなります。合併の経緯が、順位に強く影響します。",
      "面積が広い自治体は、道路や上下水道、公共施設の維持管理にかかる負担が大きくなります。人口が少ないほど、住民1人あたりの負担も重くなります。",
      "面積の広さは、そのまま可住地の広さではありません。人が実際に住んでいる土地の密度は、可住地人口密度で確認できます。",
    ],
    relatedArticles: ["area-analysis", "density-analysis", "density-finance", "habitable-density"],
    relatedRankings: [
      { href: "/ranking/density", label: "人口密度ランキング" },
      { href: "/ranking/habitable-density", label: "可住地人口密度ランキング" },
      { href: "/ranking/sparse-density", label: "人口密度が低い自治体ランキング" },
    ],
  },

  "foreign-population": {
    metricName: "外国人人口の割合",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.foreignPopulation != null && c.population > 0,
        (c) => ((c.foreignPopulation ?? 0) / c.population) * 100
      ),
    facts: (rows) => [
      share("外国人人口の割合が3%以上の自治体", (v) => v >= 3)(rows),
      ...smallTop("high")(rows),
    ],
    reading: [
      "総人口のうち、外国籍の住民が占める割合です。留学生、技能実習生、永住者など、在留資格はさまざまな人が含まれます。",
      "割合が高い自治体には、大きな工場や農業、観光、大学や日本語学校などがあることが多く、地域の産業や教育機関と結びついています。",
      "人口が少ない町では、数十人の違いで割合が大きく動きます。順位の小さな差を、地域の国際化の度合いと受け取らないでください。",
      "国勢調査と、住民基本台帳にもとづく統計では、外国人の人数が一致しません。出典欄で、使っているデータを確認してください。",
    ],
    relatedArticles: ["foreign-population", "industry-structure", "young-adult-migration-analysis", "population-concentration"],
    relatedRankings: [
      { href: "/ranking/manufacturing", label: "第2次産業就業者比率ランキング" },
      { href: "/ranking/young-adult-migration", label: "20代純移動率ランキング" },
      { href: "/ranking/decline", label: "社会増減率ランキング" },
    ],
  },

  "divorce-rate": {
    metricName: "離婚率(人口1,000人あたり)",
    unit: "件/千人",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上の自治体",
    minPopulation: 3_000,
    rows: () =>
      build25(
        (c) => c.divorces != null && c.population >= 3000,
        (c) => ((c.divorces ?? 0) / c.population) * 1000
      ),
    facts: smallTop("high"),
    reading: [
      "人口1,000人あたりの年間の離婚件数です。人口3,000人未満の自治体は、数値が不安定になるため対象外としています。",
      "離婚件数は年によって増減します。人口の少ない自治体では、数件の違いで率が大きく動くため、1年の順位だけで判断しないでください。",
      "結婚している人が多い年代の割合など、年齢構成にも左右されます。婚姻率とあわせて見ると、背景が分かりやすくなります。",
      "離婚率が高い=その自治体が暮らしにくい、という意味ではありません。地域の産業や人の出入りの多さなど、さまざまな要因が影響します。",
    ],
    relatedArticles: ["divorce-rate-analysis", "marriage-rate-analysis", "marriage-birthrate-analysis", "single-household-crime-analysis"],
    relatedRankings: [
      { href: "/ranking/marriage-rate", label: "婚姻率ランキング" },
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
      { href: "/ranking/household", label: "単独世帯割合ランキング" },
    ],
  },

  "natural-change": {
    metricName: "自然増減率(人口1,000人あたり)",
    unit: "人/千人",
    digits: 1,
    direction: "high",
    rows: () =>
      build25(
        (c) => c.births != null && c.deaths != null && c.population > 0,
        (c) => (((c.births ?? 0) - (c.deaths ?? 0)) / c.population) * 1000
      ),
    facts: (rows) => [
      share("出生数が死亡数を上回る(自然増の)自治体", (v) => v > 0)(rows),
      share("死亡数が出生数を上回る(自然減の)自治体", (v) => v < 0)(rows),
    ],
    reading: [
      "出生数から死亡数を引いた値を、人口1,000人あたりに直した割合です。プラスなら、1年間に生まれた人が亡くなった人より多いことを示します。",
      "人口の増減は、「自然増減(出生-死亡)」と「社会増減(転入-転出)」の合計です。このランキングは自然増減だけを見ており、引っ越しによる人口の動きは含まれていません。",
      "高齢化率が高い自治体では、亡くなる人が多いため、自然減になりやすくなります。出生数が少ないことだけが理由ではありません。",
      "人口が少ない自治体では、出生や死亡の数が数人違うだけで率が大きく変わります。",
    ],
    relatedArticles: ["natural-change", "birth-rate", "aging-top50", "population-change-2025"],
    relatedRankings: [
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
      { href: "/ranking/decline", label: "社会増減率ランキング" },
      { href: "/ranking/aging", label: "高齢化率ランキング" },
    ],
  },

  decline: {
    metricName: "社会増減率",
    unit: "%",
    digits: 2,
    direction: "high",
    rows: () =>
      build(
        (c) => c.inMigrants != null && c.outMigrants != null && c.population > 0,
        (c) => (((c.inMigrants ?? 0) - (c.outMigrants ?? 0)) / c.population) * 100
      ),
    facts: (rows) => [
      share("転入が転出を上回る(転入超過の)自治体", (v) => v > 0)(rows),
      share("転出が転入を上回る(転出超過の)自治体", (v) => v < 0)(rows),
    ],
    reading: [
      "転入者から転出者を引いた人数を、人口に対する割合にしたものです。プラスなら転入超過、マイナスなら転出超過を示します。",
      "社会増減は、引っ越しによる人口の動きです。出生と死亡による自然増減とは別なので、転入超過でも、自然減が大きければ人口は減ることがあります。",
      "数値が大きい自治体は、再開発や住宅の新規供給、大学や企業の立地など、人を引きつける要因がある可能性があります。ただし、数字だけでその理由は分かりません。",
      "人口の少ない自治体では、工場の寮や施設の入退所など、少数の動きで率が大きく変わります。",
    ],
    relatedArticles: ["decline", "big-city-migration", "population-churn-analysis", "young-adult-migration-analysis", "migration-child"],
    relatedRankings: [
      { href: "/ranking/churn", label: "人口の入れ替わり率ランキング" },
      { href: "/ranking/young-adult-migration", label: "20代純移動率ランキング" },
      { href: "/ranking/natural-change", label: "自然増減率ランキング" },
    ],
  },

  "young-adult-migration": {
    metricName: "20代純移動率(人口1,000人あたり)",
    unit: "人/千人",
    digits: 1,
    direction: "high",
    scope: "人口3,000人以上の自治体",
    minPopulation: 3_000,
    rows: () =>
      build(
        (c) => c.youngAdultNetMigration != null && c.population >= 3000,
        (c) => ((c.youngAdultNetMigration ?? 0) / c.population) * 1000
      ),
    facts: (rows) => [
      share("20代の転入が転出を上回る(転入超過の)自治体", (v) => v > 0)(rows),
      ...smallTop("high")(rows),
    ],
    reading: [
      "20代の転入者から転出者を引いた人数(純移動)を、総人口1,000人あたりに直した値です。プラスなら、20代が転入超過であることを示します。",
      "20代の移動は、進学と就職に大きく左右されます。大学や専門学校がある自治体、企業が集中する自治体で高くなる傾向があります。",
      "進学で転入した人が、卒業後に転出する場合もあります。1年の数字だけでは、若者が定着しているかどうかは分かりません。",
      "人口の少ない自治体では、寮や施設の入退所など、少数の動きで値が大きく動きます。",
    ],
    relatedArticles: ["young-adult-migration-analysis", "big-city-migration", "young-family-attractiveness-index", "migration-child"],
    relatedRankings: [
      { href: "/ranking/decline", label: "社会増減率ランキング" },
      { href: "/ranking/young-family-attractiveness-index", label: "子育て世代吸引力指数ランキング" },
      { href: "/ranking/marriage-rate", label: "婚姻率ランキング" },
    ],
  },

  // ───────────── 環境 ─────────────
  "recycling-rate": {
    metricName: "ごみのリサイクル率",
    unit: "%",
    digits: 1,
    direction: "high",
    rows: () =>
      build(
        (c) => c.recyclingRate != null && c.recyclingRate > 0,
        (c) => c.recyclingRate ?? 0
      ),
    facts: (rows) => [
      share("リサイクル率が30%以上の自治体", (v) => v >= 30)(rows),
      ...smallTop("high")(rows),
    ],
    reading: [
      "リサイクル率は、ごみのうち、資源として再利用された量の割合を示します。数値が高いほど、資源化が進んでいることになります。",
      "分別の品目を細かく分けている自治体や、生ごみを堆肥にしている自治体、焼却灰を資源として利用している自治体では、数値が高くなります。",
      "リサイクル率が高い=ごみが少ない、という意味ではありません。住民1人あたりのごみの排出量とあわせて見ることが大切です。",
      "人口の少ない自治体では、回収の仕組みの変更や、一部の事業所のごみの扱いで、率が大きく動くことがあります。",
    ],
    relatedArticles: ["recycling-rate-analysis"],
    relatedRankings: [
      { href: "/ranking/population", label: "人口ランキング" },
      { href: "/ranking/decrease", label: "人口が少ない自治体ランキング" },
    ],
  },

  // ───────────── 独自指数(複合スコア) ─────────────
  "fiscal-health-composite": {
    metricName: "財政健全度スコア",
    unit: "点",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上で、4つの財政指標がそろう自治体",
    minPopulation: 3_000,
    rows: () => toRows(getFiscalHealthScores(), (c) => c.score),
    reading: [
      "このスコアは、財政力指数と地方税の割合を加え、経常収支比率と実質公債費比率を引いて合成した、当サイトの独自指標です。各指標は、自治体全体の平均を0、ばらつきを1とする値(標準化)に直してから足し引きしています。",
      "点数がプラスなら、4つの指標の平均的な水準より良い側、マイナスなら悪い側にあることを示します。点数そのものに単位や基準値はなく、自治体どうしを比べるための相対的な物差しです。",
      "4つの指標を同じ重みで合成しているため、重みの付け方は便宜的なものです。どの指標を重く見るかで、順位は変わります。",
      "単年度の数字で作っているため、一時的な収入や支出の影響を受けます。財政の良し悪しの最終的な判断には、各自治体の決算資料を確認してください。",
    ],
    relatedArticles: ["fiscal-health-composite", "finance-analysis", "balance-ratio-analysis", "debt-service-ratio-analysis", "bedroom-town-finance-analysis"],
    relatedRankings: [
      { href: "/ranking/finance", label: "財政力指数ランキング" },
      { href: "/ranking/balance-ratio", label: "経常収支比率ランキング" },
      { href: "/ranking/debt-service-ratio", label: "実質公債費比率ランキング" },
      { href: "/ranking/tax-ratio", label: "地方税自主財源比率ランキング" },
    ],
  },

  "elderly-support-composite": {
    metricName: "高齢者支援体制スコア",
    unit: "点",
    digits: 2,
    direction: "high",
    scope: "高齢化率が高い上位300自治体(人口3,000人以上)",
    minPopulation: 3_000,
    rows: () => toRows(getElderlySupportScores(), (c) => c.score),
    reading: [
      "このスコアは、人口あたりの医師数と、高齢者あたりの高齢者施設数を加え、単独世帯の割合を引いて合成した、当サイトの独自指標です。各指標は標準化(平均0、ばらつき1)してから足し引きしています。",
      "対象は、高齢化率が高い上位300自治体です。高齢化が進んだ自治体の中で、医療や施設、見守りの面の体制を比べるためのものです。",
      "単独世帯の割合は、見守りが必要な世帯が多い可能性を示す代わりの指標として引いています。1人暮らしであること自体が問題という意味ではありません。",
      "医師や施設の数だけで、実際の介護や医療の質は測れません。重みの付け方も便宜的で、唯一の正解ではない点に注意してください。",
    ],
    relatedArticles: ["elderly-support-composite", "elderly-home-analysis", "doctors-analysis", "aging-top50", "household-aging-ushape"],
    relatedRankings: [
      { href: "/ranking/aging", label: "高齢化率ランキング" },
      { href: "/ranking/doctors", label: "医師数ランキング" },
      { href: "/ranking/elderly-home", label: "高齢者施設数ランキング" },
      { href: "/ranking/household", label: "単独世帯割合ランキング" },
    ],
  },

  "industry-diversity-index": {
    metricName: "産業の集中度(HHI)",
    unit: "",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上の自治体",
    minPopulation: 3_000,
    rows: () => toRows(getIndustryDiversityScores(), (c) => c.score),
    facts: (rows) => [share("産業集中度(HHI)が0.5以上の自治体", (v) => v >= 0.5)(rows)],
    reading: [
      "この指数は、第1次・第2次・第3次産業の就業者の構成比を2乗して合計したもの(HHI)です。3つの産業が3分の1ずつなら最小の約0.33、1つの産業に全員が集中すれば最大の1になります。",
      "数値が大きいほど、特定の産業への偏りが大きい(多様性が低い)ことを示します。このランキングでは、偏りが大きい自治体が上位に並びます。",
      "産業が偏っている自治体は、その産業の景気や、大きな工場の動向に、雇用や税収が左右されやすい面があります。一方で、地域の強みが明確であることの表れともいえます。",
      "ここでは産業を3つに大きく分けているだけです。たとえば第3次産業の中の業種の偏りまでは分かりません。",
    ],
    relatedArticles: ["industry-diversity-index", "industry-structure", "unemployment-analysis", "corporate-growth-analysis"],
    relatedRankings: [
      { href: "/ranking/manufacturing", label: "第2次産業就業者比率ランキング" },
      { href: "/ranking/unemployment", label: "完全失業率ランキング" },
      { href: "/ranking/corporate-growth", label: "新設法人の純増数ランキング" },
    ],
  },

  "young-family-attractiveness-index": {
    metricName: "子育て世代吸引力指数",
    unit: "点",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上で、3つの指標がそろう自治体",
    minPopulation: 3_000,
    rows: () => toRows(getYoungFamilyAttractivenessScores(), (c) => c.score),
    reading: [
      "この指数は、子ども1,000人あたりの保育施設数、20代の純移動率、婚姻率の3つを、標準化(平均0、ばらつき1)して足し合わせた、当サイトの独自指標です。",
      "保育の受け皿、若い世代の転入、結婚という3つの面から、子育て世代を引きつける力を測ろうとしています。ただし、3つの指標の重みは同じで、便宜的なものです。",
      "保育施設は数だけで、定員や待機児童の状況は含まれていません。婚姻率は、届出をした自治体で数えるため、観光地などでは実際の居住者の結婚を表さないことがあります。",
      "指数が高い自治体が、子育てしやすいと断定することはできません。実際の暮らしやすさは、住宅費、通勤、教育環境など、ここに含まれない要素にも左右されます。",
    ],
    relatedArticles: ["young-family-attractiveness-index", "daycare-access", "marriage-birthrate-analysis", "young-adult-migration-analysis", "youngest-municipalities"],
    relatedRankings: [
      { href: "/ranking/daycare", label: "保育施設ランキング" },
      { href: "/ranking/young-adult-migration", label: "20代純移動率ランキング" },
      { href: "/ranking/marriage-rate", label: "婚姻率ランキング" },
      { href: "/ranking/birth-rate", label: "出生率ランキング" },
    ],
  },

  "living-infrastructure-index": {
    metricName: "生活基盤充実度指数",
    unit: "点",
    digits: 2,
    direction: "high",
    scope: "人口3,000人以上で、4つの指標がそろう自治体",
    minPopulation: 3_000,
    rows: () => toRows(getLivingInfrastructureScores(), (c) => c.score),
    reading: [
      "この指数は、人口あたりの商業施設(小売店と飲食店)の数と、人口あたりの公民館数を加え、空き家率を引いて合成した、当サイトの独自指標です。各指標は標準化(平均0、ばらつき1)してから足し引きしています。",
      "日々の買い物や外食の場、地域の集まりの場が身近にあり、空き家が少ない地域ほど、生活の基盤が整っているとみなす考え方です。",
      "店や公民館の数だけで、距離や質は測れません。観光地や都心部では、住民以外の利用者の分も数字に入るため、高く出る傾向があります。",
      "「暮らしやすさ」の評価ではなく、あくまで3つの観点を組み合わせた目安です。重みの付け方も便宜的です。",
    ],
    relatedArticles: ["living-infrastructure-index", "restaurant-density", "shopping-access", "vacant-house-analysis", "community-center-analysis"],
    relatedRankings: [
      { href: "/ranking/restaurant", label: "飲食店密度ランキング" },
      { href: "/ranking/retail-store", label: "大型小売店数ランキング" },
      { href: "/ranking/community-center", label: "公民館数ランキング" },
      { href: "/ranking/vacant-house", label: "空き家率ランキング" },
    ],
  },

  "bedroom-town-finance": {
    metricName: "昼夜間人口比率(低い順)",
    unit: "%",
    digits: 1,
    direction: "low",
    scope: "人口3,000人以上で、昼夜間人口と財政力指数がそろう自治体",
    minPopulation: 3_000,
    rows: () => toRows(getBedroomTownFinanceScores(), (c) => c.dayNightRatio),
    reading: [
      "昼夜間人口比率が低い自治体(昼間に人が出ていくベッドタウン)を、低い順に並べ、あわせて財政力指数を示すランキングです。住むための街が、財政の面でどれだけ自立しているかを見るためのものです。",
      "ベッドタウンは、住民が他の自治体に通勤するため、地域に企業が少なく、法人関係の税収が小さくなりがちです。個人の住民税や固定資産税に頼る割合が大きくなります。",
      "一方で、住民の所得が高い自治体や、大規模な商業施設がある自治体では、財政力指数が高くなる場合もあります。昼夜間人口比率の低さだけでは、財政の姿は決まりません。",
      "昼間人口は、通勤・通学の移動だけから求めた値です。買い物や観光で訪れる人は含まれません。",
    ],
    relatedArticles: ["bedroom-town-finance-analysis", "daytime-ratio-analysis", "finance-analysis", "fiscal-health-composite"],
    relatedRankings: [
      { href: "/ranking/daytime-ratio", label: "昼夜間人口比率ランキング" },
      { href: "/ranking/finance", label: "財政力指数ランキング" },
      { href: "/ranking/fiscal-health-composite", label: "財政健全度スコアランキング" },
    ],
  },

  // ───────────── 都道府県単位のランキング ─────────────
  income: {
    metricName: "平均年収",
    unit: "万円",
    digits: 0,
    direction: "high",
    level: "prefecture",
    rows: () => prefRows((s) => s.income, 0.1),
    facts: topBottom("high", (v) => `${Math.round(v).toLocaleString()}万円`),
    reading: [
      "厚生労働省「賃金構造基本統計調査」をもとにした、都道府県別の推計年収です。毎月の給与に年間の賞与などを加えて、1年分に直しています。",
      "この調査は事業所を対象にしており、勤務先の所在地で集計されます。住んでいる場所で集計した統計とは、順位が異なることがあります。大企業の本社や支社が集まる都市は、高くなる傾向があります。",
      "年収の高さは、暮らしの豊かさと同じではありません。家賃などの住居費や物価、通勤にかかる時間と費用は、都道府県によって大きく異なります。",
      "平均は、少数の高い給与に引き上げられます。多くの人の実感に近い水準を知るには、中央値や、産業別・年齢別の賃金もあわせて見る必要があります。",
    ],
    relatedArticles: ["prefecture-income-analysis", "industry-structure", "real-estate-single-household-analysis", "unemployment-analysis"],
    relatedRankings: [
      { href: "/ranking/unemployment", label: "完全失業率ランキング" },
      { href: "/ranking/manufacturing", label: "第2次産業就業者比率ランキング" },
      { href: "/ranking/real-estate-price", label: "不動産取引価格ランキング" },
    ],
  },

  "crime-rate": {
    metricName: "刑法犯認知件数",
    unit: "件/千人",
    digits: 2,
    direction: "high",
    level: "prefecture",
    rows: () => prefRows((s) => s.crimeRate),
    facts: topBottom("high", (v) => `${v.toFixed(2)}件`),
    reading: [
      "人口1,000人あたりの刑法犯認知件数です。認知件数は、警察が事件として把握した件数で、実際に起きた犯罪のすべてではありません。",
      "刑法犯の中では、自転車盗や万引きなどの窃盗が大きな割合を占めます。件数の多さは、凶悪犯罪の多さを意味するものではありません。",
      "数字は、住んでいる人の数で割っています。昼間に通勤・通学や観光で人が集まる都市部では、人口に対する件数が大きく出る傾向があります。",
      "被害の届け出のしやすさや、警察の取り扱い方針によっても、認知件数は変わります。数値が高い=危険、数値が低い=安全、と単純に決めつけないでください。",
    ],
    relatedArticles: ["crime-rate-analysis", "single-household-crime-analysis", "accident-daytime-population", "daytime-ratio-analysis"],
    relatedRankings: [
      { href: "/ranking/traffic-accident-rate", label: "交通事故発生件数ランキング(都道府県)" },
      { href: "/ranking/daytime-ratio", label: "昼夜間人口比率ランキング" },
      { href: "/ranking/household", label: "単独世帯割合ランキング" },
    ],
  },

  "traffic-accident-rate": {
    metricName: "交通事故発生件数",
    unit: "件/10万人",
    digits: 1,
    direction: "high",
    level: "prefecture",
    rows: () => prefRows((s) => s.trafficAccidentRate),
    facts: topBottom("high", (v) => `${v.toFixed(1)}件`),
    reading: [
      "人口10万人あたりの交通事故(人身事故)の発生件数です。発生件数であり、死亡者数や、事故の重大さは含まれていません。",
      "件数が多いからといって、重大な事故が多いとは限りません。軽いけがの事故が多い地域もあれば、件数は少なくても死亡事故の割合が高い地域もあります。",
      "自動車の利用が多い地域や、交通量の多い都市部では、事故の機会が増えます。人口あたりの件数だけでは、運転する人の運転の質は測れません。",
      "市区町村別の交通事故のランキングは、別ページで確認できます。都道府県の数字は、その中に含まれる都市部と農村部の違いをならした平均です。",
    ],
    relatedArticles: ["traffic-accident-analysis", "accident-daytime-population", "crime-rate-analysis"],
    relatedRankings: [
      { href: "/ranking/traffic-accident-city", label: "交通事故発生件数ランキング(市区町村)" },
      { href: "/ranking/icy-road-accident", label: "凍結路面の事故ランキング" },
      { href: "/ranking/crime-rate", label: "刑法犯認知件数ランキング(都道府県)" },
    ],
  },

  // ───────────── 経済・不動産・地形 ─────────────
  "corporate-growth": {
    metricName: "新設法人の純増数",
    unit: "件",
    digits: 0,
    direction: "high",
    scope: "人口1,000人以上の自治体",
    minPopulation: 1_000,
    rows: () =>
      getCorporateGrowthRanking()
        .filter((c) => c.population != null && c.population >= 1000)
        .map((c) => ({ name: c.name, population: c.population ?? 0, value: c.netGrowth })),
    facts: (rows) => [
      share("法人の閉鎖が新設を上回った(純減の)自治体", (v) => v < 0)(rows),
      share("純増数が10件に満たない(純減を含む)自治体", (v) => v < 10)(rows),
    ],
    reading: [
      "国税庁「法人番号公表サイト」のデータから、直近12か月に新しくできた法人の数と、閉鎖された法人の数を数え、その差(純増)を比べています。株式会社などの法人が対象で、個人事業主は含まれません。",
      "純増数は件数そのものなので、もともと法人の数が多い大都市が上位になります。人口に対する勢いを見るには、人口1,000人あたりの純増数など、割合の指標もあわせて見る必要があります。",
      "事業をやめても、閉鎖の登記をしないまま放置されている法人があります。閉鎖が実態より少なく数えられるため、純増は実際の企業の勢いよりも大きく見える可能性があります。",
      "法人の本店を他の自治体に移すと、移した先で新設として数えられる場合があります。純増の中身は、新しい事業の誕生だけとは限りません。",
    ],
    relatedArticles: ["corporate-growth-analysis", "industry-structure", "industry-diversity-index", "unemployment-analysis"],
    relatedRankings: [
      { href: "/ranking/manufacturing", label: "第2次産業就業者比率ランキング" },
      { href: "/ranking/industry-diversity-index", label: "産業の多様性指数ランキング" },
      { href: "/ranking/unemployment", label: "完全失業率ランキング" },
    ],
  },

  "real-estate-price": {
    metricName: "宅地の平米単価",
    unit: "万円/m²",
    digits: 1,
    direction: "high",
    scope: "直近1年の宅地の取引が10件以上ある自治体",
    hideSizeAnalysis: true,
    rows: () =>
      getRealEstatePriceRanking()
        .filter((c) => c.landPricePerSqm != null && c.landSampleSize >= 10)
        .map((c) => ({ name: c.name, population: 0, value: (c.landPricePerSqm ?? 0) / 10_000 })),
    facts: () => {
      const condo = getRealEstatePriceRanking().filter(
        (c) => c.condoPricePerSqm != null && c.condoSampleSize >= 10
      );
      const v = condo.map((c) => (c.condoPricePerSqm ?? 0) / 10_000).sort((a, b) => a - b);
      const med = v.length ? v[Math.floor(v.length / 2)] : null;
      return med == null
        ? []
        : [
            `中古マンションは、取引が10件以上ある${n(v.length)}自治体が対象で、平米単価の中央値は約${med.toFixed(1)}万円/m²です(中古マンションのランキングは、このページ内の表で確認できます)。`,
          ];
    },
    reading: [
      "国土交通省「不動産情報ライブラリ」に載っている、実際の取引価格(直近1年分)の平均をもとにしています。売り出し価格や、公示地価・基準地価とは異なり、実際に成立した取引の価格です。",
      "取引の件数が少ない自治体は、数件の取引の内容で平均が大きく変わります。このため、取引が10件以上ある自治体だけを対象にしています。",
      "同じ自治体の中でも、駅の近くか郊外か、土地の広さ、中古マンションの築年数などで単価は大きく異なります。平均は、個別の物件の値段を示すものではありません。",
      "取引が多く成立している自治体の価格が反映されるため、取引そのものが少ない地域の実態は、このランキングには表れにくくなります。",
    ],
    relatedArticles: ["real-estate-price-analysis", "real-estate-single-household-analysis", "prefecture-income-analysis"],
    relatedRankings: [
      { href: "/ranking/income", label: "平均年収ランキング(都道府県)" },
      { href: "/ranking/vacant-house", label: "空き家率ランキング" },
      { href: "/ranking/density", label: "人口密度ランキング" },
    ],
  },

  "capital-elevation": {
    metricName: "県庁所在地の標高",
    unit: "m",
    digits: 1,
    direction: "high",
    level: "prefecture",
    rows: () =>
      getCapitalElevationRanking().map((c) => ({
        name: `${c.pref}${c.city}`,
        population: 0,
        value: c.elevationM,
      })),
    facts: topBottom("high", (v) => `${v.toFixed(1)}m`),
    reading: [
      "国土地理院のデータにもとづく、都道府県庁の所在地の標高(海面からの高さ)です。市全体の平均ではなく、庁舎がある地点の標高です。",
      "同じ市の中でも、標高は場所によって大きく違います。県庁の位置が低い場所にあっても、市の中には高台の住宅地が広がっていることがあります。",
      "標高が低い=浸水の危険が高い、とは限りません。川の堤防や排水の設備、地盤の状態によって、実際のリスクは変わります。災害の備えには、各自治体のハザードマップを確認してください。",
      "標高の差は、気温や雪の降り方、街の広がり方にも影響します。山に囲まれた盆地の街と、海に面した平野の街では、暮らしの条件が大きく異なります。",
    ],
    relatedArticles: ["capital-elevation-analysis"],
    relatedRankings: [
      { href: "/ranking/habitable-density", label: "可住地人口密度ランキング" },
      { href: "/ranking/density", label: "人口密度ランキング" },
      { href: "/ranking/area", label: "面積ランキング" },
    ],
  },
};
