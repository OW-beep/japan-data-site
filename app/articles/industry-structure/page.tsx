import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  alternates: { canonical: "/articles/industry-structure" },
  title: "産業構造分析｜農業・製造業・サービス業の町",
  description:
    "全国自治体の産業別就業者数から、農業中心・製造業中心・サービス業中心という3つの経済タイプを分析。長野県川上村の農業、山梨県忍野村や群馬県大泉町のものづくり、箱根町のサービス業など、地域経済の個性を紹介します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.primaryIndustryWorkers != null &&
        c.secondaryIndustryWorkers != null &&
        c.tertiaryIndustryWorkers != null
    )
    .map((c) => {
      const total =
        (c.primaryIndustryWorkers ?? 0) +
        (c.secondaryIndustryWorkers ?? 0) +
        (c.tertiaryIndustryWorkers ?? 0);
      return {
        ...c,
        total,
        primaryShare:
          total > 0
            ? ((c.primaryIndustryWorkers ?? 0) / total) * 100
            : 0,
        secondaryShare:
          total > 0
            ? ((c.secondaryIndustryWorkers ?? 0) / total) * 100
            : 0,
        tertiaryShare:
          total > 0
            ? ((c.tertiaryIndustryWorkers ?? 0) / total) * 100
            : 0,
      };
    })
    .filter((c) => c.total > 0);

  const primaryTop = [...base]
    .sort((a, b) => b.primaryShare - a.primaryShare)
    .slice(0, 10);

  const secondaryTop = [...base]
    .sort((a, b) => b.secondaryShare - a.secondaryShare)
    .slice(0, 10);

  const tertiaryTop = [...base]
    .sort((a, b) => b.tertiaryShare - a.tertiaryShare)
    .slice(0, 10);

  const avgPrimary =
    base.reduce((s, c) => s + c.primaryShare, 0) / base.length;
  const avgSecondary =
    base.reduce((s, c) => s + c.secondaryShare, 0) / base.length;
  const avgTertiary =
    base.reduce((s, c) => s + c.tertiaryShare, 0) / base.length;

  return (
    <ArticleLayout
      title="産業構造分析：農業の町・ものづくりの町・サービス業の町、日本の自治体を3タイプに分ける"
      summary={`全国${base.length.toLocaleString()}自治体の就業者数を産業別に見ると、就業者の平均${avgPrimary.toFixed(
        1
      )}%が第1次産業、${avgSecondary.toFixed(
        1
      )}%が第2次産業、${avgTertiary.toFixed(
        1
      )}%が第3次産業に従事しています。しかし自治体ごとに見ると、農業中心・製造業中心・サービス業中心という、まったく異なる経済構造を持つ町が存在します。`}
      heroLabel="第2次産業就業者比率 全国1位"
      heroValue={`${secondaryTop[0].name} ${secondaryTop[0].secondaryShare.toFixed(1)}%`}
      rankingLink="/ranking/manufacturing"
      tags={["industry"]}
      publishedAt="2026-07-29"
      top3={[
        { rank: 1, name: secondaryTop[0].name, value: `${secondaryTop[0].secondaryShare.toFixed(1)}%` },
        { rank: 2, name: secondaryTop[1].name, value: `${secondaryTop[1].secondaryShare.toFixed(1)}%` },
        { rank: 3, name: secondaryTop[2].name, value: `${secondaryTop[2].secondaryShare.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          自治体の経済は、人口や財政力だけでなく「住民がどんな
          仕事に就いているか」という産業構造によっても大きく
          性格が変わります。就業者を第1次産業(農業・林業・
          漁業)、第2次産業(製造業・建設業・鉱業)、第3次産業
          (商業・サービス業など)に分けて全国
          {base.length.toLocaleString()}
          自治体を比較すると、それぞれの産業が突出して多い、
          個性豊かな町が見えてきました。数字の裏には、その
          土地ならではの歴史や企業の存在が隠れています。
        </p>
      </div>

      <div style={box}>
        <h2>第1次産業の町TOP10：農業・漁業が主役</h2>

        <RankingBarChart
          items={primaryTop.map((c) => ({
            name: c.name,
            value: c.primaryShare,
            displayValue: `${c.primaryShare.toFixed(1)}%`,
          }))}
          barColor="#16a34a"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の長野県川上村は、就業者の
          {primaryTop[0].primaryShare.toFixed(1)}
          %が第1次産業に従事しています。標高1000m超の高原
          気候を活かしたレタス栽培で知られ、農家1戸あたりの
          所得が全国トップクラスとも言われる「稼ぐ農業」の
          町です。2位の秋田県大潟村は、平均世帯人員ランキング
          の記事でも紹介した、八郎潟を干拓して作られた計画
          農村で、大規模稲作が中心産業です。北海道の町村が
          複数ランクインしているのも特徴で、酪農・畑作が
          地域経済の根幹を支えています。
        </p>
      </div>

      <div style={box}>
        <h2>第2次産業の町TOP10：ものづくりが主役</h2>

        <RankingBarChart
          items={secondaryTop.map((c) => ({
            name: c.name,
            value: c.secondaryShare,
            displayValue: `${c.secondaryShare.toFixed(1)}%`,
          }))}
          barColor="#4338ca"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の山梨県忍野村は、産業用ロボット大手ファナックの
          本社・工場が立地する町として知られ、就業者の
          {secondaryTop[0].secondaryShare.toFixed(1)}
          %が第2次産業に従事しています。2位の群馬県大泉町は
          SUBARU(旧富士重工業)の主力工場を抱え、工場で働く
          日系ブラジル人住民が多いことでも知られる町です。
          このほか、愛知県高浜市・碧南市(三河地方の自動車
          部品産業集積地)、静岡県湖西市(ヤマハ発動機・スズキ
          関連)など、特定の大手メーカーや産業集積地を核とした
          「企業城下町」がずらりと並びました。
        </p>

        <p>
          上位20自治体まで範囲を広げると、愛知県の自治体が
          7つもランクインします。トヨタ自動車の本拠地である
          豊田市自身も45.6%と高い水準にあり、西尾市・刈谷市・
          知立市・幸田町など、トヨタグループの部品メーカーが
          集積する「中京工業地帯」の自治体が軒並み上位に
          並びました。1つの巨大企業グループが、県内の広い
          範囲にわたって産業構造そのものを形作っている様子が、
          このデータからも読み取れます。
        </p>
      </div>

      <div style={box}>
        <h2>第3次産業の町TOP10：サービス業が主役</h2>

        <RankingBarChart
          items={tertiaryTop.map((c) => ({
            name: c.name,
            value: c.tertiaryShare,
            displayValue: `${c.tertiaryShare.toFixed(1)}%`,
          }))}
          barColor="#0891b2"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフには、性格の異なる2つのグループが混在して
          います。1つは群馬県草津町、神奈川県箱根町といった
          温泉・観光地、沖縄県渡嘉敷村・座間味村といったダイビング
          で有名な離島リゾートで、宿泊・飲食・観光関連の
          サービス業が就業者の9割前後を占めています。もう1つは
          東京都千代田区・渋谷区・港区・新宿区といった、企業の
          本社機能やオフィスが集積する都心部です。同じ
          「サービス業中心」でも、観光型と業務中心型という、
          異なる経済構造が背景にあります。
        </p>

        <p>
          なお、今回紹介した3つのタイプはいずれも「極端な
          例」です。実際には大多数の自治体が、第1〜3次産業
          をバランスよく組み合わせた、いわば「標準的」な
          産業構造を持っています。全国平均は第1次産業
          {avgPrimary.toFixed(1)}
          %・第2次産業{avgSecondary.toFixed(1)}
          %・第3次産業{avgTertiary.toFixed(1)}
          %ですが、この平均に近い構成を持つ自治体こそが、
          実は最も「典型的な日本の町」だと言えるかもしれません。
        </p>
      </div>

      <div style={box}>
        <h2>産業構造は自治体の「個性」を映す鏡</h2>

        <p>
          今回の分析から見えてくるのは、日本の1741自治体が
          決して均質ではなく、農業・製造業・サービス業という
          異なる経済基盤の上に成り立っているという事実です。
          財政力指数との関係を扱った記事でも、原子力発電所や
          空港といった特定の産業・施設が財政力を大きく左右
          することを紹介しましたが、製造業中心の町(群馬県
          大泉町、愛知県高浜市など)も同様に、特定企業の業績や
          設備投資の動向が、地域経済全体を大きく左右する
          構造にあります。
        </p>

        <p>
          こうした「企業城下町」型の自治体は、その企業が
          好調な間は雇用も税収も安定しますが、工場の縮小・
          移転が起きれば、地域経済全体が大きな打撃を受ける
          リスクも抱えています。完全失業率ランキング分析の
          記事で取り上げた福岡県筑豊地方の旧産炭地は、まさに
          その好例です。産業構造を知ることは、その地域の
          「強み」と同時に「潜在的なリスク」を知ることでも
          あります。
        </p>

        <p>
          <Link href="/ranking/manufacturing" style={link}>
            製造業就業者比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/unemployment-analysis" style={link}>
            完全失業率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-diversity-index" style={link}>
            産業の多様性指数(HHI)を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-finance" style={link}>
            人口密度と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/foreign-population" style={link}>
            外国人人口比率ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          産業別就業者数は、その自治体に「居住する」就業者を
          産業別に分類した統計であり、必ずしも「その自治体内で
          働いている」人数とは一致しません。都市部への通勤者が
          多い自治体では、居住地ベースの産業構成と、実際に
          その土地で行われている経済活動の構成にズレが生じる
          場合があります。とはいえ、製造業就業者比率が突出して
          高い自治体の多くは、実際にその土地に大規模な工場が
          立地しているケースがほとんどであり、今回紹介した
          町については、統計と実態はおおむね一致していると
          考えられます。それでも、通勤・通学による人口移動が
          大きい大都市近郊の自治体を扱う際には、この点を
          念頭に置いておくと、データをより正確に読み解く
          ことができます。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          全国の自治体を産業構造で見ると、平均的には
          第1次産業{avgPrimary.toFixed(1)}
          %・第2次産業{avgSecondary.toFixed(1)}
          %・第3次産業{avgTertiary.toFixed(1)}
          %という構成ですが、個別に見れば農業が9割近い村、
          製造業が半数を占める企業城下町、サービス業が9割を
          超える観光地・オフィス街と、まったく異なる経済の
          顔を持つ自治体が数多く存在します。人口・高齢化・
          財政といった指標だけでなく、産業構造という切り口を
          加えることで、それぞれの自治体が持つ経済的な個性が
          より立体的に見えてきます。産業構造という切り口は、
          人口や財政だけでは見えてこない、その土地固有の
          経済の成り立ちを教えてくれる貴重なデータです。
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
