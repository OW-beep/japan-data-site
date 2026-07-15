import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";

export const metadata = {
  title: "高齢化率が高い自治体TOP50｜全国自治体データ",
  description:
    "高齢化率(65歳以上人口の割合)が高い自治体トップ50を紹介。地方の高齢化が進む地域の特徴を解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.elderlyPopulation && c.population)
    .map((c) => ({
      ...c,
      rate: (c.elderlyPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) /
    ranking.length;

  const smallCount = ranking.filter(
    (c) => c.population < 3000
  ).length;

  const prefCounts: Record<string, number> = {};
  ranking.forEach((c) => {
    const pref = c.name.split(" ")[0];
    prefCounts[pref] = (prefCounts[pref] || 0) + 1;
  });

  const topPref = Object.entries(prefCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <ArticleLayout
      title="高齢化率ランキングTOP50分析"
      summary="高齢化率(65歳以上人口の割合)が上位50の自治体を分析しました。半数以上が人口3,000人未満の小規模な山間部・農村部の自治体です。"
      heroLabel="TOP50平均高齢化率"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/aging"
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
        <h2>高齢化率TOP15</h2>

        <p style={{ marginBottom: 16, color: "#4b5563" }}>
          日本全体の高齢化率は約29%とされていますが、
          今回のTOP15はいずれもその2倍前後、あるいは
          それ以上の水準に達しています。人口が数千人規模の
          小さな町村ほど、若年層の流出の影響がストレートに
          比率へ反映されやすく、極端な数値が出やすい
          という特徴があります。
        </p>

        <ol>
          {ranking.slice(0, 15).map((c) => (
            <li key={c.code}>
              {c.name}（{c.rate.toFixed(1)}%、人口
              {c.population.toLocaleString()}人）
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>分析：小規模な山間部自治体に集中</h2>

        <p>
          今回のTOP50のうち、{smallCount}自治体が人口3,000人未満の
          小規模な自治体です。1位の{ranking[0].name}
          （高齢化率{ranking[0].rate.toFixed(1)}%、人口
          {ranking[0].population.toLocaleString()}人）をはじめ、
          上位には奈良県・群馬県・長野県・高知県・徳島県といった
          山間部を抱える県の町村が数多くランクインしています。
          都道府県別に見ると、TOP50の中で最も多くの自治体が
          入っているのは{topPref[0]}で、{topPref[1]}自治体が
          該当します。奈良県は紀伊山地を中心に山間部の町村が多く、
          若年層の都市部への流出が長年続いてきたことが
          背景にあると考えられます。
        </p>

        <p>
          また、福島県の自治体が複数ランクインしている点にも
          注目が必要です。これらの自治体の一部は、2011年の
          東日本大震災・原発事故の影響で長期にわたり避難指示が
          出されていた地域を含みます。避難指示の解除後、
          帰還した住民の年齢構成が高齢層に偏る傾向があり、
          これが高齢化率を押し上げる一因になっています。
          つまり、同じ「高齢化率が高い」という結果でも、
          長期的な人口流出による自治体と、災害からの
          復興途上にある自治体とでは、背景がまったく異なる
          という点に注意が必要です。
        </p>

        <p>
          全国平均の高齢化率は、市区町村単位の単純平均で
          約{average.toFixed(1)}%であり、これは人口で重み付けした
          全国計の高齢化率(約27%)よりも高くなっています。
          これは、人口の少ない町村ほど高齢化率が高い傾向にあり、
          単純平均では小規模自治体の影響が大きく出るためです。
          全国計とTOP50平均の差そのものが、日本における
          人口規模と高齢化の相関関係を物語っていると言えます。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率の高さは何を意味するのか</h2>

        <p>
          高齢化率が高い自治体では、医療・介護サービスの
          需要が高まる一方、現役世代の税収は限られるため、
          行政サービスの持続性が課題になりやすいという
          共通した構造があります。特に人口3,000人未満の
          町村では、公共交通の維持や、商店・診療所といった
          生活インフラの維持そのものが難しくなりつつある
          地域も少なくありません。一方で、こうした地域では
          住民同士の距離が近く、地域コミュニティによる
          支え合いが機能している例も多く見られます。
          近年は、こうした小規模自治体同士が連携して
          医療従事者を確保したり、オンライン診療を
          導入したりする動きも広がっています。
        </p>

        <p>
          高齢化率ランキングの上位自治体は、日本が
          今後さらに広い範囲で直面していく人口構造の
          変化を、一足先に経験している地域とも言えます。
          こうした自治体の取り組み(医療・介護の連携体制、
          移住支援、関係人口の創出など)は、これから
          高齢化が進む他の地域にとっても参考になる
          事例が多く含まれています。ランキングを
          「深刻さの指標」としてだけでなく、「先進的な
          取り組みの現場」として見る視点も大切です。
        </p>
      </div>

      <div style={box}>
        <h2>日本全体の高齢化とランキングの関係</h2>

        <p>
          日本全体の高齢化率(65歳以上人口の割合)は
          約29%で、世界で最も高い水準にあります。
          今回集計したTOP50自治体は、いずれもこの
          全国平均を大きく上回る{ranking[49].rate.toFixed(1)}
          %以上という水準です。日本の高齢化は、
          都市部より先に地方の小規模自治体で進行し、
          その後、時間差を伴って都市部にも波及していく
          という構造になっています。つまり、現在の
          TOP50自治体で起きていることは、数十年単位で
          見れば、いずれ多くの自治体が直面する可能性のある
          未来の姿でもあります。
        </p>

        <p>
          こうした観点から、高齢化率ランキングは
          単に「高齢者が多い自治体を知る」だけでなく、
          日本全体の人口構造の変化を先取りして
          理解するための重要なデータと言えます。
          本サイトでは、高齢化率とあわせて財政力指数の
          ランキングも掲載しており、高齢化が進む自治体の
          財政状況を確認することも可能です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          高齢化率ランキングの上位には、奈良県・群馬県・
          長野県・高知県・徳島県といった山間部を抱える
          県の小規模町村が並ぶ一方、福島県のように
          震災の影響という特殊な事情を抱える自治体も
          含まれていました。単純な順位だけでなく、
          その背景にある地理的条件や歴史的経緯まで
          踏み込むことで、データの持つ意味はより深く
          理解できます。本サイトでは今後も、こうした
          多角的な視点からランキングを読み解く記事を
          充実させていきます。
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
