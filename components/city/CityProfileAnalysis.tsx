import { getCityProfile } from "@/lib/cityProfile";

/**
 * 自治体の「プロフィール分析」。指標の組み合わせから判定したタイプと、
 * タイプに応じた考察、将来推計の読み解き、際立つ指標のメモを出す。
 *
 * CityNarrative(人口と年齢構成の数字)が全自治体に同じ骨格で付くのに対し、
 * こちらはタイプ判定によって文章の中身そのものが自治体ごとに変わる。
 * 表示するのは index 対象(人口10万人以上)の自治体だけ(呼び出し側で制御)。
 * 船橋市は専用の深掘り(FunabashiDeepDive)があるため対象外。
 */
export default function CityProfileAnalysis({ code }: { code: string }) {
  const p = getCityProfile(code);
  if (!p) return null;

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
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18 }}>{p.short}のプロフィール分析(タイプと将来像)</h2>

      <p style={{ lineHeight: 2, color: "#374151" }}>
        指標の組み合わせから見た{p.short}の主なタイプは
        <strong style={{ color: "#1d4ed8" }}>「{p.typeLabel}」</strong>
        です。
        {p.secondaryLabel && <>あわせて「{p.secondaryLabel}」の性格も持ちます。</>}
        人口の動き、昼と夜の人口、産業や医療の集積といった数字の出方から判定しています。
      </p>

      {p.paragraphs.map((t, i) => (
        <p key={i} style={{ lineHeight: 2, color: "#374151" }}>
          {t}
        </p>
      ))}

      {p.future && (
        <>
          <h3 style={{ fontSize: 19, fontWeight: 800, margin: "22px 0 10px" }}>
            将来の読み解き{p.futureClass ? `(軌道: ${p.futureClass})` : ""}
          </h3>
          <p style={{ lineHeight: 2, color: "#374151" }}>{p.future}</p>
        </>
      )}

      {p.notes.length > 0 && (
        <>
          <h3 style={{ fontSize: 19, fontWeight: 800, margin: "22px 0 10px" }}>際立つ指標のメモ</h3>
          <ul style={{ lineHeight: 2, color: "#374151", paddingLeft: 22, margin: 0 }}>
            {p.notes.map((note) => (
              <li key={note.label} style={{ marginBottom: 8 }}>
                <strong>{note.label}:</strong>
                {note.text}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.9, marginTop: 18 }}>
        この分析は、公表統計の指標を組み合わせて機械的に判定したもので、個々の地域事情をすべて反映するものではありません。
        タイプは「その自治体の評価」ではなく、数字の出方の読み解きです。将来推計は国立社会保障・人口問題研究所の推計(令和2年国勢調査基準)に基づく見通しで、確定した未来ではありません。
      </p>
    </section>
  );
}
