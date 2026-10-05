import { searchRakutenItems } from "@/lib/rakuten";

type Props = {
  /** 楽天市場での検索キーワード */
  keyword: string;
  /** 見出し(例:「楽天市場で見る」) */
  heading?: string;
  hits?: number;
};

/**
 * 楽天市場の商品を画像付きで表示するアフィリエイトブロック。
 * サーバーコンポーネント(async)として、ページ側で直接 <RakutenGifts .../> と
 * 書くだけで使える。RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定、または
 * 該当キーワードで商品が見つからなかった場合は何も表示しない
 * (記事ページ自体を壊さないため)。
 */
export default async function RakutenGifts({
  keyword,
  heading = "楽天市場で見る",
  hits = 3,
}: Props) {
  const items = await searchRakutenItems(keyword, hits);
  if (!items || items.length === 0) return null;

  return (
    <div style={wrap}>
      <div style={badge}>PR</div>
      <div style={title}>{heading}</div>

      <div style={grid}>
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            style={card}
          >
            <div style={imgWrap}>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={140}
                  height={140}
                  loading="lazy"
                  decoding="async"
                  style={img}
                />
              ) : (
                <div style={imgPlaceholder} />
              )}
            </div>
            <div style={itemName}>{item.name}</div>
            <div style={priceRow}>
              <span style={price}>
                ¥{item.price.toLocaleString()}
              </span>
              <span style={shop}>{item.shopName}</span>
            </div>
          </a>
        ))}
      </div>

      <p style={disclosure}>
        本ブロックは楽天市場のアフィリエイトプログラムを利用しており、
        表示価格や在庫状況は変動する場合があります。最新の情報は商品
        ページでご確認ください。
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

// カードは小さめ(約120〜140px)にして、画像は2倍強の解像度で取得している(lib/rakuten.ts)
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 140px))",
  gap: 14,
  justifyContent: "start",
};

const card: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
};

const imgWrap: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  background: "#fff",
  border: "1px solid #e7e5e4",
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 6,
};

// cover だと引き伸ばし・トリミングでぼやけて見えるため、contain で全体を表示する
const img: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
};

const imgPlaceholder: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const itemName: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.5,
  color: "#292524",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const priceRow: React.CSSProperties = {
  marginTop: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const price: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#be123c",
};

const shop: React.CSSProperties = {
  fontSize: 10,
  color: "#a8a29e",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const disclosure: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 11,
  color: "#a8a29e",
};
