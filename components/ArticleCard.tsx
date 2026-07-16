import Link from "next/link";
import { IconThumb } from "./icons/ArticleIcons";

type Props = {
  href: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
};

export default function ArticleCard({
  href,
  title,
  desc,
  icon,
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
          padding: 18,
          height: "100%",
        }}
      >
        {icon ? (
          <IconThumb icon={icon} />
        ) : (
          <div
            style={{
              width: "100%",
              height: 88,
              background: "#eff6ff",
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
        )}

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
