import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import { CityIcon, IconThumb } from "@/components/icons/ArticleIcons";

export const metadata = {
  title: "人口密度ランキング分析：なぜ東京都特別区が上位を独占するのか",
  description:
    "人口密度ランキング上位を東京都特別区が独占する理由を、国土交通省のコンパクトシティ政策の議論もふまえて分析します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.populationDensity != null)
    .sort(
      (a, b) => (b.populationDensity ?? 0) - (a.populationDensity ?? 0)
    );

  const top15 = ranking.slice(0, 15);
  const bottom10 = ranking.slice(-10).reverse();

  const average =
    ranking.reduce((s, c) => s + (c.populationDensity ?? 0), 0) /
    ranking.length;

  const tokyo23InTop15 = top15.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const gap = Math.round(
    (top15[0].populationDensity ?? 0) /
      (bottom10[0].populationDensity ?? 1)
  );

  return (
    <ArticleLayout
      title="人口密度ランキング分析：なぜ東京都特別区が上位を独占するのか"
      summary="人口密度ランキングの上位15自治体のうち、実に大半を東京都の特別区が占めています。国土交通省の都市政策の議論もふまえて、その理由を掘り下げます。"
      heroLabel="全国平均人口密度"
      heroValue={`${Math.round(average).toLocaleString()}人/km²`}
      rankingLink="/ranking/density"
      top3={[
        {
          rank: 1,
          name: top15[0].name,
          value: `${top15[0].populationDensity?.toLocaleString()}人/km²`,
        },
        {
          rank: 2,
          name: top15[1].name,
          value: `${top15[1].populationDensity?.toLocaleString()}人/km²`,
        },
        {
          rank: 3,
          name: top15[2].name,
          value: `${top15[2].populationDensity?.toLocaleString()}人/km²`,
        },
      ]}
    >
      <IconThumb icon={<CityIcon size={56} />} />

      <div style={box}>
        <h2>人口密度TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.populationDensity ?? 0,
            displayValue: `${c.populationDensity?.toLocaleString()}人/km²`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>上位15自治体を東京都特別区が独占</h2>

        <p>
          今回集計した人口密度TOP15のうち、{tokyo23InTop15}
          自治体が東京都の特別区(豊島区・中野区・荒川区・文京区など)
          です。1位の{top15[0].name}は1平方キロメートルあたり
          {top15[0].populationDensity?.toLocaleString()}
          人と、人口密度が最も低い{bottom10[0].name}
          (
          {bottom10[0].populationDensity}
          人/km²)の実に約{gap.toLocaleString()}
          倍に達します。同じ「市区町村」というくくりの中に、
          これほどの差が存在しているのです。
        </p>

        <p>
          特別区の人口密度が高い直接の理由は単純で、面積が
          小さいことです。たとえば{top15[0].name}の面積は
          {top15[0].area}
          平方キロメートルしかなく、23区の中でも小規模な部類に
          入ります。狭い面積に、鉄道網や商業施設、雇用が
          高密度で集積しているため、通勤・通学に便利な立地を
          求める人々が集中し、結果として人口密度が跳ね上がる
          構造になっています。
        </p>
      </div>

      <div style={box}>
        <h2>「密度が高い＝非効率」ではない、という視点</h2>

        <p>
          人口密度が高いと聞くと「混雑していて大変そう」という
          印象を持つ人もいるかもしれません。しかし、都市計画の
          分野では、むしろ逆の評価がされています。国土交通省の
          「立地適正化計画」の手引きでは、人口密度が高い都市ほど
          住民一人あたりの行政コストが下がり、効率的な行政運営が
          可能になるとされています。道路・上下水道・ごみ収集・
          公共交通といったインフラは、利用者が密集しているほど
          一人あたりの整備・維持コストを抑えられるためです。
        </p>

        <p>
          この考え方は「コンパクトシティ」政策の土台になっています。
          2014年の都市再生特別措置法改正で制度化された
          「立地適正化計画」は、住居や医療・福祉・商業といった
          都市機能を一定の区域に誘導し、人口密度を維持することで、
          縮小しても持続可能なまちをつくることを目指す仕組みです。
          背景には、人口減少によって空き家や空き店舗が虫食い状に
          増え、市街地の密度が下がっていく「スポンジ化」という
          現象への危機感があります。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度が低い自治体の姿</h2>

        <p>
          一方、人口密度が最も低い{bottom10[0].name}をはじめ、
          下位に並ぶのは北海道・奈良県・長野県などの山間部の
          町村です。面積の大半を森林や山地が占め、可住地
          (人が住める土地)そのものが少ないことが背景にあります。
          人口密度の低さは、必ずしも「人が減った」ことだけを
          意味するのではなく、そもそも地形的に人が住める土地が
          限られているという、地理的な制約を映し出している
          面もあります。
        </p>

        <p>
          人口密度ランキングは、単に「混んでいる・空いている」を
          示す数字ではなく、都市インフラの効率性や、まちづくりの
          方向性を考えるための重要な手がかりです。面積ランキングや
          人口ランキングとあわせて見ることで、その自治体がどのような
          地理的条件の上に成り立っているかが、より立体的に見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度と行政コストの関係</h2>

        <p>
          人口密度が行政コストに与える影響は、道路や上下水道といった
          インフラ整備だけにとどまりません。ごみ収集や除雪、
          消防・救急といった日常的な行政サービスも、対象となる
          世帯が地理的に分散しているほど、移動時間や人員配置の
          面で非効率になりやすいことが知られています。逆に、
          人口密度が高い地域では、同じ職員数・同じ予算でより
          多くの住民にサービスを届けられるため、一人あたりの
          行政コストが相対的に低くなる傾向があります。
        </p>

        <p>
          もっとも、人口密度が高すぎることにも課題はあります。
          保育所や学校の不足、災害時の避難経路の混雑、住宅費の
          高騰などは、人口密度が高い地域に特有の悩みです。
          人口密度ランキングの上位・下位いずれの自治体も、
          それぞれ異なる種類の行政課題を抱えており、「密度が
          高いほど良い」という単純な話ではない点も押さえて
          おきたいポイントです。
        </p>
      </div>

      <div style={box}>
        <h2>ランキングを読むときの注意点</h2>

        <p>
          本サイトの人口密度ランキングでは、横浜市や大阪市などの
          政令指定都市そのものを1つの自治体として計算しており、
          市内の「区」ごとの内訳はランキングに含めていません
          (区は独立した地方公共団体ではないためです)。一方、
          東京都の特別区は法律上独立した基礎自治体であるため、
          他の市町村と同列にランキングの対象としています。この
          扱いの違いが、東京都の特別区が人口密度ランキングの
          上位に並びやすい一因にもなっています。もし政令指定都市の
          区も同じ基準で計算に含めた場合、大阪市や名古屋市の
          中心区も上位に食い込んでくる可能性があります。
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};
