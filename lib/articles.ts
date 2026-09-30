/**
 * 記事の一覧(単一の情報源)。
 *
 * ここに1行追加すると、次の場所へ自動で反映される:
 *   - トップページ「新着」セクション
 *   - /articles 記事一覧(新しい順・NEWバッジ)
 *   - 各記事の末尾の「新着記事」ブロック
 *   - sitemap.xml(lastModified に記事の公開日を使用)
 *
 * 新しい記事を作ったら、この配列の先頭に必ず1行追加すること。
 * 追加漏れは `npm run check:articles` で検出できる。
 *
 * date は記事の publishedAt と同じ日付(YYYY-MM-DD)にする。
 */
export type ArticleEntry = {
  slug: string;
  date: string;
  title: string;
  desc: string;
};

export const articleEntries: ArticleEntry[] = [
  { slug: "furusato-nozei-2026-guide", date: "2026-09-30", title: "ふるさと納税2026の期限と10月の制度変更", desc: "寄付は12月31日まで、ワンストップ特例は1月10日必着。ポイント付与禁止後の選び方と、受入額が多い自治体のデータも。" },
  { slug: "designated-cities-comparison", date: "2026-09-30", title: "政令指定都市20市の人口ランキング", desc: "人口・面積・人口密度・高齢化率で20市を比較。100万人に届かない政令指定都市はどこかも解説します。" },
  { slug: "marriage-birthrate-analysis", date: "2026-09-29", title: "婚姻率と出生率の関係", desc: "東京都心は結婚は多いのに子どもは少ない。大都市限定では相関係数-0.51という逆相関を検証します。" },
  { slug: "municipality-name-trivia", date: "2026-09-26", title: "動物の名前を持つ自治体、日本一長い地名の街", desc: "全国1,740市区町村の名前を調査。動物の漢字を含む自治体は61、最長の地名は7文字でした。" },
  { slug: "daytime-restaurant-density-analysis", date: "2026-09-25", title: "昼間人口比率と飲食店密度の関係", desc: "千代田区は住民1,000人あたり飲食店45件。相関係数0.87の強い関係を検証します。" },
  { slug: "library-child-ratio-analysis", date: "2026-09-24", title: "図書館の充実度と子供の割合に関係はあるか", desc: "図書館1館あたりの人口と子供の割合を検証。相関係数0.06のほぼ無関係な結果に。" },
  { slug: "single-household-crime-analysis", date: "2026-09-23", title: "単身世帯率と犯罪率の関係", desc: "東京都は単身世帯率1位なのに犯罪率は7位。相関係数0.38の意外な関係を検証します。" },
  { slug: "daycare-birthrate-analysis", date: "2026-09-23", title: "保育園の数と出生率の関係", desc: "「保育園を増やせば出生率が上がる」は本当か。相関係数0.33の実態を検証します。" },
  { slug: "corporate-growth-analysis", date: "2026-09-18", title: "新設法人ランキング分析", desc: "渋谷区が純増4,428件で1位、最下位は宇都宮市。新設法人の純増数(新設-閉鎖)を全国の市区町村で分析します。" },
  { slug: "real-estate-single-household-analysis", date: "2026-09-14", title: "地価が高い自治体ほど単身世帯が多い", desc: "地価と単身世帯率の相関を分析。都心型と過疎型、中身の違いも解説します。" },
  { slug: "real-estate-price-analysis", date: "2026-09-14", title: "不動産価格ランキング分析", desc: "実際の取引データで土地・マンション価格を分析。地価と人口密度の関係も検証します。" },
  { slug: "vacant-house-furusato-nozei-analysis", date: "2026-09-13", title: "空き家率とふるさと納税受入額の相関", desc: "相関はあるが因果ではない。人口規模という共通要因を検証します。" },
  { slug: "population-churn-analysis", date: "2026-09-13", title: "人口の入れ替わり率ランキング分析", desc: "転入超過率だけでは見えない、住民の入れ替わりの激しさを比較します。" },
  { slug: "furusato-nozei-finance-analysis", date: "2026-09-13", title: "ふるさと納税は財政力の弱い自治体を助けているか", desc: "受入額と財政力指数の相関を分析し、制度の実態を検証します。" },
  { slug: "furusato-nozei-analysis", date: "2026-09-13", title: "ふるさと納税 受入額ランキング分析", desc: "総務省の現況調査をもとに、受入額ランキングとお金の流れを分析します。" },
  { slug: "duplicate-municipality-names", date: "2026-09-13", title: "同じ名前の自治体はいくつある？", desc: "全国で名前が重複する25組・57自治体を、人口・面積で比較します。" },
  { slug: "capital-elevation-analysis", date: "2026-09-13", title: "都道府県庁所在地 標高ランキング分析", desc: "標高上位3県はすべて盆地の都市。国土地理院データで分析します。" },
  { slug: "near-million-cities", date: "2026-09-10", title: "90万人・80万人都市一覧", desc: "100万人に迫る「準百万都市」を人口順に一覧で比較できます。" },
  { slug: "traffic-accident-analysis", date: "2026-09-03", title: "交通事故発生件数ランキング分析", desc: "都道府県別の交通事故発生件数(人口10万人あたり)を分析。" },
  { slug: "crime-rate-analysis", date: "2026-09-03", title: "刑法犯認知件数ランキング分析", desc: "都道府県別の刑法犯認知件数(人口千人あたり)を分析。" },
  { slug: "prefecture-income-analysis", date: "2026-09-02", title: "都道府県別 平均年収ランキング分析", desc: "厚生労働省の賃金統計から都道府県別の推計年収を算出し、出生率・犯罪率・交通事故率との関係を分析。" },
  { slug: "bedroom-town-finance-analysis", date: "2026-08-24", title: "「豊かなベッドタウン」ランキング分析", desc: "昼夜間人口比率(職住近接度)と財政力指数を掛け合わせて分析。" },
  { slug: "regional-block-disparity-report", date: "2026-08-21", title: "地方ブロック格差レポート", desc: "全国1,741市区町村を8つの地方ブロックに集約して比較。" },
  { slug: "pharmacist-access-analysis", date: "2026-08-20", title: "薬剤師数ランキング分析", desc: "人口10万人あたりの薬剤師数を分析。" },
  { slug: "hospital-access-analysis", date: "2026-08-20", title: "病院数ランキング分析", desc: "人口10万人あたりの病院数を分析。" },
  { slug: "divorce-rate-analysis", date: "2026-08-20", title: "離婚率ランキング分析", desc: "人口千人あたりの離婚件数を分析。" },
  { slug: "dentist-access-analysis", date: "2026-08-17", title: "歯科医師数ランキング分析", desc: "人口10万人あたりの歯科医師数を分析。" },
  { slug: "young-family-attractiveness-index", date: "2026-08-15", title: "子育て世代吸引力指数", desc: "保育所定員・20代純移動率・婚姻率を組み合わせた独自の「子育て世代吸引力指数」を算出。" },
  { slug: "living-infrastructure-index", date: "2026-08-15", title: "生活基盤充実度指数", desc: "人口あたりの商業集積(小売・飲食店)、公民館数、空き家率を組み合わせた独自の「生活基盤充実度指数」を算出。" },
  { slug: "industry-diversity-index", date: "2026-08-15", title: "産業構造の多様性指数", desc: "第1次・第2次・第3次産業の就業者比率からハーフィンダール指数(産業集中度)を算出。" },
  { slug: "fiscal-health-composite", date: "2026-08-15", title: "自治体・財政健全度スコア", desc: "財政力指数・経常収支比率・自主財源比率・実質公債費比率の4つの財政指標をZスコアで統合し、独自の「財政健全度スコア」を算出。" },
  { slug: "elderly-support-composite", date: "2026-08-15", title: "高齢者支援体制スコア", desc: "高齢化率が近い自治体同士でも、医師数・老人ホーム定員・独居高齢者率を組み合わせた独自スコアで比較すると、支援体制には大きな差があることが…" },
  { slug: "education-expense-analysis", date: "2026-08-11", title: "教育費ランキング分析", desc: "住民一人あたりの教育費をランキング分析。" },
  { slug: "debt-service-ratio-analysis", date: "2026-08-11", title: "実質公債費比率ランキング分析", desc: "過去の借金返済の重さを示す実質公債費比率をランキング分析。" },
  { slug: "recycling-rate-analysis", date: "2026-08-10", title: "ごみのリサイクル率ランキング分析", desc: "大崎町はなぜ「日本一」と呼ばれるのか。" },
  { slug: "community-center-analysis", date: "2026-08-10", title: "公民館数ランキング分析", desc: "集落ごとに公民館がある町、長野県が上位を独占。" },
  { slug: "young-adult-migration-analysis", date: "2026-08-09", title: "20代純移動率ランキング分析", desc: "若者に選ばれる街、東京だけでなく大阪市の各区が上位に。" },
  { slug: "elderly-home-analysis", date: "2026-08-08", title: "高齢者施設数ランキング分析", desc: "旭川市が「福祉の街」と呼ばれる理由、東京23区が手薄になりがちな背景。" },
  { slug: "daytime-ratio-analysis", date: "2026-08-08", title: "昼夜間人口比率ランキング分析", desc: "千代田区が1355%になる理由と、福島県の被災地が上位に入った背景。" },
  { slug: "vacant-house-analysis", date: "2026-08-07", title: "空き家率ランキング分析", desc: "軽井沢町と夕張市、上位に並ぶ「性質の違う空き家」。" },
  { slug: "shopping-access", date: "2026-08-06", title: "買い物難民ランキング分析", desc: "過疎の山村より郊外ニュータウンが危ない、意外な実態。" },
  { slug: "restaurant-density", date: "2026-08-06", title: "飲食店密度ランキング分析", desc: "千代田区とベッドタウン、対極にある2つの街の姿。" },
  { slug: "marriage-rate-analysis", date: "2026-08-06", title: "婚姻率ランキング分析", desc: "同じ東京都でも、都心の区と郊外の市でここまで差が出る理由。" },
  { slug: "daycare-access", date: "2026-08-06", title: "保育園あたり子ども人口ランキング分析", desc: "人口20万人以上の都市で比較すると、東京23区と大阪府内の自治体で驚くほど差が開く。" },
  { slug: "balance-ratio-analysis", date: "2026-08-06", title: "経常収支比率ランキング分析", desc: "原発立地自治体はなぜ強く、夕張市はなぜ最下位なのか。" },
  { slug: "foreign-population", date: "2026-08-05", title: "外国人人口比率ランキング分析", desc: "1位は19%の長野県の農村。農業・製造業・都心という3パターン。" },
  { slug: "natural-change", date: "2026-08-03", title: "自然増減率ランキング分析", desc: "全国1740自治体中、自然増加はわずか34自治体だけ。" },
  { slug: "habitable-density", date: "2026-08-03", title: "可住地人口密度ランキング分析", desc: "三重県尾鷲市は「見た目より混んでいる」自治体だった。" },
  { slug: "welfare-aging", date: "2026-08-01", title: "民生費と高齢化率の意外な関係", desc: "相関係数-0.61。高齢化率が高いほど民生費比率が下がる理由。" },
  { slug: "school-crowding", date: "2026-07-31", title: "学校規模ランキング分析", desc: "1校2293人のマンモス校の町と、21人の離島の小学校。" },
  { slug: "tax-composition", date: "2026-07-30", title: "財政の中身分析", desc: "地方税自主財源比率63.8%の村と1.7%の村、その差を解説。" },
  { slug: "industry-structure", date: "2026-07-29", title: "産業構造分析", desc: "農業の町・ものづくりの町・サービス業の町、3タイプを比較。" },
  { slug: "unemployment-analysis", date: "2026-07-28", title: "完全失業率ランキング分析", desc: "福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのかを解説。" },
  { slug: "doctors-analysis", date: "2026-07-28", title: "医師数ランキング分析", desc: "医科大学の城下町が上位独占。医師ゼロの29町村の実態も解説。" },
  { slug: "child-finance", date: "2026-07-27", title: "子ども人口割合と財政力指数の関係", desc: "相関係数0.40。成田空港の町の財政力が強い理由を分析します。" },
  { slug: "density-finance", date: "2026-07-25", title: "人口密度と財政力指数の関係", desc: "相関係数0.73。過疎地なのに財政が豊かな自治体の理由を分析します。" },
  { slug: "household-aging-ushape", date: "2026-07-24", title: "単独世帯割合と高齢化率のU字関係", desc: "相関係数はほぼ0。それでも隠れているU字型の関係を分析します。" },
  { slug: "migration-child", date: "2026-07-21", title: "転入超過と子ども人口割合の関係", desc: "相関係数0.30。「人が集まる町」と「子育て世代が集まる町」の違いを分析します。" },
  { slug: "density-aging", date: "2026-07-14", title: "人口密度と高齢化率の相関分析", desc: "相関係数-0.72。それでも密集した高齢化都市がある理由を分析します。" },
  { slug: "aging-finance", date: "2026-07-03", title: "高齢化率と財政力指数の関係", desc: "相関係数-0.71。それでも財政が強い「例外」自治体を分析します。" },
  { slug: "aging-gap", date: "2026-06-19", title: "少子高齢化ギャップ分析", desc: "高齢化率が子ども人口割合を最大62.9ポイント上回る自治体を分析します。" },
  { slug: "prefecture-composite", date: "2026-05-22", title: "都道府県総合スコア", desc: "4指標を組み合わせて都道府県を比較・分析します。" },
  { slug: "population-finance", date: "2026-05-08", title: "人口規模と財政力の関係", desc: "大都市は本当に財政が強いのかをデータで分析します。" },
  { slug: "decline", date: "2026-04-24", title: "社会増減率分析", desc: "転入超過1位はなぜ人口847人の町なのかを分析します。" },
  { slug: "household-analysis", date: "2026-04-17", title: "単独世帯割合分析", desc: "都心と被災地、正反対の理由で1人暮らしが多い自治体を分析します。" },
  { slug: "finance-analysis", date: "2026-04-10", title: "財政力指数ランキング分析", desc: "なぜ小さな村が全国トップなのかを分析します。" },
  { slug: "area-analysis", date: "2026-04-03", title: "面積ランキング分析", desc: "北海道と山間部の市町村が上位を占める理由を分析します。" },
  { slug: "density-analysis", date: "2026-03-27", title: "人口密度ランキング分析", desc: "なぜ東京都特別区が上位を独占するのかを分析します。" },
  { slug: "youngest-municipalities", date: "2026-03-13", title: "若い自治体ランキング", desc: "平均年齢が若い自治体を紹介します。" },
  { slug: "aging-top50", date: "2026-03-06", title: "高齢化率ランキング", desc: "高齢化率が高い自治体ランキングです。" },
  { slug: "child-top50", date: "2026-02-27", title: "子ども人口ランキング", desc: "子ども人口が多い自治体ランキングです。" },
  { slug: "population-concentration", date: "2026-02-20", title: "人口集中はどこで起きている？", desc: "都市への人口集中をデータから分析します。" },
  { slug: "million-cities", date: "2026-02-13", title: "100万人都市一覧", desc: "人口100万人以上の都市を一覧で比較できます。" },
  { slug: "population-top50", date: "2026-02-06", title: "人口ランキングTOP50", desc: "人口が多い自治体をランキング形式で紹介します。" },
  { slug: "population-about", date: "2026-02-06", title: "人口とは？", desc: "人口データの見方や集計方法をわかりやすく解説します。" },
  { slug: "birth-rate", date: "2026-02-06", title: "出生率ランキング", desc: "出生率が高い自治体ランキングです。" },
];

/** ランキングページの公開日(新着セクション用。追加したら先頭に1行足す) */
export type RankingEntry = {
  href: string;
  date: string;
  title: string;
  emoji: string;
};

export const rankingEntries: RankingEntry[] = [
  { href: "/ranking/churn", date: "2026-10-01", title: "人口の入れ替わり率ランキング", emoji: "🔄" },
  { href: "/ranking/aging-gap", date: "2026-10-01", title: "少子高齢化ギャップランキング", emoji: "⚖️" },
  { href: "/ranking/large-cities", date: "2026-09-30", title: "人口50万人以上の都市ランキング", emoji: "🌆" },
  { href: "/ranking/corporate-growth", date: "2026-09-18", title: "新設法人純増数ランキング", emoji: "🏢" },
  { href: "/ranking/real-estate-price", date: "2026-09-14", title: "不動産価格ランキング", emoji: "🏠" },
  { href: "/ranking/capital-elevation", date: "2026-09-13", title: "県庁所在地 標高ランキング", emoji: "⛰️" },
  { href: "/ranking/furusato-nozei", date: "2026-09-13", title: "ふるさと納税受入額ランキング", emoji: "🎁" },
];

export type FeedItem = {
  href: string;
  date: string;
  title: string;
  desc?: string;
  type: "記事" | "ランキング";
};

/** 記事とランキングを新しい順に混ぜた新着フィード */
export function getFeed(limit?: number): FeedItem[] {
  const items: FeedItem[] = [
    ...articleEntries.map((a) => ({
      href: `/articles/${a.slug}`,
      date: a.date,
      title: a.title,
      desc: a.desc,
      type: "記事" as const,
    })),
    ...rankingEntries.map((r) => ({
      href: r.href,
      date: r.date,
      title: r.title,
      type: "ランキング" as const,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return limit ? items.slice(0, limit) : items;
}

/** 記事だけを新しい順に返す。excludeSlug を渡すとその記事を除く */
export function getLatestArticles(limit: number, excludeSlug?: string) {
  return articleEntries
    .filter((a) => a.slug !== excludeSlug)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}

/** 公開から days 日以内なら true(ビルド時点で判定) */
export function isNew(date: string, days = 14, now: Date = new Date()): boolean {
  const t = new Date(`${date}T00:00:00+09:00`).getTime();
  return now.getTime() - t <= days * 24 * 60 * 60 * 1000 && now.getTime() >= t;
}

/** "2026-09-30" -> "9/30" */
export function formatMD(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}
