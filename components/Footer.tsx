import Link from "next/link";

export default function Footer() {
  return (
    <footer style={footer}>
      <div style={container}>

        <section style={column}>
          <h3>全国自治体データランキング</h3>

          <p style={text}>
            全国1747自治体の人口・面積・人口密度・
            子ども人口・高齢化率などを
            オープンデータから比較しています。
          </p>
        </section>

        <section style={column}>
          <h3>ランキング</h3>

          <ul style={list}>
            <li><Link href="/ranking/population">人口ランキング</Link></li>

            <li><Link href="/ranking/area">面積ランキング</Link></li>

            <li><Link href="/ranking/density">人口密度ランキング</Link></li>

            <li><Link href="/ranking/child">子ども人口ランキング</Link></li>

            <li><Link href="/ranking/aging">高齢化率ランキング</Link></li>
          </ul>
        </section>

        <section style={column}>
          <h3>記事</h3>

          <ul style={list}>
            <li><Link href="/articles/population-about">人口とは？</Link></li>

            <li><Link href="/articles/population-top50">人口TOP50</Link></li>

            <li><Link href="/articles/child-top50">子ども人口TOP50</Link></li>

            <li><Link href="/articles/aging-top50">高齢化率TOP50</Link></li>

            <li><Link href="/articles/million-cities">100万人都市</Link></li>

            <li><Link href="/articles/youngest-municipalities">若い自治体</Link></li>

            <li><Link href="/articles/birth-rate">出生率とは</Link></li>

            <li><Link href="/articles/decline">人口減少とは</Link></li>
          </ul>
        </section>

        <section style={column}>
          <h3>サイト情報</h3>

          <ul style={list}>
            <li><Link href="/search">自治体検索</Link></li>

            <li><Link href="/privacy">プライバシーポリシー</Link></li>

            <li><Link href="/contact">お問い合わせ</Link></li>

            <li><Link href="/sitemap">サイトマップ</Link></li>
          </ul>
        </section>

      </div>

      <div style={bottom}>
        <p>
          本サイトはe-Statなどの公開データを利用しています。
          数値は公開時点の情報です。
        </p>

        <p>
          © 2026 全国自治体データランキング
        </p>
      </div>
    </footer>
  );
}

const footer: React.CSSProperties = {
  marginTop: 60,
  background: "#111827",
  color: "#fff",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",

  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: 30,

  padding: "50px 24px",
};

const column: React.CSSProperties = {};

const text: React.CSSProperties = {
  lineHeight: 1.8,
  color: "#d1d5db",
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,

  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const bottom: React.CSSProperties = {
  borderTop: "1px solid #374151",

  padding: 20,

  textAlign: "center",

  color: "#9ca3af",

  fontSize: 13,
};