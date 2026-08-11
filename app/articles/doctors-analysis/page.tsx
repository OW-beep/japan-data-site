import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/doctors-analysis" },
  title: "医師数ランキング分析｜千代田区が全国1位",
  description:
    "全国自治体の人口10万人あたり医師数をランキング分析。医科大学の附属病院がある町が上位を独占する一方、医師が1人も登録されていない自治体が29町村ある実態を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) => c.doctorsCount != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      per10k: ((c.doctorsCount ?? 0) / c.population) * 100000,
    }));

  const ranking = [...base]
    .sort((a, b) => b.per10k - a.per10k)
    .slice(0, 15);

  const zero = base.filter((c) => (c.doctorsCount ?? 0) === 0);

  const average =
    base.reduce((s, c) => s + c.per10k, 0) / base.length;

  const universityTowns = [
    "永平寺町",
    "矢巾町",
    "東温市",
    "壬生町",
    "下野市",
    "毛呂山町",
  ];
  const universityCount = ranking.filter((c) =>
    universityTowns.some((k) => c.name.includes(k))
  ).length;

  const PREFECTURES = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
    "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
    "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
    "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
  ];

  const prefectureAverages = PREFECTURES.map((pref) => {
    const cities = base.filter((c) => c.name.startsWith(pref));
    const avg =
      cities.length > 0
        ? cities.reduce((s, c) => s + c.per10k, 0) / cities.length
        : null;
    return { pref, avg, count: cities.length };
  }).filter((p) => p.avg != null) as {
    pref: string;
    avg: number;
    count: number;
  }[];

  const prefRankingDesc = [...prefectureAverages].sort(
    (a, b) => b.avg - a.avg
  );
  const prefTop5 = prefRankingDesc.slice(0, 5);
  const prefBottom5 = prefRankingDesc.slice(-5).reverse();

  const faq = [
    {
      q: "医師数(人口10万人あたり)が全国1位の自治体はどこですか？",
      a: `東京都千代田区が${ranking[0].per10k.toFixed(
        1
      )}人で全国1位です。全国平均(${average.toFixed(
        1
      )}人)の16倍以上にあたり、大学病院や大規模総合病院の集積が主な要因です。`,
    },
    {
      q: "なぜ人口数万人規模の町が医師数ランキング上位に入るのですか？",
      a: "医科大学の附属病院を抱える町では、大学病院1つに数百〜千人規模の医師が勤務しているため、人口あたりの医師数が跳ね上がります。福井県永平寺町、岩手県矢巾町、愛媛県東温市などが代表例で、大規模な医療機関がたまたま立地していることが要因であり、必ずしも住民あたりの医療サービスが手厚いことを意味するわけではありません。",
    },
    {
      q: "医師が1人もいない自治体はありますか？",
      a: "今回の集計では、医師数が0人として登録されている自治体が29町村ありました。人口数千人規模の小さな町村が多く、自前の診療所を持たず近隣市町村の医療機関に頼っている地域です。ただし医師数がゼロだからといって医療が全く受けられないわけではありません。",
    },
    {
      q: "医師数ランキングだけで「医療が充実した自治体」と判断できますか？",
      a: "できません。この統計は医師の勤務先で計上されるため、大学病院がある自治体に数値が集中しやすい構造になっています。実際にその地域に住む人がどれだけ医療を受けやすいかは、隣接自治体までの距離や交通事情もあわせて考慮する必要があります。",
    },
  ];

  return (
    <ArticleLayout
      title="医師数ランキング分析：人口10万人あたり2901人の千代田区、医師が1人もいない29町村"
      summary={`全国${base.length.toLocaleString()}自治体の人口10万人あたり医師数を比較すると、1位の東京都千代田区は2901.9人と全国平均(${average.toFixed(
        1
      )}人)の16倍以上。一方、医師が1人も登録されていない町村が29ありました。医科大学の附属病院がある町が上位を独占する構造と、深刻な医療過疎の実態を解説します。`}
      heroLabel="人口10万人あたり医師数 全国1位"
      heroValue={`${ranking[0].name} ${ranking[0].per10k.toFixed(0)}人`}
      rankingLink="/ranking/doctors"
      path="/articles/doctors-analysis"
      tags={["medical"]}
      publishedAt="2026-07-28"
      top3={[
        { rank: 1, name: ranking[0].name, value: `${ranking[0].per10k.toFixed(0)}人` },
        { rank: 2, name: ranking[1].name, value: `${ranking[1].per10k.toFixed(0)}人` },
        { rank: 3, name: ranking[2].name, value: `${ranking[2].per10k.toFixed(0)}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「医師数(人口10万人あたり)」は、その地域でどれだけ
          医療にアクセスしやすいかを示す代表的な指標です。
          全国{base.length.toLocaleString()}
          自治体で比較すると、1位の東京都千代田区は
          {ranking[0].per10k.toFixed(1)}
          人と、全国平均の{average.toFixed(1)}
          人を大きく上回りました。ただし、この指標には
          「病院がたまたまその自治体にある」という事情が
          強く反映されるため、単純な人口の多さとは異なる
          顔ぶれが上位に並びます。
        </p>
      </div>

      <div style={box}>
        <h2>医師数(人口10万人あたり)TOP15</h2>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name,
            value: c.per10k,
            displayValue: `${c.per10k.toFixed(0)}人`,
          }))}
          barColor="#15803d"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の千代田区、4位の文京区、13位の新宿区など、東京
          都心の区は大学病院や大規模総合病院が集積しており、
          常に上位の顔ぶれです。一方で、人口数万人規模の
          町にすぎない自治体が2〜10位に複数ランクインして
          いる点が、このランキングの大きな特徴です。
        </p>
      </div>

      <div style={box}>
        <h2>上位を占める「医科大学の城下町」</h2>

        <p>
          TOP15のうち{universityCount}
          自治体が、医科大学の附属病院を抱える町です。
          福井県永平寺町(福井大学医学部附属病院)、岩手県
          矢巾町(岩手医科大学附属病院)、愛媛県東温市(愛媛
          大学医学部附属病院)、栃木県壬生町・下野市(自治
          医科大学附属病院)、埼玉県毛呂山町(埼玉医科大学
          病院)がこれにあたります。これらの町の人口は数万人
          規模ですが、大学病院1つに数百人〜千人規模の医師が
          勤務しているため、人口あたりの医師数が跳ね上がる
          という統計上の特性があります。この現象は、いわば
          「一極集中の医療インフラが小さな自治体の統計を
          押し上げる」というもので、財政力指数のランキングで
          見た原子力発電所立地自治体が、人口規模に見合わない
          高い財政力指数を示すのと似た構造だと言えます。
        </p>

        <p>
          このほか、大分県由布市(由布院を含む観光地であると
          同時に、地域の中核病院を持つ)、千葉県鴨川市
          (大規模総合病院である亀田総合病院の所在地)、
          沖縄県西原町(琉球大学医学部附属病院の所在地)も、
          同様に単一の大規模医療機関が数値を押し上げている
          典型例です。つまり、このランキングの上位は「住民
          あたりの医療サービスが手厚い自治体」というより、
          「大規模な医療機関がたまたま立地している自治体」
          という側面が強いことに注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>医師が1人もいない29町村</h2>

        <p>
          今回の集計では、医師数が0人として登録されている
          自治体が29町村ありました。福島県大玉村・湯川村・
          飯舘村、茨城県河内町、富山県舟橋村、秋田県藤里町、
          埼玉県東秩父村、長野県小川村、北海道喜茂別町、
          京都府伊根町、青森県佐井村、鹿児島県宇検村、群馬県
          南牧村、岡山県西粟倉村、沖縄県伊是名村などが該当
          します。これらの多くは人口数千人規模の小さな町村で、
          自前の診療所を持たず、近隣の市町村の医療機関に
          頼っている地域です。医師数がゼロだからといって
          医療が全く受けられないわけではありませんが、
          救急時に近隣自治体まで移動する必要があるなど、
          医療アクセスの面で大きなハンディキャップを抱えて
          いることは間違いありません。
        </p>
      </div>

      <div style={box}>
        <h2>「医師の多さ」と「暮らしやすさ」は別問題</h2>

        <p>
          医科大学の城下町が上位を占めるという結果は、裏を
          返せば「大学病院が撤退・縮小すれば、その自治体の
          医師数は一気に減る」ということでもあります。実際、
          地方の医科大学の中には、医師確保が難しく診療科の
          縮小を迫られているところも少なくありません。人口
          あたりの医師数が高いからといって、その水準が
          将来にわたって維持される保証はなく、あくまで
          「現時点でのスナップショット」として捉える必要が
          あります。
        </p>

        <p>
          また、医師数が多い自治体の住民全員が、その恩恵を
          等しく受けられるわけではない点にも注意が必要です。
          大学病院は高度専門医療を担う一方、日常的な
          プライマリケア(かかりつけ医機能)は、地域の
          診療所が担っていることが多く、医師数の多さが
          そのまま「風邪をひいたときにすぐ診てもらえる」
          という利便性に直結するとは限りません。
        </p>
      </div>

      <div style={box}>
        <h2>医療アクセスの地域差をどう見るか</h2>

        <p>
          今回のランキングから見えてくるのは、医療資源が
          「人口に応じて均等に」分布しているわけではなく、
          大学病院や大規模総合病院という「点」の存在に
          大きく左右されるという実態です。同じ県内でも、
          大学病院がある町と、医師がゼロの村が隣接して
          いることも珍しくありません。高齢化率ランキングで
          見たように、医療・介護需要は高齢化が進む地域ほど
          高まる傾向にありますが、必ずしもその需要と医師数の
          分布が一致しているとは限らない点は、地域医療を
          考えるうえで重要な視点です。
        </p>

        <p>
          <Link href="/ranking/doctors" style={link}>
            医師数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-top50" style={link}>
            高齢化率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別 平均医師数ランキング</h2>

        <p>
          市区町村単位では大学病院1つの有無で数値が大きく
          振れるため、都道府県単位で市区町村の値を平均すると、
          より地域全体の傾向に近い数字が見えてきます。
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>都道府県</th>
              <th style={th}>平均(人口10万人あたり)</th>
            </tr>
          </thead>
          <tbody>
            {prefTop5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>上位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(1)}人</td>
              </tr>
            ))}
            {prefBottom5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>下位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(1)}人</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          都道府県単位でも、大学病院がある県(京都府・徳島県・
          福井県など)が上位に偏る傾向は残ります。1つの大学病院が
          県全体の平均を押し上げているケースもあるため、都道府県別の
          数字であっても「その県全体で医療が手厚い」と単純には
          言い切れない点に注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          この医師数データは、医療施設に従事する医師が
          「勤務先の所在地」で計上される統計です。医師の
          「居住地」ベースの統計ではないため、大学病院や
          大規模病院がある自治体に数値が集中しやすい構造に
          なっています。実際にその地域に住む人がどれだけ
          医療を受けやすいかを正確に測るには、隣接自治体
          までの距離や交通事情もあわせて考慮する必要があり、
          今回のランキング単体で「医療が充実している町・
          不足している町」と断定することはできません。
        </p>

        <p>
          それでも、どの自治体にどのような医療機関が
          立地しているかを把握しておくことは、移住や
          子育て、高齢の親の暮らし先を考えるうえで、
          実用的な手がかりになります。単純な数値の
          大小だけでなく、その背景にある病院・大学の
          存在まで含めて読み解くことをおすすめします。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：医師数ランキングについてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          人口10万人あたりの医師数ランキングは、都市部の
          大規模病院集積地と、医科大学の附属病院を抱える
          地方の町が上位を占め、統計上は人口規模とは異なる
          顔ぶれになりました。一方で、医師がゼロの町村も
          29存在し、医療資源の地域差の大きさを改めて示す
          結果となりました。
        </p>

        <PersonalNote>
          「地方は医療が不足している」というイメージを漠然と
          持っていたのですが、人口あたりの医師数で見ると、
          むしろ都市部より多い地方の町がいくつもあることに
          最初は驚きました。都市部は人口密度が高いぶん、
          医師の総数は多くても一人あたりで見ると意外と
          手薄になっていることがあります。「医師が多い/少ない」
          を語るときは、総数なのか人口あたりなのかを
          区別しないと、実感と数字がすれ違ってしまうと
          感じた指標です。
        </PersonalNote>
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

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
