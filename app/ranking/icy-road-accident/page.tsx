import type { Metadata } from "next";
import Link from "next/link";

import MetricBox from "../../../components/MetricBox";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import JsonLd from "../../../components/JsonLd";
import CompareCTA from "../../../components/CompareCTA";
import RakutenGifts from "../../../components/RakutenGifts";
import { dataSources } from "../../../lib/dataSources";
import { getMunicipalities } from "../../../lib/municipalities";
import {
  ACCIDENT_YEAR_LABEL,
  SOURCE_NOTE,
  getAllAccidentRows,
  isAccidentJoinHealthy,
  national,
} from "../../../lib/trafficAccident";

/** 楽天ブロックの取得に失敗しても、6時間以内に自動で再生成されるようにする */
export const revalidate = 21600;

const MIN_ACCIDENTS = 50;

const healthy = () =>
  isAccidentJoinHealthy(getMunicipalities().map((c) => c.code));

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/icy-road-accident" },
  title:
    "凍結・積雪路面の事故が多い市区町村ランキング｜雪道・凍結路の人身事故の割合【令和7年】",
  description:
    "警察庁の交通事故統計オープンデータ(令和7年)をもとに、人身事故のうち路面が凍結・積雪していた事故の割合を市区町村別に比較。雪道・凍結路の事故が多い自治体がわかります。",
  robots: healthy() ? undefined : { index: false, follow: true },
};

export default function IcyRoadAccidentRankingPage() {
  if (!healthy()) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 28 }}>凍結・積雪路面の事故ランキング</h1>
        <p>データを準備中です。</p>
      </main>
    );
  }

  const nameByCode = new Map(getMunicipalities().map((c) => [c.code, c.name]));

  const all = getAllAccidentRows()
    .filter((r) => r.accidents >= MIN_ACCIDENTS && nameByCode.has(r.code))
    .map((r) => ({
      code: r.code,
      name: nameByCode.get(r.code) as string,
      accidents: r.accidents,
      icy: r.icySnowAccidents,
      share: (r.icySnowAccidents / r.accidents) * 100,
    }))
    .sort((a, b) => b.share - a.share || b.icy - a.icy);

  if (all.length < 20) return null;

  const top = all.slice(0, 100);
  const first = all[0];
  const nationalIcy = national.bySurface.icy.accidents + national.bySurface.snow.accidents;
  const nationalShare = (nationalIcy / national.totalAccidents) * 100;
  const withIcy = all.filter((r) => r.icy > 0).length;
  const hokkaido = top.slice(0, 50).filter((r) => r.name.startsWith("北海道")).length;

  const faq = [
    {
      q: "凍結・積雪路面の事故の割合が最も高い市区町村はどこですか？",
      a: `人身事故が${MIN_ACCIDENTS}件以上の自治体では${first.name}で、人身事故${first.accidents.toLocaleString()}件のうち${first.icy.toLocaleString()}件(${first.share.toFixed(1)}%)が凍結・積雪路面で起きています。全国の割合は${nationalShare.toFixed(1)}%です。`,
    },
    {
      q: "凍結・積雪路面の事故は、いつの時期に多いですか？",
      a: "冬に集中しています。令和7年のデータでは、凍結・積雪路面の事故の大半が12月から3月に起きています。詳しくは分析記事をご覧ください。",
    },
    {
      q: "「凍結」と「積雪」はどう違いますか？",
      a: "警察庁のコードでは、舗装された道路の表面が凍っている状態を「凍結」、雪が積もっている状態を「積雪」として区別しています。このランキングは、2つを合わせて数えています。",
    },
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        ❄️ 凍結・積雪路面の事故が多い市区町村ランキング
      </h1>

      <DataAsOf text={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})`} />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        {ACCIDENT_YEAR_LABEL}の人身事故のうち、路面が凍結または積雪していた事故の
        割合を比べたランキングです。分析記事は
        <Link prefetch={false} href="/articles/icy-road-accident-analysis" style={link}>
          雪道・凍結路の事故の分析
        </Link>
        をご覧ください。
      </p>

      <MetricBox
        title="指標定義"
        unit="%"
        definition={`人身事故のうち、路面状態が「舗装-凍結」または「舗装-積雪」だった事故の割合です。割合が不安定にならないよう、人身事故が${MIN_ACCIDENTS}件以上の自治体を対象にしています。政令指定都市の区は市に合算しています。`}
        formula="凍結・積雪路面の人身事故 ÷ 人身事故 × 100"
        example={{ name: first.name, value: `${first.share.toFixed(1)}%` }}
        source={dataSources["icy-road-accident"]}
      />

      <section style={summary}>
        <h2 style={{ marginTop: 0, fontSize: 22 }}>ランキングから見える傾向</h2>
        <p style={{ lineHeight: 1.9 }}>
          全国の人身事故{national.totalAccidents.toLocaleString()}件のうち、凍結・積雪路面の
          事故は{nationalIcy.toLocaleString()}件(約{nationalShare.toFixed(1)}%)でした。
          対象の{all.length.toLocaleString()}自治体のうち、凍結・積雪路面の事故が1件以上
          あったのは{withIcy.toLocaleString()}自治体です。割合が最も高いのは
          <strong>{first.name}</strong>({first.share.toFixed(1)}%)で、
          上位50のうち{hokkaido}自治体が北海道でした。
        </p>
        <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
          人口あたりの事故件数は
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別の交通事故ランキング
          </Link>
          でご覧いただけます。
        </p>
      </section>

      <AdSense />

      <RakutenGifts
        keyword="スノーブラシ"
        heading="冬の車の備えに:スノーブラシなどを楽天市場で見る"
      />

      <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>
        凍結・積雪路面の事故の割合が高い自治体 上位100
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={{ ...th, textAlign: "left" }}>自治体</th>
              <th style={thNum}>凍結・積雪路面の割合</th>
              <th style={thNum}>うち凍結・積雪(件)</th>
              <th style={thNum}>人身事故(件)</th>
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => (
              <tr key={c.code}>
                <td style={td}>{i + 1}</td>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                  <Link prefetch={false} href={`/city/${c.code}`} style={link}>
                    {c.name}
                  </Link>
                </td>
                <td style={tdNum}>{c.share.toFixed(1)}%</td>
                <td style={tdNum}>{c.icy.toLocaleString()}</td>
                <td style={tdNum}>{c.accidents.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={note}>{SOURCE_NOTE}。</p>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：凍結・積雪路面の事故についてよくある質問</h2>
        {faq.map((item) => (
          <p key={item.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </section>

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

      <CompareCTA />
    </main>
  );
}

const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const summary: React.CSSProperties = {
  marginTop: 35,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 30,
};
const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
  marginTop: 12,
};
const table: React.CSSProperties = {
  width: "100%",
  minWidth: 560,
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #e5e7eb",
  fontSize: 14,
};
const th: React.CSSProperties = {
  padding: "10px 8px",
  background: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  textAlign: "center",
};
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
