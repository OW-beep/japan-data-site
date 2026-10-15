import Link from "next/link";
import { getCityInsight } from "@/lib/cityInsight";

const n = (v: number) => v.toLocaleString("ja-JP");
const pt = (v: number) => (Math.abs(v) < 0.05 ? "±0.0" : `${v > 0 ? "+" : ""}${v.toFixed(1)}`);
// 「上位0%」のような表示を避け、最小1%にする
const pctOf = (rank: number, of: number) => Math.max(1, Math.ceil((rank / of) * 100));

/**
 * その自治体だけの数字(順位・2020→2025年の変化・全国/県平均との差)から作る解説文。
 * 同じ文面の差し替えではなく、数字によって書く内容が変わる(増えている/減っている、
 * 平均より高い/低い、際立つ指標がある/ない)。
 */
export default function CityNarrative({ code }: { code: string }) {
  const i = getCityInsight(code);
  if (!i) return null;

  const popTrend =
    i.popChangePct >= 3
      ? "5年間で人口が大きく増えた側の自治体です。"
      : i.popChangePct >= 0
        ? "人口はほぼ横ばいか、わずかに増えています。"
        : i.popChangePct > -5
          ? "人口は緩やかに減っています。"
          : "5年間で人口が5%以上減っており、減少のペースが速い自治体です。";

  const eldDiffNat = i.elderlyRate - i.elderlyNat;
  const eldDiffPref = i.elderlyRate - i.elderlyPref;
  const chdDiffNat = i.childRate - i.childNat;

  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 34,
        marginBottom: 40,
      }}
    >
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18 }}>{i.short}の人口と年齢構成(数字で読む)</h2>

      <p style={{ lineHeight: 2, color: "#374151" }}>
        {i.short}の人口は{n(i.pop)}人({i.label})で、全国{n(i.total)}市区町村のうち{i.popRank}位、
        {i.pref}内では{i.prefCount}市区町村中{i.popRankInPref}位です。2020年の{n(i.pop2020)}人から
        {i.popChangePct > 0 ? "+" : ""}
        {i.popChangePct.toFixed(1)}%({i.pop - i.pop2020 > 0 ? "+" : ""}
        {n(i.pop - i.pop2020)}人)変化し、増減率は全国で{i.popChangeRank}位でした。{popTrend}
      </p>

      <p style={{ lineHeight: 2, color: "#374151" }}>
        高齢化率(65歳以上の割合)は{i.elderlyRate.toFixed(1)}%で、全国の{i.elderlyNat.toFixed(1)}%より
        {Math.abs(eldDiffNat).toFixed(1)}ポイント{eldDiffNat >= 0 ? "高く" : "低く"}、{i.pref}全体の
        {i.elderlyPref.toFixed(1)}%より{Math.abs(eldDiffPref).toFixed(1)}ポイント
        {eldDiffPref >= 0 ? "高い" : "低い"}水準です。2020年の{i.elderlyRate2020.toFixed(1)}%からは
        {pt(i.elderlyRate - i.elderlyRate2020)}ポイントの変化でした。子ども(15歳未満)の割合は
        {i.childRate.toFixed(1)}%で、全国平均より{Math.abs(chdDiffNat).toFixed(1)}ポイント
        {chdDiffNat >= 0 ? "高く" : "低く"}なっています(全国{i.childRank}位)。
      </p>

      <p style={{ lineHeight: 2, color: "#374151" }}>
        {i.standouts.length > 0 ? (
          <>
            全国と比べて際立つ点は、
            {i.standouts.map((s, k) => (
              <span key={s.label}>
                {k > 0 ? "、" : ""}
                {s.label}が{s.top ? "上位" : "下位"}
                {pctOf(s.top ? s.rank : s.of - s.rank + 1, s.of)}%以内({s.rank}位/{n(s.of)})
              </span>
            ))}
            です。
          </>
        ) : (
          <>主な指標はいずれも全国の中位に収まっており、極端に目立つ偏りはありません。</>
        )}
        {i.density != null && i.densityRank != null && (
          <>
            {" "}
            人口密度は1km²あたり{n(Math.round(i.density))}人で全国{i.densityRank}位です。
          </>
        )}
        {i.financeIndex != null && i.financeRank != null && (
          <>
            {" "}
            財政力指数は{i.financeIndex.toFixed(2)}で、全国{i.financeRank}位/{n(i.financeCount)}です(1.0を超えると
            普通交付税の不交付団体の水準)。
          </>
        )}
      </p>

      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.9 }}>
        人口・年齢の数字は{i.label}、順位は政令指定都市の区を除く市区町村での比較です。このページ下部の
        表の一部は令和2年国勢調査などに基づきます。ほかの自治体との比較は
        <Link prefetch={false} href="/compare" style={{ color: "#2563eb" }}> 比較ツール</Link>、
        全国の順位は
        <Link prefetch={false} href="/ranking/population" style={{ color: "#2563eb" }}> 人口</Link>・
        <Link prefetch={false} href="/ranking/aging" style={{ color: "#2563eb" }}>高齢化率</Link>・
        <Link prefetch={false} href="/ranking/child" style={{ color: "#2563eb" }}>子ども割合</Link>
        の各ランキングで確認できます。
      </p>
    </section>
  );
}
