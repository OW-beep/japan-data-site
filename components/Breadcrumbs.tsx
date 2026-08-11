import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

type Crumb = {
  name: string;
  href?: string; // 最後の要素(現在地)は省略可
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "ホーム", href: "/" }, ...items];

  return (
    <nav aria-label="パンくずリスト" style={nav}>
      {full.map((c, i) => (
        <span key={i}>
          {c.href ? (
            <Link href={c.href} style={link}>
              {c.name}
            </Link>
          ) : (
            <span style={current}>{c.name}</span>
          )}
          {i < full.length - 1 && <span style={sep}>›</span>}
        </span>
      ))}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: full.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}

const nav: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 16,
};

const link: React.CSSProperties = {
  color: "#6b7280",
  textDecoration: "underline",
};

const current: React.CSSProperties = {
  color: "#374151",
};

const sep: React.CSSProperties = {
  margin: "0 6px",
  color: "#d1d5db",
};
