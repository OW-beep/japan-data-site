import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities } from "@/lib/municipalities";
import { median } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/city-town-village-population" },
  title:
    "市・町・村の違いは人口5万人？人口が最も少ない市と、5万人を超える町村をデータで調べた",
  description:
    "市になる条件は人口5万人以上ですが、実際には5万人に満たない市も、5万人を超える町もあります。日本で最も人口が少ない市、人口が最も多い町・村を、国勢調査のデータで調べました。市・町・村の法律上の違いも解説します。",
};

type Kind = "市" | "町" | "村";

type Row = {
  code: string;
  name: string; // 都道府県込み
  short: string;
  kind: Kind;
  population: number;
};

function kindOf(short: string): Kind | null {
  if (short.endsWith("市")) return "市";
  if (short.endsWith("町")) return "町";
  if (short.endsWith("村")) return "村";
  return null; // 特別区など
}

const BANDS = [
  { label: "5,000人未満", min: 0, max: 5_000 },
  { label: "5,000人〜1万人未満", min: 5_000, max: 10_000 },
  { label: "1万人〜3万人未満", min: 10_000, max: 30_000 },
  { label: "3万人〜5万人未満", min: 30_000, max: 50_000 },
  { label: "5万人〜10万人未満", min: 50_000, max: 100_000 },
  { label: "10万人以上", min: 100_000, max: Infinity },
] as const;

export default function Page() {
  const rows: Row[] = [];
  for (const c of getMunicipalities()) {
    const short = c.name.split(" ").pop() ?? c.name;
    const kind = kindOf(short);
    if (!kind) continue;
    rows.push({
      code: c.code,
      name: c.name,
      short,
      kind,
      population: c.population,
    });
  }

  const cities = rows.filter((r) => r.kind === "市");
  const towns = rows.filter((r) => r.kind === "町");
  const villages = rows.filter((r) => r.kind === "村");

  if (cities.length < 10 || towns.length < 10 || villages.length < 3) return null;

  const asc = (a: Row, b: Row) => a.population - b.population;
  const desc = (a: Row, b: Row) => b.population - a.population;

  const citiesAsc = [...cities].sort(asc);
  const townsDesc = [...towns].sort(desc);
  const townsAsc = [...towns].sort(asc);
  const villagesDesc = [...villages].sort(desc);
  const villagesAsc = [...villages].sort(asc);

  const smallestCity = citiesAsc[0];
  const smallestTown = townsAsc[0];
  const smallestVillage = villagesAsc[0];
  const largestTown = townsDesc[0];
  const largestVillage = villagesDesc[0];

  const THRESHOLD = 50_000;
  const smallCities = cities.filter((r) => r.population < THRESHOLD);
  const bigTownsVillages = rows
    .filter((r) => r.kind !== "市" && r.population >= THRESHOLD)
    .sort(desc);

  const stats = (list: Row[]) => {
    const pops = list.map((r) => r.population);
    return {
      count: list.length,
      median: median(pops),
      min: Math.min(...pops),
      max: Math.max(...pops),
    };
  };
  const cityStats = stats(cities);
  const townStats = stats(towns);
  const villageStats = stats(villages);

  const fmt = (n: number) => n.toLocaleString();
  const ratio = (a: number, b: number) =>
    b > 0 ? (a / b).toFixed(a / b >= 10 ? 0 : 1) : "―";

  const bandRows = BANDS.map((b) => {
    const inBand = (r: Row) => r.population >= b.min && r.population < b.max;
    return {
      label: b.label,
      city: cities.filter(inBand).length,
      town: towns.filter(inBand).length,
      village: villages.filter(inBand).length,
    };
  });

  const villageBeatsCity = largestVillage.population > smallestCity.population;
  const cityRate = (smallCities.length / cities.length) * 100;

  const faq = [
    {
      q: "日本で一番人口が少ない市はどこですか？",
      a: `${smallestCity.name}で、${fmt(smallestCity.population)}人です(国勢調査)。人口が少ない市の下位10は、この記事の表で確認できます。`,
    },
    {
      q: "日本で一番人口が少ない町・村はどこですか？",
      a: `町では${smallestTown.name}(${fmt(smallestTown.population)}人)、村では${smallestVillage.name}(${fmt(smallestVillage.population)}人)が最も人口の少ない自治体です。`,
    },
    {
      q: "市になるには人口5万人以上が必要ですか？",
      a: `地方自治法では、市の要件の一つに人口5万人以上が定められています。ただし、合併に伴う特例などで要件が緩和された時期があり、このデータでは${cities.length}市のうち${smallCities.length}市(約${cityRate.toFixed(0)}%)が人口5万人未満です。市になったあとに人口が減っても、市でなくなるわけではありません。`,
    },
    {
      q: "人口5万人を超えている町や村はありますか？",
      a:
        bigTownsVillages.length > 0
          ? `あります。このデータでは${bigTownsVillages.length}町村が5万人以上で、最も多いのは${largestTown.population >= (largestVillage.population) ? largestTown.name : largestVillage.name}(${fmt(Math.max(largestTown.population, largestVillage.population))}人)です。町村は、都道府県の条例などで決まるため、人口が多くても町のままの自治体があります。`
          : "このデータでは、人口5万人以上の町村はありません。",
    },
    {
      q: "市・町・村の違いは何ですか？",
      a: "市には、人口5万人以上、中心市街地の戸数、商工業などの従事者の割合、都道府県条例で定める都市的施設といった要件が地方自治法で定められています。町は都道府県の条例で定める要件を満たす自治体で、村はそれ以外の自治体です。法律上の権限や事務の内容に大きな差はありません。",
    },
  ];

  return (
    <ArticleLayout
      title="市・町・村の違いは人口5万人？人口が最も少ない市と、5万人を超える町村をデータで調べた"
      summary={`日本で最も人口が少ない市は${smallestCity.name}(${fmt(smallestCity.population)}人)です。市は人口5万人以上が要件のはずですが、このデータでは${cities.length}市のうち${smallCities.length}市が5万人未満で、反対に5万人以上の町村も${bigTownsVillages.length}町村あります。`}
      heroLabel="人口が最も少ない市"
      heroValue={`${smallestCity.short}(${fmt(smallestCity.population)}人)`}
      rankingLink="/ranking/decrease"
      path="/articles/city-town-village-population"
      tags={["population", "geography"]}
      publishedAt="2026-10-02"
      top3={citiesAsc.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${fmt(r.population)}人`,
      }))}
    >
      <div style={box}>
        <h2>市・町・村の数と人口規模</h2>

        <p>
          国勢調査のデータにある市区町村のうち、市・町・村の数と人口規模は次のとおりです
          (東京都の特別区は市町村とは別の扱いのため除いています)。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>区分</th>
              <th style={thNum}>数</th>
              <th style={thNum}>人口の中央値(人)</th>
              <th style={thNum}>最小(人)</th>
              <th style={thNum}>最大(人)</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["市", cityStats],
                ["町", townStats],
                ["村", villageStats],
              ] as const
            ).map(([label, s]) => (
              <tr key={label}>
                <td style={{ ...td, fontWeight: 700 }}>{label}</td>
                <td style={tdNum}>{fmt(s.count)}</td>
                <td style={tdNum}>{fmt(Math.round(s.median))}</td>
                <td style={tdNum}>{fmt(s.min)}</td>
                <td style={tdNum}>{fmt(s.max)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 14 }}>
          最も人口が少ないのは、市が<strong>{smallestCity.name}</strong>(
          {fmt(smallestCity.population)}人)、町が{smallestTown.name}(
          {fmt(smallestTown.population)}人)、村が{smallestVillage.name}(
          {fmt(smallestVillage.population)}人)です。
        </p>
      </div>

      <div style={box}>
        <h2>人口が少ない市ランキング(下位10)</h2>

        <RankingBarChart
          items={citiesAsc.slice(0, 10).map((r) => ({
            name: r.name,
            value: r.population,
            displayValue: `${fmt(r.population)}人`,
          }))}
        />

        <p style={{ marginTop: 16 }}>
          市の要件の一つは人口5万人以上ですが、このデータでは{cities.length}市のうち
          <strong>{smallCities.length}市(約{cityRate.toFixed(0)}%)</strong>
          が5万人未満です。最も人口が少ない{smallestCity.short}は、市の中央値の約
          {ratio(cityStats.median, smallestCity.population)}分の1の規模です。
        </p>
      </div>

      <div style={box}>
        <h2>人口が多い町・村ランキング</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>町(人口の多い順 上位10)</th>
                <th style={thNum}>人口(人)</th>
                <th style={th}>村(人口の多い順 上位5)</th>
                <th style={thNum}>人口(人)</th>
              </tr>
            </thead>
            <tbody>
              {townsDesc.slice(0, 10).map((t, i) => {
                const v = villagesDesc[i];
                return (
                  <tr key={t.code}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}>{t.name}</td>
                    <td style={tdNum}>{fmt(t.population)}</td>
                    <td style={td}>{i < 5 && v ? v.name : ""}</td>
                    <td style={tdNum}>{i < 5 && v ? fmt(v.population) : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 14 }}>
          最も人口が多い町は{largestTown.name}({fmt(largestTown.population)}人)、
          最も多い村は{largestVillage.name}({fmt(largestVillage.population)}人)です。
          {villageBeatsCity
            ? `最も人口が多い村の${largestVillage.short}は、最も人口が少ない市の${smallestCity.short}より人口が多くなっています。「村は市より小さい」とは限りません。`
            : `最も人口が多い村でも、最も人口が少ない市の${smallestCity.short}(${fmt(smallestCity.population)}人)には届きません。`}
        </p>
      </div>

      <div style={box}>
        <h2>人口5万人以上なのに、市ではない町村</h2>

        {bigTownsVillages.length > 0 ? (
          <>
            <p>
              人口5万人以上でありながら、市になっていない町村は
              <strong>{bigTownsVillages.length}町村</strong>あります。
            </p>
            <ul>
              {bigTownsVillages.slice(0, 15).map((r) => (
                <li key={r.code}>
                  {r.name}({r.kind}):{fmt(r.population)}人
                </li>
              ))}
            </ul>
            {bigTownsVillages.length > 15 && (
              <p style={note}>
                人口の多い順に15の町村を掲載しています(全{bigTownsVillages.length})。
              </p>
            )}
            <p>
              市になるには、人口のほかに市街地の戸数や産業構造などの要件も満たし、
              自治体として市制を施行する手続きも必要です。人口が5万人を超えても、
              町や村のままの自治体がある理由の一つです。
            </p>
          </>
        ) : (
          <p>このデータでは、人口5万人以上の町村はありません。</p>
        )}
      </div>

      <div style={box}>
        <h2>人口帯別に見る、市・町・村の数</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 480 }}>
            <thead>
              <tr>
                <th style={th}>人口</th>
                <th style={thNum}>市</th>
                <th style={thNum}>町</th>
                <th style={thNum}>村</th>
              </tr>
            </thead>
            <tbody>
              {bandRows.map((b) => (
                <tr key={b.label}>
                  <td style={td}>{b.label}</td>
                  <td style={tdNum}>{fmt(b.city)}</td>
                  <td style={tdNum}>{fmt(b.town)}</td>
                  <td style={tdNum}>{fmt(b.village)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 14 }}>
          人口の規模で見ると、市・町・村は重なり合っています。「市は大きく、村は小さい」
          という傾向は確かにありますが、人口だけで市町村の区分を判断することは
          できません。
        </p>
      </div>

      <div style={box}>
        <h2>市・町・村の法律上の違い</h2>

        <p>
          地方自治法は、市になるための要件として、次の4つを挙げています。
        </p>

        <ul>
          <li>人口が5万人以上であること</li>
          <li>中心の市街地を形成している区域内の戸数が、全戸数の6割以上であること</li>
          <li>商工業などの都市的な業態に従事する人とその世帯員が、全人口の6割以上であること</li>
          <li>都道府県の条例で定める、都市としての要件を満たしていること</li>
        </ul>

        <p>
          町は、都道府県の条例で定める要件を満たす自治体で、村はそれ以外の自治体です。
          町と村の区分は、国の法律ではなく、都道府県ごとの条例が決めています。
        </p>

        <p>
          一方で、市・町・村の法律上の権限や事務の内容に、大きな違いはありません。
          違いが出るのは、福祉事務所の設置義務など、一部の事務に限られます。
        </p>

        <p>
          このデータで5万人未満の市が多いのは、平成の大合併のころに、合併で市になる
          場合の人口要件が緩和された時期があったことが背景にあります。また、市になった
          あとで人口が減っても、市でなくなる決まりはありません。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：市・町・村の人口についてよくある質問</h2>

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
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          市は人口5万人以上、という目安は、実際には当てはまらない例が少なくありません。
          人口が最も少ない市は{smallestCity.name}({fmt(smallestCity.population)}人)で、
          5万人未満の市は{smallCities.length}市、5万人以上の町村は
          {bigTownsVillages.length}町村あります。自治体の区分と人口の規模は、
          思ったよりも重なり合っています。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/decrease" style={link}>
            人口が少ない自治体ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            人口ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/prefectural-capital-population" style={link}>
            県庁所在地の人口を比較した記事
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/municipality-name-trivia" style={link}>
            自治体の名前の豆知識
          </Link>
        </p>

        <CompareCTA />
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

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 12,
  fontSize: 14,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const thNum: React.CSSProperties = { ...th, textAlign: "right" };

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
};

const tdNum: React.CSSProperties = { ...td, textAlign: "right" };

const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
