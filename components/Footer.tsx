import Link from "next/link";

export default function Footer() {
  return (
    <footer style={footer}>
      <div style={container}>

        <section>
          <h3 style={heading}>全国自治体データランキング</h3>

          <p style={text}>
            全国1741自治体の人口・出生率・高齢化率・
            面積・人口密度・財政などを
            オープンデータから分かりやすく可視化しています。
          </p>
        </section>

        <section>
          <h3 style={heading}>人気ランキング</h3>

          <ul style={list}>
            <li><Link href="/ranking/population" style={footerLink}>人口ランキング</Link></li>
            <li><Link href="/ranking/birth-rate" style={footerLink}>出生率ランキング</Link></li>
            <li><Link href="/ranking/aging" style={footerLink}>高齢化率ランキング</Link></li>
            <li><Link href="/ranking/child" style={footerLink}>子ども人口ランキング</Link></li>
            <li><Link href="/ranking/density" style={footerLink}>人口密度ランキング</Link></li>
            <li><Link href="/ranking/area" style={footerLink}>面積ランキング</Link></li>
          </ul>
        </section>

        <section>
          <h3 style={heading}>探す</h3>

          <ul style={list}>
            <li><Link href="/prefecture" style={footerLink}>都道府県から探す</Link></li>
            <li><Link href="/search" style={footerLink}>市区町村検索</Link></li>
            <li><Link href="/compare" style={footerLink}>自治体比較ツール</Link></li>
            <li><Link href="/articles" style={footerLink}>データ分析記事</Link></li>
          </ul>
        </section>

        <section>
          <h3 style={heading}>サイト情報</h3>

          <ul style={list}>
            <li><Link href="/about" style={footerLink}>サイトについて</Link></li>
            <li><Link href="/privacy" style={footerLink}>プライバシーポリシー</Link></li>
            <li><Link href="/terms" style={footerLink}>利用規約</Link></li>
            <li><Link href="/contact" style={footerLink}>お問い合わせ</Link></li>
            <li><Link href="/sitemap" style={footerLink}>サイトマップ</Link></li>
          </ul>
        </section>

        <section>
          <h3 style={heading}>運営者の他サイト</h3>

          <ul style={list}>
            <li>
              <a
                href="https://data-mikke-lab.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={footerLink}
              >
                データみっけ(都道府県別オープンデータ)
              </a>
            </li>
            <li>
              <a
                href="https://civic-scope-funabashi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={footerLink}
              >
                CivicScope船橋(船橋市データメディア)
              </a>
            </li>
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
  background: "var(--indigo-deep)",
  color: "#fff",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",

  padding: "36px 24px",

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

const heading: React.CSSProperties = {
  color: "#fff",
  fontFamily: "var(--font-serif)",
};

const footerLink: React.CSSProperties = {
  color: "#d1d5db",
};

const bottom: React.CSSProperties = {
  borderTop: "1px solid #374151",

  padding: "24px",

  textAlign: "center",

  color: "#9ca3af",

  fontSize: 13,
  lineHeight: 1.8,
};