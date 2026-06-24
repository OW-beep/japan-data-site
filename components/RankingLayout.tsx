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
        <p style={desc}>{description}</p>
      </div>

      <div style={body}>{children}</div>
    </main>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
  padding: 24,
};

const hero: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto 20px",
};

const h1: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
};

const desc: React.CSSProperties = {
  color: "#555",
  marginTop: 6,
  lineHeight: 1.6,
};

const body: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
};