import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 20px 80px",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8,#0f172a)",
          color: "#fff",
          borderRadius: 24,
          padding: 40,
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontSize: 42,
            marginBottom: 20,
            lineHeight: 1.3,
          }}
        >
          🇯🇵 日本自治体データランキング
        </h1>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.9,
            opacity: 0.95,
            maxWidth: 700,
          }}
        >
          全国1747自治体の人口・面積・人口密度・子ども人口・高齢化率などを
          オープンデータから集計しています。
          <br />
          日本全国をデータで比較できるサイトです。
        </p>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginTop: 32,
          }}
        >
          <Stat number="1747+" label="自治体掲載" />
          <Stat number="5+" label="ランキング" />
          <Stat number="9+" label="解説記事" />
          <Stat number="100%" label="オープンデータ" />
        </div>
      </section>

      {/* 人気ランキング */}

      <h2
        style={{
          fontSize: 30,
          marginBottom: 24,
        }}
      >
        📊 人気ランキング
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
          marginBottom: 60,
        }}
      >
        <Card
          href="/ranking/population"
          emoji="👥"
          title="人口ランキング"
          desc="全国1747自治体の人口ランキング"
        />

        <Card
          href="/ranking/area"
          emoji="🗺️"
          title="面積ランキング"
          desc="面積が広い自治体ランキング"
        />

        <Card
          href="/ranking/density"
          emoji="🏙️"
          title="人口密度ランキング"
          desc="人口密度が高い自治体"
        />

        <Card
          href="/ranking/child"
          emoji="👶"
          title="子ども人口ランキング"
          desc="子どもが多い自治体"
        />

        <Card
          href="/ranking/aging"
          emoji="👴"
          title="高齢化率ランキング"
          desc="高齢化率が高い自治体"
        />
      </div>

      {/* 人気記事 */}

      <h2
        style={{
          fontSize: 30,
          marginBottom: 24,
        }}
      >
        📖 人気記事
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 20,
          marginBottom: 60,
        }}
      >
        <ArticleCard
          href="/articles/population-about"
          title="人口ランキングとは？"
          desc="人口ランキングの見方やデータの意味を分かりやすく解説。"
        />

        <ArticleCard
          href="/articles/population-concentration"
          title="人口集中はどこで起きている？"
          desc="人口集中の現状をデータで分析。"
        />

        <ArticleCard
          href="/articles/million-cities"
          title="人口100万人以上の都市一覧"
          desc="日本の大都市を一覧で紹介。"
        />

        <ArticleCard
          href="/articles/population-top50"
          title="人口ランキングTOP50"
          desc="全国の人口ランキングTOP50。"
        />

        <ArticleCard
          href="/articles/child-top50"
          title="子ども人口ランキングTOP50"
          desc="子ども人口が多い自治体を紹介。"
        />

        <ArticleCard
          href="/articles/aging-top50"
          title="高齢化率ランキングTOP50"
          desc="高齢化率が高い自治体ランキング。"
        />

        <ArticleCard
          href="/articles/youngest-municipalities"
          title="日本一若い自治体ランキング"
          desc="平均年齢が若い自治体を紹介。"
        />

        <ArticleCard
          href="/articles/birth-rate"
          title="出生率ランキング"
          desc="出生率の高い自治体を比較。"
        />

        <ArticleCard
          href="/articles/decline"
          title="人口減少ランキング"
          desc="人口減少が進む自治体を分析。"
        />
      </div>      {/* カテゴリ */}

      <h2
        style={{
          fontSize: 30,
          marginBottom: 24,
        }}
      >
        📂 カテゴリ
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 60,
        }}
      >
        <CategoryCard href="/ranking/population" text="👥 人口" />
        <CategoryCard href="/ranking/area" text="🗺️ 面積" />
        <CategoryCard href="/ranking/density" text="🏙️ 人口密度" />
        <CategoryCard href="/ranking/child" text="👶 子ども人口" />
        <CategoryCard href="/ranking/aging" text="👴 高齢化率" />
      </div>

      {/* 検索 */}

      <section
        style={{
          background: "#eff6ff",
          borderRadius: 20,
          padding: 32,
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontSize: 30,
            marginBottom: 16,
          }}
        >
          🔎 自治体を検索
        </h2>

        <p
          style={{
            color: "#555",
            lineHeight: 1.8,
            marginBottom: 24,
          }}
        >
          全国1747自治体を検索できます。
        </p>

        <Link
          href="/search"
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            padding: "14px 24px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          自治体検索はこちら →
        </Link>
      </section>

      {/* オープンデータ */}

      <section
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: 40,
        }}
      >
        <h2
          style={{
            fontSize: 28,
            marginBottom: 20,
          }}
        >
          🌏 当サイトについて
        </h2>

        <p
          style={{
            color: "#555",
            lineHeight: 1.9,
          }}
        >
          当サイトは国や自治体が公開するオープンデータをもとに、
          日本全国1747自治体の統計情報をランキング形式で紹介しています。
        </p>

        <ul
          style={{
            marginTop: 20,
            lineHeight: 2,
            color: "#444",
          }}
        >
          <li>総務省統計局（e-Stat）</li>
          <li>国土地理院</li>
          <li>総務省オープンデータ</li>
        </ul>
      </section>
    </main>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.12)",
        borderRadius: 16,
        padding: 20,
        minWidth: 150,
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        {number}
      </div>

      <div
        style={{
          opacity: .9,
        }}
      >
        {label}
      </div>
    </div>
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
        textDecoration: "none",
        color: "#111",
        background: "#fff",
        borderRadius: 18,
        padding: 24,
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 18px rgba(0,0,0,.05)",
      }}
    >
      <div style={{ fontSize: 40 }}>{emoji}</div>

      <h3 style={{ marginTop: 14 }}>
        {title}
      </h3>

      <p
        style={{
          color: "#666",
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
    </Link>
  );
}

function ArticleCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        color: "#111",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: 22,
        boxShadow: "0 3px 14px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          fontSize: 24,
          marginBottom: 12,
        }}
      >
        📖
      </div>

      <h3
        style={{
          marginBottom: 10,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#666",
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>

      <div
        style={{
          marginTop: 18,
          color: "#2563eb",
          fontWeight: 700,
        }}
      >
        続きを読む →
      </div>
    </Link>
  );
}

function CategoryCard({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#2563eb",
        border: "2px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: 999,
        padding: "12px 22px",
        fontWeight: 700,
      }}
    >
      {text}
    </Link>
  );
}