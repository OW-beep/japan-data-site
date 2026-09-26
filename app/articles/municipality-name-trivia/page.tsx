import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/municipality-name-trivia" },
  title: "動物の名前を持つ自治体、日本一長い地名の街｜地名で見る日本の自治体",
  description:
    "全国1,740市区町村の名前を1文字ずつ調べてみました。動物の漢字が入った自治体は61。日本一長い地名は「つくばみらい市」の7文字。地名という切り口から見えてくる、自治体のちょっとした物語を集めました。",
};

function cityName(fullName: string) {
  const parts = fullName.split(" ");
  return parts.length > 1 ? parts[1] : parts[0];
}

const ANIMAL_KANJI = new Set(
  "犬猫牛馬鹿熊猿鳥鶴亀蛇竜虎兎羊豚鶏鴨鷹鯉鮭鯖蟹貝雉狐狸猪鷲鵜燕雀鳩烏".split("")
);

export default function Page() {
  const cities = getMunicipalities();

  const withAnimal = cities
    .map((c) => {
      const name = cityName(c.name);
      const hits = [...name].filter((ch) => ANIMAL_KANJI.has(ch));
      return { c, name, hits };
    })
    .filter((x) => x.hits.length > 0)
    .sort((a, b) => b.c.population - a.c.population);

  const byLength = [...cities]
    .map((c) => ({ c, name: cityName(c.name) }))
    .sort((a, b) => b.name.length - a.name.length);

  const longest = byLength.slice(0, 8);
  const shortest = [...byLength].sort((a, b) => a.name.length - b.name.length);
  const shortestNames = shortest.filter((x) => x.name.length === shortest[0].name.length);

  const top10Animal = withAnimal.slice(0, 10);

  const faq = [
    {
      q: "動物の漢字が入った自治体はいくつありますか？",
      a: `全国1,740市区町村のうち、${withAnimal.length}の自治体名に動物を表す漢字が含まれていました。最も人口が多いのは${withAnimal[0].name}(${withAnimal[0].c.population.toLocaleString()}人)です。`,
    },
    {
      q: "日本一長い地名の自治体はどこですか？",
      a: `${longest[0].name}(${longest[0].name.length}文字)です。ひらがなと漢字が混ざった、市町村合併によって生まれた新しい地名に長いものが目立ちます。`,
    },
    {
      q: "日本一短い地名の自治体はどこですか？",
      a: `${shortest[0].name.length}文字の自治体が複数あり、${shortestNames
        .slice(0, 5)
        .map((x) => x.name)
        .join("・")}などが該当します。`,
    },
  ];

  return (
    <ArticleLayout
      title="動物の名前を持つ自治体、日本一長い地名の街｜地名で見る日本の自治体"
      summary={`全国1,740市区町村の名前を1文字ずつ調べると、動物の漢字が入った自治体が${withAnimal.length}見つかりました。日本一長い地名は「${longest[0].name}」(${longest[0].name.length}文字)。地名という切り口から、自治体のちょっとした物語を集めました。`}
      heroLabel="動物の名前を持つ自治体"
      heroValue={`${withAnimal.length}自治体`}
      rankingLink="/ranking/area"
      path="/articles/municipality-name-trivia"
      tags={["geography"]}
      publishedAt="2026-09-26"
      top3={top10Animal.slice(0, 3).map((x, i) => ({
        rank: i + 1,
        name: x.c.name,
        value: x.hits.join("・"),
      }))}
    >
      <div style={box}>
        <p style={lead}>
          自治体のランキングというと、人口や財政力といった数字の
          話ばかりになりがちですが、たまには少し違う切り口も。
          全国1,740市区町村の「名前」そのものを1文字ずつ調べて
          みたところ、いくつか面白い発見がありました。
        </p>
      </div>

      <div style={box}>
        <h2>動物の名前を持つ自治体は{withAnimal.length}</h2>

        <p>
          市区町村名に動物を表す漢字が含まれる自治体を探したところ、
          {withAnimal.length}見つかりました。もっとも人口が多いのは
          {withAnimal[0].name}({withAnimal[0].c.population.toLocaleString()}
          人、「{withAnimal[0].hits.join("・")}」)で、県庁所在地級の
          都市にも動物の名前は少なくありません。
        </p>

        <ul style={ul}>
          {top10Animal.map((x) => (
            <li key={x.c.code} style={li}>
              <strong>{x.name}</strong>({x.hits.join("・")}) ── 人口
              {x.c.population.toLocaleString()}人
            </li>
          ))}
        </ul>

        <p>
          小さな自治体にも味わい深い名前があります。山形県
          {" "}
          {(() => {
            const sake = withAnimal.find((x) => x.name === "鮭川村");
            return sake ? `${sake.name}(人口${sake.c.population.toLocaleString()}人)` : "鮭川村";
          })()}
          は、村内を流れる鮭川に由来する村名で、実際に秋になると
          鮭が遡上します。愛知県蟹江町、北海道猿払村、高知県
          馬路村など、その土地の自然や産業を映した名前が数多く
          見つかりました。
        </p>

        <PersonalNote>
          動物の名前を持つ自治体の中には、福島県大熊町のように、
          2011年の東京電力福島第一原発事故により長期間避難指示が
          続いた自治体も含まれています。名前の由来をたどると、
          楽しい発見だけでなく、その土地が歩んできた歴史に
          触れることもあります。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>日本一長い地名は「{longest[0].name}」</h2>

        <p>
          文字数でもっとも長い自治体名は{longest[0].name}
          ({longest[0].name.length}文字)でした。上位には、平成の
          市町村合併で新しく生まれた自治体が目立ちます。
        </p>

        <ul style={ul}>
          {longest.map((x) => (
            <li key={x.c.code} style={li}>
              <strong>{x.name}</strong>({x.name.length}文字) ── {x.c.name}
            </li>
          ))}
        </ul>

        <p>
          {longest[0].name}は2006年に茨城県伊奈町・谷和原村が
          合併して誕生した自治体で、つくばエクスプレス沿線と
          「未来」への期待を込めて名付けられました。旧町村名を
          そのまま残さず、まったく新しい名前を選んだ点が特徴的
          です。
        </p>

        <p>
          反対にもっとも短い地名は{shortest[0].name.length}文字で、
          {shortestNames
            .slice(0, 8)
            .map((x) => x.name)
            .join("・")}
          など{shortestNames.length}の自治体が該当します。短い
          地名は、古くからある地名をそのまま引き継いでいる
          ケースが多いようです。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：自治体の名前についてよくある質問</h2>

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
          自治体の名前は、その土地の自然・産業・歴史、そして
          時には合併という選択の跡を映す小さな記録です。人口や
          財政力のランキングだけでは見えてこない自治体の個性が、
          名前という切り口からも垣間見えます。
        </p>

        <p>
          <Link
            prefetch={false}
            href="/articles/duplicate-municipality-names"
            style={link}
          >
            同じ名前の自治体はいくつある？を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/area-analysis" style={link}>
            面積ランキング分析を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted, #6b7280)",
            marginTop: 16,
          }}
        >
          出典：本サイト集計(全国市区町村名一覧)。政令指定都市の区は
          独立した自治体ではないため対象外としています。
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

const ul: React.CSSProperties = {
  lineHeight: 1.9,
  paddingLeft: 20,
};

const li: React.CSSProperties = {
  marginBottom: 6,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
