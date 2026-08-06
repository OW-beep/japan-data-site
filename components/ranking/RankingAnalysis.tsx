type RankingType =
  | "population"
  | "birth-rate"
  | "aging"
  | "child"
  | "density"
  | "area";

type RankingItem = {
  name: string;
  value: number;
};

type Props = {
  type: RankingType;
  ranking: RankingItem[];
};

const CONFIG = {
  population: {
    title: "人口ランキング",
    unit: "人",
    average: "約72,000人",
    trend:
      "都市部への人口集中と地方の人口減少は今後も続くと予測されています。",
  },

  "birth-rate": {
    title: "出生率ランキング",
    unit: "",
    average: "約1.20",
    trend:
      "少子化対策が進められていますが、全国では依然として低水準です。",
  },

  aging: {
    title: "高齢化率ランキング",
    unit: "%",
    average: "約29%",
    trend:
      "日本全体で高齢化率は今後も上昇すると予測されています。",
  },

  child: {
    title: "子ども人口ランキング",
    unit: "%",
    average: "約11%",
    trend:
      "子ども人口は全国的に減少傾向です。",
  },

  density: {
    title: "人口密度ランキング",
    unit: "人/km²",
    average: "約340",
    trend:
      "都市部への人口集中が続いています。",
  },

  area: {
    title: "面積ランキング",
    unit: "km²",
    average: "約214",
    trend:
      "面積は自治体ごとの差が大きく、北海道が上位を占めます。",
  },
};

export default function RankingAnalysis({
  type,
  ranking,
}: Props) {
  const cfg = CONFIG[type];

  const top5 = ranking
    .slice(0, 5)
    .map((x) => x.name)
    .join("、");

  const bottom5 = ranking
    .slice(-5)
    .map((x) => x.name)
    .join("、");

  const max = ranking[0]?.value ?? 0;

  const min =
    ranking[ranking.length - 1]?.value ?? 0;

  return (
    <section
      style={{
        marginTop: 40,
        marginBottom: 40,
        background: "#fff",
        borderRadius: 18,
        padding: 30,
        border: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 20,
        }}
      >
        📊 データ分析
      </h2>

      <div
        style={{
          background: "#eff6ff",
          padding: 18,
          borderRadius: 12,
          marginBottom: 25,
        }}
      >
        <strong>全国平均</strong>

        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginTop: 8,
          }}
        >
          {cfg.average}
        </div>
      </div>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        このランキングでは
        {cfg.title}
        の地域差が確認できます。

        上位には

        <strong>{top5}</strong>

        が入り、

        下位には

        <strong>{bottom5}</strong>

        が含まれています。

        最大値は

        <strong>
          {max.toLocaleString()}
          {cfg.unit}
        </strong>

        、最小値は

        <strong>
          {min.toLocaleString()}
          {cfg.unit}
        </strong>

        です。
      </p>

      <h3
        style={{
          marginTop: 28,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        AIコメント
      </h3>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        上位自治体は全国平均を大きく上回る数値となっています。

        地域ごとの人口構成や都市化、行政施策などが数値へ影響していると考えられます。

        他のランキングと合わせて比較すると、
        より自治体の特徴が理解できます。
      </p>

      <h3
        style={{
          marginTop: 28,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        今後の傾向
      </h3>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        {cfg.trend}
      </p>
    </section>
  );
}