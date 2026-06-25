import Link from "next/link";

export const metadata = {
  title: "人口ランキングとは？ | 日本自治体データランキング",
  description:
    "人口ランキングの見方や集計方法、人口データから分かることを解説します。",
};

export default function Page() {
  return (
    <div style={container}>
      <h1 style={title}>人口ランキングとは？</h1>

      <p style={lead}>
        人口ランキングは、各自治体の総人口を比較したランキングです。
        日本には約1,700以上の市区町村があり、それぞれ人口規模が大きく異なります。
      </p>

      <h2 style={heading}>人口ランキングで分かること</h2>

      <p>
        人口が多い自治体は、商業施設や公共サービスが充実している傾向があります。
        一方で、人口が少ない自治体には自然環境や地域コミュニティの魅力があります。
      </p>

      <p>
        人口データを比較することで、地域ごとの特徴や日本全体の人口分布を理解できます。
      </p>

      <h2 style={heading}>データの出典</h2>

      <p>
        本サイトでは、政府統計ポータルサイト「e-Stat」などの公開データをもとに
        集計を行っています。
      </p>

      <h2 style={heading}>ランキングを見る</h2>

      <p>
        最新の人口ランキングは以下のページで確認できます。
      </p>

      <Link
        href="/ranking/population"
        style={button}
      >
        人口ランキングを見る
      </Link>

      <h2 style={heading}>人口ランキング上位の傾向</h2>

      <p>
        上位には政令指定都市や東京23区を含む大都市圏が多く並びます。
        特に首都圏・中京圏・関西圏に人口が集中する傾向があります。
      </p>

      <h2 style={heading}>まとめ</h2>

      <p>
        人口ランキングは自治体の規模を知るための基本的な指標です。
        子ども人口や高齢化率と組み合わせることで、
        より深く地域の特徴を理解できます。
      </p>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
  lineHeight: 1.8,
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 20,
};

const lead: React.CSSProperties = {
  fontSize: 18,
  marginBottom: 24,
};

const heading: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  marginTop: 32,
  marginBottom: 12,
};

const button: React.CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  padding: "10px 18px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  textDecoration: "none",
};