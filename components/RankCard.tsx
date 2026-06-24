export default function RankingCard({
  rank,
  name,
  value,
}: {
  rank: number;
  name: string;
  value: number;
}) {
  const bg =
    rank === 1
      ? "#FFD700"
      : rank === 2
      ? "#C0C0C0"
      : rank === 3
      ? "#CD7F32"
      : "white";

  return (
    <div style={{ ...box, background: bg }}>
      <div>
        {rank}. {name}
      </div>
      <div>{value.toLocaleString()}</div>
    </div>
  );
}

const box: React.CSSProperties = {
  padding: 14,
  marginBottom: 8,
  borderRadius: 12,
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 600,
};