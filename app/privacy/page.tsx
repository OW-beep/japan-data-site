export default function Page() {
  return (
    <main style={wrap}>
      <h1>プライバシーポリシー</h1>

      <p>
        当サイトはGoogle AdSenseを利用しています。
      </p>

      <h2>広告について</h2>
      <p>
        Cookieを使用し、ユーザーに最適化された広告を表示します。
      </p>

      <h2>データについて</h2>
      <p>
        本サイトは統計データ（e-Stat）を使用しています。
      </p>

      <h2>免責事項</h2>
      <p>
        データは最新ではない場合があります。
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: 24,
  lineHeight: 1.8,
};