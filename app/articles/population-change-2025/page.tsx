import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { isDesignatedCity } from "@/lib/designatedCities";
import { aggregatePrefs, getCensusChange, pctChange, signed, sum } from "@/lib/censusChange";
import { median } from "@/lib/rankingAnalysis";

const MIN_POP = 3_000;

function headline() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;
  const inc = rows.filter((r) => r.pop25 > r.pop20).length;
  const share = (inc / rows.length) * 100;
  const total = pctChange(sum(rows, (r) => r.pop20), sum(rows, (r) => r.pop25)) ?? 0;
  return { n: rows.length, inc, share, total };
}

export function generateMetadata() {
  const h = headline();
  return {
    alternates: { canonical: "/articles/population-change-2025" },
    title: h
      ? `令和7年国勢調査で人口が増えた市区町村は${h.share.toFixed(0)}%${h.share < 50 ? "だけ" : ""}｜2020年から2025年の人口増減を全国で比べた`
      : "令和7年国勢調査で人口が増えた市区町村はどこ？2020年から2025年の人口増減を全国で比べた",
    description:
      "令和2年と令和7年の国勢調査を自治体ごとに突き合わせて、5年間の人口増減を計算しました。人口が増えた市区町村・減った市区町村、都道府県別、人口規模別、政令指定都市の変化を一覧で比べます。",
  };
}

export default function Page() {
  const { rows, ok } = getCensusChange();
  if (!ok) return null;

  const n = rows.length;
  const withRate = rows.map((r) => ({ ...r, rate: pctChange(r.pop20, r.pop25) ?? 0, diff: r.pop25 - r.pop20 }));

  const inc = withRate.filter((r) => r.diff > 0);
  const dec = withRate.filter((r) => r.diff < 0);
  const share = (inc.length / n) * 100;

  const total20 = sum(rows, (r) => r.pop20);
  const total25 = sum(rows, (r) => r.pop25);
  const totalRate = pctChange(total20, total25) ?? 0;

  const big = withRate.filter((r) => r.pop20 >= MIN_POP);
  const topRate = [...big].sort((a, b) => b.rate - a.rate).slice(0, 10);
  const topPeople = [...withRate].sort((a, b) => b.diff - a.diff).slice(0, 10);
  const worstRate = [...big].sort((a, b) => a.rate - b.rate).slice(0, 10);

  const prefs = aggregatePrefs(rows)
    .map((p) => ({ ...p, rate: pctChange(p.pop20, p.pop25) ?? 0 }))
    .sort((a, b) => b.rate - a.rate);
  const prefInc = prefs.filter((p) => p.rate > 0);

  const BANDS = [
    { label: "5,000人未満", min: 0, max: 5_000 },
    { label: "5,000人〜2万人未満", min: 5_000, max: 20_000 },
    { label: "2万人〜10万人未満", min: 20_000, max: 100_000 },
    { label: "10万人以上", min: 100_000, max: Infinity },
  ];
  const bands = BANDS.map((b) => {
    const list = withRate.filter((r) => r.pop20 >= b.min && r.pop20 < b.max);
    return {
      label: b.label,
      count: list.length,
      inc: list.filter((r) => r.diff > 0).length,
      med: list.length ? median(list.map((r) => r.rate)) : NaN,
    };
  }).filter((b) => b.count > 0);

  const designated = withRate.filter((r) => isDesignatedCity(r.name)).sort((a, b) => b.rate - a.rate);

  const faq = [
    {
      q: "令和7年国勢調査で、人口が増えた市区町村はいくつありますか？",
      a: `2020年と2025年を比べられる${n.toLocaleString()}市区町村のうち、人口が増えたのは${inc.length.toLocaleString()}(約${share.toFixed(1)}%)、減ったのは${dec.length.toLocaleString()}です。`,
    },
    {
      q: "人口が最も増えた市区町村はどこですか？",
      a: `増加率が最も高いのは${topRate[0].name}で、${signed(topRate[0].rate)}%(${topRate[0].pop20.toLocaleString()}人→${topRate[0].pop25.toLocaleString()}人)です(2020年の人口が${MIN_POP.toLocaleString()}人以上の自治体)。増えた人数が最も多いのは${topPeople[0].name}で、${signed(topPeople[0].diff, 0)}人です。`,
    },
    {
      q: "人口が増えた都道府県はありますか？",
      a:
        prefInc.length > 0
          ? `あります。このデータでは、${prefInc.map((p) => `${p.pref}(${signed(p.rate)}%)`).join("、")}の${prefInc.length}都道府県で、自治体の合計が増えています。`
          : "このデータでは、人口が増えた都道府県はありません。",
    },
    {
      q: "2020年と2025年の数字は、同じ基準で比べられますか？",
      a: "どちらも国勢調査で、調査の方法は共通ですが、市町村の合併や境界の変更があると、単純には比べられません。この記事では、2つの調査の両方に同じ地域コードがある自治体だけを比べています。",
    },
  ];

  return (
    <ArticleLayout
      title={`令和7年国勢調査で人口が増えた市区町村は${share.toFixed(0)}%${share < 50 ? "だけ" : ""}｜2020年から2025年の人口増減を全国で比べた`}
      summary={`令和2年と令和7年の国勢調査を比べると、人口が増えた市区町村は${n.toLocaleString()}のうち${inc.length.toLocaleString()}(約${share.toFixed(1)}%)で、全体では${signed(totalRate)}%の変化でした。増加率の上位、都道府県別、政令指定都市の変化を一覧にしました。`}
      heroLabel="人口が増えた市区町村"
      heroValue={`${inc.length.toLocaleString()} / ${n.toLocaleString()}`}
      rankingLink="/ranking/population"
      path="/articles/population-change-2025"
      tags={["population"]}
      publishedAt="2026-10-10"
      dataNote="令和2年・令和7年国勢調査(確定値)を自治体ごとに突き合わせて集計"
      top3={topRate.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${signed(r.rate)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:人口が増えた市区町村は、{n.toLocaleString()}のうち{inc.length.toLocaleString()}(約{share.toFixed(1)}%)</h2>

        <p>
          令和7年国勢調査(確定値)の人口を、令和2年国勢調査と自治体ごとに突き合わせました。
          比べられる{n.toLocaleString()}市区町村のうち、<strong>人口が増えたのは{inc.length.toLocaleString()}
          (約{share.toFixed(1)}%)、減ったのは{dec.length.toLocaleString()}</strong>です。
          対象の合計人口は、{total20.toLocaleString()}人から{total25.toLocaleString()}人になり、
          <strong>{signed(totalRate)}%</strong>の変化でした。
        </p>

        <p style={note}>
          「比べられる市区町村」は、2つの調査の両方に同じ地域コードがあり、年齢まで取れた
          自治体です。政令指定都市は、区ではなく市全体で、東京23区は区ごとに数えています。
        </p>
      </div>

      <div style={box}>
        <h2>人口の増加率が高い自治体 上位10(2020年の人口{MIN_POP.toLocaleString()}人以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 480 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>自治体</th>
                <th style={thNum}>増減率</th>
                <th style={thNum}>2020年</th>
                <th style={thNum}>2025年</th>
              </tr>
            </thead>
            <tbody>
              {topRate.map((r, i) => (
                <tr key={r.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{signed(r.rate)}%</td>
                  <td style={tdNum}>{r.pop20.toLocaleString()}</td>
                  <td style={tdNum}>{r.pop25.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={note}>人口の少ない自治体は、数百人の変化でも増減率が大きくなるため、2020年の人口が{MIN_POP.toLocaleString()}人未満の自治体は除いています。</p>
      </div>

      <div style={box}>
        <h2>増えた人数が多い自治体 上位10</h2>

        <ol>
          {topPeople.map((r) => (
            <li key={r.code}>
              {r.name}:{signed(r.diff, 0)}人(増減率 {signed(r.rate)}%)
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>人口が減った割合が大きい自治体 ワースト10</h2>

        <ol>
          {worstRate.map((r) => (
            <li key={r.code}>
              {r.name}:{signed(r.rate)}%({r.pop20.toLocaleString()}人→{r.pop25.toLocaleString()}人)
            </li>
          ))}
        </ol>
        <p style={note}>2020年の人口が{MIN_POP.toLocaleString()}人以上の自治体が対象です。</p>
      </div>

      <div style={box}>
        <h2>都道府県別:人口の増減率</h2>

        <p>
          自治体の人口を都道府県ごとに合計すると、増えているのは
          {prefInc.length > 0
            ? `${prefInc.map((p) => p.pref).join("、")}の${prefInc.length}都道府県`
            : "ありません"}
          です。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={thNum}>増減率</th>
                <th style={thNum}>2020年→2025年</th>
                <th style={thNum}>増えた自治体</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p, i) => (
                <tr key={p.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{p.pref}</td>
                  <td style={tdNum}>{signed(p.rate)}%</td>
                  <td style={tdNum}>
                    {p.pop20.toLocaleString()}→{p.pop25.toLocaleString()}
                  </td>
                  <td style={tdNum}>
                    {p.popIncreased}/{p.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>人口規模別:大きい自治体ほど、増えているのか</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>2020年の人口</th>
              <th style={thNum}>自治体数</th>
              <th style={thNum}>増えた自治体</th>
              <th style={thNum}>増減率の中央値</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((b) => (
              <tr key={b.label}>
                <td style={td}>{b.label}</td>
                <td style={tdNum}>{b.count.toLocaleString()}</td>
                <td style={tdNum}>
                  {b.inc.toLocaleString()}({((b.inc / b.count) * 100).toFixed(0)}%)
                </td>
                <td style={tdNum}>{signed(b.med)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {designated.length >= 5 && (
        <div style={box}>
          <h2>政令指定都市{designated.length}市の人口の変化</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ ...table, minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={th}>市</th>
                  <th style={thNum}>増減率</th>
                  <th style={thNum}>2020年</th>
                  <th style={thNum}>2025年</th>
                </tr>
              </thead>
              <tbody>
                {designated.map((r) => (
                  <tr key={r.code}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                    <td style={tdNum}>{signed(r.rate)}%</td>
                    <td style={tdNum}>{r.pop20.toLocaleString()}</td>
                    <td style={tdNum}>{r.pop25.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            総務省統計局「令和2年国勢調査」と「令和7年国勢調査(人口等基本集計・確定値)」の
            市区町村別の人口です。
          </li>
          <li>
            <strong>加工。</strong>
            2つの調査の人口を、同じ地域コードの自治体どうしで突き合わせ、5年間の増減と
            増減率を計算しました。都道府県別の数字は、自治体の合計です。
          </li>
          <li>
            <strong>限界。</strong>
            合併や境界の変更があった自治体は、比べられない場合があります。人口の少ない
            自治体は、わずかな変化で増減率が大きく動きます。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>Q&amp;A：人口の増減についてよくある質問</h2>

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
          令和2年から令和7年の5年間で、人口が増えた市区町村は{n.toLocaleString()}のうち
          {inc.length.toLocaleString()}(約{share.toFixed(1)}%)でした。人口の動きは、地域によって大きく
          異なります。子どもと高齢者の変化は、あわせて次の記事で確かめています。
        </p>

        <p>
          <Link prefetch={false} href="/articles/child-population-change-2025" style={link}>
            子どもが増えた街はどこか
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/elderly-population-change-2025" style={link}>
            高齢者人口が減り始めた自治体
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            人口ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/decline" style={link}>
            社会増減率分析
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
