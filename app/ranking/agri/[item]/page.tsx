import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSense from "@/components/AdSense";
import AffiliateSlot from "@/components/AffiliateSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import CompareCTA from "@/components/CompareCTA";
import RakutenGifts from "@/components/RakutenGifts";
import DataAsOf from "@/components/DataAsOf";
import JsonLd from "@/components/JsonLd";
import { AGRI_GROUPS, AGRI_META, AGRI_RAKUTEN_PRODUCT, agriTitleName, getAgriItem, getAgriSlugs, oku, topPublished } from "@/lib/agriOutput";
import { isCityIndexable } from "@/lib/indexPolicy";

// 公開リスト(lib/agriOutput.ts の AGRI_PUBLISHED)以外は静的生成せず、アクセスされても 404 にする
export const dynamicParams = false;

/** 楽天ブロックの取得に失敗しても、6時間以内に自動で再生成されるようにする */
export const revalidate = 21600;

export function generateStaticParams() {
  return getAgriSlugs().map((item) => ({ item }));
}

type Props = { params: Promise<{ item: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item: slug } = await params;
  const item = getAgriItem(slug);
  if (!item) return {};
  const first = item.top[0];
  const pub = topPublished(item);
  const name = agriTitleName(item, slug);
  const lead = first.v == null ? `1位は${first.city}(${first.pref}・数値非公表)` : `1位は${first.city}(${first.pref})${oku(first.v)}億円`;
  return {
    alternates: { canonical: `/ranking/agri/${slug}` },
    title: `${name}が多い市町村ランキング【令和6年】${first.city}が1位`,
    description: `${slug === "total" ? "農業産出額(総合)" : `${item.label}の産出額`}(推計)が多い市町村を全国順位で一覧。${lead}。${
      pub && pub !== first ? `数値が公表されている最上位は${pub.city}(${oku(pub.v!)}億円)。` : ""
    }農林水産省「市町村別農業産出額(推計)」令和6年。推計の読み方と秘匿(非公表)の扱いも解説。`,
  };
}

export default async function AgriItemPage({ params }: Props) {
  const { item: slug } = await params;
  const item = getAgriItem(slug);
  if (!item) notFound();

  const name = agriTitleName(item, slug);
  const rows = item.top.filter((r) => r.rn <= 100).slice(0, 100);
  const first = rows[0];
  const pub = topPublished(item)!;
  const top10 = rows.slice(0, 10);
  const hiddenTop10 = top10.filter((r) => r.v == null).length;
  const top10Sum = top10.reduce((s, r) => s + (r.v ?? 0), 0);
  const prefFirst = item.prefTop[0];
  const prefShare = (prefFirst[1] / item.total) * 100;
  const sameGroup =
    AGRI_GROUPS.find((g) => g.slugs.includes(slug))?.slugs.filter((s) => s !== slug && getAgriItem(s)) ?? [];

  const faq = [
    {
      q: `${item.label}の産出額が全国で最も多い市町村はどこですか？`,
      a:
        first.v == null
          ? `全国順位は${first.city}(${first.pref})が1位ですが、数値は非公表(秘匿)です。数値が公表されている中では${pub.city}(${pub.pref})が${oku(pub.v!)}億円で最も多くなっています。`
          : `${first.city}(${first.pref})で、${oku(first.v)}億円です(令和6年、推計)。`,
    },
    {
      q: "この「産出額」は収穫量や販売額と同じですか？",
      a: "いいえ。農林水産省が都道府県の産出額を、作付面積や飼養頭数などで市町村に割り振って推計したものです。市町村ごとの価格や単収の違いは反映されないため、実際の販売額とは一致しないことがあります。",
    },
    {
      q: "数値が「非公表」の市町村があるのはなぜですか？",
      a: "生産者が少ないなどの理由で、個々の経営が特定されるおそれがある場合、数値が秘匿(x)とされています。順位と市町村名は公表されているため、このページでは「非公表」と表示しています。合計や割合は、数値が公表されている市町村だけで計算しています。",
    },
  ];

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumbs
        items={[{ name: "ランキング", href: "/ranking" }, { name: "農業産出額", href: "/ranking/agri" }, { name: name }]}
      />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>🌾 {name}が多い市町村ランキング</h1>

      <DataAsOf text="農林水産省「市町村別農業産出額(推計)」令和6年(2026年9月訂正反映)" />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        令和6年の{slug === "total" ? "農業産出額(総合)" : `${item.label}の産出額`}(推計)が全国で最も多いのは<strong>{first.city}({first.pref})</strong>
        {first.v == null ? "(数値は非公表)" : `で${oku(first.v)}億円`}です。
        {first.v == null && (
          <>数値が公表されている中では{pub.city}({pub.pref})の{oku(pub.v!)}億円が最多です。</>
        )}
        {item.producers.toLocaleString()}市町村で数値が公表されており、そのうち公表値のある最上位の市町村(上位10位以内
        {hiddenTop10 > 0 ? `で非公表の${hiddenTop10}件を除く` : ""})の合計は、公表値の合計の{((top10Sum / item.total) * 100).toFixed(0)}%に当たります。
        {item.secret > 0 && <>数値が非公表の市町村が{item.secret.toLocaleString()}あり、以下の合計と割合にはその分が含まれません。</>}
        都道府県別に公表値を合計すると最も多いのは{prefFirst[0]}({oku(prefFirst[1])}億円、公表値合計の
        {prefShare.toFixed(0)}%)です。
      </p>

      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 10,
          padding: 14,
          margin: "16px 0",
          fontSize: 14,
          lineHeight: 1.8,
          color: "#78350f",
        }}
      >
        <strong>読むときの注意:</strong>
        この数字は都道府県の産出額を作付面積・飼養頭数などで市町村に割り振った<strong>推計</strong>
        で、実際の販売額や収穫量ではありません。価格が高いブランド産地は低めに、そうでない産地は高めに出ることがあります。
      </div>

      <AdSense />

      <div style={{ overflowX: "auto", marginTop: 16 }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>全国順位</th>
              <th style={{ ...th, textAlign: "left" }}>市町村</th>
              <th style={{ ...th, textAlign: "left" }}>都道府県</th>
              <th style={thNum}>産出額(億円)</th>
              <th style={th}>県内順位</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code + r.rn}>
                <td style={td}>{r.rn}</td>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                  {isCityIndexable(r.code) ? (
                    <Link prefetch={false} href={`/city/${r.code}`} style={{ color: "#1d4ed8" }}>
                      {r.city}
                    </Link>
                  ) : (
                    r.city
                  )}
                </td>
                <td style={{ ...td, textAlign: "left" }}>{r.pref}</td>
                <td style={tdNum}>{r.v == null ? "非公表" : oku(r.v)}</td>
                <td style={td}>{r.rp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
        全国順位は数値が非公表の市町村も含めた順位です。順位が同じ市町村は、原数値(100万円単位)が同じです。
        東京都特別区は23区をまとめた1つの値として公表されています。
      </p>

      <section style={{ marginTop: 32 }}>
        <p style={{ lineHeight: 1.9, color: "#374151" }}>
          産地の自治体には、返礼品としてこうした農産物・畜産物を扱うところがあります。返礼品の有無や内容は自治体ごとに異なるため、
          寄付先の条件はリンク先で確認してください。
        </p>
        {AGRI_RAKUTEN_PRODUCT[slug] && (
          <RakutenGifts
            keyword={`ふるさと納税 ${AGRI_RAKUTEN_PRODUCT[slug]} ${pub.pref}`}
            heading={`${pub.pref}産の${AGRI_RAKUTEN_PRODUCT[slug]}を楽天市場で見る`}
          />
        )}
        <AffiliateSlot topic="furusato" />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：{item.label}の産出額</h2>
        {faq.map((f) => (
          <p key={f.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </section>

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

      <nav style={{ marginTop: 32 }} aria-label="ほかの品目">
        <h2 style={{ fontSize: 18 }}>ほかの品目のランキング</h2>
        <p style={{ lineHeight: 2 }}>
          <Link prefetch={false} href="/ranking/agri" style={a}>
            品目別ランキング一覧
          </Link>
          {sameGroup.map((s) => (
            <span key={s}>
              {" ／ "}
              <Link prefetch={false} href={`/ranking/agri/${s}`} style={a}>
                {getAgriItem(s)!.label}
              </Link>
            </span>
          ))}
        </p>
      </nav>

      <p style={{ marginTop: 24, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
        出典: 農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、同年9月18日訂正)(
        <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={a}>
          {AGRI_META.url}
        </a>
        )を加工して作成。金額は元データの1,000万円単位を億円に換算しています。
      </p>

      <CompareCTA />
    </main>
  );
}

const a: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
