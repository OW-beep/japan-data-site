export default function OpenDataSection() {
  return (
    <section
      style={{
        marginBottom: 70,
        background: "#f9fafb",
        borderRadius: 20,
        padding: 36,
      }}
    >
      <h2
        style={{
          fontSize: 34,
          marginBottom: 18,
        }}
      >
        🌏 オープンデータについて
      </h2>

      <p
        style={{
          lineHeight: 1.9,
          color: "#4b5563",
        }}
      >
        当サイトは日本政府・自治体が公開しているオープンデータを利用しています。
        <br />
        人口・面積・高齢化率・出生率などのデータをわかりやすく整理しています。
      </p>

      <ul
        style={{
          marginTop: 20,
          lineHeight: 2,
        }}
      >
        <li>総務省統計局</li>
        <li>e-Stat</li>
        <li>国土地理院</li>
        <li>住民基本台帳人口</li>
      </ul>
    </section>
  );
}