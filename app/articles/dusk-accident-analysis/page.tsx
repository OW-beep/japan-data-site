import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE, national } from "@/lib/trafficAccident";

/** 楽天ブロックの取得に失敗しても、6時間以内に自動で再生成されるようにする */
export const revalidate = 21600;

export const metadata = {
  alternates: { canonical: "/articles/dusk-accident-analysis" },
  title:
    "日が短くなる秋、交通事故が増えるのは何時？日没前後の事故の割合を月別に調べた",
  description:
    "警察庁の交通事故データ(令和7年)で、日没の前後に起きた事故の割合を月別に集計しました。10月は6月の約2倍。夕暮れから夜に歩行者の事故が死亡事故になりやすいことも、データから確かめます。",
};

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const DAY_NIGHT: { code: string; label: string }[] = [
  { code: "11", label: "昼-明" },
  { code: "12", label: "昼-昼" },
  { code: "13", label: "昼-暮" },
  { code: "21", label: "夜-暮" },
  { code: "22", label: "夜-夜" },
  { code: "23", label: "夜-明" },
];

const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);
const hhmm = (min: number) => `${Math.floor(min / 60)}:${String(Math.round(min % 60)).padStart(2, "0")}`;

export default function Page() {
  const m = national.monthly;
  if (!m || m.length !== 12 || !national.hourByMonth) return null;

  const rows = m.map((x, i) => ({
    month: MONTHS[i],
    accidents: x.accidents,
    dusk: pct(x.dusk, x.accidents),
    near: pct(x.nearSunset, x.accidents),
    sunset: x.accidents > 0 ? x.sunsetMinutesSum / x.accidents : 0,
  }));

  const maxDusk = rows.reduce((a, b) => (b.dusk > a.dusk ? b : a));
  const minDusk = rows.reduce((a, b) => (b.dusk < a.dusk ? b : a));
  const ratio = minDusk.dusk > 0 ? maxDusk.dusk / minDusk.dusk : 0;
  const oct = rows[9];
  const jun = rows[5];

  // 時間帯別の割合: 10〜12月と6〜8月
  const hourShare = (months: number[]) => {
    const h = Array(24).fill(0);
    for (const mi of months) national.hourByMonth[mi].forEach((v, i) => (h[i] += v));
    const total = h.reduce((a, b) => a + b, 0);
    return h.map((v) => pct(v, total));
  };
  const autumn = hourShare([9, 10, 11]);
  const summer = hourShare([5, 6, 7]);
  const hours = [14, 15, 16, 17, 18, 19, 20];
  const autumn1618 = autumn[16] + autumn[17] + autumn[18];
  const summer1618 = summer[16] + summer[17] + summer[18];

  // 歩行者の事故(人対車両)の昼夜別
  const ped = DAY_NIGHT.map((d) => {
    const v = national.pedestrianByDayNight[d.code] ?? { accidents: 0, fatalAccidents: 0 };
    return { ...d, accidents: v.accidents, fatal: v.fatalAccidents, rate: pct(v.fatalAccidents, v.accidents) };
  });
  const base = ped.find((p) => p.code === "12")!;
  const night = ped.find((p) => p.code === "22")!;
  const nightRatio = base.rate > 0 ? night.rate / base.rate : 0;

  const faq = [
    {
      q: "交通事故は、何時ごろに多いですか？",
      a: `令和7年のデータでは、10〜12月は17時台が最も多く、1日の人身事故の約${autumn[17].toFixed(1)}%がこの1時間に起きています。6〜8月の17時台は約${summer[17].toFixed(1)}%でした。日没の時刻が、帰宅の時間帯と重なる秋から冬に、夕方の事故の割合が高くなります。`,
    },
    {
      q: "「薄暮」とは何ですか？",
      a: "日没の前後の、明るさが変わる時間帯のことです。警察庁の事故データでは、昼夜の区分に「暮」という区分があり、この記事では、昼-暮と夜-暮の事故を「薄暮の事故」として数えています。",
    },
    {
      q: "薄暮の事故の割合が最も高い月はいつですか？",
      a: `${maxDusk.month}で、人身事故の約${maxDusk.dusk.toFixed(1)}%が薄暮に起きています。最も低いのは${minDusk.month}で約${minDusk.dusk.toFixed(1)}%です(約${ratio.toFixed(1)}倍の差)。`,
    },
    {
      q: "夜の歩行者の事故は、昼より危険ですか？",
      a: `このデータでは、歩行者が関わる事故(人対車両)のうち死亡事故になった割合は、昼間(昼-昼)が約${base.rate.toFixed(2)}%、夜間(夜-夜)が約${night.rate.toFixed(2)}%で、夜間は約${nightRatio.toFixed(1)}倍です。ただし、速度や道路の条件など、ほかの違いも影響していると考えられます。`,
    },
  ];

  return (
    <ArticleLayout
      title="日が短くなる秋、交通事故が増えるのは何時？日没前後の事故の割合を月別に調べた"
      summary={`日没の前後に起きる人身事故(薄暮の事故)は、${maxDusk.month}が全体の約${maxDusk.dusk.toFixed(1)}%、${minDusk.month}は約${minDusk.dusk.toFixed(1)}%で、約${ratio.toFixed(1)}倍の差があります。夜の歩行者の事故が、死亡事故になりやすい傾向も、データから確かめました。`}
      heroLabel={`薄暮の事故の割合(${maxDusk.month} / ${minDusk.month})`}
      heroValue={`${maxDusk.dusk.toFixed(1)}% / ${minDusk.dusk.toFixed(1)}%`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/dusk-accident-analysis"
      tags={["geography"]}
      publishedAt="2026-10-08"
      dataNote={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})を集計`}
      top3={[
        { rank: 1, name: `${maxDusk.month}の薄暮の事故`, value: `${maxDusk.dusk.toFixed(1)}%` },
        { rank: 2, name: `${minDusk.month}の薄暮の事故`, value: `${minDusk.dusk.toFixed(1)}%` },
        { rank: 3, name: "10〜12月の16〜18時台の事故", value: `${autumn1618.toFixed(1)}%` },
      ]}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して購入された場合、
        当サイトが報酬を受け取ることがあります。データの分析内容は、広告主の
        意向とは関係ありません。
      </p>

      <div style={box}>
        <h2>結論:日没が帰宅の時間と重なる10月ごろ、薄暮の事故の割合が最も高くなる</h2>

        <p>
          警察庁の事故データ({ACCIDENT_YEAR_LABEL}・本票)には、事故が起きた時刻と、その地点の
          日没の時刻が記録されています。ここから「日没の前後に起きた事故の割合」を月ごとに
          計算すると、<strong>{maxDusk.month}は約{maxDusk.dusk.toFixed(1)}%、{minDusk.month}は約
          {minDusk.dusk.toFixed(1)}%</strong>でした。約{ratio.toFixed(1)}倍の差です。
          日没の時刻が、通勤・通学からの帰宅の時間帯に入ってくる秋に、薄暮の事故の割合が高く
          なります。
        </p>

        <p style={note}>
          「薄暮の事故」は、警察庁の昼夜の区分で「暮」にあたる事故(昼-暮と夜-暮)です。
          「日没前後1時間」は、事故の発生時刻が、その地点の日没時刻の60分前から60分後までに
          入る事故です。
        </p>
      </div>

      <div style={box}>
        <h2>月別:薄暮の事故の割合と、事故地点の平均日没時刻</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>月</th>
                <th style={thNum}>人身事故(件)</th>
                <th style={thNum}>薄暮の事故の割合</th>
                <th style={thNum}>日没前後1時間の割合</th>
                <th style={thNum}>平均の日没時刻</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.month}>
                  <td style={td}>{r.month}</td>
                  <td style={tdNum}>{r.accidents.toLocaleString()}</td>
                  <td style={tdNum}>{r.dusk.toFixed(1)}%</td>
                  <td style={tdNum}>{r.near.toFixed(1)}%</td>
                  <td style={tdNum}>{hhmm(r.sunset)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 14 }}>
          平均の日没時刻は、{oct.month}が{hhmm(oct.sunset)}、{rows[11].month}は
          {hhmm(rows[11].sunset)}で、{jun.month}の{hhmm(jun.sunset)}と比べて、約
          {Math.round((jun.sunset - rows[11].sunset) / 60)}時間早くなります。
        </p>
        <p style={note}>平均の日没時刻は、各事故が起きた地点の日没時刻を、その月の事故件数で平均した値です(事故の多い地域に寄ります)。</p>
      </div>

      <div style={box}>
        <h2>時間帯別:秋は夕方の事故の割合が高い</h2>

        <p>
          1日の人身事故のうち、各時間帯に起きる割合を、10〜12月と6〜8月で比べました。
          16〜18時台の合計は、10〜12月が約<strong>{autumn1618.toFixed(1)}%</strong>、
          6〜8月が約{summer1618.toFixed(1)}%です。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>時間帯</th>
              <th style={thNum}>10〜12月</th>
              <th style={thNum}>6〜8月</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h}>
                <td style={td}>
                  {h}時台
                </td>
                <td style={tdNum}>{autumn[h].toFixed(1)}%</td>
                <td style={tdNum}>{summer[h].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={box}>
        <h2>夕暮れから夜は、歩行者の事故が死亡事故になりやすい</h2>

        <p>
          歩行者が関わる事故(人対車両)について、昼夜の区分ごとに、死亡事故になった割合を
          集計しました。昼間の「昼-昼」が約{base.rate.toFixed(2)}%なのに対して、夜間の
          「夜-夜」は約<strong>{night.rate.toFixed(2)}%</strong>で、約{nightRatio.toFixed(1)}倍です。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>昼夜の区分</th>
              <th style={thNum}>人対車両の事故(件)</th>
              <th style={thNum}>うち死亡事故(件)</th>
              <th style={thNum}>死亡事故の割合</th>
            </tr>
          </thead>
          <tbody>
            {ped.map((p) => (
              <tr key={p.code}>
                <td style={td}>{p.label}</td>
                <td style={tdNum}>{p.accidents.toLocaleString()}</td>
                <td style={tdNum}>{p.fatal.toLocaleString()}</td>
                <td style={tdNum}>{p.rate.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={note}>
          「昼」「夜」は日の出・日没を境にした昼夜、「明」「暮」は日の出・日没の前後にあたる
          区分です。「夜-明」は件数が少なく、割合が不安定です。死亡事故は、事故から24時間以内に
          死者が出た事故です。
        </p>
      </div>

      <div style={box}>
        <h2>夕暮れ・夜の外出で:できること</h2>

        <ul>
          <li>
            <strong>反射材を身につける。</strong>
            歩行者の場合、反射材を着けていると、車の運転者から見つけやすくなるとされています。
            靴、バッグ、衣服など、動く部分に着けると目立ちます。
          </li>
          <li>
            <strong>自転車は、早めにライトをつける。</strong>
            日没の前後は、周囲が明るく見えても、運転者からは見えにくいことがあります。
          </li>
          <li>
            <strong>車を運転するときは、早めのライト点灯を。</strong>
            日没の時刻は、秋から冬にかけて急に早くなります。
          </li>
        </ul>
      </div>

      <RakutenGifts
        keyword="反射材"
        heading="夕暮れ・夜の外出に:反射材を楽天市場で見る"
      />

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の、発生日時・昼夜・
            日の入り時刻・事故類型・事故の内容(死亡/負傷)です。
          </li>
          <li>
            <strong>加工。</strong>
            事故の発生時刻と、その地点の日没時刻の差を計算し、日没の前後60分以内の事故を
            数えました。昼夜の区分の「暮」は、警察庁の区分をそのまま使っています。
          </li>
          <li>
            <strong>限界。</strong>
            事故の件数であり、交通量(通る人や車の数)は含まれていません。夕方の事故の割合が
            高いのは、その時間帯の交通量が多いことも影響しています。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：薄暮の事故についてよくある質問</h2>

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
          薄暮の事故の割合は、{maxDusk.month}が約{maxDusk.dusk.toFixed(1)}%、{minDusk.month}が約
          {minDusk.dusk.toFixed(1)}%でした。日没が早まる秋から冬は、帰宅の時間帯が暗くなる
          時期です。歩行者の事故が夜に死亡事故になりやすいこともあわせて、夕方からの早めの
          備えを心がけましょう。
        </p>

        <p>
          <Link prefetch={false} href="/articles/pedestrian-accident-age-analysis" style={link}>
            歩行者の事故、年齢で何が違うか
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/icy-road-accident-analysis" style={link}>
            雪道・凍結路の事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const prNote: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  lineHeight: 1.8,
  marginBottom: 20,
};
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
