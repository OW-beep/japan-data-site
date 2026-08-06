import Link from "next/link";

type Props = {
  prefecture: string;
};

const cards = [
  {
    title: "人口ランキング",
    href: "/ranking/population",
    emoji: "👥",
  },
  {
    title: "人口密度ランキング",
    href: "/ranking/density",
    emoji: "🏙️",
  },
  {
    title: "高齢化率ランキング",
    href: "/ranking/aging",
    emoji: "👴",
  },
  {
    title: "出生率ランキング",
    href: "/ranking/birth-rate",
    emoji: "👶",
  },
  {
    title: "子ども人口ランキング",
    href: "/ranking/child",
    emoji: "🧒",
  },
  {
    title: "面積ランキング",
    href: "/ranking/area",
    emoji: "🗺️",
  },
];

export default function RelatedRankings({
  prefecture,
}: Props) {
  return (
    <section
      style={{
        marginTop: 50,
        marginBottom: 60,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 18,
        }}
      >
        関連ランキング
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.8,
          marginBottom: 24,
        }}
      >
        {prefecture}の自治体と比較したり、
        全国ランキングも確認できます。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 22,
                color: "#111827",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  marginBottom: 12,
                }}
              >
                {card.emoji}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {card.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}