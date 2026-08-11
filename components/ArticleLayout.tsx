import Link from "next/link";
import DataAsOf from "@/components/DataAsOf";
import ArticleTags from "@/components/ArticleTags";
import PublishedDate from "@/components/PublishedDate";
import AuthorByline from "@/components/AuthorByline";
import JsonLd from "@/components/JsonLd";
import meta from "@/data/meta.json";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import type { TagKey } from "@/lib/articleTags";

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
tags,
publishedAt,
path,
}: {
title: string;
summary: string;
heroLabel: string;
heroValue: string;
top3: TopItem[];
children: React.ReactNode;
rankingLink: string;
tags?: TagKey[];
publishedAt?: string;
/** 記事のURLパス(例: "/articles/million-cities")。
 *  渡すと Article 構造化データに mainEntityOfPage / url を含める。 */
path?: string;
}) {
return ( <main style={container}> {tags && <ArticleTags tags={tags} />}

  <h1 style={titleStyle}>
{title} </h1>


  <p style={summaryStyle}>
    {summary}
  </p>

  {publishedAt && <PublishedDate date={publishedAt} />}
  <DataAsOf />

  {publishedAt && (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: summary,
        datePublished: publishedAt,
        dateModified: meta.updatedAt,
        ...(path
          ? {
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${SITE_URL}${path}`,
              },
            }
          : {}),
        author: {
          "@type": "Person",
          name: `${SITE_NAME} 運営者`,
          url: `${SITE_URL}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }}
    />
  )}

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

  <AuthorByline />

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
