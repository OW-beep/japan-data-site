import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1>日本自治体データベース</h1>

      <ul>
        <li><Link href="/search">自治体検索</Link></li>
        <li><Link href="/ranking/population">人口ランキング</Link></li>
      </ul>
    </main>
  );
}