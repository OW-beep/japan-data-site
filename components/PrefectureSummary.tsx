import type { PrefectureStats } from "@/lib/getPrefectureStats";

const TOTAL_PREFECTURES = 47;

function rankPhrase(rank: number) {
  if (rank <= 5) return "全国トップクラス";
  if (rank <= 15) return "全国的に上位";
  if (rank <= 32) return "全国的には中位";
  return "全国的には下位";
}

export default function PrefectureSummary({
  stats,
}: {
  stats: PrefectureStats;
}) {
  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 28,
        marginBottom: 40,
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginTop: 0,
          marginBottom: 16,
        }}
      >
        {stats.name}の特徴
      </h2>

      <p
        style={{
          lineHeight: 2,
          fontSize: 16,
          color: "#374151",
          margin: 0,
          marginBottom: 12,
        }}
      >
        {stats.name}の人口は
        {stats.population.toLocaleString()}
        人で、全国47都道府県中{stats.populationRank}
        位、{rankPhrase(stats.populationRank)}
        の規模です。人口密度は1km²あたり
        {Math.round(stats.density).toLocaleString()}
        人(全国{stats.densityRank}位)で、
        {rankPhrase(stats.densityRank)}
        に位置します。
      </p>

      <p
        style={{
          lineHeight: 2,
          fontSize: 16,
          color: "#374151",
          margin: 0,
          marginBottom: 12,
        }}
      >
        高齢化率は{stats.agingRate.toFixed(1)}
        %で、全国{stats.agingRank}
        位({rankPhrase(stats.agingRank)})。子ども人口
        (0〜14歳)の割合は{stats.childRatio.toFixed(1)}
        %で、全国{stats.childRank}
        位({rankPhrase(stats.childRank)})です。高齢化率の
        順位が子ども人口割合の順位より上位(数字が小さい)で
        あるほど、他県に比べて高齢化が相対的に進んでいる
        ことを示しています。
      </p>

      {stats.financeIndex != null && (
        <p
          style={{
            lineHeight: 2,
            fontSize: 16,
            color: "#374151",
            margin: 0,
          }}
        >
          県内{stats.cityCount}
          市区町村の財政力指数の平均は
          {stats.financeIndex.toFixed(2)}
          です。1.0に近い、あるいは1.0を超える自治体が
          多いほど、地方交付税に頼らず自主財源で運営できて
          いる県だと言えます。
        </p>
      )}
    </section>
  );
}
