type Row = {
  name: string;
  per1000elderly: number;
};

export default function RetailAccessSummary({
  ranking,
  average,
}: {
  ranking: Row[];
  average: number;
}) {
  if (ranking.length === 0) return null;

  const tenth = ranking[Math.min(9, ranking.length - 1)];

  return (
    <section
      style={{
        marginTop: 35,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 30,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#ffedd5",
          color: "#c2410c",
          padding: "4px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        運営者コメント
      </div>

      <h2 style={{ marginTop: 0, fontSize: 24 }}>
        高齢者あたり小売店数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        高齢者(65歳以上)人口1,000人あたりの小売店数が最も
        少ないのは<strong>{ranking[0].name}</strong>
        で{ranking[0].per1000elderly.toFixed(1)}
        店。10位の<strong>{tenth.name}</strong>
        でも{tenth.per1000elderly.toFixed(1)}
        店と、全国平均({average.toFixed(1)}店)の半分にも
        届きません。上位(下位)には、大都市近郊の住宅
        専用ニュータウンが目立ちます。車での移動を前提に
        開発された郊外の町では、住民の高齢化とともに、
        身近な買い物の難しさが課題になりやすい傾向が
        見えてきます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(1)}店</strong>
        です。詳しい背景は、あわせて公開している解説記事で
        紹介しています。
      </p>
    </section>
  );
}
