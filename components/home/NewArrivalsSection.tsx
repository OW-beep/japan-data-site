import Link from "next/link";

const newItems = [
  { href: "/ranking/community-center", emoji: "🏘️", title: "公民館数" },
  { href: "/ranking/recycling-rate", emoji: "♻️", title: "ごみのリサイクル率" },
  { href: "/ranking/young-adult-migration", emoji: "🎒", title: "20代純移動率" },
  { href: "/ranking/dentist", emoji: "🦷", title: "歯科医師数" },
  { href: "/ranking/retail-store", emoji: "🏬", title: "大型小売店数" },
  { href: "/ranking/elderly-home", emoji: "🏡", title: "高齢者施設数" },
];

export default function NewArrivalsSection() {
  return (
    <section style={{ marginTop: 40, marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 0,
          }}
        >
          🆕 新着ランキング
        </h2>

        <Link
          href="/ranking"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          すべてのランキングを見る →
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {newItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              padding: "9px 16px",
              textDecoration: "none",
              color: "#111827",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>{item.emoji}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
