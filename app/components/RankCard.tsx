export default function RankCard({
  rank,
  name,
  value,
  unit = "",
}: {
  rank: number;
  name: string;
  value: number;
  unit?: string;
}) {
  const isTop3 = rank <= 3;

  return (
    <div style={{ ...card, ...(isTop3 ? topCard : {}) }}>
      <div style={left}>
        <div style={{ ...badge, ...(isTop3 ? topBadge : {}) }}>
          {rank}
        </div>
        <div style={nameStyle}>{name}</div>
      </div>

      <div style={valueStyle}>
        {value.toLocaleString()}
        {unit}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 18px",
  marginBottom: 10,
  borderRadius: 14,
  background: "white",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const topCard: React.CSSProperties = {
  background: "linear-gradient(90deg, #fff7ed, #fff)",
  border: "1px solid #fed7aa",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const badge: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const topBadge: React.CSSProperties = {
  background: "#f59e0b",
  color: "white",
};

const nameStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 15,
};

const valueStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 16,
};