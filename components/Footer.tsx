import Link from "next/link";

export default function Footer() {
  return (
    <footer style={footer}>
      <div style={container}>

        <section>
          <h3>全国自治体データランキング</h3>

          <p style={text}>
            全国1747自治体の人口・出生率・高齢化率・
            面積・人口密度・財政などを
            オープンデータから分かりやすく可視化しています。
          </p>
        </section>

        <section>
          <h3>人気ランキング</h3>

          <ul style={list}>
            <li><Link href="/ranking/population">人口ランキング</Link></li>
            <li><Link href="/ranking/birth-rate">出生率ランキング</Link></li>
            <li><Link href="/ranking/aging">高齢化率ランキング</Link></li>
            <li><Link href="/ranking/child">子ども人口ランキング</Link></li>
            <li><Link href="/ranking/density">人口密度ランキング</Link></li>
            <li><Link href="/ranking/area">面積ランキング</Link></li>
          </ul>
        </section>

        <section>
          <h3>探す</h3>

          <ul style={list}>
            <li><Link href="/prefecture">都道府県から探す</Link></li>
            <li><Link href="/search">市区町村検索</Link></li>
            <li><Link href="/articles">データ分析記事</Link></li>
          </ul>
        </section>

        <section>
          <h3>サイト情報</h3>

          <ul style={list}>
            <li><Link href="/about">サイトについて</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li><Link href="/sitemap">サイトマップ</Link></li>
          </ul>
        </section>

      </div>

      <div style={bottom}>

        <p>
          本サイトは
          e-Stat（政府統計の総合窓口）等の公開データを利用しています。
        </p>

        <p>
          データは公開時点の情報であり、
          最新情報は各自治体・総務省・関係省庁をご確認ください。
        </p>

        <p>
          © 2026 全国自治体データランキング
        </p>

      </div>
    </footer>
  );
}

const footer: React.CSSProperties = {
  marginTop: 80,
  background: "#111827",
  color: "#fff",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",

  padding: "56px 24px",

  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: 36,
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,

  display: "flex",
  flexDirection: "column",

  gap: 10,
};

const text: React.CSSProperties = {
  color: "#d1d5db",
  lineHeight: 1.8,
};

const bottom: React.CSSProperties = {
  borderTop: "1px solid #374151",

  padding: "24px",

  textAlign: "center",

  color: "#9ca3af",

  fontSize: 13,
  lineHeight: 1.8,
};