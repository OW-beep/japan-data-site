// ランキングページの MetricBox に渡す「データについて」情報を
// 一元管理するモジュール。出典・年度・対象範囲・除外条件などの
// 表記ゆれを防ぐため、ここに集約する。
//
// 出典の根拠は scripts/buildCities.ts のヘッダコメントに準拠。
// 多くの指標は e-Stat「社会・人口統計体系」市区町村データ
// (統計表ID: 0000020201、通称SSDSE-市区町村)から取得している。

export type DataSource = {
  sourceName: string;
  dataYear: string;
  scope?: string;
  excluded?: string;
  notes?: string;
};

const SSDSE_BASE: Pick<DataSource, "sourceName" | "scope"> = {
  sourceName:
    "e-Stat「社会・人口統計体系」市区町村データ(統計表ID: 0000020201)",
  scope: "全国1,741市区町村",
};

export const dataSources: Record<string, DataSource> = {
  population: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
    notes:
      "国勢調査は5年に1度の実施のため、直近1〜2年の急激な人口変動は反映されていない場合があります。",
  },
  aging: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
  },
  child: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
  },
  density: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査、面積は国土地理院データ)",
  },
  household: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
  },
  "household-size": {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
  },
  "birth-rate": {
    sourceName:
      "厚生労働省「人口動態保健所・市区町村別統計」(e-Stat内「ファイル」区分で公開)",
    dataYear: "2018〜2022年の5年計",
    scope: "全国1,741市区町村",
    notes:
      "5年間の合計特殊出生率のため、直近単年の全国値(厚生労働省公表の年次値)とは算出方法が異なり、単純比較はできません。",
  },
  doctors: {
    ...SSDSE_BASE,
    dataYear: "2022年(医師・歯科医師・薬剤師統計)",
    notes:
      "医師の「勤務地」ベースの集計です。大学病院がある自治体に数値が集中しやすい点にご注意ください。",
  },
  dentist: {
    ...SSDSE_BASE,
    dataYear: "2022年(医師・歯科医師・薬剤師統計)",
  },
  pharmacist: {
    ...SSDSE_BASE,
    dataYear: "2022年(医師・歯科医師・薬剤師統計)",
    notes: "勤務地ベースの集計のため、病院・研究機関・薬局チェーン本部がある自治体に数値が集中しやすい点にご注意ください。",
  },
  hospital: {
    sourceName: "厚生労働省「医療施設調査」(e-Stat)",
    dataYear: "2023年",
    scope: "全国1,741市区町村",
    notes: "病院(20床以上)と診療所(20床未満)は統計上区別されています。人口が少ない自治体ほど、1施設の増減で人口あたり換算値が大きく変動する点にご注意ください。",
  },
  finance: {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算",
    scope: "全国1,741市区町村",
  },
  "balance-ratio": {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算",
    scope: "全国1,741市区町村",
  },
  "tax-ratio": {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算",
    scope: "全国1,741市区町村",
  },
  "debt-service-ratio": {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算(3か年平均)",
    scope: "全国1,741市区町村",
    notes:
      "3か年平均で算出される指標のため、単年の決算数値からは直接計算できません。",
  },
  "education-expense": {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算",
    scope: "人口3,000人以上の市区町村",
    excluded: "人口3,000人未満の自治体(数値が不安定になるため)",
  },
  "welfare-ratio": {
    sourceName: "総務省「地方財政状況調査」(e-Stat)",
    dataYear: "2023年度決算",
    scope: "全国1,741市区町村",
  },
  decline: {
    sourceName: "総務省「住民基本台帳人口移動報告」",
    dataYear: "2023年",
    scope: "全国1,741市区町村",
    notes:
      "転入・転出による社会増減のみを示す指標で、出生・死亡による自然増減は含みません。",
  },
  "natural-change": {
    ...SSDSE_BASE,
    dataYear: "2022年",
    notes: "出生数・死亡数による自然増減のみを示し、転入・転出は含みません。",
  },
  area: {
    sourceName: "国土地理院「全国都道府県市区町村別面積調」",
    dataYear: "2026年(令和8年)",
    scope: "全国1,741市区町村",
  },
  "community-center": {
    sourceName:
      "e-Stat「社会・人口統計体系」G 文化・スポーツ・市区町村データ(統計表ID: 0000020207)",
    dataYear: "2021年度(社会教育調査、3年ごと実施)",
    scope: "全国1,741市区町村",
  },
  daycare: {
    sourceName:
      "統計センター SSDSE-市区町村(SSDSE-A)。元データは社会福祉施設等調査",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
  },
  "daytime-ratio": {
    sourceName:
      "総務省統計局「令和2年国勢調査」従業地・通学地集計(統計表ID: 0004003060)",
    dataYear: "2020年(令和2年国勢調査)",
  },
  decrease: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
    notes:
      "人口ランキングと同じ国勢調査人口を、少ない順に並べ替えたものです。",
  },
  "elderly-home": {
    sourceName:
      "e-Stat「社会・人口統計体系」J 福祉・市区町村データ(統計表ID: 0000020210)",
    dataYear: "2023年度",
    scope: "全国1,741市区町村",
    notes:
      "介護老人福祉施設・養護老人ホーム・有料老人ホームの合算値です。",
  },
  "foreign-population": {
    sourceName: "統計センター SSDSE-市区町村(SSDSE-A)",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
  },
  "habitable-density": {
    sourceName:
      "統計センター SSDSE-市区町村(SSDSE-A)。可住地面積は国土地理院データに基づく",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
    notes:
      "総面積から山地・湖沼等を除いた「可住地面積」を分母に用いており、単純な人口密度(総面積ベース)とは数値が異なります。",
  },
  library: {
    ...SSDSE_BASE,
    dataYear: "2021年度(社会教育調査、3年ごと実施)",
  },
  manufacturing: {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査、産業別就業者数)",
  },
  "marriage-rate": {
    ...SSDSE_BASE,
    dataYear: "2022年",
  },
  "divorce-rate": {
    ...SSDSE_BASE,
    dataYear: "2022年",
    notes: "人口規模の小さい自治体では、件数の増減で数値が大きく振れやすい点にご注意ください。",
  },
  "recycling-rate": {
    sourceName:
      "e-Stat「社会・人口統計体系」H 居住・市区町村データ(統計表ID: 0000020208)、元データは一般廃棄物処理事業実態調査",
    dataYear: "2024年度",
    scope: "全国1,741市区町村",
  },
  restaurant: {
    sourceName: "統計センター SSDSE-市区町村(SSDSE-A)、元データは経済センサス",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
  },
  "retail-access": {
    sourceName:
      "統計センター SSDSE-市区町村(SSDSE-A、小売店数)＋e-Stat「社会・人口統計体系」(高齢者人口)",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
    notes:
      "小売店の「実際の距離・アクセスのしやすさ」ではなく、人口あたりの店舗数から算出した簡易的な指標です。",
  },
  "retail-store": {
    sourceName: "統計センター SSDSE-市区町村(SSDSE-A)、元データは経済センサス",
    dataYear: "SSDSE-A-2026年版収録データ",
    scope: "全国1,741市区町村",
    notes: "売场面積1,000平方メートル以上の大型店のみを集計対象としています。",
  },
  "school-crowding": {
    ...SSDSE_BASE,
    dataYear: "2023年度(学校基本調査)",
  },
  "sparse-density": {
    ...SSDSE_BASE,
    dataYear: "2020年(令和2年国勢調査)",
    notes: "人口密度ランキングと同じデータを、低い順に並べ替えたものです。",
  },
  unemployment: {
    sourceName: "統計センター SSDSE-市区町村(SSDSE-A)、元データは国勢調査(就業状態等基本集計)",
    dataYear: "2020年(令和2年国勢調査)",
    scope: "全国1,741市区町村",
  },
  "vacant-house": {
    sourceName: "総務省統計局「令和5年住宅・土地統計調査」",
    dataYear: "2023年(令和5年)",
    scope: "市・区、および人口1万5千人以上の町村",
    excluded: "人口1万5千人未満の町村(調査の公表方針により対象外)",
  },
  "young-adult-migration": {
    sourceName:
      "総務省統計局「住民基本台帳人口移動報告」年齢階級別集計(統計表ID: 0003419945)",
    dataYear: "2025年(データが薄い場合は2024年で補完)",
    scope: "全国1,741市区町村",
    notes: "20〜29歳の転入超過数を合算した値です。",
  },
};
