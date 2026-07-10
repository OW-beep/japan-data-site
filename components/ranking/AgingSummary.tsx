type Props = {
  average: number;
  cityCount: number;
};

export default function AgingSummary({
  average,
  cityCount,
}: Props) {
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

      <h2
        style={{
          marginTop: 0,
          fontSize: 24,
        }}
      >
        高齢化率ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        高齢化率が高い自治体は、
        山間部や離島など人口減少が続く地域に多い傾向があります。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        一方で都市部では若年層の流入が多く、
        高齢化率が比較的低くなる傾向があります。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        高齢化率は、
        「高齢者が多い」というより、
        「若い世代との割合」で決まる指標です。
      </p>

      <p
        style={{
          marginBottom: 0,
          fontWeight: 700,
        }}
      >
        全国平均：
        {average.toFixed(2)}%
        （対象自治体 {cityCount.toLocaleString()}）
      </p>
    </section>
  );
}