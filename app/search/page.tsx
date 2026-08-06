import SearchBox from "@/components/SearchBox";

export const metadata = {
  title: "自治体検索",
  description: "全国1747自治体を検索できます。",
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          marginBottom: 30,
        }}
      >
        🔍 自治体検索
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
          lineHeight: 1.8,
        }}
      >
        市区町村名を入力すると、
        該当する自治体を検索できます。
      </p>

      <SearchBox />
    </main>
  );
}