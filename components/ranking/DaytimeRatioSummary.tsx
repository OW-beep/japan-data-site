type Row = {
  name: string;
  value: number;
};

export default function DaytimeRatioSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg = ranking.reduce((s, r) => s + r.value, 0) / ranking.length;
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
        昼夜間人口比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国平均は{avg.toFixed(1)}
        %(ほぼ100%)でしたが、1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}
        %、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}
        %と、住民登録人口の2倍以上の人が昼間その街で活動して
        いることになります。上位には東京・大阪・名古屋の
        都心区が並ぶ一方、福島県内の自治体もいくつか
        入っており、これは東日本大震災の避難区域で夜間人口が
        極端に少ない中、除染・復興関連の作業者が日中は
        多く滞在していることを反映したものと考えられます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        下位(比率が低い自治体)は、いずれも大都市への通勤・
        通学者が多い、いわゆるベッドタウンです。同じ「人口」
        でも、住民登録上の人口と、実際にその街で日中を
        過ごす人の数は、まったく違う姿を映し出しています。
      </p>
    </section>
  );
}
