import { TAGS, type TagKey } from "@/lib/articleTags";

export default function ArticleTags({ tags }: { tags: TagKey[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 14,
      }}
    >
      {tags.map((key) => {
        const t = TAGS[key];
        if (!t) return null;
        return (
          <span
            key={key}
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
              background: t.bg,
              color: t.fg,
              letterSpacing: 0.3,
            }}
          >
            {t.label}
          </span>
        );
      })}
    </div>
  );
}
