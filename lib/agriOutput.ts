/**
 * 農林水産省「市町村別農業産出額(推計)」令和6年の品目別データ。
 * data/agri-output-r6.json は scripts/build_agri_output.py で作る。
 *
 * 読み方の注意(ページにも明記すること):
 *  - 都道府県の産出額を作付面積・飼養頭数などで市町村に按分した「推計」。
 *    価格や単収の差は反映されないので、ブランド産地の実力とは一致しないことがある。
 *  - 値が null のものは数値非公表(秘匿)。順位と市町村名は公表されている。
 *  - 合計・割合は「数値が公表されている市町村」だけで計算している。
 */
import raw from "@/data/agri-output-r6.json";
import { isReleased } from "@/lib/release";

export type AgriRow = { code: string; pref: string; city: string; v: number | null; rn: number; rp: number };
export type AgriItem = {
  key: string;
  label: string;
  dept: string;
  producers: number;
  secret: number;
  total: number;
  prefTop: [string, number][];
  top: AgriRow[];
};

const data = raw as unknown as {
  meta: { source: string; url: string; publishedAt: string; correctedAt: string; unit: string };
  items: Record<string, AgriItem>;
};

export const AGRI_META = data.meta;

/** ハブページの並び。slug は data の items のキー(公開していない品目は表示時に除かれる) */
export const AGRI_GROUPS: { title: string; slugs: string[] }[] = [
  { title: "総合", slugs: ["total"] },
  { title: "米・野菜", slugs: ["rice", "vegetables", "tomato", "strawberry", "cabbage", "onion", "negi", "cucumber"] },
  { title: "果実", slugs: ["fruits", "mikan", "apple", "grape", "peach", "pear"] },
  { title: "いも・花き・茶", slugs: ["sweetpotato", "potato", "flowers", "tea"] },
  { title: "畜産", slugs: ["beef", "milk", "pork", "egg", "broiler"] },
];

/**
 * 公開する品目(段階公開)。ふるさと納税の需要期(10〜12月)に間に合わせるため、
 * 返礼品で人気の高い品目から先に出す。残りの品目はデータだけ持っておき、
 * ここに slug を足して再デプロイすれば公開される(一覧・サイトマップ・個別ページが連動)。
 * 公開日は lib/release.ts で品目ごとに予約している(日付が来るまでは 404、サイトマップにも載らない)。
 */
export const AGRI_PUBLISHED: string[] = [
  "total", "rice", "apple", "mikan", "strawberry", "grape", "peach", "beef", "pork", "egg",
  "vegetables", "tomato", "cabbage", "onion", "negi", "cucumber",
  "fruits", "pear", "milk", "broiler", "sweetpotato", "potato", "tea", "flowers",
];

/** その品目を今公開してよいか。日付は lib/release.ts の "/ranking/agri/<slug>" */
const agriReleased = (slug: string) => AGRI_PUBLISHED.includes(slug) && isReleased(`/ranking/agri/${slug}`);

/**
 * 楽天市場の商品検索に使う語(slug → 商品名)。総合(total)は特定の商品がないので載せない。
 * 検索語は「ふるさと納税 {商品名} {産地の都道府県}」。産地は、数値が公表されている最上位の市町村の県。
 */
export const AGRI_RAKUTEN_PRODUCT: Record<string, string> = {
  rice: "米",
  mikan: "みかん",
  apple: "りんご",
  strawberry: "いちご",
  grape: "ぶどう",
  peach: "もも",
  beef: "牛肉",
  pork: "豚肉",
  egg: "卵",
};

/** 公開している slug だけ */
export function getAgriSlugs(): string[] {
  return AGRI_PUBLISHED.filter((s) => s in data.items && agriReleased(s));
}

export function getAgriItem(slug: string): AgriItem | null {
  return agriReleased(slug) ? (data.items[slug] ?? null) : null;
}

/** 1,000万円 → 億円(小数1桁) */
export function oku(v: number): string {
  return (v / 10).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** 数値が公表されている最上位の行 */
export function topPublished(item: AgriItem): AgriRow | null {
  return item.top.find((r) => r.v != null) ?? null;
}

/** 産出額ランキングのページ名(「〜の産出額が多い市町村」) */
export function agriTitleName(item: AgriItem, slug: string): string {
  return slug === "total" ? "農業産出額" : `${item.label}の産出額`;
}
