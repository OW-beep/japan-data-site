import Link from "next/link";
import { notFound } from "next/navigation";
import { isReleased, releaseDate } from "@/lib/release";

import ArticleLayout from "@/components/ArticleLayout";
import ClusterLinks from "@/components/ClusterLinks";
import JsonLd from "@/components/JsonLd";
import { isDesignatedCity } from "@/lib/designatedCities";
import {
  getCitiesPopWithTokyo23,
  getMunicipalitiesPop,
  shortName,
  changePct,
  type CityWithPop,
} from "@/lib/cityPopulation";

function getData() {
  const { rows, label, use2025 } = getCitiesPopWithTokyo23();
  const sorted = [...rows].sort((a, b) => b.population - a.population);
  const million = sorted.filter((c) => c.population >= 1_000_000);
  const below = sorted.filter((c) => c.population < 1_000_000);
  const byRate = [...million].sort((a, b) => changePct(b) - changePct(a));
  const inc = million.filter((c) => c.population > c.pop2020);
  const dec = million.filter((c) => c.population < c.pop2020);
  return { million, below, byRate, inc, dec, label, use2025 };
}

export function generateMetadata() {
  const { million, byRate, inc, use2025 } = getData();
  const top = byRate[0];
  const year = use2025 ? "2020→2025" : "最新";
  return {
    alternates: { canonical: "/articles/million-cities-population-change" },
    title: `100万人都市の人口増減(${year})｜増えたのは${million.length}市中${inc.length}市、最大は${shortName(top.name)}(+${changePct(top).toFixed(1)}%)`,
    description: `令和2年と令和7年の国勢調査を比べて、人口100万人以上の${million.length}都市の人口がどう変わったかを調べました。増えた都市・減った都市、100万人まであと一歩の千葉市の見通し、政令指定都市20市の増減ランキングまで。`,
  };
}

const sign = (n: number) => (n > 0 ? "+" : "");

export default function Page() {
  // 予約公開(lib/release.ts)。日付が来るまでは 404
  if (!isReleased("/articles/million-cities-population-change")) notFound();
  const { million, below, byRate, inc, dec, label, use2025 } = getData();
  const n = million.length;
  const top = byRate[0];
  const worst = byRate[byRate.length - 1];
  const flat = million.reduce((m, c) => (Math.abs(c.population - c.pop2020) < Math.abs(m.population - m.pop2020) ? c : m), million[0]);

  // 100万人まであと一歩の都市(2025年の人口が1位の「100万人未満」)
  const next = below[0];
  const gap = 1_000_000 - next.population;
  const perYear = (next.population - next.pop2020) / 5;
  const yearsToGo = perYear > 0 ? gap / perYear : null;

  // 政令指定都市20市の増減率
  const designated = getMunicipalitiesPop()
    .rows.filter((c) => isDesignatedCity(c.name))
    .sort((a, b) => changePct(b) - changePct(a));
  const designatedInc = designated.filter((c) => c.population > c.pop2020).length;

  const faq = [
    {
      q: "100万人都市の人口は、5年前より増えましたか？",
      a: `${label}と2020年を比べると、${n}都市のうち${inc.length}都市で増え、${dec.length}都市で減りました。合計では${sign(million.reduce((s, c) => s + c.population - c.pop2020, 0))}${(million.reduce((s, c) => s + c.population - c.pop2020, 0)).toLocaleString()}人の変化です。`,
    },
    {
      q: "人口の増加率が最も高い100万人都市はどこですか？",
      a: `${top.name}で、${top.pop2020.toLocaleString()}人から${top.population.toLocaleString()}人へ(${sign(changePct(top))}${changePct(top).toFixed(1)}%)。逆に最も減ったのは${worst.name}(${changePct(worst).toFixed(1)}%)です。`,
    },
    {
      q: `${shortName(next.name)}はいつ100万人になりますか？`,
      a:
        yearsToGo != null
          ? `${shortName(next.name)}の人口は${next.population.toLocaleString()}人で、100万人まであと${gap.toLocaleString()}人です。2020〜2025年の増え方(年平均${Math.round(perYear).toLocaleString()}人)がそのまま続くと仮定すれば約${yearsToGo.toFixed(1)}年後ですが、これは単純な計算で、実際の人口動態で変わります。`
          : `${shortName(next.name)}の人口は2020年から減っているため、現在の傾向では100万人には届きません。`,
    },
  ];

  return (
    <ArticleLayout
      title={`100万人都市の人口増減(2020年→2025年)｜増えたのは${n}市中${inc.length}市`}
      summary={`人口100万人以上の${n}都市を、令和2年と令和7年の国勢調査で比べました。増えたのは${inc.length}都市、減ったのは${dec.length}都市。増加率1位は${shortName(top.name)}(${sign(changePct(top))}${changePct(top).toFixed(1)}%)で、${shortName(next.name)}は100万人まであと${gap.toLocaleString()}人です。`}
      heroLabel="2020年より人口が増えた100万人都市"
      heroValue={`${inc.length} / ${n}都市`}
      rankingLink="/ranking/large-cities"
      path="/articles/million-cities-population-change"
      tags={["population"]}
      publishedAt={releaseDate("/articles/million-cities-population-change", "2026-10-15")}
      dataNote={`${label}(総務省統計局)と令和2年国勢調査の比較。東京都特別区部(23区の合計)は1都市として数えています。`}
      top3={byRate.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${sign(changePct(c))}${changePct(c).toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>{n}都市の人口増減(増加率順)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={{ ...th, textAlign: "left" }}>都市</th>
                <th style={thR}>2025年</th>
                <th style={thR}>2020年</th>
                <th style={thR}>増減(人)</th>
                <th style={thR}>増減率</th>
              </tr>
            </thead>
            <tbody>
              {byRate.map((c: CityWithPop, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{c.name}</td>
                  <td style={tdR}>{c.population.toLocaleString()}</td>
                  <td style={tdR}>{c.pop2020.toLocaleString()}</td>
                  <td style={tdR}>
                    {sign(c.population - c.pop2020)}
                    {(c.population - c.pop2020).toLocaleString()}
                  </td>
                  <td style={{ ...tdR, color: c.population >= c.pop2020 ? "#047857" : "#b91c1c", fontWeight: 700 }}>
                    {sign(changePct(c))}
                    {changePct(c).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>読み取れること</h2>
        <p>
          {n}都市のうち{inc.length}都市は増え、{dec.length}都市は減りました。増加率が最も高かったのは
          {top.name}で{sign(changePct(top))}
          {changePct(top).toFixed(1)}%、減少率が最も大きかったのは{worst.name}の{changePct(worst).toFixed(1)}%です。
          {flat.name}は{(flat.population - flat.pop2020).toLocaleString()}人(
          {changePct(flat).toFixed(2)}%)とほぼ横ばいでした。
        </p>
        <p>
          増えた都市と減った都市の分かれ目は、人口の規模ではありません。100万人都市であっても、5年間で人口が減った都市が
          半数あります。{use2025 ? "令和7年国勢調査の確定値" : "国勢調査"}では、100万人を超えていることと、人口が増えていることは別の話です。
        </p>
      </div>

      <div style={box}>
        <h2>{shortName(next.name)}は100万人に届くか</h2>
        <p>
          100万人まであと一歩の都市は{next.name}です。2025年の人口は{next.population.toLocaleString()}人で、
          100万人まであと<strong>{gap.toLocaleString()}人</strong>。2020年から{sign(changePct(next))}
          {changePct(next).toFixed(1)}%(年平均{sign(perYear)}
          {Math.round(perYear).toLocaleString()}人)の変化です。
          {yearsToGo != null && (
            <>
              {" "}
              この増え方が続くと仮定した単純な計算では、100万人到達まで約{yearsToGo.toFixed(1)}年です。ただし人口は転入・転出と出生・死亡で毎年変わるため、
              この計算はあくまで目安です。
            </>
          )}
        </p>
        <p>
          100万人にあと一歩の都市は、ほかに{below[1] ? shortName(below[1].name) : ""}(
          {below[1]?.population.toLocaleString()}人)、{below[2] ? shortName(below[2].name) : ""}(
          {below[2]?.population.toLocaleString()}人)などがあります。一覧は
          <Link prefetch={false} href="/articles/near-million-cities" style={link}>
            人口90万人・80万人都市一覧
          </Link>
          で見られます。
        </p>
      </div>

      <div style={box}>
        <h2>政令指定都市20市の人口増減ランキング</h2>
        <p>
          政令指定都市20市のうち、2020年から人口が増えたのは{designatedInc}市です(増加率順)。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={{ ...th, textAlign: "left" }}>市</th>
                <th style={thR}>2025年</th>
                <th style={thR}>増減率</th>
              </tr>
            </thead>
            <tbody>
              {designated.map((c, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, textAlign: "left" }}>{c.name}</td>
                  <td style={tdR}>{c.population.toLocaleString()}</td>
                  <td style={{ ...tdR, color: c.population >= c.pop2020 ? "#047857" : "#b91c1c", fontWeight: 700 }}>
                    {sign(changePct(c))}
                    {changePct(c).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      <div style={box}>
        <p>
          100万人都市の一覧(人口順)は
          <Link prefetch={false} href="/articles/million-cities" style={link}>
            日本の100万人都市一覧
          </Link>
          にまとめています。
        </p>
      </div>

      <ClusterLinks current="/articles/million-cities-population-change" />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
  lineHeight: 1.9,
};
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
