"use client";

import { useState } from "react";
import Link from "next/link";
import RankingBarChart from "@/components/RankingBarChart";

type CityRow = {
  code: string;
  name: string;
  population: number;
  childPopulation: number;
  elderlyPopulation: number;
  area: number | null;
  populationDensity: number | null;
  financeIndex: number | null;
  birthRate?: number | null;
  inMigrants?: number | null;
  outMigrants?: number | null;
  households?: number | null;
  singleHouseholds?: number | null;
};

type Metric = {
  key: string;
  label: string;
  unit: string;
  compute: (c: CityRow) => number | null;
  format: (v: number) => string;
};

const METRICS: Metric[] = [
  {
    key: "population",
    label: "人口",
    unit: "人",
    compute: (c) => c.population,
    format: (v) => `${v.toLocaleString()}人`,
  },
  {
    key: "child",
    label: "子ども人口割合",
    unit: "%",
    compute: (c) =>
      c.population > 0
        ? (c.childPopulation / c.population) * 100
        : null,
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "aging",
    label: "高齢化率",
    unit: "%",
    compute: (c) =>
      c.population > 0
        ? (c.elderlyPopulation / c.population) * 100
        : null,
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "density",
    label: "人口密度",
    unit: "人/km²",
    compute: (c) => c.populationDensity,
    format: (v) => `${v.toLocaleString()}人/km²`,
  },
  {
    key: "area",
    label: "面積",
    unit: "km²",
    compute: (c) => c.area,
    format: (v) => `${v.toLocaleString()}km²`,
  },
  {
    key: "finance",
    label: "財政力指数",
    unit: "",
    compute: (c) => c.financeIndex,
    format: (v) => v.toFixed(2),
  },
  {
    key: "birthRate",
    label: "出生率",
    unit: "",
    compute: (c) => c.birthRate ?? null,
    format: (v) => v.toFixed(2),
  },
  {
    key: "decline",
    label: "社会増減率",
    unit: "%",
    compute: (c) =>
      c.population > 0 &&
      c.inMigrants != null &&
      c.outMigrants != null
        ? ((c.inMigrants - c.outMigrants) / c.population) * 100
        : null,
    format: (v) => `${v.toFixed(2)}%`,
  },
  {
    key: "household",
    label: "単独世帯割合",
    unit: "%",
    compute: (c) =>
      c.households
        ? ((c.singleHouseholds ?? 0) / c.households) * 100
        : null,
    format: (v) => `${v.toFixed(1)}%`,
  },
];

export default function PrefectureRankingTabs({
  cities,
  prefName,
}: {
  cities: CityRow[];
  prefName: string;
}) {
  const [metricKey, setMetricKey] = useState("population");
  const metric = METRICS.find((m) => m.key === metricKey)!;

  const ranked = cities
    .map((c) => ({
      city: c,
      value: metric.compute(c),
    }))
    .filter(
      (r): r is { city: CityRow; value: number } =>
        r.value != null
    )
    .sort((a, b) => b.value - a.value);

  return (
    <section style={{ marginBottom: 50 }}>
      <h2 style={{ marginBottom: 16 }}>
        {prefName}内ランキング
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetricKey(m.key)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background:
                m.key === metricKey ? "#1d4ed8" : "#fff",
              color: m.key === metricKey ? "#fff" : "#374151",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          このデータはまだ整備されていません。
        </p>
      ) : (
        <>
          <RankingBarChart
            items={ranked.slice(0, 15).map((r) => ({
              name: r.city.name.replace(prefName + " ", ""),
              value: r.value,
              displayValue: metric.format(r.value),
            }))}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 10,
              marginTop: 20,
            }}
          >
            {ranked.map((r, i) => (
              <Link
                key={r.city.code}
                href={`/city/${r.city.code}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#111827",
                  fontSize: 14,
                }}
              >
                <span>
                  {i + 1}. {r.city.name.replace(prefName + " ", "")}
                </span>
                <strong>{metric.format(r.value)}</strong>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
