/**
 * ふるさと納税の「いつまでに、何をするか」の流れを示す図解。
 * 期限の日付は、記事(furusato-nozei-2026-guide)の本文と同じ内容。年が変わったら、ここも更新する。
 *   - 寄付: 12月31日までに決済が完了したもの
 *   - ワンストップ特例の申請書: 翌年1月10日必着(2027年1月10日は日曜日)。寄付先が5自治体以内の場合
 *   - 確定申告: 翌年2〜3月(2027年は3月15日ごろまで)
 *   - 控除の確認: 翌年6月ごろの住民税の決定通知書
 */
type Step = { when: string; title: string; text: string; color: string };

const STEPS: Step[] = [
  {
    when: "〜 12月31日",
    title: "寄付する(決済を完了)",
    text: "控除上限額の範囲内で寄付します。銀行振込などは、年末前に受付が終わることがあるので、早めに。",
    color: "#0369a1",
  },
  {
    when: "寄付のあと",
    title: "証明書・申請書が届く",
    text: "寄付先から、寄附金受領証明書や、ワンストップ特例の申請書が届きます。届く時期は、自治体によって違います。",
    color: "#0e7490",
  },
  {
    when: "1月10日必着(2027年)",
    title: "ワンストップ特例を申請",
    text: "寄付先が5自治体以内なら、申請書を郵送します。2027年1月10日は日曜日なので、早めの投函が安心です。",
    color: "#7c3aed",
  },
  {
    when: "2〜3月(3/15ごろまで)",
    title: "確定申告(6自治体以上など)",
    text: "ワンストップ特例を使えない場合は、確定申告で控除を受けます。受領証明書を、なくさずに保管します。",
    color: "#be185d",
  },
  {
    when: "翌年6月ごろ",
    title: "控除を確認する",
    text: "住民税の決定通知書で、寄付した分の控除が反映されているかを確認します。",
    color: "#15803d",
  },
];

export default function FurusatoTimeline() {
  return (
    <figure style={{ margin: "24px 0" }}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 12 }}>
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            style={{
              flex: "1 1 180px",
              minWidth: 170,
              background: "#fff",
              border: `2px solid ${s.color}`,
              borderRadius: 12,
              padding: "12px 14px",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: s.color, display: "inline-block", padding: "2px 10px", borderRadius: 999 }}>
              {i + 1}. {s.when}
            </div>
            <div style={{ fontWeight: 800, margin: "8px 0 4px", lineHeight: 1.5 }}>{s.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}>{s.text}</div>
          </li>
        ))}
      </ol>
      <figcaption style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.7 }}>
        2026年分のふるさと納税の流れ。ワンストップ特例の申請書と確定申告は、どちらか一方で手続きします。
      </figcaption>
    </figure>
  );
}
