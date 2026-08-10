type Row = {
  name: string;
  value: number;
};

export default function RecyclingRateSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg = ranking.reduce((s, r) => s + r.value, 0) / ranking.length;

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
        ごみのリサイクル率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国平均は{avg.toFixed(1)}
        %でしたが、上位には全国的に「ごみ減量・リサイクルの
        優等生」として知られる鹿児島県大崎町(埋立処分場の
        延命化を目的に住民参加型の28品目分別を徹底し、
        リサイクル率日本一の常連)も入っています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        なお、上位の一部自治体は99%台という極めて高い数値
        となっており、通常のリサイクル率の分布から見ると
        統計的にやや不自然です。集計方法の違い(直接資源化量
        の計上方法など)による可能性があり、順位そのものより
        「大崎町のように住民参加型の取り組みで高い数値を
        出している自治体がある」という傾向として捉えることを
        おすすめします。また東京23区は共同のごみ処理組合で
        運営されているため、区単位のデータが存在せず、
        今回のランキング対象には含まれていません。
      </p>
    </section>
  );
}
