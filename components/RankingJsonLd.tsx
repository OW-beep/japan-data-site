import JsonLd from "./JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

/**
 * ランキングページ用の構造化データ。
 * ItemList(上位20件)と BreadcrumbList(トップ > ランキング一覧 > このページ)を出す。
 * ランキングページにはこれまでJSON-LDが無く、検索エンジンに順位表として伝わりにくかった。
 */
export default function RankingJsonLd({
  path,
  title,
  items,
}: {
  path: string;
  title: string;
  items: { name: string; code?: string }[];
}) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.code ? { url: `${SITE_URL}/city/${c.code}` } : {}),
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "ランキング一覧",
        item: `${SITE_URL}/ranking`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
  return (
    <>
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumb} />
    </>
  );
}
