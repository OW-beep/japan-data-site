import Link from "next/link";
import { getWardsOf } from "@/lib/municipalities";

type Props = {
  cityFullName: string; // 例: "神奈川県 横浜市"
};

export default function CityWards({ cityFullName }: Props) {
  const wards = getWardsOf(cityFullName).sort(
    (a, b) => b.population - a.population
  );

  // 区がない自治体(政令指定都市以外)では何も表示しない
  if (wards.length === 0) return null;

  return (
    <section
      style={{
        marginBottom: 40,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        区ごとの内訳
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.8,
          marginBottom: 20,
        }}
      >
        {cityFullName.split(" ")[1]}には{wards.length}
        の区があります。区は独立した自治体ではなく市の内部組織のため、
        全国ランキングの対象には含めていませんが、市内の内訳としてこちらに掲載しています。
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto auto",
            gap: 12,
            padding: "12px 20px",
            background: "#f9fafb",
            fontSize: 13,
            fontWeight: 700,
            color: "#6b7280",
          }}
        >
          <div>順位</div>
          <div>区名</div>
          <div style={{ textAlign: "right" }}>人口</div>
          <div style={{ textAlign: "right" }}>面積</div>
          <div style={{ textAlign: "right" }}>人口密度</div>
        </div>

        {wards.map((ward, i) => {
          const wardName = ward.name
            .replace(cityFullName, "")
            .trim();

          return (
            <Link
              key={ward.code}
              href={`/city/${ward.code}`}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "auto 1fr auto auto auto",
                gap: 12,
                padding: "14px 20px",
                borderTop: "1px solid #f3f4f6",
                textDecoration: "none",
                color: "#111827",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {i + 1}
              </div>

              <div style={{ fontWeight: 700 }}>
                {wardName}
              </div>

              <div style={{ textAlign: "right" }}>
                {ward.population.toLocaleString()}人
              </div>

              <div style={{ textAlign: "right", color: "#6b7280" }}>
                {ward.area != null
                  ? `${ward.area.toLocaleString()}km²`
                  : "-"}
              </div>

              <div style={{ textAlign: "right", color: "#6b7280" }}>
                {ward.populationDensity != null
                  ? `${ward.populationDensity.toLocaleString()}人/km²`
                  : "-"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
