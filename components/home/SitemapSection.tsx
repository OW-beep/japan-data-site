import Link from "next/link";

export default function SitemapSection() {
  return (
    <section
      style={{
        marginBottom: 60,
      }}
    >
      <h2
        style={{
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        🗂 サイトマップ
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 32,
        }}
      >
        <div>
          <h3>ランキング</h3>

          <ul style={{ lineHeight: 2 }}>
            <li><Link href="/ranking/population">人口ランキング</Link></li>
            <li><Link href="/ranking/area">面積ランキング</Link></li>
            <li><Link href="/ranking/density">人口密度ランキング</Link></li>
            <li><Link href="/ranking/child">子ども人口ランキング</Link></li>
            <li><Link href="/ranking/aging">高齢化率ランキング</Link></li>
          </ul>
        </div>

        <div>
          <h3>記事</h3>

          <ul style={{ lineHeight: 2 }}>
            <li><Link href="/articles/population-about">人口とは？</Link></li>
            <li><Link href="/articles/population-top50">人口TOP50</Link></li>
            <li><Link href="/articles/population-concentration">人口集中</Link></li>
            <li><Link href="/articles/million-cities">100万人都市</Link></li>
            <li><Link href="/articles/birth-rate">出生率</Link></li>
            <li><Link href="/articles/decline">人口減少</Link></li>
          </ul>
        </div>
      </div>
    </section>
  );
}