"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCities } from "@/lib/getCities";

export default function SearchBox() {
  const cities = useMemo(() => getCities(), []);

  const [keyword, setKeyword] = useState("");

  const result = useMemo(() => {
    if (!keyword) return [];

    return cities
      .filter((c) =>
        c.name.toLowerCase().includes(keyword.toLowerCase())
      )
      .slice(0, 20);
  }, [keyword, cities]);

  return (
    <>
      <input
        type="text"
        placeholder="自治体名を入力（例：船橋市）"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 18,
          borderRadius: 12,
          border: "1px solid #ddd",
        }}
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {result.map((city) => (
          <Link
            key={city.code}
            href={`/city/${city.code}`}
            style={{
              display: "block",
              padding: 16,
              borderBottom: "1px solid #eee",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <strong>{city.name}</strong>

            <div
              style={{
                color: "#666",
                marginTop: 4,
              }}
            >
              人口 {city.population.toLocaleString()} 人
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}