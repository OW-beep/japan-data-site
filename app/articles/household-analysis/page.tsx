import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import { HouseholdIcon, IconThumb } from "@/components/icons/ArticleIcons";

export const metadata = {
  title: "単独世帯割合分析：都心と被災地、正反対の理由で1人暮らしが多い自治体",
  description:
    "単独世帯割合ランキングの上位に共通するのは、東京都心の特別区と東日本大震災の被災地域。まったく異なる背景を分析します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.households != null && c.households > 0)
    .map((c) => ({
      ...c,
      ratio:
        ((c.singleHouseholds ?? 0) / (c.households ?? 1)) * 100,
      avgSize: c.population / (c.households ?? 1),
    }))
    .sort((a, b) => b.ratio - a.ratio);

  const top15 = ranking.slice(0, 15);

  const bySize = [...ranking].sort((a, b) => b.avgSize - a.avgSize);
  const top10Size = bySize.slice(0, 10);

  const average =
    ranking.reduce((s, c) => s + c.ratio, 0) / ranking.length;

  const tokyoInTop15 = top15.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const fukushimaInTop15 = top15.filter((c) =>
    c.name.startsWith("福島県")
  ).length;

  return (
    <ArticleLayout
      title="単独世帯割合分析：都心と被災地、正反対の理由で1人暮らしが多い自治体"
      summary="単独世帯割合が最も高いのは、人口847人の福島県大熊町(95.8%)。上位には東京都心の特別区も並びますが、その理由はまったく異なります。"
      heroLabel="全国平均単独世帯割合"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/household"
      top3={[
        {
          rank: 1,
          name: top15[0].name,
          value: `${top15[0].ratio.toFixed(1)}%`,
        },
        {
          rank: 2,
          name: top15[1].name,
          value: `${top15[1].ratio.toFixed(1)}%`,
        },
        {
          rank: 3,
          name: top15[2].name,
          value: `${top15[2].ratio.toFixed(1)}%`,
        },
      ]}
    >
      <IconThumb icon={<HouseholdIcon size={56} />} />

      <div style={box}>
        <h2>単独世帯割合TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.ratio,
            displayValue: `${c.ratio.toFixed(1)}%`,
          }))}
        />

        <p
          style={{
            marginTop: 16,
            color: "#4b5563",
          }}
        >
          全国平均が{average.toFixed(1)}%であるのに対し、
          TOP15はいずれもその1.5倍以上の水準です。世帯数
          そのものが少ない自治体も多く含まれており、
          少数の単身入居でも割合が大きく変動しやすい
          点には注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>1位は人口の96%が一人暮らし</h2>

        <p>
          単独世帯割合の全国1位は{top15[0].name}
          で、実に{top15[0].ratio.toFixed(1)}%に達します。
          これは東日本大震災による長期避難からの復興途上に
          ある自治体で、帰還した住民の多くが復興関連の
          単身赴任者・作業員であることが、極端に高い単独
          世帯割合の背景にあります。TOP15のうち
          {fukushimaInTop15}自治体を福島県の被災自治体が
          占めており、社会増減率ランキングの分析記事で
          取り上げた「転入超過1位」と同じ町がここでも
          1位になっている点は偶然ではありません。
        </p>
      </div>

      <div style={box}>
        <h2>都心の単独世帯は「震災」とは違う理由</h2>

        <p>
          TOP15のうち{tokyoInTop15}自治体を東京都特別区
          (新宿区・渋谷区・豊島区・中野区など)が占めています。
          これらの地域は、進学・就職を機に上京した若年単身者や、
          結婚しても子どもを持たない共働き世帯(DINKs)が
          集まりやすく、単身世帯・二人世帯が多いことが
          単独世帯割合を押し上げています。同じ「単独世帯割合が
          高い」という結果でも、被災地域と都心とでは、
          その中身がまったく異なります。
        </p>
      </div>

      <div style={box}>
        <h2>平均世帯人員が多い自治体は農村部に集中</h2>

        <p>
          逆に、1世帯あたりの平均人員が最も多いのは
          {top10Size[0].name}
          で、1世帯あたり{top10Size[0].avgSize.toFixed(2)}人です。
          TOP10には秋田県・山形県・長野県・群馬県といった
          東北・甲信越地方の農村部の自治体が並びます。
          三世代同居や、農業を営む大家族世帯が比較的多く
          残っていることが、平均世帯人員を押し上げている
          要因と考えられます。
        </p>

        <p>
          全国的には、単身世帯の増加と平均世帯人員の減少が
          長期的なトレンドとして進んでいますが、その進み方には
          大きな地域差があります。都市部では独立した若年層の
          流入によって、農村部では若年層の流出と高齢世帯の
          残留によって、それぞれ異なるメカニズムで世帯構成が
          変化しています。
        </p>
      </div>

      <div style={box}>
        <h2>単身世帯の増加は何を意味するのか</h2>

        <p>
          単独世帯割合の上昇は、日本社会全体で進んでいる
          長期的なトレンドです。未婚率の上昇、晩婚化、
          高齢者の一人暮らしの増加など、複数の要因が
          重なって単身世帯を増やしています。単身世帯が
          多い自治体では、一人分の生活に合わせた住宅供給
          (ワンルームマンションなど)や、単身高齢者向けの
          見守りサービス、孤立を防ぐ地域コミュニティづくりなど、
          従来の「標準世帯(夫婦と子ども)」を前提とした
          行政サービスとは異なる対応が求められます。
        </p>

        <p>
          逆に、平均世帯人員が多い自治体では、三世代同居に
          よる子育て・介護の助け合いが機能している一方、
          若年層が地元に残りにくい産業構造や、住宅事情が
          背景にある場合もあります。世帯構成の違いは、
          単純な良し悪しではなく、それぞれの地域が持つ
          社会構造の違いを反映していると言えるでしょう。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          単独世帯割合ランキングは、一見同じ「一人暮らしが
          多い自治体」を並べているように見えて、実際には
          震災復興・都市の単身化・農村の高齢化という、
          複数の異なる社会現象を映し出しています。本サイトの
          社会増減率ランキング・高齢化率ランキングとあわせて
          見ることで、それぞれの自治体が置かれている状況を
          より正確に読み解くことができます。
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
