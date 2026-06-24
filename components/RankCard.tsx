export default function RankCard({
  rank,
  name,
  value,
  unit,
}: {
  rank: number;
  name: string;
  value: number;
  unit: string;
}) {
  const top3 = rank <= 3;

  return (
    <div style={{ ...card, ...(top3 ? top : {}) }}>
      <div style={left}>
        <div style={{ ...badge, ...(top3 ? badgeTop : {}) }}>
          {rank}
        </div>
        <div style={{ fontWeight: 600 }}>{name}</div>
      </div>

      <div style={valueStyle}>
        {value.toLocaleString()}
        <span style={{ fontSize: 12, marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 14,
  marginBottom: 8,
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const top: React.CSSProperties = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const badge: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const badgeTop: React.CSSProperties = {
  background: "#f59e0b",
  color: "white",
};

const valueStyle: React.CSSProperties = {
  fontWeight: 800,
};