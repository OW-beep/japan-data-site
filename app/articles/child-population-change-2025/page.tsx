import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { aggregatePrefs, getCensusChange, pctChange, signed, sum } from "@/lib/censusChange";

const MIN_CHILD = 300;

function headline() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;
  const inc = rows.filter((r) => r.child25 > r.child20).length;
  const total = pctChange(sum(rows, (r) => r.child20), sum(rows, (r) => r.child25)) ?? 0;
  return { n: rows.length, inc, share: (inc / rows.length) * 100, total };
}

export function generateMetadata() {
  const h = headline();
  return {
    alternates: { canonical: "/articles/child-population-change-2025" },
    title: h
      ? `子ども(15歳未満)が増えた市区町村は${h.share.toFixed(0)}%${h.share < 50 ? "だけ" : ""}｜令和7年国勢調査で2020年からの変化を調べた`
      : "子ども(15歳未満)が増えた市区町村はどこ？令和7年国勢調査で2020年からの変化を調べた",
    description:
      "令和2年と令和7年の国勢調査を自治体ごとに突き合わせて、15歳未満の人口の5年間の変化を計算しました。子どもが増えた自治体、減った自治体、総人口が増えても子どもは減った自治体を調べます。",
  };
}

export default function Page() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;

  const n = rows.length;
  const w = rows.map((r) => ({
    ...r,
    rate: pctChange(r.child20, r.child25),
    diff: r.child25 - r.child20,
    share20: (r.child20 / r.pop20) * 100,
    share25: r.pop25 > 0 ? (r.child25 / r.pop25) * 100 : 0,
  }));

  const inc = w.filter((r) => r.diff > 0);
  const dec = w.filter((r) => r.diff < 0);
  const share = (inc.length / n) * 100;

  const c20 = sum(rows, (r) => r.child20);
  const c25 = sum(rows, (r) => r.child25);
  const p20 = sum(rows, (r) => r.pop20);
  const p25 = sum(rows, (r) => r.pop25);
  const childRate = pctChange(c20, c25) ?? 0;
  const share20 = (c20 / p20) * 100;
  const share25 = (c25 / p25) * 100;

  const eligible = w.filter((r) => r.child20 >= MIN_CHILD && r.rate != null) as (typeof w[number] & { rate: number })[];
  const topRate = [...eligible].sort((a, b) => b.rate - a.rate).slice(0, 10);
  const topPeople = [...w].sort((a, b) => b.diff - a.diff).slice(0, 10);
  const worstRate = [...eligible].sort((a, b) => a.rate - b.rate).slice(0, 10);

  const popUpChildDown = w.filter((r) => r.pop25 > r.pop20 && r.child25 < r.child20);
  const popDownChildUp = w.filter((r) => r.pop25 < r.pop20 && r.child25 > r.child20);
  const popUp = w.filter((r) => r.pop25 > r.pop20).length;

  const prefs = aggregatePrefs(rows)
    .map((p) => ({ ...p, rate: pctChange(p.child20, p.child25) ?? 0 }))
    .sort((a, b) => b.rate - a.rate);
  const prefInc = prefs.filter((p) => p.rate > 0);

  const faq = [
    {
      q: "令和7年国勢調査で、子ども(15歳未満)の人口は、全国でどれくらい変わりましたか？",
      a: `比べられる${n.toLocaleString()}市区町村の合計で、15歳未満の人口は${c20.toLocaleString()}人から${c25.toLocaleString()}人になり、${signed(childRate)}%の変化でした。総人口に占める割合は、${share20.toFixed(1)}%から${share25.toFixed(1)}%になっています。`,
    },
    {
      q: "子どもの人口が増えた市区町村は、いくつありますか？",
      a: `${n.toLocaleString()}市区町村のうち、15歳未満の人口が増えたのは${inc.length.toLocaleString()}(約${share.toFixed(1)}%)、減ったのは${dec.length.toLocaleString()}です。`,
    },
    {
      q: "子どもが最も増えた(増加率が高い)市区町村はどこですか？",
      a:
        topRate.length > 0
          ? `2020年の15歳未満人口が${MIN_CHILD}人以上の自治体では${topRate[0].name}で、${signed(topRate[0].rate)}%(${topRate[0].child20.toLocaleString()}人→${topRate[0].child25.toLocaleString()}人)です。増えた人数が最も多いのは${topPeople[0].name}で、${signed(topPeople[0].diff, 0)}人です。`
          : "該当する自治体はありません。",
    },
    {
      q: "総人口が増えているのに、子どもが減っている自治体はありますか？",
      a: `あります。人口が増えた${popUp.toLocaleString()}市区町村のうち、15歳未満の人口が減ったのは${popUpChildDown.length.toLocaleString()}です。人口が増えても、増えたのが大人だけだった自治体もあります。`,
    },
  ];

  return (
    <ArticleLayout
      title={`子ども(15歳未満)が増えた市区町村は${share.toFixed(0)}%${share < 50 ? "だけ" : ""}｜令和7年国勢調査で2020年からの変化を調べた`}
      summary={`令和2年から令和7年の5年間で、15歳未満の人口が増えた市区町村は${n.toLocaleString()}のうち${inc.length.toLocaleString()}(約${share.toFixed(1)}%)でした。全体では${signed(childRate)}%の変化で、総人口に占める割合は${share20.toFixed(1)}%から${share25.toFixed(1)}%になっています。`}
      heroLabel="子どもが増えた市区町村"
      heroValue={`${inc.length.toLocaleString()} / ${n.toLocaleString()}`}
      rankingLink="/ranking/child"
      path="/articles/child-population-change-2025"
      tags={["population"]}
      publishedAt="2026-10-10"
      dataNote="令和2年・令和7年国勢調査(確定値)を自治体ごとに突き合わせて集計"
      top3={(topRate.length >= 3 ? topRate : topPeople).slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: r.rate != null ? `${signed(r.rate)}%` : `${signed(r.diff, 0)}人`,
      }))}
    >
      <div style={box}>
        <h2>結論:子どもが増えた市区町村は、{n.toLocaleString()}のうち{inc.length.toLocaleString()}(約{share.toFixed(1)}%)</h2>

        <p>
          15歳未満の人口を、令和2年と令和7年の国勢調査で、自治体ごとに突き合わせました。
          比べられる{n.toLocaleString()}市区町村のうち、<strong>増えたのは{inc.length.toLocaleString()}
          (約{share.toFixed(1)}%)、減ったのは{dec.length.toLocaleString()}</strong>です。
          合計では、{c20.toLocaleString()}人から{c25.toLocaleString()}人になり、
          <strong>{signed(childRate)}%</strong>の変化でした。総人口に占める割合(年少人口割合)は、
          {share20.toFixed(1)}%から{share25.toFixed(1)}%です。
        </p>
      </div>

      <div style={box}>
        <h2>子どもの増加率が高い自治体 上位10(2020年の15歳未満が{MIN_CHILD}人以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 480 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>自治体</th>
                <th style={thNum}>増減率</th>
                <th style={thNum}>2020年</th>
                <th style={thNum}>2025年</th>
                <th style={thNum}>年少人口割合(2025)</th>
              </tr>
            </thead>
            <tbody>
              {topRate.map((r, i) => (
                <tr key={r.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{signed(r.rate)}%</td>
                  <td style={tdNum}>{r.child20.toLocaleString()}</td>
                  <td style={tdNum}>{r.child25.toLocaleString()}</td>
                  <td style={tdNum}>{r.share25.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={note}>子どもの数が少ない自治体は、数十人の変化でも増減率が大きくなるため、除いています。</p>
      </div>

      <div style={box}>
        <h2>増えた人数が多い自治体 上位10</h2>

        <ol>
          {topPeople.map((r) => (
            <li key={r.code}>
              {r.name}:{signed(r.diff, 0)}人
              {r.rate != null ? `(増減率 ${signed(r.rate)}%)` : ""}
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>子どもが減った割合が大きい自治体 ワースト10</h2>

        <ol>
          {worstRate.map((r) => (
            <li key={r.code}>
              {r.name}:{signed(r.rate)}%({r.child20.toLocaleString()}人→{r.child25.toLocaleString()}人)
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>「人口は増えたのに、子どもは減った」自治体</h2>

        <p>
          総人口が増えた{popUp.toLocaleString()}市区町村のうち、<strong>{popUpChildDown.length.toLocaleString()}</strong>
          では、15歳未満の人口が減りました。反対に、総人口が減ったのに子どもが増えた自治体は
          {popDownChildUp.length.toLocaleString()}あります。人口の増減と、子どもの増減は、必ずしも一致しません。
        </p>

        {popUpChildDown.length > 0 && (
          <p style={note}>
            例:
            {[...popUpChildDown]
              .sort((a, b) => b.pop25 - b.pop20 - (a.pop25 - a.pop20))
              .slice(0, 5)
              .map((r) => `${r.name}(総人口 ${signed(r.pop25 - r.pop20, 0)}人、子ども ${signed(r.diff, 0)}人)`)
              .join("、")}
            (総人口の増加が大きい順)。
          </p>
        )}
      </div>

      <div style={box}>
        <h2>都道府県別:15歳未満の人口の増減率</h2>

        <p>
          自治体を都道府県ごとに合計すると、子どもが増えているのは
          {prefInc.length > 0 ? `${prefInc.map((p) => p.pref).join("、")}の${prefInc.length}都道府県` : "ありません"}
          です。減少率が大きいのは、{prefs.slice(-3).reverse().map((p) => `${p.pref}(${signed(p.rate)}%)`).join("、")}
          でした。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 440 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={thNum}>増減率</th>
                <th style={thNum}>2020年→2025年</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p, i) => (
                <tr key={p.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{p.pref}</td>
                  <td style={tdNum}>{signed(p.rate)}%</td>
                  <td style={tdNum}>
                    {p.child20.toLocaleString()}→{p.child25.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            総務省統計局「令和2年国勢調査」と「令和7年国勢調査(人口等基本集計・確定値)」の
            市区町村別の、15歳未満人口と総人口です。
          </li>
          <li>
            <strong>加工。</strong>
            2つの調査を、同じ地域コードの自治体どうしで突き合わせ、15歳未満人口の5年間の
            増減と増減率、年少人口割合を計算しました。
          </li>
          <li>
            <strong>限界。</strong>
            子どもの数は、出生・死亡だけでなく、転入・転出や、年齢が上がって15歳に達する人の
            数にも影響されます。合併や境界の変更があった自治体は、比べられない場合があります。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>Q&amp;A：子どもの人口の変化についてよくある質問</h2>

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
          令和2年から令和7年の5年間で、15歳未満の人口が増えた市区町村は{n.toLocaleString()}のうち
          {inc.length.toLocaleString()}(約{share.toFixed(1)}%)でした。全体の子どもの数は{signed(childRate)}%の
          変化で、総人口に占める割合も{share20.toFixed(1)}%から{share25.toFixed(1)}%になりました。
          子どもが増えている自治体の特徴は、出生率や子育て環境のデータとあわせて見ると、
          理由が見えてきます。
        </p>

        <p>
          <Link prefetch={false} href="/articles/population-change-2025" style={link}>
            人口が増えた市区町村はどこか
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/elderly-population-change-2025" style={link}>
            高齢者人口が減り始めた自治体
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/child" style={link}>
            子ども人口割合ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/birth-rate" style={link}>
            出生率ランキング
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
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 14 };
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f1f5f9" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
const note: React.CSSProperties = { fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
