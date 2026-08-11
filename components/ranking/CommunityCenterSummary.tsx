type Row = {
  name: string;
  value: number;
};

export default function CommunityCenterSummary({
  ranking,
  zeroCount,
  totalCount,
}: {
  ranking: Row[];
  zeroCount: number;
  totalCount: number;
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
        公民館数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        公民館1館あたりの人口(全国平均
        {Math.round(avg).toLocaleString()}
        人)で見ると、1位の<strong>{ranking[0].name}</strong>
        はわずか
        {Math.round(ranking[0].value).toLocaleString()}
        人、10位の<strong>{tenth.name}</strong>
        でも{Math.round(tenth.value).toLocaleString()}
        人と、集落ごとに公民館が置かれているような密度に
        なっています。一方、公民館が1館もない自治体も
        {zeroCount}
        あり(対象
        {totalCount.toLocaleString()}
        自治体中)、多くは都市部に集中しています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        都市部で公民館数が少ないのは、コミュニティセンターや
        地区センターなど、別の名称の類似施設に役割が置き
        換わっているためと考えられます。この統計は「公民館」
        という名称の施設に限られるため、都市部の生涯学習・
        地域活動インフラの実態を過小評価している可能性が
        ある点にご留意ください。
      </p>
    </section>
  );
}
