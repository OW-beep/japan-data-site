import Link from "next/link";

/**
 * 「目的から探す(PurposeSection)」が実用ツール的な入口なのに対し、
 * ここは雑学・読み物として気軽に開いてもらうための入口。
 * 既存記事の中から、単体では埋もれがちな「意外な数字」フックを
 * 持つ記事をピックアップしている。新規データ取得は不要で、
 * 既存コンテンツの見せ方だけを変える構成。
 */
const reads = [
  {
    emoji: "🏙️",
    hook: "千代田区の昼間人口は夜間人口の13.5倍",
    href: "/articles/daytime-ratio-analysis",
  },
  {
    emoji: "🏫",
    hook: "1つの学校に2,293人が通う町がある",
    href: "/articles/school-crowding",
  },
  {
    emoji: "🦷",
    hook: "北海道の小さな町が歯科医師数で全国2位に入る理由",
    href: "/articles/dentist-access-analysis",
  },
  {
    emoji: "🏛️",
    hook: "長野県は集落ごとに公民館がある",
    href: "/articles/community-center-analysis",
  },
  {
    emoji: "♻️",
    hook: "ごみリサイクル率が日本一の町、大崎町の作戦",
    href: "/articles/recycling-rate-analysis",
  },
  {
    emoji: "🏠",
    hook: "市川市の財政力指数が1.07というベッドタウンの謎",
    href: "/articles/bedroom-town-finance-analysis",
  },
];

export default function NicheReadsSection() {
  return (
    <section style={{ marginTop: 40, marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        🧐 ちょっと気になる、自治体データの読み物
      </h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        調べ物というより、雑学として。統計データの中には、こういう
        「なんでそうなるの？」という数字がいろいろ隠れています。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {reads.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "14px 16px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1.4 }}>{r.emoji}</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: "#111827" }}>
              {r.hook}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
