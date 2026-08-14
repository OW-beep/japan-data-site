import Link from "next/link";
import { TAGS, type TagKey } from "@/lib/articleTags";

const articles: {
  title: string;
  href: string;
  emoji: string;
  desc: string;
  tag: TagKey;
  fresh?: boolean;
}[] = [
  {
    title: "財政健全度スコア(4指標統合)",
    href: "/articles/fiscal-health-composite",
    emoji: "🏅",
    desc: "独自の複合指標で算出。夕張市が桁違いの最下位という結果に。",
    tag: "finance",
    fresh: true,
  },
  {
    title: "実質公債費比率ランキング分析",
    href: "/articles/debt-service-ratio-analysis",
    emoji: "💳",
    desc: "夕張市が突出。東京23区は軒並みマイナスの好対照。",
    tag: "finance",
  },
  {
    title: "教育費ランキング分析",
    href: "/articles/education-expense-analysis",
    emoji: "🏫",
    desc: "北海道の小さな町が上位独占。人口規模との関係を解説。",
    tag: "child",
  },
  {
    title: "外国人人口比率ランキング分析",
    href: "/articles/foreign-population",
    emoji: "🌏",
    desc: "1位は19%の農村。農業・製造業・都心の3パターン。",
    tag: "international",
  },
  {
    title: "買い物難民ランキング分析",
    href: "/articles/shopping-access",
    emoji: "🛒",
    desc: "過疎の山村より郊外ニュータウンが危ない、意外な実態。",
    tag: "aging",
  },
  {
    title: "出生率ランキング分析",
    href: "/articles/birth-rate",
    emoji: "👶",
    desc: "鹿児島・沖縄の島しょ部が上位に来る理由を解説。",
    tag: "child",
  },
  {
    title: "高齢化率TOP50",
    href: "/articles/aging-top50",
    emoji: "🧓",
    desc: "高齢化率が高い自治体の特徴を比較。",
    tag: "aging",
  },
  {
    title: "少子高齢化ギャップ分析",
    href: "/articles/aging-gap",
    emoji: "📉",
    desc: "高齢化率が子ども割合を最大62.9pt上回る自治体。",
    tag: "aging",
  },
  {
    title: "財政力指数と高齢化率の関係",
    href: "/articles/aging-finance",
    emoji: "💰",
    desc: "相関係数-0.71。それでも財政が強い例外自治体。",
    tag: "finance",
  },
  {
    title: "財政の中身分析",
    href: "/articles/tax-composition",
    emoji: "💴",
    desc: "自主財源比率63.8%の村と1.7%の村、その差とは。",
    tag: "finance",
  },
  {
    title: "学校規模ランキング分析",
    href: "/articles/school-crowding",
    emoji: "🏫",
    desc: "1校2293人のマンモス校の町と21人の離島の学校。",
    tag: "child",
  },
  {
    title: "民生費と高齢化率の意外な関係",
    href: "/articles/welfare-aging",
    emoji: "🤝",
    desc: "相関係数-0.61。高齢化率が高いほど比率が下がる謎。",
    tag: "finance",
  },
  {
    title: "可住地人口密度ランキング分析",
    href: "/articles/habitable-density",
    emoji: "🏔️",
    desc: "三重県尾鷲市は「見た目より混んでいる」自治体だった。",
    tag: "geography",
  },
  {
    title: "自然増減率ランキング分析",
    href: "/articles/natural-change",
    emoji: "👶",
    desc: "自然増加している自治体は全国でわずか34。",
    tag: "population",
  },
  {
    title: "医師数ランキング分析",
    href: "/articles/doctors-analysis",
    emoji: "🩺",
    desc: "医科大学の城下町が独占。医師ゼロの29町村も。",
    tag: "medical",
  },
  {
    title: "完全失業率ランキング分析",
    href: "/articles/unemployment-analysis",
    emoji: "💼",
    desc: "福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのか。",
    tag: "labor",
  },
  {
    title: "産業構造分析",
    href: "/articles/industry-structure",
    emoji: "🏭",
    desc: "農業の町・ものづくりの町・サービス業の町を比較。",
    tag: "industry",
  },
  {
    title: "単独世帯割合とU字の関係",
    href: "/articles/household-aging-ushape",
    emoji: "🏠",
    desc: "相関係数はほぼ0なのに現れるU字型の謎。",
    tag: "household",
  },
];

export default function ArticlesSection() {
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
          📖 おすすめ記事
        </h2>

        <Link
          href="/articles"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          すべての記事を見る →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 16,
        }}
      >
        {articles.map((article) => {
          const t = TAGS[article.tag];
          return (
            <Link
              key={article.href}
              href={article.href}
              style={{
                textDecoration: "none",
                color: "#111827",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 18,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 24 }}>
                    {article.emoji}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    {article.fresh && (
                      <span
                        style={{
                          background: "#fef2f2",
                          color: "#dc2626",
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        NEW
                      </span>
                    )}
                    <span
                      style={{
                        background: t.bg,
                        color: t.fg,
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {article.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.6,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  {article.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
