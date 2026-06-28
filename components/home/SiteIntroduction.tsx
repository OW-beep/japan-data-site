export default function SiteIntroduction() {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "60px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 28,
          color: "#111827",
        }}
      >
        このサイトについて
      </h2>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 36,
          lineHeight: 2,
          fontSize: 18,
          color: "#374151",
        }}
      >
        <p>
          全国自治体データベースは、日本全国1741自治体の人口・出生率・
          高齢化率・人口密度・子ども人口・面積などを比較できるデータサイトです。
        </p>

        <p style={{ marginTop: 18 }}>
          行政機関が公開しているオープンデータをもとに、
          自治体ごとの特徴をランキングや個別ページで分かりやすく掲載しています。
        </p>

        <div
          style={{
            marginTop: 28,
            background: "#f8fafc",
            borderRadius: 12,
            padding: 22,
          }}
        >
          <h3
            style={{
              fontSize: 22,
              marginBottom: 18,
            }}
          >
            このサイトで分かること
          </h3>

          <ul
            style={{
              lineHeight: 2.1,
              paddingLeft: 22,
            }}
          >
            <li>人口ランキング</li>
            <li>出生率ランキング</li>
            <li>人口密度ランキング</li>
            <li>高齢化率ランキング</li>
            <li>子ども人口ランキング</li>
            <li>全国1741自治体の個別データ</li>
            <li>都道府県別比較</li>
          </ul>
        </div>

        <p style={{ marginTop: 24 }}>
          統計データは定期的に更新し、
          誰でも無料で自治体データを比較できることを目指しています。
        </p>
      </div>
    </section>
  );
}