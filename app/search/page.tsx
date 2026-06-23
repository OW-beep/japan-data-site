"use client";

import { useMemo, useState } from "react";
import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return cities
      .filter((c) =>
        c.name.includes(query) || c.code.includes(query)
      )
      .slice(0, 50);
  }, [query]);

  return (
    <main style={{ padding: 20 }}>
      <h1>自治体検索</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="例：船橋市"
        style={{
          padding: 8,
          width: "100%",
          marginBottom: 20,
        }}
      />

      <ul>
        {results.map((c) => (
          <li key={c.code}>
            <Link href={`/city/${c.code}`}>
              {c.name}（{c.population?.toLocaleString()}）
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}