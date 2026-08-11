import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/elderly-home-analysis" },
  title: "高齢者施設数ランキング分析｜旭川市が「福祉の街」の理由",
  description:
    "老人ホーム1施設あたりの高齢者人口をランキング分析。北海道旭川市が大都市の中で突出して施設に余裕がある理由と、東京23区で施設が手薄になりがちな背景を解説します。",
};

export default function Page() {
  const all = getMunicipalities().filter(
    (c) => c.elderlyHomeCount != null && c.elderlyPopulation > 0
  );

  const zeroCount = all.filter((c) => c.elderlyHomeCount === 0).length;

  const base = all
    .filter((c) => (c.elderlyHomeCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      elderlyPerFacility: c.elderlyPopulation / (c.elderlyHomeCount ?? 1),
    }));

  const ranking = [...base].sort(
    (a, b) => a.elderlyPerFacility - b.elderlyPerFacility
  );
  const top15 = ranking.slice(0, 15);

  const bigCities = base
    .filter((c) => c.population >= 200000)
    .sort((a, b) => a.elderlyPerFacility - b.elderlyPerFacility);

  const bigTop10 = bigCities.slice(0, 10);
  const bigBottom10 = [...bigCities]
    .sort((a, b) => b.elderlyPerFacility - a.elderlyPerFacility)
    .slice(0, 10);

  const average =
    base.reduce((s, c) => s + c.elderlyPerFacility, 0) / base.length;

  const tokyoWardsInBottom10 = bigBottom10.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  return (
    <ArticleLayout
      title="高齢者施設数ランキング分析:旭川市が「福祉の街」と呼ばれる理由、東京23区が手薄になりがちな背景"
      summary={`老人ホーム1施設あたりの高齢者人口を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${Math.round(
        average
      ).toLocaleString()}人に対し、人口20万人以上の都市に絞ると北海道旭川市が最も余裕があり、東京23区の多くが施設の手薄さで下位に沈む結果になりました。老人ホームが1つもない自治体も全国に${zeroCount}あります。`}
      heroLabel="高齢者施設 余裕度 全国1位"
      heroValue={`${top15[0].name} ${Math.round(top15[0].elderlyPerFacility).toLocaleString()}人/施設`}
      rankingLink="/ranking/elderly-home"
      tags={["aging"]}
      publishedAt="2026-08-08"
      top3={[
        { rank: 1, name: top15[0].name, value: `${Math.round(top15[0].elderlyPerFacility).toLocaleString()}人` },
        { rank: 2, name: top15[1].name, value: `${Math.round(top15[1].elderlyPerFacility).toLocaleString()}人` },
        { rank: 3, name: top15[2].name, value: `${Math.round(top15[2].elderlyPerFacility).toLocaleString()}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          老人ホーム(介護老人福祉施設・養護老人ホーム・有料
          老人ホームの合算)1施設あたりの高齢者人口は、数字が
          小さいほど施設に余裕があることを意味します。厚生
          労働省「社会福祉施設等調査」等をもとにした社会・
          人口統計体系のデータを用いて、全国
          {base.length.toLocaleString()}
          自治体の平均は
          {Math.round(average).toLocaleString()}
          人でしたが、老人ホームが1つもない自治体も全国に
          {zeroCount}
          あり、多くは高齢者人口自体が少ない小規模な町村
          でした。地方の中核都市と、東京23区のような大都市
          中心部とでは、施設の集積度に大きな違いがあることも
          見えてきました。65歳以上人口が増え続ける中、
          この差は今後さらに意味を持ってくるテーマです。
        </p>
      </div>

      <div style={box}>
        <h2>全自治体ランキングTOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.elderlyPerFacility,
            displayValue: `${Math.round(c.elderlyPerFacility).toLocaleString()}人`,
          }))}
          barColor="#0d9488"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を対象にすると、上位には人口千人未満の
          小規模な町村が並びます。高齢者の絶対数が少ないぶん
          施設あたりの余裕も大きくなるため、これだけで
          「介護環境が充実している」とは言い切れません。町村
          単位で施設を1つでも運営できているという事実自体は
          評価できますが、都市部との単純比較には向かない
          結果と言えます。人口減少が進む地域ほど、こうした
          小さな拠点をどう維持していくかが、今後の課題に
          なりそうです。
        </p>
      </div>

      <div style={box}>
        <h2>人口20万人以上の都市では、北海道旭川市が1位</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.elderlyPerFacility,
            displayValue: `${Math.round(c.elderlyPerFacility).toLocaleString()}人`,
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市
          {bigCities.length}
          自治体に絞ると、北海道旭川市が1位でした。旭川市は
          道北エリアの医療・福祉の拠点として、周辺市町村
          からの入所者も受け入れる役割を担っており、「北海道
          第二の都市」でありながら人口規模の割に施設数が
          多い、福祉インフラの集積地としての性格を持って
          います。宮崎市・佐賀市・青森市・前橋市など、地方の
          中核都市が上位に多く並んだのも特徴的です。
        </p>
      </div>

      <div style={box}>
        <h2>逆に東京23区の多くが、施設の手薄さで下位に</h2>

        <RankingBarChart
          items={bigBottom10.map((c) => ({
            name: c.name,
            value: c.elderlyPerFacility,
            displayValue: `${Math.round(c.elderlyPerFacility).toLocaleString()}人`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市の中で、老人ホーム1施設あたりの
          高齢者人口が最も多かったのは東京都豊島区で、旭川市
          の約9倍という差がありました。ワースト10のうち
          {tokyoWardsInBottom10}
          自治体を東京都の特別区が占めています。都心部は
          地価が高く、大規模な施設用地を確保しにくいことが、
          この差の背景にあると考えられます。
        </p>

        <PersonalNote>
          高齢者福祉に関わる業務を見てきた立場から言うと、
          都心区の施設不足は、単純に「土地がない」だけでなく、
          建設・運営コストの高さも大きな壁になっています。
          都心区の多くは、施設整備の代わりに在宅介護サービス
          (訪問介護・デイサービスなど)の充実に力を入れる
          傾向がありますが、この統計にはそうした在宅系サービス
          の充実度は反映されていません。「施設が少ない=介護
          環境が悪い」と単純には言えない点は、注意して
          伝えたいポイントです。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回の老人ホーム数は、介護老人福祉施設(特別養護
          老人ホーム)・養護老人ホーム・有料老人ホームの3種類
          を合算したものです。グループホームや老人保健施設、
          サービス付き高齢者向け住宅など、この統計に含まれて
          いない高齢者向け住まいも別途存在するため、実際の
          介護インフラはこの数字が示す以上に多様です。また、
          今回のデータは2023年度時点のもので、施設の新規
          開設・閉鎖により今後数値が変動する可能性がある点も
          あわせてご留意ください。
        </p>
      </div>

      <div style={box}>
        <h2>親の介護・自分の老後を考えるときの視点</h2>

        <p>
          この指標は、将来の介護を見据えて住む場所を選ぶ際の
          参考になりますが、施設数だけでなく「入所の順番待ちが
          どれくらいあるか」「特別養護老人ホームか有料老人
          ホームか、費用感がどう違うか」といった要素も、実際の
          利用しやすさを大きく左右します。旭川市のように
          周辺市町村からの受け入れも担う「福祉拠点都市」で
          あっても、人気の施設は満床で待機が発生している
          ケースもあるため、この統計はあくまで「街全体としての
          施設の厚み」を見る指標として捉え、実際の入所可否は
          自治体の窓口や施設への直接確認が欠かせません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          高齢者施設数ランキングは、地方の医療・福祉拠点都市
          が上位に来る一方、地価の高い大都市中心部では施設が
          手薄になりやすいという、都市構造の違いを浮き彫りに
          しました。ただし、施設数だけで介護環境の良し悪しを
          判断するのは早計で、在宅介護サービスの充実度や
          待機状況もあわせて確認する必要があります。人口
          密度・財政力・医療といった他の指標と重ね合わせる
          ことで、その街が高齢期の暮らしにどれだけ備えて
          いるか、より立体的に見えてくるはずです。
        </p>

        <p>
          <Link href="/ranking/elderly-home" style={link}>
            高齢者施設数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-top50" style={link}>
            高齢化率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
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
