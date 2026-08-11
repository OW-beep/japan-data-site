import Link from "next/link";

const featured = [
  {
    title: "人口100万人以上の都市は12市｜全国一覧とランキング",
    href: "/articles/million-cities",
    emoji: "🏙️",
    desc: "三大都市圏だけで何市を占めるのか、地域別の内訳まで分析。",
  },
  {
    title: "出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか",
    href: "/articles/birth-rate",
    emoji: "👶",
    desc: "市区町村別に加え、都道府県別の平均出生率ランキングも掲載。",
  },
  {
    title: "医師数ランキング分析：千代田区が全国1位",
    href: "/articles/doctors-analysis",
    emoji: "🏥",
    desc: "医師が1人もいない29町村の実態と、都道府県別の平均値。",
  },
];

export default function FeaturedArticlesSection() {
  return (
    <section style={{ marginTop: 48, marginBottom: 48 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
        📌 代表分析記事
      </h2>

      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        統計データを深掘りした、特におすすめの分析記事です。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 16,
        }}
      >
        {featured.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.emoji}</div>
            <div style={{ fontWeight: 700, marginBottom: 6, lineHeight: 1.5 }}>
              {a.title}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
              {a.desc}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
