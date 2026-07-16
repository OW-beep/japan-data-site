import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "子ども人口割合が高い自治体TOP50",
  description:
    "15歳未満人口の割合が高い自治体トップ50を紹介。子育て世代が多い自治体の特徴がわかります。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) => c.childPopulation != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      rate: (c.childPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) /
    ranking.length;

  const okinawaCount = ranking.filter((c) =>
    c.name.startsWith("沖縄県")
  ).length;

  const smallCount = ranking.filter(
    (c) => c.population < 3000
  ).length;

  return (
    <ArticleLayout
      title="子ども人口ランキングTOP50分析"
      summary="子ども比率(15歳未満人口の割合)が高い自治体を分析しました。TOP50のうち、実に3分の1近くを沖縄県の市町村が占めています。"
      heroLabel="TOP50平均子ども比率"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/child"
      top3={[
        {
          rank: 1,
          name: ranking[0].name,
          value: `${ranking[0].rate.toFixed(1)}%`,
        },
        {
          rank: 2,
          name: ranking[1].name,
          value: `${ranking[1].rate.toFixed(1)}%`,
        },
        {
          rank: 3,
          name: ranking[2].name,
          value: `${ranking[2].rate.toFixed(1)}%`,
        },
      ]}
    >
      <div style={box}>
        <h2>子ども比率TOP15</h2>

        <p style={{ marginBottom: 16, color: "#4b5563" }}>
          全国平均の子ども比率が約11%であるのに対し、
          TOP15は軒並みその1.5倍を超える水準です。
          離島や沖縄県の自治体が目立つ一方、大都市近郊の
          ベッドタウンも複数ランクインしている点に
          注目してください。
        </p>

        <RankingBarChart
          items={ranking.slice(0, 15).map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: `${c.rate.toFixed(1)}%`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>分析：沖縄県が上位を席巻</h2>

        <p>
          今回のTOP50のうち、{okinawaCount}
          自治体が沖縄県の市町村です。全国平均の子ども比率が
          {average.toFixed(1)}%であるのに対し、1位の
          {ranking[0].name}は{ranking[0].rate.toFixed(1)}%と、
          平均を大きく上回っています。沖縄県は合計特殊出生率が
          全国で最も高い都道府県として知られており、その傾向が
          市町村単位のデータにもはっきりと表れています。
          子育て世帯を支える地域のつながりの強さや、
          三世代同居・近居が比較的多い家族構成が、
          こうした高い子ども比率の背景にあると考えられています。
        </p>

        <p>
          沖縄県以外では、福岡県新宮町や三重県朝日町、
          熊本県合志市など、大都市近郊のベッドタウンが
          上位に入っています。これらの自治体に共通するのは、
          比較的地価が手頃でありながら、福岡市や名古屋市、
          熊本市といった中心都市への通勤・通学が可能な立地にある
          という点です。宅地開発が進み、子育て世代の転入が
          続いていることが、子ども比率を押し上げている
          要因と考えられます。
        </p>

        <p>
          一方で、離島の小規模自治体(鹿児島県三島村・十島村、
          東京都御蔵島村、沖縄県渡嘉敷村・座間味村など)も
          上位に名を連ねています。これらは人口自体が数百人と
          非常に少ないため、少数の子育て世帯が転入するだけで
          比率が大きく変動しやすいという特徴があります。
          比率だけでなく、実際の人口規模もあわせて見ることが
          大切です。
        </p>
      </div>

      <div style={box}>
        <h2>子ども比率と出生率の違い</h2>

        <p>
          子ども比率(15歳未満人口の割合)は、あくまで
          「現時点での人口構成」を示す指標であり、
          出生率(1人の女性が生涯に産む子どもの数の推計値)とは
          異なる概念です。子育て世代の転入が多い地域では、
          出生率そのものがそれほど高くなくても、子ども比率は
          高く算出されることがあります。逆に、出生率が
          高くても、進学や就職で若年層が地域外へ流出していれば、
          子ども比率は伸び悩みます。両方の指標をあわせて見ることで、
          その地域が「子育て世帯に選ばれている」のか、
          「地域内で自然に子どもが生まれ育っている」のかを
          より正確に読み解くことができます。
        </p>
      </div>

      <div style={box}>
        <h2>ランキング下位の自治体にも目を向ける</h2>

        <p>
          子ども比率が低い自治体の多くは、高齢化率が
          高い自治体と重なります。若年層の進学・就職による
          流出が続いた結果、地域内の年齢構成が高齢層に
          偏り、相対的に子どもの割合が下がっているためです。
          こうした自治体では、子育て支援策の拡充や、
          移住・定住促進策によって若い世代を呼び込もうと
          する取り組みが各地で行われています。子ども比率
          ランキングの上位・下位を比較することは、
          こうした地域政策の効果を検証する手がかりにも
          なります。
        </p>

        <p>
          本サイトでは、子ども比率のほかにも高齢化率・
          人口密度・財政力指数など複数のランキングを
          掲載しています。子ども比率が高い自治体が、
          高齢化率や財政力指数の面でどのような特徴を
          持っているかを見比べることで、単一の指標だけでは
          分からない、地域ごとの人口構造の全体像が
          見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>沖縄県の子ども比率が高い理由</h2>

        <p>
          沖縄県は、厚生労働省が公表する都道府県別の
          合計特殊出生率でも、長年にわたり全国トップの
          水準を維持している地域です。2024年のデータでも
          沖縄県は1.54と、全国平均の1.15を0.39ポイント
          上回っています。この記事のTOP50には
          {okinawaCount}の沖縄県自治体がランクインしており、
          都道府県単位の出生率と、市町村単位の子ども比率の
          両方で、沖縄県が高い水準にあることが確認できます。
        </p>

        <p>
          背景としてよく指摘されるのは、平均初婚年齢が
          全国平均より若い傾向にあること、三世代同居や
          近居の割合が比較的高く、子育てを親族で
          支え合う文化が根付いていること、そして
          気候や住宅事情など生活コストの面で、大都市圏と
          比べて子育てのハードルが相対的に低いと
          感じられやすいことなどが挙げられます。
          もちろん、こうした要因がすべての家庭に
          当てはまるわけではありませんが、都道府県単位・
          市町村単位の双方で一貫した傾向が見られる点は、
          データとして非常に興味深い事実です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          子ども人口割合ランキングTOP50のうち、
          {okinawaCount}自治体を沖縄県が占め、
          {smallCount}自治体は人口3,000人未満の
          小規模な離島・町村でした。子ども比率が高い
          自治体は、地域による差(沖縄県)と、都市近郊の
          宅地開発による差(ベッドタウン)という、
          異なる2種類の要因に分かれています。
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
