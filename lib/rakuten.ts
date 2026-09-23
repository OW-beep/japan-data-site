/**
 * 楽天市場商品検索API（IchibaItem/Search）の薄いラッパー。
 *
 * 楽天は2026年に仕様変更を重ねており、現時点（2026-07-01版）の仕様は以下の通り。
 * 古いバージョンのURLを使うと "wrong_parameter / API Configuration not found" という
 * エラーになるため、バージョン番号が変わったら随時このファイルを更新すること。
 *
 * - エンドポイント: https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701
 *   （旧 app.rakuten.co.jp/services/api/... は完全停止済み）
 * - applicationId に加えて accessKey が必須（クエリパラメータかヘッダーのどちらでも可。ここではクエリで送る）
 * - formatVersion=2 を指定しているが、実際のレスポンスはドキュメント記載と異なり
 *   キー名が "Items"（大文字）のままで、配列の各要素はフラットな商品情報オブジェクト
 *   （{item: {...}} のようなネストはない）。ドキュメントより実際のレスポンスを信用してこの形で解析する。
 *
 * - RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定の場合は何もせず null を返す
 *   （キー未登録でもビルド・他ページが壊れないようにするため）。
 * - サーバー側（Server Component）専用。キーをブラウザに渡さないよう、
 *   このモジュールをクライアントコンポーネントから直接importしないこと。
 * - 楽天APIは呼び出し頻度に上限があるため、Next.jsのfetchキャッシュで
 *   1日単位（86400秒）に再取得を抑える。
 */

import { SITE_URL } from "./site";

export interface RakutenItem {
  name: string;
  price: number;
  url: string; // affiliateId設定時はアフィリエイトリンク、未設定時は通常の商品URL
  imageUrl: string | null;
  shopName: string;
}

// 楽天の実際のレスポンスは、ドキュメント記載と異なり formatVersion=2 でも
// キー名は "Items"（大文字）のままで、配列の各要素はフラットな商品情報オブジェクトだった
// （{item: {...}} のようなネストはない）。ドキュメントより実レスポンスを信用してこの形に合わせる。
interface RakutenSearchResponse {
  Items?: RawItem[];
  count?: number;
  error?: string;
  error_description?: string;
}
interface RawItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  shopName: string;
  mediumImageUrls?: string[];
}

const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

export async function searchRakutenItems(keyword: string, hits = 3): Promise<RakutenItem[] | null> {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId || !accessKey) {
    console.warn(
      `[rakuten] RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定のため「${keyword}」の検索をスキップしました`
    );
    return null;
  }

  const paramsObj: Record<string, string> = {
    format: "json",
    formatVersion: "2",
    keyword,
    applicationId,
    accessKey,
    hits: String(hits),
    sort: "standard"
  };
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (affiliateId) paramsObj.affiliateId = affiliateId;

  // URLSearchParamsはスペースを"+"にエンコードするが、楽天側が"+"を区切りのスペースとして
  // 解釈せず検索結果0件になるケースがあるため、encodeURIComponent（%20）で明示的に組み立てる
  const query = Object.entries(paramsObj)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  // アプリ登録時に指定した「Allowed websites」のドメインとRefererが一致しないと弾かれる。
  // サイトの正式ドメインは lib/site.ts の SITE_URL に一元化されているため、それをそのまま使う
  // (このファイル内にドメインをハードコードすると、site.ts側の値とズレて楽天API側で
  // wrong_parameter エラーになるリスクがあるため)。
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;

  try {
    const res = await fetch(`${ENDPOINT}?${query}`, {
      headers: { Referer: siteUrl, Origin: siteUrl },
      // 楽天APIの呼び出し回数を抑えるため、同じキーワードの結果は1日キャッシュする
      next: { revalidate: 60 * 60 * 24 }
    });
    const rawText = await res.text();
    let data: RakutenSearchResponse = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.warn(`[rakuten] 「${keyword}」のレスポンスがJSONとして解釈できませんでした。body=${rawText.slice(0, 500)}`);
      return null;
    }

    if (!res.ok || data.error) {
      console.warn(
        `[rakuten] 「${keyword}」の検索が失敗しました。status=${res.status} error=${data.error} description=${data.error_description}`
      );
      return null;
    }
    if (!data.Items || data.Items.length === 0) {
      // 原因切り分け用に、レスポンスの生の内容をそのままログに出す（countが0件なのか、
      // itemsのキー名自体が想定と違うのかを確認するため）
      console.warn(
        `[rakuten] 「${keyword}」の検索結果が0件でした。送信keyword=${encodeURIComponent(keyword)} / rawBody=${rawText.slice(0, 800)}`
      );
      return null;
    }

    return data.Items.map((item) => ({
      name: item.itemName,
      price: item.itemPrice,
      url: item.affiliateUrl || item.itemUrl,
      imageUrl: item.mediumImageUrls?.[0] ?? null,
      shopName: item.shopName
    }));
  } catch (err) {
    // ネットワークエラー等で記事ページ自体が落ちないよう、失敗時は「表示なし」にフォールバックする
    console.warn(`[rakuten] 「${keyword}」の検索中に例外が発生しました:`, err);
    return null;
  }
}
