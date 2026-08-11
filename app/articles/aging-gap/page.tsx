import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";


export const metadata = {
  alternates: { canonical: "/articles/aging-gap" },
  title: "少子高齢化ギャップ分析｜最大62.9ポイント差",
  description:
    "高齢化率から子ども人口割合を引いた「少子高齢化ギャップ」を全国の自治体で比較。群馬県南牧村が62.9ポイント差で全国最大の一方、全国でわずか6自治体だけが子どもの割合が高齢者の割合を上回る「逆転」を維持しています。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.elderlyPopulation != null &&
        c.childPopulation != null &&
        c.population > 0
    )
    .map((c) => {
      const childRatio = (c.childPopulation / c.population) * 100;
      const agingRate = (c.elderlyPopulation / c.population) * 100;
      return {
        ...c,
        childRatio,
        agingRate,
        gap: agingRate - childRatio,
      };
    });

  const byGapDesc = [...base].sort((a, b) => b.gap - a.gap);
  const byGapAsc = [...base].sort((a, b) => a.gap - b.gap);

  const top15 = byGapDesc.slice(0, 15);
  const reversal15 = byGapAsc.slice(0, 15);

  const avgGap = base.reduce((s, c) => s + c.gap, 0) / base.length;
  const avgAging = base.reduce((s, c) => s + c.agingRate, 0) / base.length;
  const avgChild = base.reduce((s, c) => s + c.childRatio, 0) / base.length;
  const reversedCount = base.filter((c) => c.gap < 0).length;

  const okinawaInReversal = reversal15.filter((c) =>
    c.name.startsWith("沖縄県")
  ).length;

  const fukushimaInTop15 = top15.filter((c) =>
    c.name.startsWith("福島県")
  ).length;

  return (
    <ArticleLayout
      title="少子高齢化ギャップ分析：高齢化率が子ども人口割合を上回る差が最大62.9ポイントの自治体"
      summary={`高齢化率から子ども人口割合を引いた「少子高齢化ギャップ」で見ると、全国トップは群馬県南牧村(${top15[0].gap.toFixed(
        1
      )}ポイント差)。一方、全国${base.length.toLocaleString()}自治体のうち、子どもの割合が高齢者の割合を上回っているのはわずか${reversedCount}自治体だけです。`}
      heroLabel="ギャップ全国1位"
      heroValue={`${top15[0].name} ${top15[0].gap.toFixed(1)}pt差`}
      rankingLink="/ranking/aging"
      tags={["aging", "child"]}
      publishedAt="2026-06-19"
      top3={[
        {
          rank: 1,
          name: top15[0].name,
          value: `${top15[0].gap.toFixed(1)}pt`,
        },
        {
          rank: 2,
          name: top15[1].name,
          value: `${top15[1].gap.toFixed(1)}pt`,
        },
        {
          rank: 3,
          name: top15[2].name,
          value: `${top15[2].gap.toFixed(1)}pt`,
        },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「高齢化率が高い自治体」と「子どもが少ない自治体」は、
          似ているようで実は同じ顔ぶれとは限りません。そこで
          今回は、高齢化率(65歳以上人口の割合)から子ども人口割合
          (0〜14歳人口の割合)を差し引いた「少子高齢化ギャップ」
          という指標を使い、高齢化と少子化がどれだけ極端に
          同時進行しているかを比較しました。全国平均では
          高齢化率が{avgAging.toFixed(1)}%、子ども人口割合が
          {avgChild.toFixed(1)}%で、その差(ギャップ)は
          平均{avgGap.toFixed(1)}ポイントです。この平均を
          はるかに超える自治体と、逆にギャップがほとんど無い
          (あるいは子どもの方が多い)自治体、両方の顔ぶれから
          日本の地域格差を読み解きます。
        </p>
      </div>

      <div style={box}>
        <h2>少子高齢化ギャップTOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.gap,
            displayValue: `${c.gap.toFixed(1)}pt`,
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の{top15[0].name}
          は、高齢化率{top15[0].agingRate.toFixed(1)}%に対し
          子ども人口割合はわずか{top15[0].childRatio.toFixed(1)}%
          しかなく、その差は{top15[0].gap.toFixed(1)}
          ポイントに達します。人口{top15[0].population.toLocaleString()}
          人の小さな村ですが、住民のおよそ3人に2人が65歳以上、
          子どもは50人に1人程度という計算です。
        </p>
      </div>

      <div style={box}>
        <h2>上位は中山間地の山村に集中</h2>

        <p>
          TOP15の顔ぶれを見ると、群馬県・奈良県・長野県・
          高知県・徳島県などの中山間地にある山村が数多く
          並びます。これらの地域には共通して、高度経済成長期
          以降に若年層が都市部へ大量に流出し、残った住民の
          高齢化がそのまま進んだという歴史があります。
          いったん子育て世代の流出が進むと、その地域で
          生まれる子どもの数自体が減り、次の世代の子育て
          世代も育ちにくくなるという悪循環が起きやすく、
          ギャップはますます拡大していきます。
        </p>

        <p>
          特に注目したいのは、TOP15のうち{fukushimaInTop15}
          自治体を占める福島県の飯舘村・金山町・昭和村です。
          これらは東日本大震災による長期避難の影響を受けた
          地域で、避難指示解除後に帰還した住民の多くが
          高齢者であるため、他の山村とは異なる特殊な事情で
          ギャップが拡大しています。社会増減率分析の記事で
          取り上げた「転入超過1位」の自治体とも重なる地域が
          多く、震災からの復興と人口構成の変化が今も続いて
          いることがうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>逆に「子どもの方が多い」自治体はどこか</h2>

        <RankingBarChart
          items={reversal15.map((c) => ({
            name: c.name,
            value: -c.gap,
            displayValue: `${(-c.gap).toFixed(1)}pt`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上のグラフは、ギャップが最も小さい(高齢化率と子ども
          人口割合がほぼ拮抗している、あるいは子どもの方が
          多い)15自治体を、差が大きい順に並べたものです。
          全国{base.length.toLocaleString()}自治体のうち、
          子ども人口割合が高齢化率を上回る「逆転」を起こして
          いるのは、わずか{reversedCount}自治体のみでした。
        </p>
      </div>

      <div style={box}>
        <h2>逆転自治体の3つのパターン</h2>

        <p>
          最も逆転幅が大きいのは福岡県新宮町
          (子ども{reversal15[0].childRatio.toFixed(1)}% ／
          高齢者{reversal15[0].agingRate.toFixed(1)}%)です。
          福岡市に隣接するベッドタウンで、大規模な宅地開発に
          よって子育て世代の転入が続いていることが背景に
          あります。同様に愛知県長久手市(トヨタ自動車の
          企業城下町に近い名古屋市近郊のニュータウン)、
          埼玉県戸田市・滋賀県栗東市(いずれも大都市圏への
          通勤圏)も、宅地開発による若い子育て世代の流入が
          子ども人口割合を押し上げているパターンです。
        </p>

        <p>
          2つ目のパターンは沖縄県です。逆転15自治体のうち
          {okinawaInReversal}
          自治体を南風原町・豊見城市・与那原町・渡嘉敷村・
          中城村・宜野湾市など沖縄県の自治体が占めています。
          出生率ランキング分析の記事で見たとおり、沖縄県は
          全国で最も出生率が高い県であり、子育て世代の
          割合も相対的に高く保たれています。
        </p>

        <p>
          3つ目は東京都御蔵島村・小笠原村という、人口数百人〜
          数千人規模の離島です。人口自体が非常に少ないため、
          数世帯の子育て世帯の転出入だけで割合が大きく
          変動しやすいという統計上の特性も影響しています。
          離島特有の家族構成(漁業・農業を営む世帯が比較的
          多く残っていること)も背景にあると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>ギャップという指標の意味</h2>

        <p>
          高齢化率ランキングや子ども人口ランキングは、それぞれ
          単独の指標としてもよく使われますが、両方を組み合わせた
          「ギャップ」を見ることで、その地域の人口構成が
          将来どちらの方向に進みやすいかがより立体的に
          見えてきます。ギャップが大きい自治体は、次の
          世代を担う子育て世代の絶対数がすでに乏しく、
          今後さらに人口が急減するリスクを抱えています。
          一方、ギャップが小さい、あるいは逆転している
          自治体は、子育て世帯の転入や高い出生率によって、
          少なくとも当面は人口構成が急激に悪化しにくいと
          言えます。
        </p>

        <p>
          ただし、逆転自治体の多くも日本社会全体の少子高齢化
          トレンドと無縁ではありません。宅地開発によって
          子育て世代を集めている郊外都市も、開発から数十年
          経てば入居した世代がまとめて高齢化し、急速に
          高齢化率が上昇する「ニュータウンの高齢化」問題に
          直面する可能性があります。実際、1960〜70年代に
          開発された大都市近郊のニュータウンの多くは、
          現在まさにこの問題に直面しています。今は逆転して
          いても、20〜30年後には同じ地域がギャップ上位に
          並ぶことも十分に考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>ギャップが大きい自治体に共通する将来課題</h2>

        <p>
          ギャップTOP15の自治体は、いずれも人口5,000人を
          下回る小規模な町村です。子どもの数が極端に少ない
          ということは、単純に将来の生産年齢人口・地域の
          担い手が先細りするだけでなく、小中学校の統廃合、
          保育・子育て支援サービスの縮小、地域の祭りや
          消防団といった共同体機能の担い手不足など、
          複合的な課題につながります。一方で高齢者の割合が
          高いということは、医療・介護需要が集中し、
          自治体の財政負担も大きくなりやすいことを意味します。
          高齢化率と財政力指数の関係を扱った別記事でも
          示したとおり、高齢化が進む自治体ほど財政力指数が
          低下する傾向があり、ギャップ上位の自治体の多くは
          子育て支援と高齢者福祉の両方に、限られた財源で
          対応しなければならないという、二重の難しさを
          抱えていると言えます。
        </p>

        <p>
          こうした山村の多くは、Iターン・Uターン移住の
          促進、テレワーク環境の整備、空き家バンクの活用
          など、子育て世代の呼び込みに取り組んでいますが、
          いったん失われた子育て世代の厚みを短期間で
          取り戻すことは容易ではありません。ギャップの
          大きさは、その地域が置かれている状況の深刻さを
          端的に示す数値だと言えるでしょう。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          このランキングは、各自治体の高齢化率と子ども人口
          割合という2つの単純な比率の差を、単純に自治体単位で
          比較したものです。人口規模を加味した加重平均では
          ないため、人口が数百人〜数千人規模の小さな村では、
          わずかな人口変動でも比率が大きく振れる点に注意が
          必要です。また、この指標はあくまで「現在の年齢構成の
          偏り」を示すものであり、将来の人口推計そのもの
          ではありません。将来推計については、国立社会保障・
          人口問題研究所が公表する市区町村別将来推計人口も
          あわせて参照することをおすすめします。
        </p>

        <p>
          <Link href="/ranking/aging" style={link}>
            高齢化率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/child" style={link}>
            子ども人口割合ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/child-finance" style={link}>
            子ども人口割合と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/school-crowding" style={link}>
            学校規模ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          少子高齢化ギャップの上位には、高度経済成長期以降の
          長期的な人口流出が続く中山間地の山村と、震災からの
          復興途上にある福島県の一部自治体が並びました。
          一方、ギャップが小さい・逆転している自治体は、
          大都市近郊の宅地開発地域と、出生率の高い沖縄県、
          そして統計上の変動が大きい小規模離島という、性質の
          異なる3つのグループに分かれることが分かりました。
          同じ「子どもが少ない」「高齢者が多い」という
          数字の裏に、まったく違う地域の物語があるという
          ことです。
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

const lead: React.CSSProperties = {
  fontSize: 16,
  color: "#374151",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
