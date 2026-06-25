import Link from "next/link";
import cities from "@/data/cities.json";

export const metadata = {
  title: "人口ランキングTOP50分析",
  description: "人口上位自治体をデータ分析",
};

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  const top10Population = ranking
    .slice(0, 10)
    .reduce((s, c) => s + c.population, 0);

  const averagePopulation = Math.round(
    ranking.reduce((s, c) => s + c.population, 0) /
      ranking.length
  );

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>人口ランキングTOP50分析</h1>

      <p>
        全国自治体の人口データを集計し、
        人口上位50自治体を分析しました。
      </p>

      <div style={box}>
        <h2>分析結果</h2>

        <ul>
          <li>
            TOP10人口合計：
            {top10Population.toLocaleString()}人
          </li>

          <li>
            TOP50平均人口：
            {averagePopulation.toLocaleString()}人
          </li>

          <li>
            集計自治体数：
            {ranking.length}
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>人口TOP20</h2>

        <table style={table}>
          <thead>
            <tr>
              <th>順位</th>
              <th>自治体</th>
              <th>人口</th>
            </tr>
          </thead>

          <tbody>
            {ranking.slice(0, 20).map((c, i) => (
              <tr key={c.code}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>
                  {c.population.toLocaleString()}人
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={box}>
        <h2>データから分かること</h2>

        <p>
          上位には大都市圏の自治体が集中しています。
        </p>

        <p>
          特に首都圏・関西圏・中京圏への人口集中が
          確認できます。
        </p>

        <p>
          人口ランキングは地域規模を把握する
          基本的な指標です。
        </p>
      </div>

      <Link
        href="/ranking/population"
        style={button}
      >
        人口ランキングを見る
      </Link>
    </main>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const button: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  textDecoration: "none",
};