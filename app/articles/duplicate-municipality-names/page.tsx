import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/duplicate-municipality-names" },
  title: "同じ名前の自治体はいくつある？｜池田町は全国に4つ",
  description:
    "全国1,740市区町村の名前を調べると、25組・57自治体で名前が重複していることが分かりました。「池田町」は北海道・福井県・長野県・岐阜県の4つに存在し、人口は10倍以上違います。",
};

export default function Page() {
  const cities = getMunicipalities();
  const byName = new Map(cities.map((c) => [c.name, c]));

  const ikedaNames = [
    "北海道 池田町",
    "福井県 池田町",
    "長野県 池田町",
    "岐阜県 池田町",
  ];
  const ikeda = ikedaNames.map((n) => byName.get(n)!).filter(Boolean);
  const ikedaSorted = [...ikeda].sort((a, b) => b.population - a.population);

  const pairs: { label: string; names: string[]; note: string }[] = [
    {
      label: "府中市",
      names: ["東京都 府中市", "広島県 府中市"],
      note: "東京の府中市は競馬場やケヤキ並木で知られるベッドタウン、広島の府中市は家具・木工業で栄えた「ふちゅう」です。読み方は同じですが、人口は7倍近く違います。",
    },
    {
      label: "伊達市",
      names: ["北海道 伊達市", "福島県 伊達市"],
      note: "どちらも仙台藩祖・伊達政宗ゆかりの地名です。福島県伊達市はもともとの伊達氏発祥の地、北海道伊達市は明治時代に旧仙台藩・亘理伊達家の家臣団が開拓した町で、名付けの経緯そのものが繋がっています。",
    },
    {
      label: "森町",
      names: ["北海道 森町", "静岡県 森町"],
      note: "全国で唯一「町」を「ちょう」ではなく「まち」と読む北海道森町と、遠州森の石松で知られる静岡県森町。読み方(森町/もりまち・もりまち)は同じでも由来は無関係です。",
    },
  ];

  const otherTriosAndMore = [
    ["美里町", 3],
    ["美浜町", 3],
    ["美郷町", 3],
    ["南部町", 3],
    ["朝日町", 3],
  ] as const;

  const faq = [
    {
      q: "同じ名前の自治体は、全国にいくつありますか？",
      a: "全国1,740市区町村(東京都特別区部・政令指定都市の区を除く)のうち、25組・57自治体で名前が重複しています。最も多いのは「池田町」で、北海道・福井県・長野県・岐阜県の4つに存在します。",
    },
    {
      q: "なぜ同じ名前の市区町村が存在できるのですか？",
      a: "地方自治法上、市区町村の名前が重複してはいけないのは同じ都道府県内だけで、異なる都道府県であれば同じ名前を使うことができます。「府中市」(東京都・広島県)や「伊達市」(北海道・福島県)のように、歴史的な由来から同じ地名が離れた場所に付けられたケースも多くあります。",
    },
    {
      q: "同じ名前でも人口は同じくらいですか？",
      a: `いいえ、大きく異なります。「池田町」は最大の${ikedaSorted[0].name}(人口${ikedaSorted[0].population.toLocaleString()}人)と最小の${ikedaSorted[3]?.name}(人口${ikedaSorted[3]?.population.toLocaleString()}人)で、人口に約${Math.round(
        ikedaSorted[0].population / (ikedaSorted[3]?.population || 1)
      )}倍の差があります。`,
    },
  ];

  return (
    <ArticleLayout
      title="同じ名前の自治体はいくつある？｜「池田町」は全国に4つ"
      summary="全国1,740市区町村の名前を調べたところ、25組・57自治体で名前が重複していました。最多は「池田町」の4自治体で、人口は最大10倍近く違います。"
      heroLabel="名前が重複している自治体グループの数"
      heroValue="25組"
      rankingLink="/ranking/population"
      path="/articles/duplicate-municipality-names"
      tags={["population"]}
      publishedAt="2026-09-13"
      top3={[
        { rank: 1, name: "池田町", value: "4自治体" },
        { rank: 2, name: "美里町・美浜町・美郷町など", value: "3自治体" },
        { rank: 3, name: "府中市・伊達市・森町など", value: "2自治体" },
      ]}
    >
      <div style={box}>
        <h2>全国で最多、「池田町」は4つある</h2>

        <p>
          全国1,740市区町村(政令指定都市の区、東京都特別区部を除く)
          の名前を集計すると、25組・57自治体で名前がまったく同じ
          自治体が存在することが分かりました。最も多いのは
          「池田町」で、北海道・福井県・長野県・岐阜県の4道県に
          存在します。
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>自治体名</th>
              <th style={th}>人口</th>
              <th style={th}>面積</th>
            </tr>
          </thead>
          <tbody>
            {ikedaSorted.map((c) => (
              <tr key={c.name}>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.population.toLocaleString()}人</td>
                <td style={td}>{c.area}km²</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          同じ「池田町」でも、最大の{ikedaSorted[0].name}
          (人口{ikedaSorted[0].population.toLocaleString()}人)と
          最小の{ikedaSorted[3]?.name}
          (人口{ikedaSorted[3]?.population.toLocaleString()}人)では、
          人口に約
          {Math.round(
            ikedaSorted[0].population / (ikedaSorted[3]?.population || 1)
          )}
          倍の差があります。面積も
          {ikedaSorted
            .slice()
            .sort((a, b) => (b.area ?? 0) - (a.area ?? 0))[0].name}
          は{ikedaSorted.slice().sort((a, b) => (b.area ?? 0) - (a.area ?? 0))[0].area}
          km²と、最も小さい町の10倍近くに達します。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ同じ名前の自治体が存在できるのか</h2>

        <p>
          地方自治法上、市区町村の名前が重複してはいけないのは
          「同じ都道府県内」だけです。異なる都道府県であれば、
          同じ名前の市区町村が存在しても問題ありません。実際、
          今回のような有名な重複例には、それぞれ興味深い由来が
          あります。
        </p>

        {pairs.map((pair) => {
          const items = pair.names.map((n) => byName.get(n)).filter(Boolean);
          return (
            <div className="pull-note" key={pair.label}>
              <strong>{pair.label}</strong>
              <div style={{ margin: "8px 0" }}>
                {items.map((c) => (
                  <span className="stat-chip" key={c!.name}>
                    {c!.name}(人口{c!.population.toLocaleString()}人)
                  </span>
                ))}
              </div>
              {pair.note}
            </div>
          );
        })}
      </div>

      <div style={box}>
        <h2>3つある地名も5組</h2>

        <p>
          4つの「池田町」に次いで、3つの自治体で同じ名前を
          持つグループが5組あります。
        </p>

        <div style={{ margin: "12px 0" }}>
          {otherTriosAndMore.map(([name]) => (
            <span className="stat-chip" key={name}>
              {name}
            </span>
          ))}
        </div>

        <p>
          「美」の字がつく地名(美里町・美浜町・美郷町)が3組の
          うち3つを占めているのも面白い偶然です。景観の良さを
          アピールする「美」の字は、全国の自治体が好んで使う
          縁起の良い漢字だということがうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：同じ名前の自治体についてよくある質問</h2>

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
          同じ名前の自治体でも、人口や面積、成り立ちはまったく
          異なります。統計データを見るときに「どの県の、どの
          自治体か」を意識することの大切さを、この重複地名の
          存在はあらためて教えてくれます。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/population" style={link}>
            人口ランキングを見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/search" style={link}>
            自治体検索を見る
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)",
  padding: "20px 24px",
  border: "1px solid var(--line)",
  marginBottom: 20,
};

const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "2px solid var(--line)",
  padding: "8px 6px",
  fontSize: 14,
};

const td: React.CSSProperties = {
  borderBottom: "1px solid var(--line)",
  padding: "8px 6px",
  fontSize: 14,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
  textDecoration: "underline",
};
