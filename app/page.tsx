import Link from "next/link";

export default function Page() {
return (
<main
style={{
maxWidth: 1100,
margin: "0 auto",
padding: 24,
}}
> <section style={hero}> <h1 style={heroTitle}>
日本の自治体データをランキングで見る </h1>


    <p style={heroText}>
      人口・子ども人口・高齢化率など、
      全国の自治体データをランキング形式で公開しています。
    </p>
  </section>

  <h2>ランキング</h2>

  <div style={grid}>
    <Link href="/ranking/population" style={card}>
      <h3>人口ランキング</h3>
      <p>人口の多い自治体TOP50</p>
    </Link>

    <Link href="/ranking/child" style={card}>
      <h3>子ども人口ランキング</h3>
      <p>子ども比率が高い自治体TOP50</p>
    </Link>

    <Link href="/ranking/aging" style={card}>
      <h3>高齢化率ランキング</h3>
      <p>高齢化率が高い自治体TOP50</p>
    </Link>

    <Link href="/ranking/decline" style={card}>
      <h3>人口減少ランキング</h3>
      <p>人口減少率が高い自治体TOP50</p>
    </Link>
  </div>

  <h2 style={{ marginTop: 40 }}>
    特集記事
  </h2>

  <div style={grid}>
    <Link
      href="/articles/population-top50"
      style={card}
    >
      <h3>人口ランキングTOP50分析</h3>
      <p>
        人口上位自治体の特徴を分析
      </p>
    </Link>

    <Link
      href="/articles/aging-top50"
      style={card}
    >
      <h3>高齢化率TOP50分析</h3>
      <p>
        高齢化率上位自治体を分析
      </p>
    </Link>

    <Link
      href="/articles/million-cities"
      style={card}
    >
      <h3>人口100万人超自治体一覧</h3>
      <p>
        人口100万人以上の自治体を紹介
      </p>
    </Link>
  </div>
</main>


);
}

const hero: React.CSSProperties = {
background: "#2563eb",
color: "white",
borderRadius: 20,
padding: 30,
marginBottom: 40,
};

const heroTitle: React.CSSProperties = {
fontSize: 36,
marginBottom: 12,
};

const heroText: React.CSSProperties = {
fontSize: 18,
};

const grid: React.CSSProperties = {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(260px,1fr))",
gap: 20,
};

const card: React.CSSProperties = {
background: "white",
border: "1px solid #e5e7eb",
borderRadius: 16,
padding: 20,
textDecoration: "none",
color: "#111",
};
