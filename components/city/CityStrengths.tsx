import LazyGifts from "@/components/city/LazyGifts";
import { getAgriCity } from "@/lib/agriCity";
import { oku } from "@/lib/agriOutput";

const SOURCE_URL = "https://www.maff.go.jp/j/tokei/kouhyou/sityoson_sansyutu/index.html";

/**
 * 自治体ごとの「強み」(農業産出額の品目別・全国順位)と、その品目の楽天市場リンク。
 *
 * ・強みは、品目別の全国順位が30位以内のもの。順位は農林水産省の公表値で、数字から機械的に決めている。
 * ・楽天の商品ブロックは、強みの1番目の品目だけ。検索は「ふるさと納税 {品目} {市町村名}」。
 *   ビルド時ではなく、ブロックの近くまでスクロールされたときに /api/city-gifts/[code] から取得する(LazyGifts)。
 *   このブロックがあるページは index する(lib/indexPolicy.ts の cityHasAffiliate)。
 * ・強みがない自治体では、何も表示しない。
 */
export default function CityStrengths({ code }: { code: string }) {
  const a = getAgriCity(code);
  if (!a || a.strengths.length === 0) return null;

  const top = a.strengths[0];

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
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18 }}>{a.city}の強み(農業産出額・令和6年)</h2>

      <p style={{ lineHeight: 2, color: "#374151" }}>
        {a.city}の農業産出額(推計)は
        {a.total != null ? `${oku(a.total)}億円` : "非公表"}
        {a.totalRn != null && <>で、全国{a.totalRn}位({a.pref}内{a.totalRp}位)</>}です。品目別に見ると、
        {a.strengths.map((s, i) => (
          <span key={s.item}>
            {i > 0 ? "、" : ""}
            {s.item}が全国{s.rn}位{s.v != null ? `(${oku(s.v)}億円)` : "(金額は非公表)"}
          </span>
        ))}
        と、全国の上位に入っています。
      </p>

      <LazyGifts code={code} heading={`${a.city}の${top.product}を楽天市場で見る`} />

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.9, marginTop: 14 }}>
        農林水産省の推計は、都道府県の産出額を作付面積や飼養頭数などで市町村に割り振ったもので、価格や単収の違いは反映されません。
        実際の販売額や収穫量とは一致しないことがあります。返礼品の有無や内容は自治体ごとに異なります。出典:
        農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、9月18日訂正)(
        <a href={SOURCE_URL} rel="noopener noreferrer" target="_blank" style={{ color: "#2563eb" }}>
          {SOURCE_URL}
        </a>
        )を加工して作成。
      </p>
    </section>
  );
}
