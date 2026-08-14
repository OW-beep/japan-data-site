import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/school-crowding" },
  title: "学校規模ランキング分析｜1校2293人の町も",
  description:
    "全国自治体の小学校1校あたりの子ども人口を分析。子育て世代の急増に学校整備が追いつかない自治体と、児童数十人でも学校を維持し続ける過疎地域、両極端の実態を紹介します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.elementarySchoolCount != null &&
        c.elementarySchoolCount > 0 &&
        c.childPopulation != null
    )
    .map((c) => ({
      ...c,
      perSchool:
        c.childPopulation / (c.elementarySchoolCount ?? 1),
    }));

  const top15 = [...base]
    .sort((a, b) => b.perSchool - a.perSchool)
    .slice(0, 15);

  const bottom15 = [...base]
    .sort((a, b) => a.perSchool - b.perSchool)
    .slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.perSchool, 0) / base.length;

  const okinawaCount = top15.filter((c) =>
    c.name.startsWith("沖縄県")
  ).length;

  return (
    <ArticleLayout
      title="学校規模ランキング分析：1校あたり2293人のマンモス校の町、21人しかいない離島の小学校"
      summary={`全国${base.length.toLocaleString()}自治体で小学校1校あたりの子ども人口(0〜14歳)を比較すると、全国平均${Math.round(
        average
      ).toLocaleString()}人に対し、1位の静岡県長泉町は${Math.round(
        top15[0].perSchool
      ).toLocaleString()}人と平均の4倍近くに達しました。一方で最下位の東京都青ヶ島村はわずか21人。子育て世代急増の町と、児童数十人でも学校を守り続ける離島、対照的な2つの姿を紹介します。`}
      heroLabel="小学校1校あたり子ども人口 全国1位"
      heroValue={`${top15[0].name} ${Math.round(top15[0].perSchool).toLocaleString()}人`}
      rankingLink="/ranking/school-crowding"
      tags={["child"]}
      publishedAt="2026-07-31"
      top3={[
        { rank: 1, name: top15[0].name, value: `${Math.round(top15[0].perSchool).toLocaleString()}人` },
        { rank: 2, name: top15[1].name, value: `${Math.round(top15[1].perSchool).toLocaleString()}人` },
        { rank: 3, name: top15[2].name, value: `${Math.round(top15[2].perSchool).toLocaleString()}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          子育て世代の人口が増えている自治体では、学校の
          整備が追いついているのでしょうか。小学校1校あたり
          の子ども人口(0〜14歳)を「学校規模」の目安として
          全国{base.length.toLocaleString()}
          自治体を比較すると、平均
          {Math.round(average).toLocaleString()}
          人に対し、上位は2000人前後、下位は50人未満と、
          非常に大きな開きがありました。
        </p>
      </div>

      <div style={box}>
        <h2>1校あたり子ども人口TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.perSchool,
            displayValue: `${Math.round(c.perSchool).toLocaleString()}人`,
          }))}
          barColor="#be185d"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の静岡県長泉町は、地方税自主財源比率ランキング
          でも上位10位に入った、製薬・医療機器関連企業が
          集積する町です。3位の三重県朝日町、10位の群馬県
          吉岡町は、転入超過と子ども人口割合の関係を扱った
          記事で紹介した、自動車関連産業による子育て世代の
          流入が続く町です。
        </p>
      </div>

      <div style={box}>
        <h2>沖縄県と大都市近郊ベッドタウンの存在感</h2>

        <p>
          TOP15のうち{okinawaCount}
          自治体を沖縄県の南風原町・与那原町・浦添市・
          宜野湾市が占めています。出生率ランキング分析の
          記事で見たとおり、沖縄県は全国で最も出生率が
          高く、子どもの数自体が多いため、学校規模も
          自然と大きくなる傾向があります。このほか、埼玉県
          朝霞市・戸田市、愛知県長久手市、石川県野々市市と
          いった大都市近郊のベッドタウンも上位に並びました。
          戸田市・長久手市は、少子高齢化ギャップ分析の記事
          で「子どもの割合が高齢者の割合を上回る、全国でも
          珍しい逆転自治体」として紹介した町です。子育て
          世代の転入が続く町ほど、学校の受け入れ規模も
          大きくなっていることが、複数の記事を通じて一貫して
          確認できます。
        </p>

        <p>
          15位には東京都港区も入りました。都心の再開発に
          伴うタワーマンション建設で子育て世代の転入が続き、
          既存の小学校だけでは対応しきれず、教室の増築や
          新設校の検討が課題になっている地域としてしばしば
          報道される地域でもあります。人口が集中する都市部
          ほど、学校整備の遅れが顕在化しやすい構造にある
          ことが、このランキングからも読み取れます。
        </p>
      </div>

      <div style={box}>
        <h2>「マンモス校」が引き起こす現実的な課題</h2>

        <p>
          1校あたりの子ども人口が突出して多い自治体では、
          実際の教育現場でさまざまな課題が指摘されています。
          1学年に複数のクラスを設置しても教室が足りず、
          特別教室(音楽室・理科室など)を普通教室に転用
          したり、校庭や体育館の利用時間を学年ごとに細かく
          調整したりするケースが少なくありません。給食の
          提供体制や、通学路の安全確保といった面でも、
          急激な児童数増加は行政にとって大きな負担となり
          ます。新しい学校を1校建設するには、用地確保から
          開校まで数年単位の時間がかかるため、人口増加の
          スピードに施設整備が追いつかないという構造的な
          タイムラグが生じやすいのです。
        </p>

        <PersonalNote>
          人口が急増している地域を見ていて感じるのは、
          子育て世帯が一気に流入すると、人口統計上は
          「成長している自治体」に見えても、保育所・学校・
          学童などの整備が追いつかないという課題が起きやすい
          ということです。人口が増えることは基本的に前向きな
          変化ですが、急激な変化はそれはそれで別の負担を
          生みます。人口増加も人口減少も、それだけでは
          良い・悪いを単純に判断できないと感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>1校あたり子ども人口BOTTOM15</h2>

        <RankingBarChart
          items={bottom15.map((c) => ({
            name: c.name,
            value: c.perSchool,
            displayValue: `${Math.round(c.perSchool)}人`,
          }))}
          barColor="#6b7280"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最下位の東京都青ヶ島村は、子ども人口全体でもごく
          少数ですが、それでも小学校を1校維持しています。
          伊豆諸島最南端に位置し、船・ヘリコプター以外に
          交通手段がないという地理的制約もあり、他の地域の
          学校に通わせることは事実上不可能です。離島や山村
          では、通学が困難なため学校を統廃合
          できず、児童数十人規模でも学校を存続させている
          ケースがほとんどです。地域コミュニティの存続や
          子育て世帯の定住のために不可欠な施設である一方、
          教育費と財政の関係を考えるうえでは、学校運営コスト
          の効率という面で大きな課題を抱えています。教員
          1人あたりの児童数が少ないぶん、きめ細かな指導が
          可能という教育的な利点がある一方、学校運営に
          必要な最低限の人員・設備コストは児童数に比例して
          は減らないため、児童1人あたりの行政コストは
          都市部に比べて大幅に高くなる傾向があります。
        </p>
      </div>

      <div style={box}>
        <h2>学校規模から見える、人口動態の"最前線"</h2>

        <p>
          学校は、地域の子育て世代人口の増減が最も早く、
          最も具体的なかたちで表れる施設です。人口統計上の
          「子ども人口割合」が上昇していても、それが本当に
          地域に根付いた動きなのか、一時的な現象なのかは、
          実際に学校がどれだけ混雑しているか、あるいは
          統廃合の議論が起きているかを見ることで、より
          実感を持って理解できます。今回紹介した上位の
          自治体の多くは、既存の学校の教室不足や、新設校の
          検討といった課題に直面している可能性が高く、
          逆に下位の自治体は、学校統廃合という別の難しい
          課題に直面していると考えられます。人口統計・
          産業構造・財政という切り口に加えて、学校という
          具体的な生活インフラの視点を持つことで、統計の
          数字がより身近なものとして感じられるようになります。
        </p>

        <p>
          <Link href="/ranking/school-crowding" style={link}>
            小学校1校あたり子ども人口ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/migration-child" style={link}>
            転入超過と子ども人口割合の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-gap" style={link}>
            少子高齢化ギャップ分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          この指標は、子ども人口(0〜14歳、就学前の乳幼児も
          含む)を小学校数(6〜12歳が通う施設)で単純に割った
          概算値であり、実際の1校あたりの児童数そのものでは
          ありません。また、学校の規模は校舎の面積や教室数
          によっても大きく異なるため、この数値が高いからと
          いって必ずしも「教室が過密である」とは限りません。
          あくまで、子ども人口と学校インフラのバランスを
          把握するための目安としてご利用ください。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          小学校1校あたりの子ども人口ランキングでは、全国
          平均{Math.round(average).toLocaleString()}
          人に対し、上位は2000人前後、下位は50人を大きく
          下回るという、極端な地域差が明らかになりました。
          上位には、産業集積による子育て世代の転入が続く町
          や、出生率の高い沖縄県の自治体、大都市近郊の
          ベッドタウンが並び、これまでの人口・出生率関連の
          記事で紹介した町の多くが、学校規模というまったく
          別の指標からも同じ姿で確認できました。人口統計と
          教育インフラを重ね合わせることで、地域の子育て
          環境がより立体的に見えてきます。
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
