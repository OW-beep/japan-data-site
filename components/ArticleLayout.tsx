import Link from "next/link";

type TopItem = {
  rank: number;
  name: string;
  value: string;
};

export default function ArticleLayout({
  title,
  summary,
  heroLabel,
  heroValue,
  top3,
  children,
  rankingLink,
}: {
  title: string;
  summary: string;
  heroLabel: string;
  heroValue: string;
  top3: TopItem[];
  children: React.ReactNode;
  rankingLink: string;
}) {
  return (
    <main style={container}>
      <h1 style={titleStyle}>{title}</h1>

      <p style={summaryStyle}>{summary}</p>

      <div style={hero}>
        <div style={heroLabelStyle}>
          {heroLabel}
        </div>

        <div style={heroValueStyle}>
          {heroValue}
        </div>
      </div>

      <h2 style={sectionTitle}>
        🏆 TOP3
      </h2>

      <div style={topGrid}>
        {top3.map((item) => (
          <div
            key={item.rank}
            style={{
              ...topCard,
              background:
                item.rank === 1
                  ? "#fff7cc"
                  : item.rank === 2
                  ? "#f3f4f6"
                  : item.rank === 3
                  ? "#fde7d8"
                  : "#fff",
            }}
          >
            <div style={rank}>
              #{item.rank}
            </div>

            <div style={name}>
              {item.name}
            </div>

            <div style={value}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div style={content}>
        {children}
      </div>

      <Link
        href={rankingLink}
        style={button}
      >
        ランキングを見る →
      </Link>
    </main>
  );
}

const container: React.CSSProperties = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 800,
  marginBottom: 12,
};

const summaryStyle: React.CSSProperties = {
  color: "#666",
  marginBottom: 24,
};

const hero: React.CSSProperties = {
  background: "#2563eb",
  color: "white",
  borderRadius: 16,
  padding: 24,
  textAlign: "center",
  marginBottom: 32,
};

const heroLabelStyle: React.CSSProperties = {
  fontSize: 16,
};

const heroValueStyle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 800,
};

const sectionTitle: React.CSSProperties = {
  marginBottom: 16,
};

const topGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 32,
};

const topCard: React.CSSProperties = {
  borderRadius: 16,
  padding: 20,
  border: "1px solid #e5e7eb",
};

const rank: React.CSSProperties = {
  fontWeight: 700,
};

const name: React.CSSProperties = {
  fontSize: 20,
  marginTop: 10,
};

const value: React.CSSProperties = {
  fontWeight: 700,
  marginTop: 10,
};

const content: React.CSSProperties = {
  lineHeight: 1.9,
};

const button: React.CSSProperties = {
  display: "inline-block",
  marginTop: 24,
  padding: "12px 18px",
  background: "#2563eb",
  color: "white",
  borderRadius: 10,
  textDecoration: "none",
};