import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleLayout from "@/components/ArticleLayout";
import { getAgriCity } from "@/lib/agriCity";
import { AGRI_META, oku } from "@/lib/agriOutput";
import { getMunicipalitiesPop, isShi } from "@/lib/cityPopulation";
import { isReleased, releaseDate } from "@/lib/release";

const PATH = "/articles/agri-output-per-capita";
const MIN_POP = 5_000;

function getRows() {
  const { rows, label } = getMunicipalitiesPop();
  const list = rows
    .map((c) => {
      const a = getAgriCity(c.code);
      if (!a || a.total == null) return null;
      // 1,000万円 → 万円。人口1人あたりの農業産出額(万円)
      return { code: c.code, name: c.name, city: a.city, pref: a.pref, pop: c.population, total: a.total, perCap: (a.total * 1000) / c.population, totalRn: a.totalRn };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);
  const nat = list.reduce((s, x) => s + x.total * 1000, 0) / list.reduce((s, x) => s + x.pop, 0);
  const all = list.filter((x) => x.pop >= MIN_POP).sort((a, b) => b.perCap - a.perCap);
  const shi = list.filter((x) => isShi(x.name) && x.pop >= MIN_POP).sort((a, b) => b.perCap - a.perCap);
  return { all, shi, nat, label, n: list.length };
}

const man = (v: number) => v.toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function generateMetadata() {
  if (!isReleased(PATH)) return {};
  const { all, shi, nat } = getRows();
  return {
    alternates: { canonical: PATH },
    title: `人口あたりの農業産出額が多い市町村ランキング(令和6年)｜1位は${all[0].city}`,
    description: `農業産出額を人口で割ると、規模の大きい産地とは違う顔ぶれになります。人口${MIN_POP.toLocaleString()}人以上で1位は${all[0].pref}${all[0].city}(1人あたり${man(all[0].perCap)}万円)、市では${shi[0].city}。全国平均は${man(nat)}万円。`,
  };
}

export default function Page() {
  if (!isReleased(PATH)) notFound();
  const { all, shi, nat, label, n } = getRows();
  const t = (x: ReturnType<typeof getRows>["all"][number], i: number) => (
    <tr key={x.code}>
      <td style={td}>{i + 1}</td>
      <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
        {x.city}
        <span style={{ color: "#6b7280", fontSize: 12 }}>({x.pref})</span>
      </td>
      <td style={tdR}>{man(x.perCap)}</td>
      <td style={tdR}>{oku(x.total)}</td>
      <td style={tdR}>{x.pop.toLocaleString()}</td>
      <td style={td}>{x.totalRn}</td>
    </tr>
  );
  const head = (
    <thead>
      <tr>
        <th style={th}>順位</th>
        <th style={{ ...th, textAlign: "left" }}>市町村</th>
        <th style={thR}>1人あたり(万円)</th>
        <th style={thR}>産出額(億円)</th>
        <th style={thR}>人口(人)</th>
        <th style={th}>産出額の全国順位</th>
      </tr>
    </thead>
  );

  return (
    <ArticleLayout
      title="人口あたりの農業産出額が多い市町村ランキング(令和6年)"
      summary={`農業産出額を人口で割ると、人口${MIN_POP.toLocaleString()}人以上で1位は${all[0].pref}${all[0].city}(1人あたり${man(all[0].perCap)}万円)、市では${shi[0].city}(${man(shi[0].perCap)}万円)です。全国平均は${man(nat)}万円で、産出額の全国順位とはかなり違う顔ぶれになります。`}
      heroLabel="人口あたりの農業産出額が最も多い市町村"
      heroValue={all[0].city}
      rankingLink="/ranking/agri/total"
      path={PATH}
      tags={["industry"]}
      publishedAt={releaseDate(PATH, "2026-10-16")}
      dataNote={`農業産出額: 農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、9月18日訂正)。人口: ${label}。東京都特別区は集計の単位が異なるため除く。`}
      top3={all.slice(0, 3).map((x, i) => ({ rank: i + 1, name: `${x.pref} ${x.city}`, value: `${man(x.perCap)}万円` }))}
    >
      <div style={box}>
        <h2>計算の方法</h2>
        <p>
          農業産出額(推計)を人口({label})で割り、1人あたりの金額(万円)を出しました。{n.toLocaleString()}市町村が対象で、
          全国の平均は1人あたり{man(nat)}万円です。人口が極端に少ない自治体は数字が大きくぶれるため、ランキングは人口
          {MIN_POP.toLocaleString()}人以上に限っています。農業産出額は都道府県の産出額を面積や頭数で市町村に割り振った
          <strong>推計</strong>で、販売額そのものではありません。
        </p>
      </div>

      <div style={box}>
        <h2>人口{MIN_POP.toLocaleString()}人以上の市町村(上位30)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            {head}
            <tbody>{all.slice(0, 30).map(t)}</tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>市に限ったランキング(上位20)</h2>
        <p>町村を除き、人口{MIN_POP.toLocaleString()}人以上の市だけで並べました。</p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            {head}
            <tbody>{shi.slice(0, 20).map(t)}</tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          産出額の総額が最も多い市町村については、
          <Link prefetch={false} href="/ranking/agri" style={link}>
            農業産出額 市町村ランキング
          </Link>
          をご覧ください。出典: 農林水産省(
          <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={link}>
            {AGRI_META.url}
          </a>
          )。
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
