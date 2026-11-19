import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities2025 } from "@/lib/city2025";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import { getFuture, popIndex2050 } from "@/lib/futurePopulation";
import { shortName } from "@/lib/cityPopulation";

const PATH = "/articles/retirement-city-guide";

/** 地価(円/m²)を自治体コードで引けるようにする。政令指定都市は区の平均で市単位に寄せる */
function buildPriceMap(): Map<string, number> {
  const map = new Map<string, number>();
  const wards = new Map<string, number[]>();
  getRealEstatePriceRanking().forEach((r) => {
    if (r.landPricePerSqm == null) return;
    map.set(r.code, r.landPricePerSqm);
    if (!r.code.endsWith("00")) {
      const cityCode = r.code.slice(0, 3) + "00";
      wards.set(cityCode, [...(wards.get(cityCode) ?? []), r.landPricePerSqm]);
    }
  });
  wards.forEach((v, k) => {
    if (!map.has(k)) map.set(k, v.reduce((a, b) => a + b, 0) / v.length);
  });
  return map;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export const metadata = {
  alternates: { canonical: PATH },
  title: "老後の移住先・セカンドライフの街選び｜医療と生活費で失敗しないデータの見方",
  description:
    "退職後の移住先選びで見るべきデータ(医師数・地価・財政・買い物アクセス)を、人口10万人以上の市の実データで解説。高齢化率と医師数の掛け合わせで分かった「医療の拠点都市」の見つけ方と、データでは測れない注意点もまとめました。",
};

export default function Page() {
  const priceMap = buildPriceMap();
  const base = getMunicipalities2025()
    .filter((c) => c.population >= 100000)
    .map((c) => ({
      code: c.code,
      name: c.name,
      pop: c.population,
      aging: c.agingRate ?? (c.elderlyPopulation / c.population) * 100,
      doctors: c.doctorsCount != null ? (c.doctorsCount / c.population) * 100000 : null,
      hospitals: c.hospitalCount ?? null,
      land: priceMap.get(c.code) ?? null,
      fiscal: c.financeIndex,
      retail: c.retailStoreCount != null ? (c.retailStoreCount / c.population) * 10000 : null,
    }));

  const withDoc = base.filter((c) => c.doctors != null);
  const withBoth = base.filter((c) => c.doctors != null && c.land != null);
  const medDoc = median(withDoc.map((c) => c.doctors!));
  const medLand = median(withBoth.map((c) => c.land!));

  // 高齢化率と医師数の相関(人口10万人以上の市)
  const mx = withDoc.reduce((s, c) => s + c.aging, 0) / withDoc.length;
  const my = withDoc.reduce((s, c) => s + (c.doctors ?? 0), 0) / withDoc.length;
  let num = 0, dx = 0, dy = 0;
  withDoc.forEach((c) => {
    num += (c.aging - mx) * ((c.doctors ?? 0) - my);
    dx += (c.aging - mx) ** 2;
    dy += ((c.doctors ?? 0) - my) ** 2;
  });
  const corrAgingDoctors = num / Math.sqrt(dx * dy);

  const both = withBoth
    .filter((c) => c.doctors! >= medDoc && c.land! <= medLand)
    .sort((a, b) => (b.doctors ?? 0) - (a.doctors ?? 0));
  const aging30DocOk = base.filter(
    (c) => c.aging >= 30 && c.doctors != null && c.doctors >= medDoc
  ).length;

  const pick = (name: string) => base.find((c) => c.name === name);
  const examples = [
    pick("奈良県 橿原市"),
    pick("鳥取県 米子市"),
    pick("長野県 松本市"),
    pick("茨城県 つくば市"),
    pick("島根県 出雲市"),
    pick("栃木県 那須塩原市"),
    pick("北海道 釧路市"),
  ].filter((c): c is NonNullable<typeof c> => c != null);

  const faq = [
    {
      q: "老後の移住先では、医師数はどれくらいあれば安心ですか？",
      a: `人口10万人以上の市では、人口10万人あたり医師数の中央値は${Math.round(medDoc)}人です。ただし医師数は大学病院や中核病院のある自治体に集中します。人数だけでなく、自宅から通える範囲に内科・整形外科など日常的に使う診療科があるかを、地図で確認することが大切です。`,
    },
    {
      q: "高齢化率が高い街は、老後の移住先として避けるべきですか？",
      a: "一概には言えません。高齢化率が高い街は、同世代が多く高齢者向けのサービスや施設が整っている場合もあります。人口10万人以上の市では、高齢化率30%以上でも医師数が中央値以上の市が" + aging30DocOk + "市あります。高齢化率だけで判断せず、医療と生活の便をあわせて見てください。",
    },
    {
      q: "地価が安い街なら、生活費も安くなりますか？",
      a: "住居費は下がりますが、車が必須の地域では燃料費・維持費がかさみます。買い物や通院の移動コストまで含めた「生活全体のコスト」で比べることが大切です。この記事の地価は自治体全体の平均で、駅前と郊外では大きく違う点にも注意してください。",
    },
    {
      q: "移住前に、データ以外で確認すべきことは何ですか？",
      a: "病院までの実際の所要時間と診療科、冬の気候(積雪・路面凍結)、坂道の多さ、車を手放した後の移動手段です。これらは統計では測れません。自治体のお試し移住制度などを使い、冬を含む季節に数日滞在してから判断するのがおすすめです。",
    },
    {
      q: "財政力指数は老後の暮らしに関係しますか？",
      a: "介護保険料や公共施設の維持など、長い目では関係します。ただし指数が低くても地方交付税でサービスは維持されるため、単独の判断材料にはなりません。財政健全度スコアなど複数の指標とあわせて見てください。",
    },
    {
      q: "いま住んでいる街から移るべきか迷っています。判断の目安は？",
      a: "住み慣れた街には、かかりつけ医や知人のネットワークという、データに表れない資産があります。移住のメリット(住居費の低下、子世帯への近さなど)が、その資産を手放すコストを上回るかが判断の分かれ目です。この記事のデータは「移る場合の候補の絞り方」として使い、移るかどうか自体は家族やかかりつけ医と相談して決めてください。",
    },
  ];

  return (
    <ArticleLayout
      title="老後の移住先・セカンドライフの街選び｜医療と生活費で失敗しないデータの見方"
      summary="退職後の住まい選びで後悔しやすいのは、「静かで自然が豊か」という印象だけで決めてしまうことです。この記事では、医師数・地価・財政・買い物アクセスのデータで候補を絞る方法を、人口10万人以上の市の実データとあわせて解説します。"
      heroLabel="医師数が中央値以上・地価が中央値以下の市(人口10万人以上)"
      heroValue={`${both.length}市`}
      rankingLink="/ranking/doctors"
      path={PATH}
      tags={["aging", "medical", "migration"]}
      publishedAt="2026-11-19"
      dataNote="人口・高齢化率: 令和7年国勢調査(確定値)。医師数: 2022年(医師・歯科医師・薬剤師統計ベース、勤務地ベース)。地価: 国土交通省「不動産情報ライブラリ」の取引実勢価格(政令指定都市は区の平均)。財政力指数: 2022年度決算。対象は人口10万人以上の市・特別区。"
      top3={both.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: shortName(c.name),
        value: `医師 ${Math.round(c.doctors!)}人/10万人`,
      }))}
    >
      <div style={box}>
        <h2>結論:老後の街選びは「医療の拠点」と「生活コスト」の掛け合わせで見る</h2>
        <p>
          老後の移住で失敗の多くは、医療と移動の問題から生まれます。
          若い頃は気にならなかった「病院まで車で40分」「買い物は隣町まで」
          という距離が、70代・80代では暮らしそのものの負担になります。
          逆に、家賃や地価の安さだけで選ぶと、医療と買い物に不自由する
          街を掴みかねません。
        </p>
        <p>
          この記事では、人口10万人以上の{base.length}市・特別区について、
          医師数と地価を掛け合わせて候補のタイプを分けます。
          「医療が手厚く、住居費も抑えられる市」は{both.length}市ありました。
          印象ではなく数字で候補を絞り、最後に現地で確かめる順番が、
          セカンドライフの失敗を減らします。
        </p>
      </div>

      <div style={box}>
        <h2>まず決める:4つの優先順位</h2>
        <p>
          人によって正解は違います。次の4つのうち、自分が上位に置くものを
          先に決めると、見るべきデータが定まります。
        </p>
        <ul>
          <li>
            <strong>医療</strong>:かかりつけ医と中核病院への近さ。
            見るデータは医師数・病院数。持病がある人は最優先です。
          </li>
          <li>
            <strong>生活費</strong>:住居費と移動費の合計。
            見るデータは地価(家賃の目安)と、車が要るかどうか。
          </li>
          <li>
            <strong>移動のしやすさ</strong>:買い物・通院・駅までの距離。
            見るデータは小売店の多さと、街のコンパクトさ。
          </li>
          <li>
            <strong>気候と災害</strong>:雪・暑さ・水害への強さ。
            見るデータは標高や気候の傾向ですが、最終的には
            ハザードマップと現地確認が必要です。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>掛け合わせで分かったこと:「高齢化が進んだ街=医療が薄い」ではない</h2>
        <p>
          「高齢化率が高い街は、医師も少なくて不安」という見方は、
          データでは裏付けられません。人口10万人以上の市で高齢化率と
          人口10万人あたり医師数の相関を取ると、{corrAgingDoctors.toFixed(2)}と
          ほぼ無関係でした。高齢化率30%以上の市でも、医師数が中央値
          ({Math.round(medDoc)}人/10万人)以上の市が{aging30DocOk}市あります。
          医師は「高齢者の多い街」ではなく「中核病院のある拠点都市」に
          集まるからです。
        </p>
        <p>
          そこで、医師数が中央値以上で、地価が中央値
          (1m²あたり約{(medLand / 10000).toFixed(1)}万円)以下の市を
          拾うと{both.length}市が残ります。上位は次の顔ぶれです。
        </p>
        <RankingBarChart
          title="医師が多く地価が中央値以下の市(人口10万人あたり医師数)"
          items={both.slice(0, 6).map((c) => ({
            name: shortName(c.name),
            value: Math.round(c.doctors!),
            displayValue: `${Math.round(c.doctors!)}人`,
          }))}
        />
        <p>
          奈良県橿原市(770人)は県の医療拠点、鳥取県米子市(624人)や
          長野県松本市(569人)は地方の中核都市です。大都市でなくても、
          県単位の医療拠点になっている市は医師が集まります。
          詳しくは
          <Link href="/ranking/doctors" style={link}>医師数ランキング</Link>
          と
          <Link href="/ranking/hospital" style={link}>病院数ランキング</Link>
          で確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>データで候補を絞る手順</h2>
        <ol>
          <li>
            <strong>医療の拠点から当たる:</strong>
            医師数ランキングで、住みたい地域ブロックの中核都市を
            3〜5つ拾います。
          </li>
          <li>
            <strong>住居費の目安を見る:</strong>
            地価ランキングで候補の地価を比べます。地価は家賃や
            中古住宅価格の土台になります。
          </li>
          <li>
            <strong>街の持続性を見る:</strong>
            財政力指数と将来推計人口で、20年後もサービスが
            維持されそうかを確認します。人口が急減する街は、
            店や路線バスの撤退が進みやすい面があります。
          </li>
          <li>
            <strong>自治体ページで最終確認:</strong>
            候補の自治体ページで、高齢化率・買い物アクセス・
            標高などをまとめて見ます。気になる2市は
            <Link href="/compare" style={link}>自治体比較ツール</Link>
            で並べられます。
          </li>
        </ol>
      </div>

      <div style={box}>
        <h2>候補タイプ別の実例</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>市</th>
                <th style={thR}>医師/10万人</th>
                <th style={thR}>地価(円/m²)</th>
                <th style={thR}>高齢化率</th>
                <th style={thR}>財政力指数</th>
                <th style={{ ...th, textAlign: "left" }}>タイプ</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((c) => (
                <tr key={c.code}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    <Link href={`/city/${c.code}`} style={link}>{c.name}</Link>
                  </td>
                  <td style={tdR}>{c.doctors != null ? Math.round(c.doctors) : "—"}</td>
                  <td style={tdR}>{c.land != null ? Math.round(c.land).toLocaleString() : "—"}</td>
                  <td style={tdR}>{c.aging.toFixed(1)}%</td>
                  <td style={tdR}>{c.fiscal != null ? c.fiscal.toFixed(2) : "—"}</td>
                  <td style={{ ...td, textAlign: "left" }}>
                    {c.name.includes("橿原") || c.name.includes("米子") || c.name.includes("松本")
                      ? "医療拠点型"
                      : c.name.includes("つくば")
                        ? "バランス型"
                        : c.name.includes("出雲")
                          ? "生活充実型"
                          : "生活費重視型"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          医療拠点型の橿原市・米子市・松本市は、医師の多さに対して
          地価が大都市圏より大きく下がります。茨城県つくば市は
          高齢化率18.7%と若い研究学園都市で、財政力指数も1.06と
          高いバランス型です。島根県出雲市は小売店が人口1万人あたり
          94.3店と多く(中央値は67.7店)、買い物の便が目立ちます。
        </p>
        <p>
          生活費重視型の栃木県那須塩原市(地価14,637円/m²)や
          北海道釧路市(同16,213円/m²)は住居費を大きく抑えられます。
          ただし釧路市は高齢化率36.3%で将来の人口減少も速く、
          店や医療機関の集約が進む可能性があります。「安い」には
          理由があることまで含めて判断してください。
        </p>
      </div>

      <div style={box}>
        <h2>20年後まで見通す:将来推計人口の見方</h2>
        <p>
          移住は10年、20年単位の決断です。いま便利な街でも、人口の
          減り方が速い街では、スーパーや診療所の撤退・集約が
          進みやすくなります。国立社会保障・人口問題研究所の推計で
          2050年の人口指数(2020年=100)を見ると、候補の顔ぶれは
          次のように分かれます。
        </p>
        <ul>
          {examples.map((c) => {
            const f = getFuture(c.code);
            if (!f) return null;
            return (
              <li key={c.code}>
                {c.name}:{Math.round(popIndex2050(f))}(2050年)
              </li>
            );
          })}
        </ul>
        <p>
          茨城県つくば市は106と、2050年でも人口が増える数少ない市です。
          一方、北海道釧路市は60で、人口が4割減る見通しです。減少
          そのものが悪いわけではなく、静かな暮らしを望む人には
          合う場合もあります。ただ、買い物と医療の拠点が将来も
          維持されるかは、移住前に自治体の計画や地元紙の動きまで
          見ておくと安心です。介護施設の入りやすさについては、
          施設数だけでは定員や空き状況まで分かりません。候補の街の
          地域包括支援センターに相談し、実際の待機状況を聞くのが
          確実です。
        </p>
      </div>

      <div style={box}>
        <h2>注意点:データでは測れないもの</h2>
        <p>
          正直にお伝えすると、老後の暮らしを左右するのに、
          統計では測れないものが少なくありません。
        </p>
        <ul>
          <li>
            <strong>病院までの距離と診療科</strong>:
            医師数は自治体単位の集計です。自宅から病院までの
            所要時間や、必要な診療科があるかは地図で個別に
            確認が必要です。
          </li>
          <li>
            <strong>車前提の生活かどうか</strong>:
            運転できる間は不便でなくても、免許返納後の移動手段が
            あるかは別問題です。路線バスや乗合タクシーの有無を
            確認してください。
          </li>
          <li>
            <strong>冬の気候</strong>:
            積雪や路面凍結は、転倒と外出控えに直結します。
            標高データは目安にはなりますが、体感は現地でしか
            分かりません。
          </li>
          <li>
            <strong>坂道と段差</strong>:
            日常の買い物ルートに坂が多いかどうかは、統計には
            表れません。
          </li>
        </ul>
        <p>
          候補を2〜3に絞ったら、お試し移住や短期滞在を使い、
          冬を含む季節に「住む側」で数日過ごしてみることを
          おすすめします。データの出典と限界は
          <Link href="/methodology" style={link}>データの出典と算出方法</Link>
          にまとめています。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
        <CompareCTA />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
