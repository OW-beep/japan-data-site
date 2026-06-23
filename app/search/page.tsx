"use client";

import { useState } from "react";
import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const [q, setQ] = useState("");

  const results = cities
    .filter((c) =>
      c.name.includes(q)
    )
    .slice(0, 50);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>🔎 自治体検索</h1>

      <input
        value={q}
        onChange={(e) =>
          setQ(e.target.value)
        }
        placeholder="例：船橋市 / 大阪"
        style={{
          width: "100%",
          padding: 12,
          marginTop: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: 20 }}>
        {results.map((c) => (
          <Link
            key={c.code}
            href={`/city/${c.code}`}
            style={{
              display: "block",
              padding: 12,
              background: "white",
              marginBottom: 8,
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </main>
  );
}