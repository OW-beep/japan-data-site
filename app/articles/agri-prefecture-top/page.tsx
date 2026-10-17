import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import { allAgriCities } from "@/lib/agriCity";
import { AGRI_META, getAgriItem, oku } from "@/lib/agriOutput";
import { isReleased, releaseDate } from "@/lib/release";

const PATH = "/articles/agri-prefecture-top";

function getRows() {
  const byPref = new Map<string, { code: string; city: string; total: number; rn: number }[]>();
  for (const [code, a] of allAgriCities()) {
    if (a.total == null || a.totalRn == null) continue;
    const l = byPref.get(a.pref) ?? [];
    l.push({ code, city: a.city, total: a.total, rn: a.totalRn });
    byPref.set(a.pref, l);
  }
  const rows = [...byPref.entries()].map(([pref, l]) => ({
    pref,
    top: l.sort((x, y) => y.total - x.total).slice(0, 3),
    sum: l.reduce((s, x) => s + x.total, 0),
    n: l.length,
  }));
  // 全国の農業産出額が多い県の順
  return rows.sort((a, b) => b.sum - a.sum);
}

export function generateMetadata() {
  if (!isReleased(PATH)) return {};
  const rows = getRows();
  const best = [...rows].sort((a, b) => a.top[0].rn - b.top[0].rn)[0];
  return {
    alternates: { canonical: PATH },
    title: `農業産出額が最も多い市町村、47都道府県一覧(令和6年)｜${best.pref}は${best.top[0].city}`,
    description: `都道府県ごとに、農業産出額(令和6年・推計)が最も多い市町村と上位3位を一覧にしました。全国1位は${best.pref}${best.top[0].city}(${oku(best.top[0].total)}億円)。農林水産省「市町村別農業産出額(推計)」を加工して作成。`,
  };
}

export default function Page() {
  if (!isReleased(PATH)) notFound();
  const rows = getRows();
  const nat = [...rows].sort((a, b) => a.top[0].rn - b.top[0].rn);
  const towns = rows.filter((r) => /[町村]$/.test(r.top[0].city));
  const hokkaido = rows.find((r) => r.pref === "北海道");
  const gaps = rows
    .map((r) => ({ r, ratio: r.top[1] ? r.top[0].total / r.top[1].total : 1 }))
    .sort((a, b) => b.ratio - a.ratio);
  const faq = [
    {
      q: "農業産出額が全国で最も多い市町村はどこですか？",
      a: `令和6年(推計)は${nat[0].pref}${nat[0].top[0].city}で${oku(nat[0].top[0].total)}億円、2位は${nat[1].pref}${nat[1].top[0].city}の${oku(nat[1].top[0].total)}億円です。`,
    },
    {
      q: "県内1位が町や村の都道府県はいくつありますか？",
      a: `${towns.length}つです(${towns.map((t) => `${t.pref}${t.top[0].city}`).join("、")})。`,
    },
  ];

  return (
    <ArticleLayout
      title="農業産出額が最も多い市町村、47都道府県の一覧(令和6年)"
      summary={`都道府県ごとに、農業産出額(令和6年・推計)が最も多い市町村と上位3位を一覧にしました。全国1位は${nat[0].pref}${nat[0].top[0].city}(${oku(nat[0].top[0].total)}億円)、2位は${nat[1].top[0].city}(${oku(nat[1].top[0].total)}億円)。県内1位が町や村の都道府県は${towns.length}つあります。`}
      heroLabel="農業産出額が全国1位の市町村"
      heroValue={nat[0].top[0].city}
      rankingLink="/ranking/agri"
      path={PATH}
      tags={["industry"]}
      publishedAt={releaseDate(PATH, "2026-10-16")}
      dataNote="農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、同年9月18日訂正)を加工して作成。東京都は特別区を1つにまとめた値。"
      top3={nat.slice(0, 3).map((r, i) => ({ rank: i + 1, name: `${r.pref} ${r.top[0].city}`, value: `${oku(r.top[0].total)}億円` }))}
    >
      <div style={box}>
        <h2>読み方</h2>
        <p>
          農林水産省の市町村別農業産出額は、都道府県の産出額を作付面積や飼養頭数などで市町村に割り振った<strong>推計</strong>です。
          実際の販売額とは一致しないことがあります。表は農業産出額(総合)の多い順に並べ、県ごとの最上位3市町村を載せています。
          北海道は{hokkaido ? `${hokkaido.n}市町村` : ""}の合計が大きい一方、県内1位の市町村は
          {hokkaido?.top[0].city}です。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別 農業産出額が多い市町村(上位3位)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>都道府県</th>
                <th style={{ ...th, textAlign: "left" }}>1位</th>
                <th style={{ ...th, textAlign: "left" }}>2位</th>
                <th style={{ ...th, textAlign: "left" }}>3位</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.pref}>
                  <td style={td}>{r.pref}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={i} style={{ ...td, textAlign: "left" }}>
                      {r.top[i] ? (
                        <>
                          {r.top[i].city}
                          <span style={{ color: "#6b7280", fontSize: 12 }}> {oku(r.top[i].total)}億円(全国{r.top[i].rn}位)</span>
                        </>
                      ) : (
                        "―"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280" }}>表の県の並びは、市町村の農業産出額を県ごとに合計した多い順です。</p>
      </div>

      <div style={box}>
        <h2>1位と2位の差が大きい県</h2>
        <p>
          県内1位が2位の何倍かで見ると、差が最も大きいのは{gaps[0].r.pref}で、{gaps[0].r.top[0].city}
          ({oku(gaps[0].r.top[0].total)}億円)が{gaps[0].r.top[1].city}({oku(gaps[0].r.top[1].total)}億円)の
          約{gaps[0].ratio.toFixed(1)}倍です。次いで{gaps[1].r.pref}の{gaps[1].ratio.toFixed(1)}倍、
          {gaps[2].r.pref}の{gaps[2].ratio.toFixed(1)}倍と続きます。
        </p>
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
        <p>
          品目別の順位は
          <Link prefetch={false} href="/ranking/agri" style={link}>
            農業産出額 市町村ランキング(品目別)
          </Link>
          {getAgriItem("rice") && (
            <>
              、たとえば
              <Link prefetch={false} href="/ranking/agri/rice" style={link}>
                米
              </Link>
            </>
          )}
          をご覧ください。出典: 農林水産省(
          <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={link}>
            {AGRI_META.url}
          </a>
          )。
        </p>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
