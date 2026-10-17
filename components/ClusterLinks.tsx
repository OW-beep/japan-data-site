import Link from "next/link";
import { isReleased } from "@/lib/release";

/**
 * 「都市の人口規模」関連ページの相互リンク集(トピッククラスター)。
 *
 * 狙い:
 *  - 検索流入の大半を占める /articles/million-cities の訪問者を、関連ページへ回遊させる
 *  - 順位が低い /ranking/population などへ、関連性の高い文脈で内部リンクを集める
 *  - 内部リンクのアンカーテキストに、検索されている語(「100万人都市」「人口50万人以上の都市」等)を入れる
 *
 * ページを追加したら ITEMS に1行足せば、クラスター全体に反映される。
 */
const ITEMS: { href: string; label: string; note: string }[] = [
  { href: "/articles/million-cities", label: "100万人都市一覧", note: "人口100万人以上の都市を人口順に" },
  { href: "/articles/million-cities-population-change", label: "100万人都市の人口増減", note: "2020年→2025年で増えた都市・減った都市" },
  { href: "/articles/near-million-cities", label: "90万人・80万人都市一覧", note: "100万人に迫る「準百万都市」" },
  { href: "/ranking/large-cities", label: "人口50万人以上の都市ランキング", note: "政令指定都市を含む大都市を比較" },
  { href: "/ranking/mid-cities", label: "人口30万人以上の都市ランキング", note: "中核市クラスまで範囲を広げて一覧" },
  { href: "/articles/city-population-tiers", label: "人口規模別 都市一覧", note: "100万・50万・30万・10万人以上は何市?" },
  { href: "/articles/designated-cities-comparison", label: "政令指定都市20市の人口ランキング", note: "人口・面積・高齢化率で比較" },
  { href: "/ranking/population", label: "全国自治体 人口ランキング", note: "全国1,700超の市区町村を人口順に" },
  { href: "/ranking/smallest-cities", label: "人口が少ない市ランキング", note: "大きい都市の反対側、人口最少の市は?" },
];

export default function ClusterLinks({ current }: { current?: string }) {
  // 予約公開(lib/release.ts)で、まだ公開していないページへはリンクしない
  const items = ITEMS.filter((i) => i.href !== current && isReleased(i.href));
  return (
    <nav
      aria-label="都市の人口規模に関する関連ページ"
      style={{
        margin: "28px 0",
        padding: 20,
        border: "1px solid var(--line, #e5e7eb)",
        background: "var(--surface, #fff)",
      }}
    >
      <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>都市の人口規模をもっと比べる</h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        {items.map((i) => (
          <li key={i.href}>
            <Link prefetch={false} href={i.href} style={{ fontWeight: 700 }}>
              {i.label}
            </Link>
            <div style={{ fontSize: 13, color: "var(--muted, #6b7280)", marginTop: 2 }}>{i.note}</div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
