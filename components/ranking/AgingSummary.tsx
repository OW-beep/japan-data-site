type Props = {
  average: number;
  cityCount: number;
  top3?: { name: string; rate: number }[];
};

export default function AgingSummary({
  average,
  cityCount,
  top3,
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
        {top3 && top3.length >= 3 && (
          <>
            {" "}
            今回のランキングでは<strong>{top3[0].name}</strong>
            が{top3[0].rate.toFixed(1)}%で最も高く、
            <strong>{top3[1].name}</strong>
            （{top3[1].rate.toFixed(1)}%）、
            <strong>{top3[2].name}</strong>
            （{top3[2].rate.toFixed(1)}%）と続きます。
          </>
        )}
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        一方で都市部では若年層の流入が多く、
        高齢化率が比較的低くなる傾向があります。
        進学や就職を機に若年層が都市部へ移動する一方、地方に残った
        高齢世代の割合が相対的に高まることが、地域間の格差を広げる
        大きな要因になっています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        高齢化率は、
        「高齢者が多い」というより、
        「若い世代との割合」で決まる指標です。
        同じ高齢者数でも、若年人口が流出している自治体ほど
        高齢化率は高く算出される点に注意が必要です。
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