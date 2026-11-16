import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getCities } from "@/lib/getCities";
import { getMunicipalities } from "@/lib/municipalities";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";

const PATH = "/articles/vacant-land-price-analysis";

export const metadata = {
  alternates: { canonical: PATH },
  title: "空き家率が高い街は衰退しているのか？地価と掛け合わせて分かった「別荘地の空き家」",
  description:
    "空き家率と地価を全国1,000超の自治体で掛け合わせると、相関は-0.48。ところが空き家率トップは軽井沢町70%・熱海市53%と、衰退ではなく別荘地でした。空き家率の正しい読み方を、統計の内訳から解説します。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return num / Math.sqrt(dx * dy);
}

export default function Page() {
  const muniCodes = new Set(getMunicipalities().map((c) => c.code));
  const priceByCode = new Map(
    getRealEstatePriceRanking()
      .filter((r) => r.landPricePerSqm != null)
      .map((r) => [r.code, r.landPricePerSqm as number]),
  );
  const data = getCities()
    .filter(
      (c) =>
        muniCodes.has(c.code) &&
        c.vacantHouseCount != null &&
        c.totalHousingCount != null &&
        c.totalHousingCount > 0 &&
        priceByCode.has(c.code),
    )
    .map((c) => ({
      name: c.name,
      vac: ((c.vacantHouseCount as number) / (c.totalHousingCount as number)) * 100,
      price: priceByCode.get(c.code) as number,
    }));
  // 地価は桁が大きく違うため、対数にして比較する(方法は本文にも明記)
  const r = corr(data.map((d) => d.vac), data.map((d) => Math.log(d.price)));

  const topVac = [...data].sort((a, b) => b.vac - a.vac).slice(0, 5);
  const cheapAndOccupied = data
    .filter((d) => d.vac < 10 && d.price < 20000)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);
  const highBoth = data.filter((d) => d.vac >= 20 && d.price >= 100000).length;

  const faq = [
    {
      q: "空き家率が高い街は、衰退しているのですか？",
      a: `一概には言えません。空き家率の上位は${topVac.map((d) => d.name).join("、")}など別荘地・リゾート地が占めます。統計上の「空き家」には別荘などの二次的住宅も含まれるため、観光地では空き家率が高く出ます。衰退による空き家かどうかは、空き家の内訳(賃貸用・売却用・二次的住宅・その他)を見ないと判断できません。`,
    },
    {
      q: "空き家率と地価には関係がありますか？",
      a: `全国${data.length.toLocaleString()}自治体で計算した相関係数は${r.toFixed(2)}(地価は対数変換)で、中程度の負の関係があります。地価が高い地域ほど空き家は少なく、逆もおおむね成り立ちます。ただし空き家率20%以上で地価10万円/m²以上の自治体は${highBoth}件と、例外にもはっきりした天井があります。`,
    },
    {
      q: "空き家が多い街で家を買うときの注意点は？",
      a: "空き家率の数字だけで判断しないことです。別荘地型の空き家が多い街と、住まい手がいなくなった空き家が多い街では、将来の資産価値も行政サービスもまったく違います。空き家バンクの登録状況、人口の増減、その空き家が市場に出ているか(賃貸・売却用か、放置されているか)を確認してください。",
    },
    {
      q: "この記事の空き家率の定義は？",
      a: "住宅総数に占める空き家数の割合です。空き家には、賃貸用・売却用・別荘などの二次的住宅・その他の空き家がすべて含まれます。地価は国土交通省「不動産情報ライブラリ」の取引価格から集計した土地価格(円/m²)です。",
    },
  ];

  const table = (list: typeof data) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thR}>空き家率</th>
            <th style={thR}>地価(円/m²)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.name}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{d.name}</td>
              <td style={tdR}>{d.vac.toFixed(1)}%</td>
              <td style={tdR}>{d.price.toLocaleString()}円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ArticleLayout
      title="空き家率が高い街は衰退しているのか？地価と掛け合わせた分析"
      summary={`空き家率と地価の相関は${r.toFixed(2)}。地価が高い街ほど空き家は少ない、という常識はおおむね正しい。ところが空き家率のトップは軽井沢町(70%)や熱海市(53%)――衰退した街ではなく、別荘地でした。「空き家率」の読み違いを、統計の内訳から解きほぐします。`}
      heroLabel="空き家率と地価の相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/vacant-house"
      path={PATH}
      tags={["household", "composite"]}
      publishedAt="2026-11-16"
      dataNote={`対象は空き家数と地価の両方が取れる全国${data.length.toLocaleString()}自治体。空き家率は当サイト収録の住宅統計(住宅総数に占める空き家の割合、別荘等の二次的住宅を含む)。地価は国土交通省「不動産情報ライブラリ」の取引価格集計(円/m²)で、相関の計算では対数変換している。`}
      top3={[
        { rank: 1, name: "相関係数(空き家率×地価)", value: r.toFixed(2) },
        { rank: 2, name: "空き家率1位", value: `${topVac[0].name.split(" ").pop()} ${topVac[0].vac.toFixed(1)}%` },
        { rank: 3, name: "空き家率20%超かつ地価10万円超", value: `${highBoth}自治体` },
      ]}
    >
      <div style={box}>
        <h2>結論:関係はある。でも空き家率トップは「別荘地」だった</h2>
        <p>
          空き家率と地価の相関係数は<strong>{r.toFixed(2)}</strong>。
          地価が高い街ほど空き家が少ないという関係は、全国データでも
          確認できます。空き家率20%以上で地価が10万円/m²を超える自治体は
          {highBoth}件で、「人気の街に空き家があふれる」ことは起きていません。
        </p>
        <p>
          ところが、空き家率の上位を見ると話が変わります。衰退した
          過疎地が並ぶと思いきや、顔ぶれはリゾート地ばかりでした。
        </p>
      </div>

      <div style={box}>
        <h2>空き家率トップ5:軽井沢70%、熱海53%の正体</h2>
        {table(topVac)}
        <p>
          軽井沢町・那須町・熱海市・北杜市・白浜町。いずれも別荘地として
          知られる街です。理由は統計の定義にあります。住宅統計の
          「空き家」には、普段は人が住んでいない<strong>別荘などの
          二次的住宅</strong>が含まれます。別荘が多い街では、空き家率が
          50〜70%に達しても、それは衰退ではなく「別荘需要の強さ」の
          裏返しなのです。
        </p>
        <p>
          問題になる空き家は、賃貸にも売却にも出ていない「その他の空き家」
          (いわゆる放置空き家)です。空き家率という一つの数字は、
          別荘と放置空き家を区別できません。ニュースで空き家率だけを
          見て「この街は終わっている」と判断するのは早計です。
        </p>
      </div>

      <div style={box}>
        <h2>もう一つの例外:地価が安いのに空き家が少ない農村</h2>
        {table(cheapAndOccupied)}
        <p>
          逆の例外もあります。地価が2万円/m²未満なのに空き家率が
          10%未満の自治体です。益子町(栃木)や美郷町(秋田)のように、
          持ち家中心で賃貸市場が小さい地域では、家は代替わりしながら
          住み続けられ、統計上の空き家になりにくい。地価の安さが
          そのまま空き家の多さにはつながらない好例です。
        </p>
      </div>

      <div style={box}>
        <h2>読み解き:空き家率の正しい使い方</h2>
        <ol>
          <li>
            <strong>まず内訳を見る:</strong>
            別荘(二次的住宅)が多いのか、放置(その他)が多いのかで
            意味が正反対になります
          </li>
          <li>
            <strong>地価と組み合わせる:</strong>
            空き家率が高くても地価が下がりきっていない街は、需要が
            残っている可能性があります。この記事のように
            <Link prefetch={false} href="/ranking/real-estate-price" style={link}>
              地価ランキング
            </Link>
            と並べて見てください
          </li>
          <li>
            <strong>人口の増減と組み合わせる:</strong>
            空き家率が高く、人口も減り続けている街が、本当に対策が
            必要な「空き家問題の街」です
          </li>
        </ol>
        <p>
          空き家率そのものの順位は
          <Link prefetch={false} href="/ranking/vacant-house" style={link}>
            空き家率ランキング
          </Link>
          で確認できます。移住先として空き家バンクを使う場合は、
          この3点をチェックしてから候補を絞るのがおすすめです
          (手順は
          <Link prefetch={false} href="/articles/moving-city-data-guide" style={link}>
            移住先の選び方ガイド
          </Link>
          にまとめています)。
        </p>
      </div>

      <div style={box}>
        <h2>この分析の方法と限界</h2>
        <p>
          地価は自治体によって数万円から100万円超まで開くため、
          相関係数は地価を対数変換して計算しました(変換なしでは
          大都市の極端な値に引っ張られます)。空き家率は住宅統計の
          時点の値で、地価は直近の取引集計と、時点が完全には
          そろっていません。また空き家の内訳(二次的住宅・その他)は
          自治体別の公開範囲が限られるため、この記事では総量の
          空き家率で分析し、内訳は上位自治体の性質から考察しています。
        </p>
        <CompareCTA />
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
