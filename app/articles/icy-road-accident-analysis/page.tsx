import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities } from "@/lib/municipalities";
import {
  ACCIDENT_YEAR_LABEL,
  SOURCE_NOTE,
  aggregateByPrefecture,
  getAllAccidentRows,
  national,
} from "@/lib/trafficAccident";

function summarize() {
  const icy = national.bySurface.icy;
  const snow = national.bySurface.snow;
  const dry = national.bySurface.dry;

  const icyAcc = icy.accidents + snow.accidents;
  const icyFatal = icy.fatalAccidents + snow.fatalAccidents;
  const icyShare = (icyAcc / national.totalAccidents) * 100;
  const icyFatalRate = icyAcc > 0 ? (icyFatal / icyAcc) * 100 : 0;
  const dryFatalRate = dry.accidents > 0 ? (dry.fatalAccidents / dry.accidents) * 100 : 0;
  const fatalRatio = dryFatalRate > 0 ? icyFatalRate / dryFatalRate : 0;

  const months = national.icySnowByMonth;
  const monthTotal = months.reduce((s, v) => s + v, 0);
  const winter = [11, 0, 1, 2].reduce((s, i) => s + months[i], 0); // 12,1,2,3月
  const winterShare = monthTotal > 0 ? (winter / monthTotal) * 100 : 0;

  const prefs = aggregateByPrefecture()
    .filter((p) => p.icySnowAccidents > 0)
    .sort((a, b) => b.icySnowAccidents - a.icySnowAccidents);

  return {
    icyAcc,
    icyFatal,
    icyShare,
    icyFatalRate,
    dryFatalRate,
    fatalRatio,
    months,
    monthTotal,
    winterShare,
    prefs,
  };
}

export function generateMetadata() {
  const s = summarize();
  return {
    alternates: { canonical: "/articles/icy-road-accident-analysis" },
    title: `雪道・凍結路で事故が多いのはどこ？凍結・積雪路面の事故は全体の${s.icyShare.toFixed(1)}%、死亡事故の割合は乾燥路面の約${s.fatalRatio.toFixed(1)}倍`,
    description: `警察庁の交通事故オープンデータ(令和7年)で、凍結・積雪路面の人身事故${s.icyAcc.toLocaleString()}件を分析。いつ、どこで多いのか、死亡事故の割合は乾燥路面と比べてどうか、事故の割合が高い自治体を調べました。`,
  };
}

export default function Page() {
  const s = summarize();
  if (s.icyAcc === 0) return null;

  const nameByCode = new Map(getMunicipalities().map((c) => [c.code, c.name]));
  const cities = getAllAccidentRows()
    .filter((r) => r.accidents >= 50 && nameByCode.has(r.code))
    .map((r) => ({
      name: nameByCode.get(r.code) as string,
      accidents: r.accidents,
      icy: r.icySnowAccidents,
      share: (r.icySnowAccidents / r.accidents) * 100,
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 10);

  const prefsTop = s.prefs.slice(0, 8);
  const hokkaido = s.prefs.find((p) => p.code === "01");
  const hokkaidoShare = hokkaido ? (hokkaido.icySnowAccidents / s.icyAcc) * 100 : 0;
  const tokyo = s.prefs.find((p) => p.code === "13");

  const surfaces: [string, { accidents: number; fatalAccidents: number }][] = [
    ["乾燥", national.bySurface.dry],
    ["湿潤", national.bySurface.wet],
    ["凍結", national.bySurface.icy],
    ["積雪", national.bySurface.snow],
  ];

  const monthLabels = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const monthOrder = [9, 10, 11, 0, 1, 2]; // 10月〜3月

  const faq = [
    {
      q: "凍結・積雪路面の事故は全国で何件ありますか？",
      a: `${ACCIDENT_YEAR_LABEL}の人身事故${national.totalAccidents.toLocaleString()}件のうち、路面が凍結または積雪していた事故は${s.icyAcc.toLocaleString()}件(約${s.icyShare.toFixed(1)}%)です。`,
    },
    {
      q: "凍結・積雪路面の事故は、いつ多いですか？",
      a: `冬に集中しています。このデータでは、凍結・積雪路面の事故の約${s.winterShare.toFixed(0)}%が12月から3月に起きています。`,
    },
    {
      q: "凍結・積雪路面では、事故が重大になりやすいですか？",
      a: `このデータでは、人身事故のうち死亡事故の割合は、凍結・積雪路面で約${s.icyFatalRate.toFixed(2)}%、乾燥路面で約${s.dryFatalRate.toFixed(2)}%でした。凍結・積雪路面のほうが約${s.fatalRatio.toFixed(1)}倍高くなっています。ただし、車の速度や道路の種類など、ほかの条件の違いも影響している可能性があります。`,
    },
    {
      q: "凍結・積雪路面の事故が最も多い都道府県はどこですか？",
      a: hokkaido
        ? `件数では北海道で、${hokkaido.icySnowAccidents.toLocaleString()}件(全国の約${hokkaidoShare.toFixed(0)}%)です。`
        : `件数では${prefsTop[0]?.name ?? "―"}です。`,
    },
  ];

  return (
    <ArticleLayout
      title={`雪道・凍結路で事故が多いのはどこ？凍結・積雪路面の事故は全体の${s.icyShare.toFixed(1)}%、死亡事故の割合は乾燥路面の約${s.fatalRatio.toFixed(1)}倍`}
      summary={`令和7年の人身事故のうち、凍結・積雪路面の事故は${s.icyAcc.toLocaleString()}件(約${s.icyShare.toFixed(1)}%)でした。約${s.winterShare.toFixed(0)}%が12〜3月に集中し、死亡事故の割合は乾燥路面の約${s.fatalRatio.toFixed(1)}倍です。`}
      heroLabel="凍結・積雪路面の事故(全国・令和7年)"
      heroValue={`${s.icyAcc.toLocaleString()}件`}
      rankingLink="/ranking/icy-road-accident"
      path="/articles/icy-road-accident-analysis"
      tags={["geography"]}
      publishedAt="2026-10-02"
      top3={prefsTop.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        name: p.name,
        value: `${p.icySnowAccidents.toLocaleString()}件`,
      }))}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して購入された場合、
        当サイトが報酬を受け取ることがあります。データの分析内容は、広告主の
        意向とは関係ありません。
      </p>

      <div style={box}>
        <h2>結論:凍結・積雪路面の事故は全体の{s.icyShare.toFixed(1)}%、でも重大になりやすい</h2>

        <p>
          警察庁の交通事故統計オープンデータ({ACCIDENT_YEAR_LABEL}・本票)で、人身事故
          {national.totalAccidents.toLocaleString()}件を路面の状態別に集計しました。
          路面が凍結または積雪していた事故は
          <strong>{s.icyAcc.toLocaleString()}件(約{s.icyShare.toFixed(1)}%)</strong>
          で、件数は多くありません。ところが、人身事故のうち死亡事故になった割合は、
          凍結・積雪路面が約{s.icyFatalRate.toFixed(2)}%、乾燥路面が約
          {s.dryFatalRate.toFixed(2)}%で、<strong>約{s.fatalRatio.toFixed(1)}倍</strong>
          でした。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>路面状態</th>
              <th style={thNum}>人身事故(件)</th>
              <th style={thNum}>うち死亡事故(件)</th>
              <th style={thNum}>死亡事故の割合</th>
            </tr>
          </thead>
          <tbody>
            {surfaces.map(([label, v]) => (
              <tr key={label}>
                <td style={td}>{label}</td>
                <td style={tdNum}>{v.accidents.toLocaleString()}</td>
                <td style={tdNum}>{v.fatalAccidents.toLocaleString()}</td>
                <td style={tdNum}>
                  {((v.fatalAccidents / v.accidents) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={note}>
          死亡事故は、事故から24時間以内に死者が出た事故です。路面の状態は、事故が起きた
          時点のものです。速度や道路の種類など、ほかの条件の違いも影響している可能性が
          あります。
        </p>
      </div>

      <div style={box}>
        <h2>いつ多い?冬の約{s.winterShare.toFixed(0)}%が12〜3月に集中</h2>

        <p>
          凍結・積雪路面の事故を月別に見ると、12月から3月に集中しています。
          この4か月で、全体の約<strong>{s.winterShare.toFixed(0)}%</strong>を占めます。
        </p>

        <table style={{ ...table, maxWidth: 480 }}>
          <thead>
            <tr>
              <th style={th}>月</th>
              <th style={thNum}>凍結・積雪路面の事故(件)</th>
              <th style={thNum}>割合</th>
            </tr>
          </thead>
          <tbody>
            {monthOrder.map((i) => (
              <tr key={i}>
                <td style={td}>{monthLabels[i]}</td>
                <td style={tdNum}>{s.months[i].toLocaleString()}</td>
                <td style={tdNum}>
                  {s.monthTotal > 0
                    ? `${((s.months[i] / s.monthTotal) * 100).toFixed(1)}%`
                    : "―"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={note}>
          4〜9月は件数がごくわずかなため、表から省いています。月は事故の発生月です。
        </p>
      </div>

      <div style={box}>
        <h2>どこで多い?北海道が全国の約{hokkaidoShare.toFixed(0)}%</h2>

        <p>
          都道府県別に見ると、件数が最も多いのは
          <strong>{prefsTop[0].name}</strong>
          ({prefsTop[0].icySnowAccidents.toLocaleString()}件)です。
          {hokkaido && prefsTop[0].code === "01"
            ? `北海道だけで、全国の凍結・積雪路面の事故の約${hokkaidoShare.toFixed(0)}%を占めます。`
            : ""}
          {tokyo
            ? `雪の少ない東京都でも${tokyo.icySnowAccidents.toLocaleString()}件あり、雪が降った日には、降雪地域以外でも事故が起きています。`
            : ""}
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>都道府県</th>
              <th style={thNum}>凍結・積雪路面の事故(件)</th>
              <th style={thNum}>その県の人身事故に占める割合</th>
            </tr>
          </thead>
          <tbody>
            {prefsTop.map((p, i) => (
              <tr key={p.code}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{p.name}</td>
                <td style={tdNum}>{p.icySnowAccidents.toLocaleString()}</td>
                <td style={tdNum}>
                  {((p.icySnowAccidents / p.accidents) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={box}>
        <h2>市区町村別:凍結・積雪路面の事故の割合が高い自治体</h2>

        <p>
          人身事故が50件以上の市区町村について、事故のうち凍結・積雪路面で起きた
          割合が高い順に並べると、上位は次のとおりです。
        </p>

        <ol>
          {cities.map((c) => (
            <li key={c.name}>
              {c.name}:{c.share.toFixed(1)}%(人身事故{c.accidents.toLocaleString()}件のうち
              {c.icy.toLocaleString()}件)
            </li>
          ))}
        </ol>

        <p>
          上位100自治体の一覧は
          <Link prefetch={false} href="/ranking/icy-road-accident" style={link}>
            凍結・積雪路面の事故ランキング
          </Link>
          で見られます。
        </p>
      </div>

      <div style={box}>
        <h2>冬の運転で気をつけたいこと</h2>

        <ul>
          <li>
            <strong>冬用タイヤの準備。</strong>
            多くの都道府県の規則で、積雪・凍結した道路を走るときは、タイヤに滑り止めの
            措置を取るよう定められています。雪や凍結が予想される地域を走る場合は、
            早めに冬用タイヤへの交換を検討しましょう。
          </li>
          <li>
            <strong>凍結しやすい場所。</strong>
            橋の上、トンネルの出入口、日陰の道路は、周囲より路面が凍りやすいとされて
            います。路面が濡れているように見えても、凍っていることがあります。
          </li>
          <li>
            <strong>速度と車間距離。</strong>
            急ブレーキや急ハンドルを避け、速度を落として、車間距離を長めに取ることが
            基本です。
          </li>
          <li>
            <strong>フロントガラスの霜・雪の除去。</strong>
            出発前に視界を確保することも大切です。
          </li>
        </ul>
      </div>

      <RakutenGifts
        keyword="スノーブラシ 霜取り 解氷スプレー 車"
        heading="冬の車の備えに:雪かき・霜取り用品を楽天市場で見る"
      />

      <div style={box}>
        <h2>Q&amp;A：凍結・積雪路面の事故についてよくある質問</h2>

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
          凍結・積雪路面の人身事故は全体の約{s.icyShare.toFixed(1)}%ですが、約
          {s.winterShare.toFixed(0)}%が12〜3月に集中し、死亡事故になる割合は乾燥路面の約
          {s.fatalRatio.toFixed(1)}倍でした。雪の少ない地域でも、降雪の日には事故が
          起きています。冬の運転では、早めの備えと、速度を落とした運転を心がけましょう。
        </p>

        <p style={note}>
          {SOURCE_NOTE}。人身事故は、死者または負傷者が出た交通事故で、物損事故は
          含まれません。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/icy-road-accident" style={link}>
            凍結・積雪路面の事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/traffic-accident-analysis" style={link}>
            交通事故発生件数ランキング分析(都道府県別)
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
