import A8Banner from "@/components/A8Banner";
import { AFFILIATE_COPY, AFFILIATE_SLOTS, type AffiliateTopic } from "@/lib/affiliates";
import { affiliateTopicsFor } from "@/lib/affiliateMap";

/**
 * 記事の末尾などに出す、悩みに合ったアフィリエイトの枠(広告)。
 *
 * 記事のスラッグから(または topics を直接渡して)トピックを決め、ASPのコードが設定されているものだけを出す。
 * 何も設定されていなければ、何も表示しない(ページは壊れない)。
 * 広告であることは、A8Banner の「PR」と免責文で示し、広告の有無で分析結果が変わらないことを、下の注記で明記する。
 */
export default function AffiliateRecommend({
  slug,
  topics,
}: {
  slug?: string;
  topics?: AffiliateTopic[];
}) {
  const list = topics ?? (slug ? affiliateTopicsFor(slug) : []);
  const active = list.filter((t) => AFFILIATE_SLOTS[t] != null);
  if (active.length === 0) return null;

  return (
    <aside aria-label="関連サービスの紹介(広告)" style={wrap}>
      {active.map((t) => {
        const cfg = AFFILIATE_SLOTS[t]!;
        const copy = AFFILIATE_COPY[t];
        return (
          <div key={t} style={{ marginBottom: 6 }}>
            {/* 「PR」の表示と見出しは、A8Banner が出す(二重にしない) */}
            <p style={lead}>{copy.lead}</p>
            <A8Banner {...cfg} heading={cfg.heading || copy.title} />
          </div>
        );
      })}
      <p style={note}>
        この枠は広告(アフィリエイト)です。リンク先で申し込みや購入があると、当サイトに報酬が支払われることがあります。
        広告の有無で、記事の分析や、ランキングの内容を変えることはありません。
      </p>
    </aside>
  );
}

const wrap: React.CSSProperties = { margin: "28px 0", padding: "16px 16px 8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14 };
const lead: React.CSSProperties = { margin: "0 0 10px", fontSize: 14, lineHeight: 1.8, color: "#4b5563" };
const note: React.CSSProperties = { margin: "0 0 8px", fontSize: 12, color: "#6b7280", lineHeight: 1.7 };
