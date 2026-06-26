import Link from "next/link";

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          color: "white",
          borderRadius: 20,
          padding: 32,
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: 40,
            marginBottom: 16,
          }}
        >
          🇯🇵 日本自治体データランキング
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.8,
            opacity: 0.95,
          }}
        >
          全国1,700以上の自治体データをランキングで比較。
          <br />
          人口・面積・人口密度などを見やすくまとめています。
        </p>
      </section>

      {/* ランキング */}
      <h2 style={{ marginBottom: 20 }}>
        📊 人気ランキング
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <Card
          href="/ranking/population"
          emoji="👥"
          title="人口ランキング"
          desc="全国の人口ランキングを見る"
        />

        <Card
          href="/ranking/area"
          emoji="🗺️"
          title="面積ランキング"
          desc="広い自治体ランキング"
        />

        <Card
          href="/ranking/density"
          emoji="🏙️"
          title="人口密度ランキング"
          desc="最も人口が密集する自治体"
        />

        <Card
          href="/search"
          emoji="🔎"
          title="自治体検索"
          desc="自治体名からデータを検索"
        />
      </div>

      {/* 記事 */}
      <h2 style={{ marginBottom: 20 }}>
        📚 データの見方・解説
      </h2>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <Article
          href="/articles/population"
          title="人口ランキングの見方"
        />

        <Article
          href="/articles/area"
          title="面積ランキングの見方"
        />

        <Article
          href="/articles/density"
          title="人口密度ランキングの見方"
        />
      </div>
    </main>
  );
}

function Card({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 24,
        borderRadius: 18,
        background: "white",
        textDecoration: "none",
        color: "#111",
        boxShadow: "0 8px 20px rgba(0,0,0,.06)",
        border: "1px solid #e5e7eb",
        transition: ".2s",
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 12,
        }}
      >
        {emoji}
      </div>

      <h3
        style={{
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#666",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </Link>
  );
}

function Article({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 20,
        borderRadius: 16,
        background: "#f8fafc",
        textDecoration: "none",
        color: "#111827",
        border: "1px solid #e5e7eb",
      }}
    >
      📖 {title}
    </Link>
  );
}