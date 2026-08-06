import Link from "next/link";

type Item = {
  name: string;
  href: string;
};

export default function Breadcrumb({
  items,
}: {
  items: Item[];
}) {
  return (
    <nav
      style={{
        marginBottom: 24,
        fontSize: 14,
      }}
    >
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && " > "}

          <Link
            href={item.href}
            style={{
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}