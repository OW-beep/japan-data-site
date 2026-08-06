type Row = {
  name: string;
  naturalRate: number;
};

export default function NaturalChangeSummary({
  ranking,
  positiveCount,
  totalCount,
}: {
  ranking: Row[];
  positiveCount: number;
  totalCount: number;
}) {
  if (ranking.length === 0) return null;

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
        自然増減率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        出生数から死亡数を引いた自然増減率がプラス、つまり
        「生まれる人の方が亡くなる人より多い」自治体は、
        全国{totalCount.toLocaleString()}
        自治体のうちわずか
        <strong> {positiveCount}自治体(
        {((positiveCount / totalCount) * 100).toFixed(1)}%)
        </strong>
        しかありませんでした。1位の<strong>{ranking[0].name}</strong>
        でも人口千人あたり{ranking[0].naturalRate.toFixed(1)}
        人の増加にとどまっています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        詳しい背景は、あわせて公開している解説記事で紹介して
        います。
      </p>
    </section>
  );
}
