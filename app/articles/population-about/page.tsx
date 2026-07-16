import Link from "next/link";
import DataAsOf from "@/components/DataAsOf";
import { getMunicipalities } from "@/lib/municipalities";

export const metadata = {
  title: "人口ランキングとは？",
  description:
    "人口ランキングの見方や集計方法、人口データから分かることを、実際の数字とともに解説します。",
};

export default function Page() {
  const municipalities = getMunicipalities();

  const totalPopulation = municipalities.reduce(
    (s, c) => s + c.population,
    0
  );

  const sorted = [...municipalities].sort(
    (a, b) => a.population - b.population
  );

  const largest = sorted[sorted.length - 1];
  const smallest = sorted[0];

  const median =
    sorted[Math.floor(sorted.length / 2)];

  const over100k = municipalities.filter(
    (c) => c.population >= 100000
  ).length;

  const under5000 = municipalities.filter(
    (c) => c.population < 5000
  ).length;

  const under1000 = municipalities.filter(
    (c) => c.population < 1000
  ).length;

  const prefTotals: Record<string, number> = {};
  municipalities.forEach((c) => {
    const pref = c.name.split(" ")[0];
    prefTotals[pref] = (prefTotals[pref] || 0) + c.population;
  });

  const prefRanking = Object.entries(prefTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const top6PrefTotal = prefRanking
    .slice(0, 6)
    .reduce((s, [, v]) => s + v, 0);

  const gtokyo = ["東京都", "神奈川県", "埼玉県", "千葉県"];
  const gtokyoTotal = gtokyo.reduce(
    (s, p) => s + (prefTotals[p] || 0),
    0
  );

  const million = municipalities.filter(
    (c) => c.population >= 1000000
  );

  return (
    <div style={container}>
      <h1 style={title}>人口ランキングとは？</h1>

      <DataAsOf />

      <p style={lead}>
        人口ランキングは、各自治体の総人口を比較したランキングです。
        日本には現在{municipalities.length.toLocaleString()}
        の市区町村があり(本サイトでは政令指定都市の区を除いた実在する自治体の数で集計しています)、
        その人口規模は最大の{largest.name}(約
        {Math.round(largest.population / 10000).toLocaleString()}
        万人)から最小の{smallest.name}(
        {smallest.population.toLocaleString()}人)まで、
        実に{Math.round(largest.population / smallest.population).toLocaleString()}
        倍の開きがあります。
      </p>

      <h2 style={heading}>まず全体像を数字で見る</h2>

      <p>
        本サイトが集計している{municipalities.length.toLocaleString()}
        自治体の総人口は
        {totalPopulation.toLocaleString()}人です。このうち
        人口10万人を超える自治体は{over100k}
        (全体の{((over100k / municipalities.length) * 100).toFixed(1)}
        %)、人口5,000人未満の自治体は{under5000}
        (全体の{((under5000 / municipalities.length) * 100).toFixed(1)}
        %)です。人口1,000人未満の自治体も{under1000}
        あります。全自治体を人口順に並べたとき、
        ちょうど真ん中に位置する自治体(中央値)は{median.name}
        (人口{median.population.toLocaleString()}人)です。
        平均値(
        {Math.round(
          totalPopulation / municipalities.length
        ).toLocaleString()}
        人)と中央値を比べると、平均値の方が大きくなります。
        これは、人口の多い一部の自治体が平均値を押し上げている
        ためで、日本の自治体人口の分布が一様ではないことを
        示しています。
      </p>

      <h2 style={heading}>人口ランキングで分かること</h2>

      <p>
        人口が多い自治体は、商業施設や公共交通、医療機関などの
        インフラが整いやすく、雇用の受け皿も大きくなる傾向があります。
        実際、人口上位10自治体はいずれも政令指定都市であり、
        企業の本社機能や大学、大規模な商業施設が集積しています。
      </p>

      <p>
        一方で、人口が少ない自治体には、
        自然環境の豊かさや、住民同士の距離が近いコミュニティといった
        別の魅力があります。人口規模だけでは地域の暮らしやすさを
        測ることはできませんが、行政サービスの効率性や税収規模、
        インフラ投資の判断材料としては重要な指標です。
      </p>

      <h2 style={heading}>地域による偏り</h2>

      <p>
        都道府県別に人口を集計すると、{prefRanking[0][0]}が
        {prefRanking[0][1].toLocaleString()}人
        (全国の{((prefRanking[0][1] / totalPopulation) * 100).toFixed(1)}
        %)で最も多く、{prefRanking[1][0]}・{prefRanking[2][0]}・
        {prefRanking[3][0]}・{prefRanking[4][0]}・{prefRanking[5][0]}
        が続きます。上位6都府県の合計は
        {top6PrefTotal.toLocaleString()}人で、全国人口の
        {((top6PrefTotal / totalPopulation) * 100).toFixed(1)}
        %を占めます。特に東京都・神奈川県・埼玉県・千葉県の
        「1都3県」を合計すると{gtokyoTotal.toLocaleString()}人、
        全国の{((gtokyoTotal / totalPopulation) * 100).toFixed(1)}
        %です。市区町村の数で見た1都3県の割合は
        {(
          (municipalities.filter((c) =>
            gtokyo.some((p) => c.name.startsWith(p))
          ).length /
            municipalities.length) *
          100
        ).toFixed(1)}
        %にとどまるため、少ない自治体数に人口が集中している
        ことが数字の差から読み取れます。
      </p>

      <h2 style={heading}>データの出典</h2>

      <p>
        本サイトでは、総務省統計局が提供する政府統計ポータルサイト
        「e-Stat」の公開データ(住民基本台帳に基づく人口等)をもとに
        集計を行っています。集計の際、政令指定都市の「区」
        (横浜市港北区など)は独立した自治体ではないため、
        全国ランキングの対象からは除外し、各市のページに内訳として
        掲載しています。一方、東京都の特別区(千代田区など)は
        法律上独立した地方公共団体のため、他の市町村と同様に
        ランキングの対象としています。
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
        上位には政令指定都市や東京都特別区を含む大都市圏が多く並びます。
        人口100万人を超える自治体は全国で{million.length}
        のみで、全{municipalities.length.toLocaleString()}
        自治体のうち
        {((million.length / municipalities.length) * 100).toFixed(2)}
        %にすぎません。それでもこの{million.length}自治体の
        合計人口は
        {million
          .reduce((s, c) => s + c.population, 0)
          .toLocaleString()}
        人に達し、全国人口の
        {(
          (million.reduce((s, c) => s + c.population, 0) /
            totalPopulation) *
          100
        ).toFixed(1)}
        %を占めています(詳しくは「100万人都市一覧」でも
        紹介しています)。
      </p>

      <h2 style={heading}>人口だけでは分からないこと</h2>

      <p>
        人口ランキングは自治体の規模を知る上で最も基本的な
        指標ですが、これだけで地域の実態を判断するのは
        早計です。たとえば人口が同じ規模の自治体でも、
        面積が大きく異なれば人口密度はまったく違ってきますし、
        高齢化率や子ども人口の割合が異なれば、必要な
        行政サービスの内容も変わってきます。
      </p>

      <p>
        本サイトでは人口ランキングのほかにも、出生率・
        高齢化率・人口密度・面積・財政力指数といった
        複数の指標を掲載しています。人口・高齢化率・
        財政力指数を組み合わせて見ることで、「人口は
        多いが高齢化率も高い自治体」のような、単一の
        ランキングだけでは分からない自治体の特徴を
        数字で比較できます。
      </p>

      <h2 style={heading}>人口ランキングの活用例</h2>

      <p>
        人口ランキングは、引っ越しや移住を検討する際の
        参考情報としてはもちろん、ビジネスにおける
        出店計画や商圏分析、自治体自身による政策立案の
        基礎資料としても活用されています。人口規模は
        売上予測や施設需要の推計における基礎的な変数の
        一つであり、近隣自治体との比較は広域連携の
        検討材料にもなります。
      </p>

      <p>
        人口が多い自治体は生活インフラが充実している一方、
        家賃や物価がやや高くなる傾向があり、人口が
        少ない自治体は自然環境に恵まれる一方、
        商業施設や公共交通の利便性では都市部に
        及ばないことが一般的です。人口ランキングと
        あわせて、面積や人口密度のランキングも
        確認することをおすすめします。
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
