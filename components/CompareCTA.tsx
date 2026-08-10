import Link from "next/link";

export default function CompareCTA() {
  return (
    <Link
      href="/compare"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 24,
        marginBottom: 24,
        padding: "18px 22px",
        background: "linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%)",
        borderRadius: 14,
        textDecoration: "none",
        color: "#fff",
      }}
    >
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
          ⚖️ 気になる2つの自治体を並べて比較する
        </div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>
          人口・財政・医療など16指標で、候補の街を横並びに比較できます
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, whiteSpace: "nowrap" }}>
        →
      </div>
    </Link>
  );
}
