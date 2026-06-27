import Link from "next/link";

type Props = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
};

export default function Card({
  href,
  emoji,
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
          borderRadius: 18,
          border: "1px solid #e5e7eb",
          padding: 24,
          height: "100%",
          transition: ".2s",
        }}
      >
        <div style={{ fontSize: 42 }}>{emoji}</div>

        <h3
          style={{
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.8,
          }}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}