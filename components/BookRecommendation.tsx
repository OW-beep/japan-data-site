import { AMAZON_TAG } from "@/lib/amazonBooks";

type Book = {
  title: string;
  author: string;
  blurb: string;
  /** 確認済みASINがあれば直接リンク、無ければ検索キーワードでリンクする */
  asin?: string;
  searchKeyword?: string;
};

function buildUrl(book: Book) {
  if (book.asin) {
    return `https://www.amazon.co.jp/dp/${book.asin}?tag=${AMAZON_TAG}`;
  }
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(
    book.searchKeyword ?? book.title
  )}&tag=${AMAZON_TAG}`;
}

export default function BookRecommendation({ books }: { books: Book[] }) {
  return (
    <div style={wrap}>
      <div style={badge}>PR</div>

      <div style={title}>もっと詳しく知りたい方へ</div>

      {books.map((book) => (
        <a
          key={book.title}
          href={buildUrl(book)}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          style={link}
        >
          <div style={bookTitle}>
            『{book.title}』{book.author}
          </div>
          <div style={blurb}>{book.blurb}</div>
        </a>
      ))}

      <p style={disclosure}>
        Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
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
  marginBottom: 10,
};

const link: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  padding: "8px 0",
  borderTop: "1px solid #e7e5e4",
};

const bookTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#1d4ed8",
  marginBottom: 2,
};

const blurb: React.CSSProperties = {
  fontSize: 13,
  color: "#57534e",
  lineHeight: 1.7,
};

const disclosure: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 11,
  color: "#a8a29e",
};
