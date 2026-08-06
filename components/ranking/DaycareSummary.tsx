type Row = {
  name: string;
  value: number;
};

export default function DaycareSummary({
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
        保育園1施設あたりの子ども人口ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        この指標は、保育園1施設あたりに何人の子どもがいるかを
        表しており、<strong>数字が小さいほど、子どもの数に対して
        保育施設に余裕がある</strong>ことを意味します。今回1位の
        <strong>{ranking[0].name}</strong>
        は保育園1施設あたり{ranking[0].value.toFixed(0)}
        人、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(0)}
        人と、全国平均{avg.toFixed(0)}
        人を大きく下回りました。上位には、人口減少が進む
        地方の町村が並んでいます。子どもの絶対数が少ない
        分、施設あたりの余裕は生まれやすい一方、それがそのまま
        「子育てしやすい」と言い切れるかは別の問題です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        統計を扱ってきた立場から一つ注意点を挙げると、この
        「保育園数」という統計は、認可保育所・認定こども園・
        小規模保育事業所など施設の種類によって集計方法に
        ばらつきが出やすい項目です。特に大都市では、統計上の
        カウント方法によって実際の保育施設数より少なく
        見えている可能性があり、この指標だけで「保育が
        充実しているか」を判断するのは早計です。あくまで
        目安の一つとして見ていただければと思います。
      </p>
    </section>
  );
}
