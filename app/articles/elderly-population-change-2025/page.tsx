import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { aggregatePrefs, getCensusChange, pctChange, signed, sum } from "@/lib/censusChange";

const MIN_ELD = 300;
const MIN_POP = 3_000;

function headline() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;
  const dec = rows.filter((r) => r.eld25 < r.eld20).length;
  return { n: rows.length, dec, share: (dec / rows.length) * 100 };
}

export function generateMetadata() {
  const h = headline();
  return {
    alternates: { canonical: "/articles/elderly-population-change-2025" },
    title: h
      ? `高齢者(65歳以上)の人口が減った市区町村は${h.share.toFixed(0)}%｜令和7年国勢調査で高齢化率の変化を調べた`
      : "高齢者(65歳以上)の人口が減り始めた市区町村はどこ？令和7年国勢調査で高齢化率の変化を調べた",
    description:
      "令和2年と令和7年の国勢調査を自治体ごとに突き合わせて、65歳以上の人口と高齢化率の5年間の変化を計算しました。高齢者の人口が減った自治体、高齢化率が下がった自治体、現役世代の変化を調べます。",
  };
}

export default function Page() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;

  const n = rows.length;
  const w = rows.map((r) => ({
    ...r,
    eRate: pctChange(r.eld20, r.eld25),
    eDiff: r.eld25 - r.eld20,
    aging20: (r.eld20 / r.pop20) * 100,
    aging25: r.pop25 > 0 ? (r.eld25 / r.pop25) * 100 : 0,
    wDiff: r.work25 - r.work20,
  }));

  const eldDec = w.filter((r) => r.eDiff < 0);
  const eldInc = w.filter((r) => r.eDiff > 0);
  const share = (eldDec.length / n) * 100;

  const e20 = sum(rows, (r) => r.eld20);
  const e25 = sum(rows, (r) => r.eld25);
  const p20 = sum(rows, (r) => r.pop20);
  const p25 = sum(rows, (r) => r.pop25);
  const w20 = sum(rows, (r) => r.work20);
  const w25 = sum(rows, (r) => r.work25);
  const eRate = pctChange(e20, e25) ?? 0;
  const wRate = pctChange(w20, w25) ?? 0;
  const aging20 = (e20 / p20) * 100;
  const aging25 = (e25 / p25) * 100;

  const eldEligible = w.filter((r) => r.eld20 >= MIN_ELD && r.eRate != null) as (typeof w[number] & { eRate: number })[];
  const worstDec = [...eldEligible].sort((a, b) => a.eRate - b.eRate).slice(0, 10);

  const popEligible = w.filter((r) => r.pop20 >= MIN_POP);
  const agingUp = [...popEligible].sort((a, b) => b.aging25 - b.aging20 - (a.aging25 - a.aging20)).slice(0, 10);
  const agingDownList = popEligible.filter((r) => r.aging25 < r.aging20);
  const agingDownTop = [...agingDownList].sort((a, b) => a.aging25 - a.aging20 - (b.aging25 - b.aging20)).slice(0, 8);

  const workInc = w.filter((r) => r.wDiff > 0).length;

  const prefs = aggregatePrefs(rows)
    .map((p) => ({
      ...p,
      aging25: (p.eld25 / p.pop25) * 100,
      aging20: (p.eld20 / p.pop20) * 100,
    }))
    .sort((a, b) => b.aging25 - a.aging25);
  const prefTop = prefs.slice(0, 5);
  const prefBottom = prefs.slice(-5).reverse();

  const faq = [
    {
      q: "令和7年国勢調査で、高齢者(65歳以上)の人口は、全国でどれくらい変わりましたか？",
      a: `比べられる${n.toLocaleString()}市区町村の合計で、65歳以上の人口は${e20.toLocaleString()}人から${e25.toLocaleString()}人になり、${signed(eRate)}%の変化でした。高齢化率は${aging20.toFixed(1)}%から${aging25.toFixed(1)}%です。`,
    },
    {
      q: "高齢者の人口が減った市区町村は、いくつありますか？",
      a: `${n.toLocaleString()}市区町村のうち、65歳以上の人口が減ったのは${eldDec.length.toLocaleString()}(約${share.toFixed(1)}%)、増えたのは${eldInc.length.toLocaleString()}です。過疎が進み、高齢者そのものも減り始めている自治体があります。`,
    },
    {
      q: "高齢化率が下がった自治体は、ありますか？",
      a: `あります。2020年の人口が${MIN_POP.toLocaleString()}人以上の自治体のうち、高齢化率が下がったのは${agingDownList.length.toLocaleString()}です。若い世代が増えたり、高齢者が減ったりすると、割合が下がります。`,
    },
    {
      q: "15〜64歳の人口は、どう変わりましたか？",
      a: `15〜64歳の人口(年齢不詳を含む)は、合計で${w20.toLocaleString()}人から${w25.toLocaleString()}人になり、${signed(wRate)}%の変化でした。増えた市区町村は${workInc.toLocaleString()}です。`,
    },
  ];

  return (
    <ArticleLayout
      title={`高齢者(65歳以上)の人口が減った市区町村は${share.toFixed(0)}%｜令和7年国勢調査で高齢化率の変化を調べた`}
      summary={`令和2年から令和7年の5年間で、65歳以上の人口が減った市区町村は${n.toLocaleString()}のうち${eldDec.length.toLocaleString()}(約${share.toFixed(1)}%)でした。全体の高齢化率は${aging20.toFixed(1)}%から${aging25.toFixed(1)}%になっています。`}
      heroLabel="高齢者人口が減った市区町村"
      heroValue={`${eldDec.length.toLocaleString()} / ${n.toLocaleString()}`}
      rankingLink="/ranking/aging"
      path="/articles/elderly-population-change-2025"
      tags={["population", "aging"]}
      publishedAt="2026-10-10"
      dataNote="令和2年・令和7年国勢調査(確定値)を自治体ごとに突き合わせて集計"
      top3={prefTop.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        name: p.pref,
        value: `高齢化率 ${p.aging25.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:高齢者の人口が減った市区町村は、{n.toLocaleString()}のうち{eldDec.length.toLocaleString()}(約{share.toFixed(1)}%)</h2>

        <p>
          65歳以上の人口を、令和2年と令和7年の国勢調査で、自治体ごとに突き合わせました。
          比べられる{n.toLocaleString()}市区町村のうち、<strong>65歳以上の人口が減ったのは
          {eldDec.length.toLocaleString()}(約{share.toFixed(1)}%)</strong>、増えたのは{eldInc.length.toLocaleString()}です。
          合計では、{e20.toLocaleString()}人から{e25.toLocaleString()}人になり、
          <strong>{signed(eRate)}%</strong>の変化でした。高齢化率は、{aging20.toFixed(1)}%から
          <strong>{aging25.toFixed(1)}%</strong>になっています。
        </p>
      </div>

      <div style={box}>
        <h2>高齢者の人口が大きく減った自治体 ワースト10(2020年の65歳以上が{MIN_ELD}人以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 500 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>自治体</th>
                <th style={thNum}>増減率</th>
                <th style={thNum}>2020年→2025年</th>
                <th style={thNum}>高齢化率(2025)</th>
              </tr>
            </thead>
            <tbody>
              {worstDec.map((r, i) => (
                <tr key={r.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{signed(r.eRate)}%</td>
                  <td style={tdNum}>
                    {r.eld20.toLocaleString()}→{r.eld25.toLocaleString()}
                  </td>
                  <td style={tdNum}>{r.aging25.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={note}>
          高齢者が減っている自治体は、人口全体が大きく減っている場合も多く、高齢化率はむしろ
          高いままのこともあります。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率が最も上がった自治体 上位10(2020年の人口{MIN_POP.toLocaleString()}人以上)</h2>

        <ol>
          {agingUp.map((r) => (
            <li key={r.code}>
              {r.name}:{r.aging20.toFixed(1)}% → {r.aging25.toFixed(1)}%(
              {signed(r.aging25 - r.aging20)}ポイント)
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>高齢化率が下がった自治体</h2>

        <p>
          2020年の人口が{MIN_POP.toLocaleString()}人以上の自治体のうち、高齢化率が<strong>下がった</strong>のは
          {agingDownList.length.toLocaleString()}です。若い世代の流入や、高齢者の減少が、背景にあると
          考えられます。下がり幅が大きい自治体は、次のとおりです。
        </p>

        <ol>
          {agingDownTop.map((r) => (
            <li key={r.code}>
              {r.name}:{r.aging20.toFixed(1)}% → {r.aging25.toFixed(1)}%(
              {signed(r.aging25 - r.aging20)}ポイント)
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>15〜64歳(現役世代)の変化</h2>

        <p>
          15〜64歳の人口(年齢不詳を含む)は、合計で{w20.toLocaleString()}人から{w25.toLocaleString()}人に
          なり、<strong>{signed(wRate)}%</strong>の変化でした。増えた市区町村は{workInc.toLocaleString()}
          (約{((workInc / n) * 100).toFixed(1)}%)にとどまります。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別:2025年の高齢化率</h2>

        <p>
          自治体を都道府県ごとに合計した、2025年の高齢化率は、高い順に
          {prefTop.map((p) => `${p.pref}(${p.aging25.toFixed(1)}%)`).join("、")}です。
          低いのは、{prefBottom.map((p) => `${p.pref}(${p.aging25.toFixed(1)}%)`).join("、")}でした。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 440 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={thNum}>高齢化率(2025)</th>
                <th style={thNum}>2020年からの変化</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p, i) => (
                <tr key={p.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{p.pref}</td>
                  <td style={tdNum}>{p.aging25.toFixed(1)}%</td>
                  <td style={tdNum}>{signed(p.aging25 - p.aging20)}ポイント</td>
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
            市区町村別の、65歳以上人口・15歳未満人口・総人口です。
          </li>
          <li>
            <strong>加工。</strong>
            2つの調査を、同じ地域コードの自治体どうしで突き合わせ、65歳以上人口の増減、
            高齢化率の変化(ポイント)を計算しました。15〜64歳は、総人口から15歳未満と65歳以上を
            引いた値で、年齢不詳を含みます。
          </li>
          <li>
            <strong>限界。</strong>
            高齢者の人数は、亡くなる人、転出入する人、65歳に達する人の数で決まります。
            合併や境界の変更があった自治体は、比べられない場合があります。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>Q&amp;A：高齢者の人口の変化についてよくある質問</h2>

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
          令和2年から令和7年の5年間で、65歳以上の人口が減った市区町村は{n.toLocaleString()}のうち
          {eldDec.length.toLocaleString()}(約{share.toFixed(1)}%)でした。全体の高齢化率は{aging20.toFixed(1)}%から
          {aging25.toFixed(1)}%になり、15〜64歳は{signed(wRate)}%の変化です。高齢化の進み方も、
          地域によって大きく異なります。
        </p>

        <p>
          <Link prefetch={false} href="/articles/population-change-2025" style={link}>
            人口が増えた市区町村はどこか
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/child-population-change-2025" style={link}>
            子どもが増えた街はどこか
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/aging" style={link}>
            高齢化率ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/aging-top50" style={link}>
            高齢化率ランキングTOP50
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
