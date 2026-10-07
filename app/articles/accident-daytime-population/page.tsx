import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getDerivedData } from "@/lib/accidentDerived";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE } from "@/lib/trafficAccident";
import { pearson } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/accident-daytime-population" },
  title:
    "交通事故が多い街は、昼間人口で割ると入れ替わる？夜間人口あたりと昼間人口あたりを比べた",
  description:
    "人口あたりの交通事故ランキングでは、都心の区が上位に並びます。ところが昼間人口で割ると、順位は大きく入れ替わります。警察庁の事故データと国勢調査の昼間人口・夜間人口を組み合わせた、独自の加工データで調べました。",
};

const MIN_POPULATION = 10_000;

type R = {
  name: string;
  accidents: number;
  night: number;
  day: number;
  ratio: number; // 昼夜間人口比率(%)
  perNight: number; // 夜間人口1万人あたり
  perDay: number; // 昼間人口1万人あたり
  rankNight: number;
  rankDay: number;
};

function build(): R[] {
  const { rows } = getDerivedData();
  const base = rows
    .filter((r) => r.daytimePop2020 != null && r.daytimePop2020 > 0 && r.nightPop2020 >= MIN_POPULATION)
    .map((r) => ({
      name: r.name,
      accidents: r.accidents,
      night: r.nightPop2020,
      day: r.daytimePop2020 as number,
      ratio: ((r.daytimePop2020 as number) / r.nightPop2020) * 100,
      perNight: (r.accidents / r.nightPop2020) * 10_000,
      perDay: (r.accidents / (r.daytimePop2020 as number)) * 10_000,
      rankNight: 0,
      rankDay: 0,
    }));

  [...base].sort((a, b) => b.perNight - a.perNight).forEach((r, i) => (r.rankNight = i + 1));
  [...base].sort((a, b) => b.perDay - a.perDay).forEach((r, i) => (r.rankDay = i + 1));
  return base;
}

const fmt1 = (n: number) => n.toFixed(1);

/** 順位の動きを文にする(下がらない場合に「下がります」と書かないため) */
function moveWord(from: number, to: number): string {
  if (to > from) return `${from}位から${to}位に下がります`;
  if (to < from) return `${from}位から${to}位に上がります`;
  return `${from}位のまま変わりません`;
}

export default function Page() {
  const rows = build();
  if (rows.length < 100) return null;

  const { popLabel } = getDerivedData();
  const byNight = [...rows].sort((a, b) => a.rankNight - b.rankNight);
  const byDay = [...rows].sort((a, b) => a.rankDay - b.rankDay);

  const top = byNight[0];
  const topNightTen = byNight.slice(0, 10);

  // 夜間人口あたりの上位50のうち、昼間人口あたりで順位が大きく下がった自治体
  const drops = byNight
    .slice(0, 50)
    .map((r) => ({ ...r, move: r.rankDay - r.rankNight }))
    .sort((a, b) => b.move - a.move)
    .slice(0, 6);

  // 昼間人口あたりの上位10
  const topDayTen = byDay.slice(0, 10);

  // 昼夜間人口比率が高い(昼間に人が集まる)自治体の数
  const inflow = rows.filter((r) => r.ratio >= 120).length;

  const corr = pearson(
    rows.map((r) => Math.log10(r.ratio)),
    rows.map((r) => Math.log10(Math.max(r.perNight, 0.1) / Math.max(r.perDay, 0.1)))
  );

  const faq = [
    {
      q: "昼間人口とは何ですか？",
      a: "その地域に、昼間にいる人の数です。夜間人口(住んでいる人の数)から、他の地域へ通勤・通学で出ていく人を引き、他の地域から通勤・通学で入ってくる人を足して求めます。国勢調査で調べられています。",
    },
    {
      q: "なぜ、昼間人口で割ると順位が変わるのですか？",
      a: "都心の区のように、昼間に通勤・通学で人と車が集まる地域は、住んでいる人(夜間人口)が少ないのに、事故は昼間の人の動きに応じて起きます。夜間人口で割ると、件数が人口の割に多く見えます。昼間人口で割ると、その影響が小さくなります。",
    },
    {
      q: `夜間人口あたりの人身事故が最も多い自治体は、どこですか？`,
      a: `${top.name}で、夜間人口1万人あたり${fmt1(top.perNight)}件です。昼間人口で割ると${fmt1(top.perDay)}件になり、順位は${moveWord(top.rankNight, top.rankDay)}(人口1万人以上の${rows.length.toLocaleString()}自治体)。`,
    },
    {
      q: "昼間人口で割るほうが正しい指標ですか？",
      a: "どちらが正しいということはありません。住民1人あたりのリスクを見るなら夜間人口、その地域にいる人1人あたりのリスクを見るなら昼間人口が近い指標です。どちらにも、通過する車や観光客は含まれない、昼間人口は通勤・通学の人だけで買い物客などは含まれない、といった限界があります。",
    },
  ];

  return (
    <ArticleLayout
      title="交通事故が多い街は、昼間人口で割ると入れ替わる？夜間人口あたりと昼間人口あたりを比べた"
      summary={`夜間人口あたりの人身事故が最も多い${top.name}は、昼間人口で割ると順位が${moveWord(top.rankNight, top.rankDay).replace(/^\d+位から/, "").replace(/^\d+位のまま変わりません/, "変わりません")}。警察庁の事故データ(令和7年)と国勢調査の昼間人口を組み合わせて、順位がどう入れ替わるかを調べました。`}
      heroLabel={`${top.name}の順位(夜間→昼間)`}
      heroValue={`${top.rankNight}位 → ${top.rankDay}位`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/accident-daytime-population"
      tags={["population", "geography"]}
      publishedAt="2026-10-05"
      dataNote="警察庁の交通事故統計オープンデータ(令和7年)×令和2年国勢調査の昼間人口・夜間人口"
      top3={topNightTen.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `昼間では${r.rankDay}位`,
      }))}
    >
      <div style={box}>
        <h2>結論:「夜間人口あたり」の上位は、昼間人口で割ると大きく入れ替わる</h2>

        <p>
          人口1万人あたりの人身事故件数で比べるとき、ふつうは住んでいる人(夜間人口)で割ります。
          ところが、昼間に通勤・通学で人が集まる地域では、この割り方だと、件数が人口の割に
          多く見えてしまいます。そこで、{ACCIDENT_YEAR_LABEL}の事故件数を、夜間人口と昼間人口の
          両方で割って、順位を比べました。対象は人口1万人以上の{rows.length.toLocaleString()}自治体です。
        </p>

        <p>
          夜間人口あたりで最も多い<strong>{top.name}</strong>は、{fmt1(top.perNight)}件(1万人あたり)です。
          昼間人口が夜間人口の{(top.ratio / 100).toFixed(1)}倍あるため、昼間人口で割ると
          <strong>{fmt1(top.perDay)}件</strong>になり、順位は
          <strong>{moveWord(top.rankNight, top.rankDay)}</strong>。
        </p>
      </div>

      <div style={box}>
        <h2>夜間人口あたりの上位10と、昼間人口あたりの順位</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={th}>自治体</th>
                <th style={thNum}>昼夜間人口比率</th>
                <th style={thNum}>夜間人口あたり</th>
                <th style={thNum}>昼間人口あたり</th>
                <th style={thNum}>順位(夜間→昼間)</th>
              </tr>
            </thead>
            <tbody>
              {topNightTen.map((r) => (
                <tr key={r.name}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{r.ratio.toFixed(0)}%</td>
                  <td style={tdNum}>{fmt1(r.perNight)}件</td>
                  <td style={tdNum}>{fmt1(r.perDay)}件</td>
                  <td style={tdNum}>
                    {r.rankNight}位 → {r.rankDay}位
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={note}>件数は人身事故(1万人あたり)。昼夜間人口比率は、昼間人口が夜間人口の何%か(100%超なら昼間に人が集まる地域)です。</p>
      </div>

      <div style={box}>
        <h2>昼間人口で割ると、順位が大きく下がる自治体</h2>

        <p>
          夜間人口あたりの上位50自治体のうち、昼間人口で割ったときに順位が大きく下がるのは、
          次の自治体です。いずれも、昼間に通勤・通学で人が集まる地域です。
        </p>

        <ol>
          {drops.map((r) => (
            <li key={r.name}>
              {r.name}:{r.rankNight}位 → {r.rankDay}位(昼夜間人口比率{r.ratio.toFixed(0)}%)
            </li>
          ))}
        </ol>

        <p style={note}>
          昼夜間人口比率が120%以上の自治体は、対象の{rows.length.toLocaleString()}自治体のうち
          {inflow.toLocaleString()}あります。
          {corr != null
            ? `昼夜間人口比率と、2つの指標の差(対数の比)の相関係数は${corr.toFixed(2)}です。`
            : ""}
        </p>
      </div>

      <div style={box}>
        <h2>昼間人口あたりの上位10</h2>

        <p>
          反対に、昼間人口で割って初めて上位に出てくるのは、昼間に人が出ていく
          (昼夜間人口比率が低い)地域です。住んでいる人の割に、昼間の人が少なく見えるため、
          昼間人口あたりの件数が大きくなります。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>自治体</th>
                <th style={thNum}>昼間人口あたり</th>
                <th style={thNum}>夜間人口あたりの順位</th>
                <th style={thNum}>昼夜間人口比率</th>
              </tr>
            </thead>
            <tbody>
              {topDayTen.map((r) => (
                <tr key={r.name}>
                  <td style={td}>{r.rankDay}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{fmt1(r.perDay)}件</td>
                  <td style={tdNum}>{r.rankNight}位</td>
                  <td style={tdNum}>{r.ratio.toFixed(0)}%</td>
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
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の人身事故件数と、
            総務省統計局「令和2年国勢調査」の昼間人口・夜間人口です。
          </li>
          <li>
            <strong>加工。</strong>
            事故件数を、自治体ごとに夜間人口と昼間人口で割り、1万人あたりに直しました。
            政令指定都市の区は市に合算し、東京23区は区ごとに集計しています。
          </li>
          <li>
            <strong>限界。</strong>
            事故は2025年、昼間人口と夜間人口は2020年です。年が5年離れているため、
            人口が大きく変わった自治体では、実際と差が出ます。この記事で夜間人口を
            「令和2年国勢調査」に統一しているのも、昼間人口と同じ年で比べるためです。
            ランキングページの人口({popLabel})とは数字が異なります。
          </li>
          <li>
            昼間人口は通勤・通学の移動だけを反映しており、買い物客や観光客、通過する車は
            含まれません。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。昼間人口・夜間人口は総務省統計局「令和2年国勢調査」。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：昼間人口あたりの事故についてよくある質問</h2>

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
          人口あたりの事故は、何で割るかによって、順位が変わります。夜間人口あたりで
          1位の{top.name}は、昼間人口で割ると{top.rankDay}位でした。ランキングを見るときは、
          その自治体に昼間、人が集まる地域かどうかも合わせて確認すると、数字の意味が
          つかみやすくなります。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/daytime-ratio" style={link}>
            昼夜間人口比率ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/daytime-ratio-analysis" style={link}>
            昼夜間人口比率の分析記事
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
