import Link from "next/link";

type Props = {
  href: string;
  title: string;
  desc: string;
};

export default function ArticleCard({
  href,
  title,
  desc,
}: Props) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 22,
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 140,
            background: "#eff6ff",
            borderRadius: 12,
            marginBottom: 18,
          }}
        />

        <h3>{title}</h3>

        <p
          style={{
            color: "#666",
            lineHeight: 1.8,
          }}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}