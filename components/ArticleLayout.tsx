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
return ( <main style={container}> <h1 style={titleStyle}>
{title} </h1>


  <p style={summaryStyle}>
    {summary}
  </p>

  <div style={hero}>
    <div style={heroLabelStyle}>
      {heroLabel}
    </div>

    <div style={heroValueStyle}>
      {heroValue}
    </div>
  </div>

  <h2>
    🏆 TOP3
  </h2>

  <div style={topGrid}>
    {top3.map((item) => (
      <div
        key={item.rank}
        style={topCard}
      >
        <div style={rankStyle}>
          #{item.rank}
        </div>

        <div style={nameStyle}>
          {item.name}
        </div>

        <div style={valueStyle}>
          {item.value}
        </div>
      </div>
    ))}
  </div>

  <div>
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
fontSize: 36,
fontWeight: 800,
};

const summaryStyle: React.CSSProperties = {
color: "#6b7280",
marginBottom: 24,
};

const hero: React.CSSProperties = {
background:
"linear-gradient(135deg,#2563eb,#1d4ed8)",
color: "white",
padding: 30,
borderRadius: 20,
textAlign: "center",
marginBottom: 30,
};

const heroLabelStyle: React.CSSProperties = {
fontSize: 18,
};

const heroValueStyle: React.CSSProperties = {
fontSize: 48,
fontWeight: 800,
};

const topGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(250px,1fr))",
gap: 16,
marginBottom: 30,
};

const topCard: React.CSSProperties = {
background: "#fff",
border: "1px solid #e5e7eb",
borderRadius: 16,
padding: 20,
};

const rankStyle: React.CSSProperties = {
color: "#2563eb",
fontWeight: 700,
};

const nameStyle: React.CSSProperties = {
marginTop: 8,
fontWeight: 700,
};

const valueStyle: React.CSSProperties = {
marginTop: 8,
fontSize: 24,
fontWeight: 800,
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
