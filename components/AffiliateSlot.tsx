import A8Banner from "@/components/A8Banner";
import { AFFILIATE_SLOTS, type AffiliateTopic } from "@/lib/affiliates";

/**
 * トピック別のアフィリエイト枠。設定は lib/affiliates.ts に集約している。
 * 未設定(null)のトピックは何も描画しないので、置いておくだけで安全。
 */
export default function AffiliateSlot({ topic }: { topic: AffiliateTopic }) {
  const cfg = AFFILIATE_SLOTS[topic];
  if (!cfg) return null;
  return <A8Banner {...cfg} />;
}
