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
    .slice(0, 30);

  return (
    <main style={page}>
      <h1>🔎 自治体検索</h1>

      <input
        value={q}
        onChange={(e) =>
          setQ(e.target.value)
        }
        placeholder="例：船橋 / 大阪 / 横浜"
        style={input}
      />

      <div>
        {results.map((c) => (
          <Link
            key={c.code}
            href={`/city/${c.code}`}
            style={card}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

const page = {
  maxWidth: 800,
  margin: "0 auto",
  padding: 24,
};

const input = {
  width: "100%",
  padding: 14,
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
};

const card = {
  display: "block",
  padding: 12,
  marginTop: 10,
  background: "white",
  borderRadius: 10,
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};