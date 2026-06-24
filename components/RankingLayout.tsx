import DataNote from "@/components/DataNote";

export default function RankingLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main style={wrap}>
      <div style={hero}>
        <h1 style={h1}>{title}</h1>
        {description && <p style={desc}>{description}</p>}
      </div>

      <div style={grid}>{children}</div>

      <DataNote />

      <footer style={footer}>
        Japan Data Ranking · powered by e-Stat
      </footer>
    </main>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  padding: "40px 16px",
};

const hero: React.CSSProperties = {
  maxWidth: 1000,
  margin: "0 auto 24px",
};

const h1: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const desc: React.CSSProperties = {
  color: "#555",
  marginTop: 8,
  lineHeight: 1.6,
};

const grid: React.CSSProperties = {
  maxWidth: 1000,
  margin: "0 auto",
};

const footer: React.CSSProperties = {
  marginTop: 40,
  textAlign: "center",
  fontSize: 12,
  color: "#888",
};