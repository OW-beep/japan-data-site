import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import { MapIcon, IconThumb } from "@/components/icons/ArticleIcons";

export const metadata = {
  title: "面積ランキング分析：日本の国土はなぜ山がちなのか",
  description:
    "面積ランキング上位を北海道と山間部の市が占める理由を、可住地面積など国の統計データとともに分析します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.area != null)
    .sort((a, b) => (b.area ?? 0) - (a.area ?? 0));

  const top15 = ranking.slice(0, 15);
  const bottom10 = ranking.slice(-10).reverse();

  const average =
    ranking.reduce((s, c) => s + (c.area ?? 0), 0) /
    ranking.length;

  const hokkaidoInTop15 = top15.filter((c) =>
    c.name.startsWith("北海道")
  ).length;

  const hokkaidoTotal = ranking.filter((c) =>
    c.name.startsWith("北海道")
  ).length;

  const gap = Math.round(
    (top15[0].area ?? 0) / (bottom10[0].area ?? 1)
  );

  return (
    <ArticleLayout
      title="面積ランキング分析：日本の国土はなぜ山がちなのか"
      summary="面積ランキングの上位には北海道と本州山間部の市町村が並びます。日本の国土に占める可住地の少なさという、統計が示す地理的な現実を読み解きます。"
      heroLabel="全国自治体の平均面積"
      heroValue={`${average.toFixed(1)}km²`}
      rankingLink="/ranking/area"
      top3={[
        {
          rank: 1,
          name: top15[0].name,
          value: `${top15[0].area?.toLocaleString()}km²`,
        },
        {
          rank: 2,
          name: top15[1].name,
          value: `${top15[1].area?.toLocaleString()}km²`,
        },
        {
          rank: 3,
          name: top15[2].name,
          value: `${top15[2].area?.toLocaleString()}km²`,
        },
      ]}
    >
      <IconThumb icon={<MapIcon size={56} />} />

      <div style={box}>
        <h2>面積TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.area ?? 0,
            displayValue: `${c.area?.toLocaleString()}km²`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>北海道が上位に多い理由</h2>

        <p>
          面積TOP15のうち{hokkaidoInTop15}
          自治体を北海道の市町が占めています。北海道には全国
          179自治体のうち{hokkaidoTotal}
          が含まれ、都府県に比べて一つひとつの自治体が広大な
          面積を持つ点が特徴です。1位の{top15[0].name}
          は{top15[0].area?.toLocaleString()}
          平方キロメートルと、面積が最も小さい
          {bottom10[0].name}
          (
          {bottom10[0].area}
          平方キロメートル)の実に約{gap.toLocaleString()}
          倍にもなります。同じ「市」という単位でも、規模の
          差はこれほど大きいのです。
        </p>

        <p>
          北海道は明治以降に開拓が進んだ経緯から、一つの市町村が
          担当する範囲が本州よりも広く設定されてきました。
          一方、本州の面積上位には岐阜県高山市・静岡県浜松市・
          静岡県静岡市・栃木県日光市など、平成の市町村合併で
          複数の町村が一つの市に統合された自治体が目立ちます。
          面積の大きさは、そのまま「広大な土地を切り開いた」こと
          を意味するとは限らず、合併によって山間部が市域に
          編入された結果であるケースも多く含まれています。
        </p>
      </div>

      <div style={box}>
        <h2>日本の国土は「山がち」という統計的事実</h2>

        <p>
          日本の国土面積は約37万8,000平方キロメートルですが、
          国土交通省国土政策局の資料によれば、このうち実際に
          人が住める「可住地面積」は国土全体のおよそ30%に
          とどまるとされています。残りの大部分は山地や森林が
          占めており、これが日本の都市が沿岸部や盆地に集中して
          発達してきた地理的な背景です。ある調査報告では、
          標高0〜100メートルの範囲に住む人口が日本の総人口の
          80%以上を占めるとも指摘されています。
        </p>

        <p>
          都道府県別に見ると、総務省統計局のデータをもとにした
          集計では、可住地面積の割合(総面積に占める割合)が
          最も高いのは大阪府で約70%、次いで千葉県・埼玉県・
          茨城県・東京都と、首都圏や関西圏の都市部が上位を
          占めます。逆に最も低いのは高知県で約16%、島根県・
          岐阜県・山梨県・奈良県と続きます。この可住地面積率の
          並びは、人口密度ランキングの並びと驚くほど重なって
          おり、「平地が少ない県ほど人口が集中しにくい」という、
          統計データが裏付ける地理的な法則が見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>面積が小さい自治体の顔ぶれ</h2>

        <p>
          面積が最も小さいのは富山県舟橋村で、わずか
          {bottom10[0].area}
          平方キロメートルです。以下、沖縄県渡名喜村、大阪府忠岡町、
          東京都利島村など、離島や、都市部にありながら独立して
          市町村を維持してきた小規模な自治体が並びます。面積の
          小ささは人口の少なさを意味するとは限らず、大阪府忠岡町
          のように、狭い面積に住宅地が密集する自治体も含まれて
          います。面積ランキングは、人口密度ランキングと重ねて
          見ることで、その自治体が「広くて人が少ない」のか
          「狭くて人が集中している」のかを、より正確に読み解く
          手がかりになります。
        </p>
      </div>

      <div style={box}>
        <h2>「平成の大合併」が面積ランキングに与えた影響</h2>

        <p>
          2000年代前半に全国で進んだ「平成の大合併」により、
          日本の市町村数は1999年時点の約3,200から、現在の
          1,700台まで大きく減少しました。合併によって
          複数の町村が一つの市に統合された結果、山間部や
          農村部を広く抱え込む、面積の大きな「新しい市」が
          各地に誕生しました。静岡市や浜松市が政令指定都市
          でありながら面積上位に入っているのは、まさにこの
          合併の影響です。面積ランキングの上位を見るときは、
          「もともと広かった」自治体と、「合併で広くなった」
          自治体が混在している点を意識すると、ランキングの
          見え方がより立体的になります。
        </p>

        <p>
          面積が大きい自治体は、その分だけ道路や上下水道などの
          インフラを広範囲に維持する必要があり、人口密度の
          記事でも触れた「行政コストの効率性」という観点では
          不利になりやすい側面があります。面積ランキング・
          人口密度ランキング・財政力指数ランキングを重ねて
          見ることで、それぞれの自治体が抱える地理的な条件と
          財政的な課題の関係が、より具体的に見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>面積ランキングの基準について</h2>

        <p>
          本サイトの面積データは、国土地理院が毎年公表する
          「全国都道府県市区町村別面積調」を出典としています。
          この調査は、埋め立てや河川改修などによって年ごとに
          変動する海岸線や境界線を反映しており、同じ自治体でも
          年によって面積の数値がわずかに変動することがあります。
          また、政令指定都市の区は独立した自治体ではないため、
          本サイトの面積ランキングには含めていません。区ごとの
          面積を知りたい場合は、各市の個別ページに掲載している
          内訳をご確認ください。
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
