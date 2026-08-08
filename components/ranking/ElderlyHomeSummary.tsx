type Row = {
  name: string;
  value: number;
};

export default function ElderlyHomeSummary({
  ranking,
  zeroCount,
}: {
  ranking: Row[];
  zeroCount: number;
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
        高齢者施設数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        この指標は、老人ホーム1施設あたりの高齢者人口を示して
        おり、数字が小さいほど施設に余裕があります。1位の
        <strong>{ranking[0].name}</strong>
        は1施設あたり
        {Math.round(ranking[0].value).toLocaleString()}
        人、10位の<strong>{tenth.name}</strong>
        でも{Math.round(tenth.value).toLocaleString()}
        人と、全国平均
        {Math.round(avg).toLocaleString()}
        人を大きく下回りました。一方、老人ホームが1施設も
        ない自治体も全国に{zeroCount}
        あり、多くは高齢者人口自体が少ない小規模な町村です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        大都市を見ると、東京23区の多くが1施設あたりの高齢者
        人口が多い(=施設が手薄な)側に位置しています。地価の
        高さが、大規模な施設用地の確保を難しくしている
        可能性があります。
      </p>
    </section>
  );
}
