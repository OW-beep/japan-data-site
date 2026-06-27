import PrefCard from "../PrefCard";

const prefectures = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県",
  "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県",
  "宮崎県","鹿児島県","沖縄県",
];

export default function PrefectureSection() {
  return (
    <section
      style={{
        marginBottom: 70,
      }}
    >
      <h2
        style={{
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        🗾 都道府県から探す
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 24,
          lineHeight: 1.8,
        }}
      >
        都道府県ごとの人口・面積・人口密度などをまとめています。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(130px,1fr))",
          gap: 14,
        }}
      >
        {prefectures.map((pref) => (
          <PrefCard
            key={pref}
            href={`/prefecture/${encodeURIComponent(pref)}`}
            name={pref}
          />
        ))}
      </div>
    </section>
  );
}