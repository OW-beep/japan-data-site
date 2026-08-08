import Link from "next/link";

const rankings = [
  { href: "/ranking/population", emoji: "👥", title: "人口" },
  { href: "/ranking/birth-rate", emoji: "👶", title: "出生率" },
  { href: "/ranking/child", emoji: "🧒", title: "子ども人口" },
  { href: "/ranking/aging", emoji: "🧓", title: "高齢化率" },
  { href: "/ranking/density", emoji: "🏙️", title: "人口密度" },
  { href: "/ranking/area", emoji: "🗺️", title: "面積" },
  { href: "/ranking/finance", emoji: "💰", title: "財政力指数" },
  { href: "/ranking/decline", emoji: "📊", title: "社会増減率" },
  { href: "/ranking/household", emoji: "🏠", title: "単独世帯割合" },
  { href: "/ranking/household-size", emoji: "👨‍👩‍👧‍👦", title: "平均世帯人員" },
  { href: "/ranking/doctors", emoji: "🩺", title: "医師数" },
  { href: "/ranking/unemployment", emoji: "💼", title: "完全失業率" },
  { href: "/ranking/manufacturing", emoji: "🏭", title: "製造業就業者比率" },
  { href: "/ranking/tax-ratio", emoji: "💴", title: "地方税自主財源比率" },
  { href: "/ranking/school-crowding", emoji: "🏫", title: "小学校規模" },
  { href: "/ranking/welfare-ratio", emoji: "🤝", title: "民生費比率" },
  { href: "/ranking/habitable-density", emoji: "🏔️", title: "可住地人口密度" },
  { href: "/ranking/natural-change", emoji: "👶", title: "自然増減率" },
  { href: "/ranking/decrease", emoji: "📉", title: "人口が少ない自治体" },
  { href: "/ranking/sparse-density", emoji: "🏞️", title: "人口密度が低い自治体" },
  { href: "/ranking/foreign-population", emoji: "🌏", title: "外国人人口比率" },
  { href: "/ranking/retail-access", emoji: "🛒", title: "高齢者あたり小売店数" },
  { href: "/ranking/balance-ratio", emoji: "🧮", title: "経常収支比率" },
  { href: "/ranking/marriage-rate", emoji: "💍", title: "婚姻率" },
  { href: "/ranking/daycare", emoji: "🧸", title: "保育園あたり子ども人口" },
  { href: "/ranking/restaurant", emoji: "🍜", title: "飲食店密度" },
  { href: "/ranking/library", emoji: "📚", title: "図書館数" },
  { href: "/ranking/vacant-house", emoji: "🏚️", title: "空き家率" },
  { href: "/ranking/daytime-ratio", emoji: "🌆", title: "昼夜間人口比率" },
  { href: "/ranking/elderly-home", emoji: "🏡", title: "高齢者施設数" },
];

export default function RankingSection() {
  return (
    <section
      style={{
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
          }}
        >
          📊 ランキングから探す
        </h2>

        <Link
          href="/ranking"
          style={{
            fontSize: 14,
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
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(150px,1fr))",
          gap: 12,
        }}
      >
        {rankings.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "16px 14px",
                textAlign: "center",
                height: "100%",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>
                {item.emoji}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
