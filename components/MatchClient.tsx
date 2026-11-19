"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import citiesData from "@/data/match-cities.json";

type MatchCity = {
  c: string;
  n: string;
  p: string;
  pop: number;
  ag: number;
  inc: number | null;
  doc: number | null;
  land: number | null;
  fis: number | null;
  day: number | null;
  ch: number;
  dc: number | null;
  ret: number | null;
};

const cities = citiesData as MatchCity[];

type PriorityKey = "medical" | "cost" | "lively" | "child";

const PRIORITIES: { key: PriorityKey; label: string; hint: string }[] = [
  { key: "medical", label: "医療の充実", hint: "医師数(人口10万人あたり)" },
  { key: "cost", label: "地価・家賃の安さ", hint: "地価(取引実勢価格)" },
  { key: "lively", label: "にぎわい・仕事", hint: "昼夜間人口比率と小売店の多さ" },
  { key: "child", label: "子育て", hint: "子どもの割合と保育園の余裕" },
];

/** 値のある自治体の中でのパーセンタイル(0〜1)。大きいほど1に近い */
function percentileMap(values: (number | null)[]): Map<number, number> {
  const present = values
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v != null)
    .sort((a, b) => a.v - b.v);
  const map = new Map<number, number>();
  present.forEach((x, rank) => {
    map.set(x.i, present.length <= 1 ? 0.5 : rank / (present.length - 1));
  });
  return map;
}

const avg = (xs: (number | null)[]): number | null => {
  const ok = xs.filter((x): x is number => x != null);
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null;
};

export default function MatchClient() {
  const [weights, setWeights] = useState<Record<PriorityKey, 0 | 1 | 2>>({
    medical: 1,
    cost: 1,
    lively: 1,
    child: 1,
  });

  const scored = useMemo(() => {
    const docP = percentileMap(cities.map((c) => c.doc));
    const landP = percentileMap(cities.map((c) => c.land));
    const dayP = percentileMap(cities.map((c) => c.day));
    const retP = percentileMap(cities.map((c) => c.ret));
    const chP = percentileMap(cities.map((c) => c.ch));
    const dcP = percentileMap(cities.map((c) => c.dc));

    return cities.map((city, i) => {
      const sub: Record<PriorityKey, number | null> = {
        medical: docP.get(i) ?? null,
        cost: landP.has(i) ? 1 - landP.get(i)! : null,
        lively: avg([dayP.get(i) ?? null, retP.get(i) ?? null]),
        child: avg([chP.get(i) ?? null, dcP.has(i) ? 1 - dcP.get(i)! : null]),
      };
      let num = 0;
      let den = 0;
      (Object.keys(sub) as PriorityKey[]).forEach((k) => {
        const w = weights[k];
        const s = sub[k];
        if (w > 0 && s != null) {
          num += w * s;
          den += w;
        }
      });
      return { city, score: den > 0 ? num / den : 0 };
    });
  }, [weights]);

  const top = useMemo(
    () => [...scored].sort((a, b) => b.score - a.score).slice(0, 8),
    [scored]
  );

  const fmt = (v: number | null, suffix = "") =>
    v == null ? "—" : `${v.toLocaleString()}${suffix}`;

  return (
    <div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 24,
        }}
      >
        <p style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 15 }}>
          あなたが重視するのは?
        </p>
        {PRIORITIES.map((p) => (
          <div
            key={p.key}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <div style={{ minWidth: 190, flex: "1 1 190px" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{p.hint}</div>
            </div>
            {(
              [
                { v: 2 as const, label: "重視する" },
                { v: 1 as const, label: "ふつう" },
                { v: 0 as const, label: "気にしない" },
              ]
            ).map((opt) => {
              const active = weights[p.key] === opt.v;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() =>
                    setWeights((w) => ({ ...w, [p.key]: opt.v }))
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
                    background: active ? "#2563eb" : "#fff",
                    color: active ? "#fff" : "#374151",
                    fontSize: 13,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, margin: "0 0 14px" }}>
        あなたに合いそうな街 上位8
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 14,
        }}
      >
        {top.map(({ city, score }, idx) => (
          <div
            key={city.c}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                {idx + 1}位
              </span>
              <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>
                マッチ度 {Math.round(score * 100)}
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
              <Link
                href={`/city/${city.c}`}
                style={{ color: "#111827", textDecoration: "none" }}
              >
                {city.n}
              </Link>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
              {city.p}／人口{city.pop.toLocaleString()}人
            </div>
            <div
              style={{
                height: 6,
                background: "#eef2f7",
                borderRadius: 3,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: `${Math.round(score * 100)}%`,
                  background: "#2563eb",
                  borderRadius: 3,
                }}
              />
            </div>
            <dl
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.9,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: 10,
              }}
            >
              <dt style={{ color: "#6b7280" }}>医師数</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>
                {fmt(city.doc, "人/10万人")}
              </dd>
              <dt style={{ color: "#6b7280" }}>地価</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>
                {city.land != null
                  ? `${city.land.toLocaleString()}円/m²`
                  : "—"}
              </dd>
              <dt style={{ color: "#6b7280" }}>高齢化率</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>{city.ag}%</dd>
              <dt style={{ color: "#6b7280" }}>課税所得</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>
                {fmt(city.inc, "万円/人")}
              </dd>
              <dt style={{ color: "#6b7280" }}>昼夜間人口比率</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>
                {fmt(city.day)}
              </dd>
              <dt style={{ color: "#6b7280" }}>財政力指数</dt>
              <dd style={{ margin: 0, textAlign: "right" }}>
                {city.fis != null ? city.fis.toFixed(2) : "—"}
              </dd>
            </dl>
            <div style={{ marginTop: 10 }}>
              <Link
                href={`/city/${city.c}`}
                style={{ color: "#2563eb", fontSize: 13 }}
              >
                この街のデータを見る →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
