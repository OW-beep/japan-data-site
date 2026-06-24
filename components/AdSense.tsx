export default function AdSense() {
  return (
    <div style={box}>
      {/* AdSense */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4630812027939211"
        data-ad-slot="auto"
        data-ad-format="auto"
      />
    </div>
  );
}

const box: React.CSSProperties = {
  margin: "16px 0",
  textAlign: "center",
};