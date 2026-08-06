type Row = {
  name: string;
  value: number;
};

export default function RestaurantSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg =
    ranking.reduce((s, r) => s + r.value, 0) /
    ranking.length;

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
          background: "#dbeafe",
          color: "#1d4ed8",
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
        飲食店密度ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口1,000人あたりの飲食店数を見ると、1位の
        <strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}
        店、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}
        店と、全国平均{avg.toFixed(1)}
        店を大きく上回りました。上位を占めるのは、大きく
        2つのタイプの自治体です。1つは東京都千代田区・
        中央区・港区・渋谷区のような、住民より通勤・通学者
        (昼間人口)がはるかに多いオフィス街。もう1つは、
        神奈川県箱根町、長野県白馬村・野沢温泉村、沖縄県
        竹富町のような、住民の何倍もの観光客が訪れる
        温泉地・リゾート地です。どちらも「住民人口」を
        分母にすると、実際の利用者数に対して飲食店が
        極端に多く見える結果になります。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        単独世帯割合ランキングの記事でも触れましたが、
        単身世帯が多い都市部では外食への依存度が高くなる
        傾向があります。飲食店密度が高い街は、住んでいる
        人にとっての「外食のしやすさ」であると同時に、
        その街を訪れる人の多さを映す鏡でもあるようです。
      </p>
    </section>
  );
}
