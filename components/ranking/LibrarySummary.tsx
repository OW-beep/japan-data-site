type Row = {
  name: string;
  value: number;
};

export default function LibrarySummary({ ranking }: { ranking: Row[] }) {
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
        図書館数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        この指標は、人口10万人以上の自治体を対象に、図書館
        1館あたりの人口を計算したものです。数字が小さいほど、
        人口に対して図書館が充実していることを意味します。
        1位の<strong>{ranking[0].name}</strong>
        は図書館1館あたり
        {Math.round(ranking[0].value).toLocaleString()}
        人、10位の<strong>{tenth.name}</strong>
        でも{Math.round(tenth.value).toLocaleString()}
        人と、全国平均
        {Math.round(avg).toLocaleString()}
        人を大きく下回りました。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        一方で、人口30万人を超える都市の中には、図書館が
        1〜2館しかない自治体も見つかりました。図書館の
        設置数は自治体の面積や合併の経緯にも左右されるため、
        単純な人口比較だけでなく、分館やコミュニティ施設内の
        図書コーナーの有無なども含めて実態を確認することを
        おすすめします。
      </p>
    </section>
  );
}
