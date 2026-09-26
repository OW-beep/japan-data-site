/**
 * A8.net(バリューコマース等と同種のアフィリエイトASP)から発行される
 * 静的なバナー広告コードをそのまま貼るための共通コンポーネント。
 *
 * 【重要】ASP側の規約により、発行されたHTML(リンク先URL・画像URL・
 * a8mat値・1x1のトラッキングピクセル)は改変せずそのまま使用する
 * こと。パラメータを書き換えたり、リンク先を短縮・加工したりすると
 * 成果が正しく計測されない(＝報酬が発生しない)ため、必ず発行された
 * 値をそのまま props で渡すこと。
 */
type Props = {
  /** クリック時の遷移先(px.a8.net/svt/ejp?a8mat=... の形)。改変しないこと */
  href: string;
  /** バナー画像URL(bgt?aid=... の形)。改変しないこと */
  imgSrc: string;
  width: number;
  height: number;
  /** 成果計測用の1x1トラッキングピクセルURL。改変しないこと */
  trackingPixelSrc: string;
  heading?: string;
};

export default function A8Banner({
  href,
  imgSrc,
  width,
  height,
  trackingPixelSrc,
  heading = "ふるさと納税の返礼品を探す",
}: Props) {
  return (
    <div style={wrap}>
      <div style={badge}>PR</div>
      <div style={title}>{heading}</div>

      <a href={href} rel="nofollow noopener noreferrer" target="_blank" style={link}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          width={width}
          height={height}
          alt=""
          style={{ border: 0, maxWidth: "100%", height: "auto" }}
        />
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={trackingPixelSrc} width={1} height={1} alt="" style={{ border: 0 }} />

      <p style={disclosure}>
        本ブロックはアフィリエイトプログラムを利用しており、表示内容や
        提供条件は変動する場合があります。最新の情報はリンク先でご確認
        ください。
      </p>
    </div>
  );
}

const wrap: React.CSSProperties = {
  marginTop: 24,
  marginBottom: 8,
  padding: "16px 20px",
  background: "#fafaf9",
  border: "1px solid #e7e5e4",
  borderRadius: 12,
};

const badge: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  color: "#78716c",
  border: "1px solid #d6d3d1",
  borderRadius: 4,
  padding: "1px 6px",
  marginBottom: 8,
};

const title: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#57534e",
  marginBottom: 12,
};

const link: React.CSSProperties = {
  display: "inline-block",
};

const disclosure: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 11,
  color: "#a8a29e",
};
