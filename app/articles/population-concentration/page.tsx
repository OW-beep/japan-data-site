import Link from "next/link";

export const metadata = {
  title: "日本で最も人口が集中している地域は？",
  description:
    "人口データから日本の人口集中地域を分析します。",
};

export default function Page() {
  return (
    <div style={container}>
      <h1>日本で最も人口が集中している地域は？</h1>

      <p>
        日本の人口は全国に均等に分布しているわけではありません。
        特に首都圏への集中が続いています。
      </p>

      <h2>人口はどこに集中しているのか</h2>

      <p>
        全国の自治体人口を比較すると、
        東京都区部・横浜市・大阪市・名古屋市など
        大都市圏への集中が確認できます。
      </p>

      <p>
        これは就業機会や交通利便性、
        教育機関の集積などが背景にあります。
      </p>

      <h2>人口集中のメリット</h2>

      <ul>
        <li>公共交通が発達しやすい</li>
        <li>医療機関が充実しやすい</li>
        <li>企業が集まりやすい</li>
      </ul>

      <h2>人口集中の課題</h2>

      <ul>
        <li>住宅価格の上昇</li>
        <li>通勤混雑</li>
        <li>地方の人口流出</li>
      </ul>

      <h2>ランキングで確認する</h2>

      <p>
        実際の人口ランキングは以下から確認できます。
      </p>

      <Link href="/ranking/population">
        人口ランキングを見る
      </Link>

      <h2>まとめ</h2>

      <p>
        人口データを見ると、日本では依然として
        大都市圏への人口集中が続いています。
        ランキングを確認することで、
        日本の人口分布をより具体的に理解できます。
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