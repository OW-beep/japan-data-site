import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/young-adult-migration-analysis" },
  title: "20代純移動率ランキング分析｜若者に選ばれる街、大阪市の各区が上位に",
  description:
    "20代の純移動率をランキング分析。東京23区だけでなく大阪市の各区が上位に多数入る一方、全国の8割近い自治体で若者の流出が続いている実態を、2025年の最新データから読み解きます。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) => c.youngAdultNetMigration != null && c.population >= 3000
    )
    .map((c) => ({
      ...c,
      rate: ((c.youngAdultNetMigration ?? 0) / c.population) * 1000,
    }));

  const ranking = [...base].sort((a, b) => b.rate - a.rate);
  const top15 = ranking.slice(0, 15);

  const bottom10 = [...base].sort((a, b) => a.rate - b.rate).slice(0, 10);

  const bigCities = base
    .filter((c) => c.population >= 200000)
    .sort((a, b) => b.rate - a.rate);
  const bigTop10 = bigCities.slice(0, 10);

  const average = base.reduce((s, c) => s + c.rate, 0) / base.length;
  const positiveCount = base.filter(
    (c) => (c.youngAdultNetMigration ?? 0) > 0
  ).length;

  const osakaInTop15 = top15.filter((c) =>
    c.name.startsWith("大阪府")
  ).length;

  return (
    <ArticleLayout
      title="20代純移動率ランキング分析:若者に選ばれる街、東京だけでなく大阪市の各区が上位に"
      summary={`人口1,000人あたりの20代純移動数を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}に対し、1位は${top15[0].name}(${top15[0].rate.toFixed(
        1
      )})でした。ただし純移動がプラスの自治体は全体のわずか${Math.round(
        (positiveCount / base.length) * 100
      )}%にとどまり、多くの自治体で若者の流出が続く厳しい現実も見えてきます。`}
      heroLabel="20代純移動率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].rate.toFixed(1)}`}
      rankingLink="/ranking/young-adult-migration"
      tags={["migration"]}
      publishedAt="2026-08-09"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].rate.toFixed(1)}` },
        { rank: 2, name: top15[1].name, value: `${top15[1].rate.toFixed(1)}` },
        { rank: 3, name: top15[2].name, value: `${top15[2].rate.toFixed(1)}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          20代純移動率は、進学・就職といったライフイベントの
          多い20代が、その自治体にどれだけ転入・転出している
          かを示す指標です。2025年の住民基本台帳人口移動報告
          をもとに全国
          {base.length.toLocaleString()}
          自治体を比較したところ、全国平均は
          {average.toFixed(1)}
          でしたが、実際にプラスだったのは
          {positiveCount.toLocaleString()}
          自治体、全体のわずか
          {Math.round((positiveCount / base.length) * 100)}
          %にとどまりました。人口が増えている自治体でも、
          高齢化が進みながら20代だけは流出しているケースも
          あり、単純な人口増減とは違う切り口で街の将来性を
          考えるヒントになります。同じ「人口が減っている街」
          でも、若者が残っているかどうかで、10年後の姿は
          大きく変わってくるはずです。
        </p>
      </div>

      <div style={box}>
        <h2>20代純移動率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: c.rate.toFixed(1),
          }))}
          barColor="#0284c7"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は{top15[0].name}
          で、{top15[0].rate.toFixed(1)}
          という高い水準でした。TOP15のうち
          {osakaInTop15}
          自治体を大阪市内の区(西区・淀川区・北区・浪速区・
          東成区など)が占めており、東京23区に負けない勢いで
          若者を集めていることが分かります。沖縄県竹富町の
          ようなリゾート地が入っているのも興味深い点で、
          観光業やリゾートワークを目的に移住する若者の存在も
          うかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>人口20万人以上の都市では、東京都墨田区が1位</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: c.rate.toFixed(1),
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市に絞ると、東京都墨田区が1位、
          川崎市中原区・品川区・台東区と続きました。近年の
          再開発やタワーマンション建設が進むエリアが目立ち、
          新しい住宅供給が若者の流入に直結していることが
          うかがえます。千葉市中央区や大田区、目黒区といった、
          都心へのアクセスが良く比較的家賃を抑えやすい
          エリアも上位に食い込んでおり、通勤利便性とコスト
          のバランスが選ばれる街の共通点になっているようです。
        </p>

        <PersonalNote>
          単独世帯割合や婚姻率の記事で見た「都心区に若い
          単身者が集まる」という傾向が、この20代純移動の
          データでも裏付けられた形です。特に大阪市の各区が
          東京23区と並ぶ勢いで20代を集めているのは、
          個人的には少し意外でした。家賃相場が東京よりも
          抑えられている分、若い世代にとって都心での一人
          暮らしを始めやすい街になっているのかもしれません。
          データを重ねるほど、街の個性が立体的に見えてくる
          のを実感します。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>逆に流出が大きいのは、地方の町村</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: c.rate.toFixed(1),
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最も流出が大きかったのは大阪府岬町でした。下位10
          自治体には千葉県の房総エリアや愛知県知多半島の
          町など、大都市近郊でありながら人口規模の小さい
          町が目立ちます。進学や就職のタイミングで若者が
          近隣の大都市へ流出し、そのまま戻らないという
          構造が、こうした町では特に強く表れているようです。
          リゾート地・別荘地系の自治体が空き家率ランキングと
          同様にここでも下位に並んでいるのは、観光需要と
          定住人口の確保が必ずしも一致しないことを示して
          います。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          このデータは2025年(令和7年)の1年間の転入出を集計したもので、
          単年の数値には引っ越しシーズンの偶然や、大型
          マンションの竣工といった一時的な要因も影響します。
          継続的な傾向かどうかは、複数年のデータを見比べる
          ことでより確実に判断できます。今後、この移動報告
          データが更新されるたびに、順位の変動を追いかけて
          いくのも面白い見方です。また、住民基本台帳上の
          転入・転出は、進学時に住民票を移さない学生などが
          反映されない場合もあり、実際の若者人口の動きを
          完全には捉えきれていない可能性がある点にも留意が
          必要です。
        </p>
      </div>

      <div style={box}>
        <h2>この指標は何に使えるか</h2>

        <p>
          20代純移動率がプラスの自治体は、賃貸物件の供給や
          単身者向けの生活インフラ(飲食店・交通の便など)が
          充実している傾向にあります。就職・転職を機に
          一人暮らしを始める場所を検討する際、この指標が
          高い街は、同世代の住民が多く暮らしやすい環境が
          整っている可能性が高いと言えます。逆に自治体側の
          視点では、この数値が続けてマイナスの地域は、
          若年層向けの住宅施策や雇用創出が急務であることを
          示す、分かりやすい警告サインにもなります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          20代純移動率ランキングは、東京一極集中というより
          「大都市圏の都心回帰」という現象をより正確に映して
          いました。東京23区だけでなく大阪市の各区も若者を
          強く引きつけている一方、全国の8割近い自治体では
          20代の流出が続いています。人口減少社会において、
          若い世代がどこに集まり、どこから去っていくのかは、
          その街の10年後・20年後を占う先行指標とも言えます。
          婚姻率・単独世帯割合の記事とあわせて読むと、若い
          世代がどこでライフステージを迎えているのか、より
          具体的なイメージがつかめるはずです。
        </p>

        <p>
          <Link href="/ranking/young-adult-migration" style={link}>
            20代純移動率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/marriage-rate-analysis" style={link}>
            婚姻率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-analysis" style={link}>
            単独世帯割合ランキング分析を見る
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
