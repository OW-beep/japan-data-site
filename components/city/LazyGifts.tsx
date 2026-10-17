"use client";

import { useEffect, useRef, useState } from "react";

import RakutenGiftsView from "@/components/RakutenGiftsView";
import type { RakutenItem } from "@/lib/rakuten";

/**
 * 自治体ページ用の楽天ブロック。ブロックの近くまでスクロールされたときに初めて
 * /api/city-gifts/[code] を呼んで表示する。
 *  ・ビルドで楽天APIを呼ばない(ビルド時間の短縮)
 *  ・ページを開いただけでは、画像や通信が増えない(表示の軽量化)
 * 取得に失敗した場合や商品がない場合は、何も表示しない。
 */
export default function LazyGifts({ code, heading }: { code: string; heading: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<RakutenItem[] | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      fetch(`/api/city-gifts/${code}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { items?: RakutenItem[] } | null) => {
          if (j?.items && j.items.length > 0) setItems(j.items);
        })
        .catch(() => {});
    };
    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [code]);

  return <div ref={ref}>{items && <RakutenGiftsView items={items} heading={heading} />}</div>;
}
