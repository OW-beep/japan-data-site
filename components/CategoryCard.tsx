import Link from "next/link";

type Props = {
  href: string;
  text: string;
};

export default function CategoryCard({
  href,
  text,
}: Props) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background: "#2563eb",
          color: "#fff",
          borderRadius: 999,
          padding: "14px 22px",
          fontWeight: 700,
        }}
      >
        {text}
      </div>
    </Link>
  );
}