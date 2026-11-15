/**
 * 記事ごとに、どのアフィリエイトのトピックを出すか。
 *
 * 記事の「悩み」(lib/articleSolutionsData*.ts の problem)から、合うトピックを自動で選ぶ。
 * 読者の悩みと関係がない広告は出さない。原則は1記事に1トピック(複数の悩みが重なる記事だけ2トピック)。
 * すでに記事の本文に <AffiliateSlot topic="..."> がある記事は、同じトピックを重ねて出さない(EXISTING)。
 * 各トピックの枠は、ASPのコードを lib/affiliates.ts に貼るまで、何も表示されない。
 */
import type { AffiliateTopic } from "./affiliates";
import { ARTICLE_SOLUTIONS } from "./articleSolutions";

/** すでに記事の本文にA8の枠がある記事(重ねて出さない) */
const EXISTING: Record<string, AffiliateTopic[]> = {
  "big-city-migration": ["moving"],
  "designated-cities-comparison": ["moving"],
  "furusato-nozei-2026-guide": ["furusato"],
  "furusato-nozei-analysis": ["furusato"],
  "furusato-nozei-concentration": ["furusato"],
  "furusato-nozei-finance-analysis": ["furusato"],
  "vacant-house-furusato-nozei-analysis": ["furusato"],
  "real-estate-price-analysis": ["realestate"],
};

/**
 * 悩みの文章から、トピックを決める規則(上から優先)。
 * 広告と結びつかない語(「運転」「見守り」「起業」「住宅の購入」など)は、条件に入れない。
 *   - realestate は「売却の査定」の広告なので、売る・相続・空き家をどうするか、という悩みだけに使う(買う人には出さない)
 *   - care は「介護施設」の広告なので、介護や施設を探す悩みだけに使う
 *   - car は、車を手放す・乗り換える・免許を返納する、という悩みに使う(事故を避けたい、には出さない)
 */
const RULES: { topic: AffiliateTopic; test: RegExp }[] = [
  { topic: "furusato", test: /ふるさと納税|産地の農産物を応援/ },
  { topic: "realestate", test: /空き家(が|に|を)|相続|売却/ },
  { topic: "care", test: /介護|施設があるか/ },
  { topic: "career", test: /転職|仕事が見つかり|就職|仕事を探/ },
  { topic: "car", test: /免許の返納|車が必要|車を手放|乗り換え/ },
  { topic: "moving", test: /引っ越し|引越し|転勤|住む街を選|住む都市を選|住む場所を|移住|住み替え/ },
];

/** 悩みの文章が規則に当てはまっても、広告との結びつきが弱いので、出さない記事 */
const EXCLUDE = new Set(["natural-change", "vacant-house-furusato-nozei-analysis"]);

/** 原則は1記事に1トピック。複数の悩みが重なる記事だけ、2トピックまで出す */
const DEFAULT_MAX = 1;
const MAX_TOPICS_FOR: Record<string, number> = {
  "municipal-income-analysis": 2, // 転職・引っ越しのどちらも
  "light-car-ownership-analysis": 2, // 車・引っ越しのどちらも
};

export function affiliateTopicsFor(slug: string): AffiliateTopic[] {
  const sol = ARTICLE_SOLUTIONS[slug];
  if (!sol || EXCLUDE.has(slug)) return [];
  const have = EXISTING[slug] ?? [];
  const out: AffiliateTopic[] = [];
  for (const r of RULES) {
    if (out.length >= (MAX_TOPICS_FOR[slug] ?? DEFAULT_MAX)) break;
    if (have.includes(r.topic)) continue;
    // 「悩み」(problem)に当てはまるものだけを使う。チェック項目の文言だけでは、広告を出さない
    if (r.test.test(sol.problem)) out.push(r.topic);
  }
  return out;
}
