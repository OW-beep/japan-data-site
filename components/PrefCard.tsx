import Link from "next/link";

type Props = {
  href: string;
  name: string;
};

export default function PrefCard({
  href,
  name,
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
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          textAlign: "center",
          color: "#111827",
          fontWeight: 600,
        }}
      >
        {name}
      </div>
    </Link>
  );
}