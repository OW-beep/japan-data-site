import Link from "next/link";
import { TAX_META, getTax, incomeRank, nationalIncomePerTaxpayer } from "@/lib/taxableIncome";

/**
 * 自治体ページの「所得と働き方」。総務省『市町村税課税状況等の調』令和7年度から、
 * 納税義務者1人あたりの課税対象所得、所得者の構成(給与・営業等・農業)、株式等の所得の割合、軽自動車の台数を示す。
 * 数字はすべてデータから計算する。住民税は住所地で課税されるため、勤務地ではなく住んでいる場所の統計。
 * 政令指定都市の区は、区ごとの値がないので表示しない。
 */
export default function CityIncome({ code, name, population }: { code: string; name: string; population: number }) {
  const t = getTax(code);
  if (!t || t.all <= 0) return null;

  const city = name.trim().split(/\s+/).pop() as string;
  const national = nationalIncomePerTaxpayer();
  const rank = incomeRank(code);
  const pct = (v: number) => ((v / t.all) * 100).toFixed(1);
  const stock = t.ti > 0 ? (t.st / t.ti) * 100 : 0;
  const kei = population > 0 ? (t.kei / population) * 100 : null;
  const ratio = t.incomePerTaxpayer / national;
  const man = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}万円`;

  const seg = [
    { label: "給与", v: t.sal, color: "#2563eb" },
    { label: "営業等", v: t.biz, color: "#f59e0b" },
    { label: "農業", v: t.farm, color: "#16a34a" },
    { label: "その他・家屋敷等のみ", v: t.oth + t.hse, color: "#94a3b8" },
  ];

  return (
    <section aria-labelledby={`income-${code}`} style={wrap}>
      <h2 id={`income-${code}`} style={h2}>
        {city}の所得と働き方(令和7年度の課税データ)
      </h2>
      <p style={p}>
        {city}の、納税義務者1人あたりの課税対象所得は<strong>{man(t.incomePerTaxpayer)}</strong>です。全国の合計の
        {national.toFixed(0)}万円の{(ratio * 100).toFixed(0)}%にあたります。
        {rank && (
          <>
            {" "}
            データのある{rank.total.toLocaleString()}市区町村のうち、高い方から{rank.rank.toLocaleString()}位です(中央値は{man(rank.median)})。
          </>
        )}
        住民税の納税義務者(均等割を納める人)は{t.all.toLocaleString()}人で、その{pct(t.sal)}%が給与所得者です。
      </p>

      <div role="img" aria-label={`住民税の納税義務者の構成。給与${pct(t.sal)}%、営業等${pct(t.biz)}%、農業${pct(t.farm)}%`} style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden", margin: "6px 0 6px" }}>
        {seg.map((s) => (
          <div key={s.label} title={`${s.label} ${pct(s.v)}%`} style={{ width: `${(s.v / t.all) * 100}%`, background: s.color }} />
        ))}
      </div>
      <p style={cap}>
        {seg.map((s) => (
          <span key={s.label} style={{ marginRight: 12 }}>
            <span style={{ color: s.color, fontWeight: 800 }}>■</span> {s.label} {pct(s.v)}%
          </span>
        ))}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <tbody>
            <tr>
              <th style={thL}>納税義務者1人あたり課税対象所得</th>
              <td style={td}>{man(t.incomePerTaxpayer)}</td>
            </tr>
            <tr>
              <th style={thL}>所得割の納税義務者数</th>
              <td style={td}>{t.tp.toLocaleString()}人</td>
            </tr>
            <tr>
              <th style={thL}>株式等の所得が課税対象所得に占める割合</th>
              <td style={td}>{stock.toFixed(1)}%</td>
            </tr>
            {kei != null && (
              <tr>
                <th style={thL}>軽自動車(四輪乗用・自家用)の台数(人口100人あたり)</th>
                <td style={td}>{kei.toFixed(1)}台</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={cap}>
        課税対象所得は、年収(収入)ではなく所得で、所得控除の前の金額です。住民税は1月1日の住所で課税されるので、勤務地ではなく、
        住んでいる場所の統計です。住民全員の平均ではありません。{TAX_META.fiscalYear === 2025 && "令和7年度の課税は、令和6年中の所得にもとづきます。"}
        出典:
        <a href={TAX_META.url} target="_blank" rel="noopener noreferrer" style={link}>
          総務省「市町村税課税状況等の調」(外部サイト)
        </a>
        。ほかの街との比較は、
        <Link prefetch={false} href="/ranking/taxable-income" style={link}>
          所得ランキング
        </Link>
        や、
        <Link prefetch={false} href="/compare" style={link}>
          自治体比較ツール
        </Link>
        で確認できます。
      </p>
    </section>
  );
}

const wrap: React.CSSProperties = { margin: "28px 0", padding: "20px 18px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 10px" };
const p: React.CSSProperties = { margin: "0 0 12px", lineHeight: 1.9, color: "#374151" };
const cap: React.CSSProperties = { fontSize: 13, color: "#6b7280", lineHeight: 1.8, margin: "6px 0 10px" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", fontSize: 14, background: "#fff" };
const thL: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", background: "#f8fafc", fontWeight: 700, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right", whiteSpace: "nowrap" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
