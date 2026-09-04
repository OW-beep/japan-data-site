import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import { getPrefectureStats } from "@/lib/prefectureStats";
import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/prefecture-income-analysis" },
  title: "都道府県別 平均年収ランキング分析｜静岡県は「稼げて治安も良いが事故はワースト1位」",
  description:
    "厚生労働省の賃金統計から都道府県別の推計年収を算出し、出生率・犯罪率・交通事故率との関係を分析。年収が高いほど出生率は低く、犯罪率は高いという相関が見られる一方、静岡県は数少ない例外でした。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return cov / (sx * sy);
}

export default function Page() {
  const prefStats = getPrefectureStats().filter(
    (r) =>
      r.stats.income != null &&
      r.stats.crimeRate != null &&
      r.stats.trafficAccidentRate != null
  );

  const cityBase = getMunicipalities().filter(
    (c) => c.population >= 3000 && c.birthRate != null
  );
  const prefBirthAvg = new Map<string, number>();
  const grouped = new Map<string, number[]>();
  cityBase.forEach((c) => {
    const pref = c.name.split(" ")[0];
    if (!grouped.has(pref)) grouped.set(pref, []);
    grouped.get(pref)!.push(c.birthRate ?? 0);
  });
  grouped.forEach((values, pref) => {
    prefBirthAvg.set(pref, values.reduce((s, v) => s + v, 0) / values.length);
  });

  const merged = prefStats
    .filter((r) => prefBirthAvg.has(r.pref))
    .map((r) => ({
      pref: r.pref,
      income: r.stats.income ?? 0,
      crimeRate: r.stats.crimeRate ?? 0,
      trafficAccidentRate: r.stats.trafficAccidentRate ?? 0,
      birthRate: prefBirthAvg.get(r.pref) ?? 0,
    }));

  const incomes = merged.map((m) => m.income);
  const births = merged.map((m) => m.birthRate);
  const crimes = merged.map((m) => m.crimeRate);
  const traffics = merged.map((m) => m.trafficAccidentRate);

  const corrBirth = corr(incomes, births);
  const corrCrime = corr(incomes, crimes);

  const rankedIncome = [...merged].sort((a, b) => b.income - a.income);
  const top10Income = rankedIncome.slice(0, 10);

  const medianCrime = [...crimes].sort((a, b) => a - b)[
    Math.floor(crimes.length / 2)
  ];

  const exceptions = top10Income.filter((m) => m.crimeRate <= medianCrime);
  const shizuoka = merged.find((m) => m.pref === "静岡県");
  const shizuokaTrafficRank =
    [...merged]
      .sort((a, b) => b.trafficAccidentRate - a.trafficAccidentRate)
      .findIndex((m) => m.pref === "静岡県") + 1;

  const faq = [
    {
      q: "都道府県別の推計年収が最も高いのはどこですか？",
      a: `東京都(推計${(top10Income[0].income / 100).toFixed(1)}万円)です。神奈川県・大阪府・栃木県・愛知県が続きます。`,
    },
    {
      q: "年収が高い都道府県ほど、出生率も高いのですか？",
      a: `逆の傾向があります。相関係数は${corrBirth.toFixed(
        2
      )}で、年収が高い都道府県ほど出生率が低い傾向が見られました。地方ブロック格差レポートで見た「関東は豊かだが出生率最低」という構造が、都道府県単位でも裏付けられた形です。`,
    },
    {
      q: "年収が高い都道府県は、犯罪率も高いのですか？",
      a: `その傾向があります。相関係数は${corrCrime.toFixed(
        2
      )}で、年収が高い都道府県ほど刑法犯認知件数(人口千人あたり)も多い傾向が見られました。都市部への人口・経済活動の集中が、犯罪機会の増加につながっている可能性があります。`,
    },
    {
      q: "年収が高くて治安も良い都道府県はありますか？",
      a: shizuoka
        ? `数少ない例外の1つが静岡県です。年収は全国上位である一方、犯罪率は中央値以下に抑えられています。ただし交通事故発生件数では全国${shizuokaTrafficRank}位(ワースト1位)であるなど、指標によって評価が分かれる点には注意が必要です。`
        : "一部の県では、高い年収と比較的低い犯罪率が両立しています。",
    },
  ];

  return (
    <ArticleLayout
      title="都道府県別 平均年収ランキング分析：静岡県は「稼げて治安も良いが事故はワースト1位」"
      summary={`厚生労働省の賃金構造基本統計調査から都道府県別の推計年収を算出し、本サイトの出生率・犯罪率・交通事故率データと掛け合わせました。年収が高い都道府県ほど出生率は低く(相関係数${corrBirth.toFixed(
        2
      )})、犯罪率は高い(相関係数${corrCrime.toFixed(
        2
      )})という傾向が見えた一方、静岡県は「稼げて治安も良い」数少ない例外でした。ただし交通事故発生件数は全国ワースト1位という、指標によって顔が変わる結果になっています。`}
      heroLabel="推計年収 全国1位"
      heroValue={`${top10Income[0].pref} ${(top10Income[0].income / 100).toFixed(1)}万円`}
      rankingLink="/ranking/income"
      path="/articles/prefecture-income-analysis"
      tags={["finance"]}
      publishedAt="2026-09-02"
      top3={[
        { rank: 1, name: top10Income[0].pref, value: `${(top10Income[0].income / 100).toFixed(1)}万円` },
        { rank: 2, name: top10Income[1].pref, value: `${(top10Income[1].income / 100).toFixed(1)}万円` },
        { rank: 3, name: top10Income[2].pref, value: `${(top10Income[2].income / 100).toFixed(1)}万円` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          本サイトではこれまで市区町村単位のデータを中心に
          分析してきましたが、平均年収は市区町村単位では
          公表されていないため、今回初めて都道府県単位の
          政府統計(厚生労働省「賃金構造基本統計調査」)を
          新たに取得しました。この年収データを、既存の
          出生率・犯罪率・交通事故率データと掛け合わせる
          ことで、これまで見えなかった関係が見えてきました。
        </p>
      </div>

      <div style={box}>
        <h2>年収が高いほど、出生率は低い</h2>

        <p>
          都道府県別の推計年収と、市区町村データから算出した
          都道府県別平均出生率の相関係数は{corrBirth.toFixed(2)}
          でした。地方ブロック格差レポートで見た「関東は
          財政力・産業構造でほぼ全て1位なのに出生率だけ
          最下位」という構造が、都道府県単位の年収データでも
          同じ方向性で裏付けられた形です。年収の高さと
          子育てのしやすさは、必ずしも一致しないことが
          あらためて分かります。
        </p>
      </div>

      <div style={box}>
        <h2>年収が高いほど、犯罪率も高い</h2>

        <p>
          年収と刑法犯認知件数(人口千人あたり)の相関係数は
          {corrCrime.toFixed(2)}でした。大阪府(犯罪率
          {merged.find((m) => m.pref === "大阪府")?.crimeRate}
          ・全国最多)のように、経済活動が活発な都市部
          ほど、人や物が集まることで犯罪の機会自体が
          増えやすいという、都市化に伴う一般的な傾向が
          反映されていると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>数少ない例外・静岡県の「稼げて治安も良い」の裏側</h2>

        <p>
          年収TOP10の都道府県の中で、犯罪率が全国中央値
          以下に収まっているのは{exceptions.length}県のみで、
          その代表が静岡県です。年収は全国上位でありながら、
          犯罪率は中央値を下回り、「稼げて治安も良い」と
          いう、今回のデータでは珍しいパターンに当てはまり
          ます。
        </p>

        <p>
          ただし手放しには喜べません。静岡県は交通事故
          発生件数(人口10万人あたり)で見ると、全国
          {shizuokaTrafficRank}位、つまりワースト1位でした。
          1つの指標で「良い県」と判断しても、別の指標では
          全く違う顔が見えてくるという、今回のデータ横断
          分析ならではの発見です。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回の年収データは、市区町村単位では公表されて
          いないため都道府県単位のみの掲載です。また
          「賃金構造基本統計調査」は主に企業規模10人以上の
          事業所に勤める一般労働者を対象としており、
          自営業者や公務員の一部は含まれない点にご注意
          ください。相関関係は因果関係を示すものではなく、
          都市化の度合いなど、背景にある共通の要因を
          反映している可能性が高い点にも留意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：都道府県別年収についてよくある質問</h2>

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
          都道府県別の年収データを新たに取得し、出生率・
          犯罪率・交通事故率と掛け合わせたことで、「豊かさ」
          には複数の側面があることが見えてきました。年収の
          高さは出生率の低さ・犯罪率の高さと結びつく傾向が
          ある一方、静岡県のような例外も存在します。1つの
          指標だけで地域を評価せず、複数のデータを横断して
          見ることの大切さを、あらためて感じる結果になり
          ました。
        </p>

        <p>
          <Link href="/ranking/income" style={link}>
            平均年収ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/crime-rate" style={link}>
            刑法犯認知件数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/traffic-accident-rate" style={link}>
            交通事故発生件数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/crime-rate-analysis" style={link}>
            刑法犯認知件数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/traffic-accident-analysis" style={link}>
            交通事故発生件数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/regional-block-disparity-report" style={link}>
            地方ブロック格差レポートを見る
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
