"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCities } from "@/lib/getCities";
import { computeCityMetrics } from "@/lib/cityMetrics";
import type { City } from "@/lib/City";

function CitySearchInput({
  label,
  cities,
  selected,
  onSelect,
}: {
  label: string;
  cities: City[];
  selected: City | null;
  onSelect: (c: City) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    if (!keyword) return [];
    return cities
      .filter((c) => c.name.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 8);
  }, [keyword, cities]);

  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b7280",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {selected ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: "#fff",
            border: "2px solid #2563eb",
            borderRadius: 10,
          }}
        >
          <strong>{selected.name}</strong>
          <button
            onClick={() => {
              onSelect(null as unknown as City);
              setKeyword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            変更
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="自治体名を入力（例：船橋市）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 10,
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
          />

          {results.length > 0 && (
            <div
              style={{
                marginTop: 6,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {results.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onSelect(c);
                    setKeyword("");
                  }}
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CompareClient() {
  const cities = useMemo(() => getCities(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cityA, setCityA] = useState<City | null>(null);
  const [cityB, setCityB] = useState<City | null>(null);

  useEffect(() => {
    const aCode = searchParams.get("a");
    const bCode = searchParams.get("b");
    if (aCode) {
      const c = cities.find((x) => x.code === aCode);
      if (c) setCityA(c);
    }
    if (bCode) {
      const c = cities.find((x) => x.code === bCode);
      if (c) setCityB(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (cityA) params.set("a", cityA.code);
    if (cityB) params.set("b", cityB.code);
    const qs = params.toString();
    router.replace(qs ? `/compare?${qs}` : "/compare", {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityA, cityB]);

  const metricsA = cityA ? computeCityMetrics(cityA) : null;
  const metricsB = cityB ? computeCityMetrics(cityB) : null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <CitySearchInput
          label="自治体A"
          cities={cities}
          selected={cityA}
          onSelect={setCityA}
        />
        <CitySearchInput
          label="自治体B"
          cities={cities}
          selected={cityB}
          onSelect={setCityB}
        />
      </div>

      {metricsA && metricsB && cityA && cityB && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: 13,
                    width: "44%",
                  }}
                >
                  指標
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "14px 16px",
                    fontWeight: 800,
                  }}
                >
                  {cityA.name}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "14px 16px",
                    fontWeight: 800,
                  }}
                >
                  {cityB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {metricsA.map((m, i) => {
                const mB = metricsB[i];
                const aVal = m.value;
                const bVal = mB.value;
                const aWins =
                  m.direction !== "neutral" &&
                  aVal != null &&
                  bVal != null &&
                  (m.direction === "high" ? aVal > bVal : aVal < bVal);
                const bWins =
                  m.direction !== "neutral" &&
                  aVal != null &&
                  bVal != null &&
                  (m.direction === "high" ? bVal > aVal : bVal < aVal);

                return (
                  <tr key={m.key} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#374151",
                      }}
                    >
                      <div>
                        {m.label}
                        {m.unit && (
                          <span style={{ color: "#9ca3af" }}>
                            {" "}
                            ({m.unit})
                          </span>
                        )}
                      </div>
                      {m.description && (
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: "#9ca3af",
                            fontWeight: 400,
                          }}
                        >
                          {m.description}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: aWins ? 800 : 400,
                        color: aWins ? "#1d4ed8" : "#111827",
                      }}
                    >
                      {aVal != null ? m.format(aVal) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: bWins ? 800 : 400,
                        color: bWins ? "#1d4ed8" : "#111827",
                      }}
                    >
                      {bVal != null ? m.format(bVal) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {(!cityA || !cityB) && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          2つの自治体を選ぶと、人口・高齢化率・財政力指数など
          16項目の比較表が表示されます。
        </p>
      )}
    </div>
  );
}
