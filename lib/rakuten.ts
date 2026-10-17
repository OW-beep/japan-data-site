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
 * - 楽天APIは「1秒に1回」程度の呼び出し制限がある。ビルド時に複数ページが同時に
 *   呼ぶと制限に当たり、失敗したページは次のデプロイまで「ブロックなし」で固定されて
 *   いた。そのため次の対策をしている:
 *     1. 呼び出しを1本ずつの順番待ち(約1.1秒間隔)にする
 *     2. 制限(429)・サーバーエラー・通信エラーは、間隔をあけて数回やり直す
 *     3. 同じキーワードの成功結果は、プロセス内で1時間使い回す
 *     4. fetch は next.revalidate で6時間キャッシュする(下の fetch を参照)。
 *        以前は cache: "no-store" だったが、Next.js 16 の静的生成(ビルド)中に no-store の fetch が
 *        あると DYNAMIC_SERVER_USAGE エラーになり、通信エラー扱いで4回やり直した末に「ブロックなし」で
 *        固定され、そのページは毎回サーバーで生成される(動的ページ)状態になっていた。
 *        成功(200)した結果だけが Next のキャッシュに入り、失敗(429など)は入らないので、
 *        失敗が固定される心配はない。
 * - 画像は、APIが返す128px角では粗いので、サムネイルのサイズ指定(_ex)を書き換えて
 *   大きめ(300px角)を取得し、表示は小さめにする(高解像度ディスプレイでも鮮明にするため)。
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

/** 表示サイズ(約140px)の2倍強を取得する。楽天のサムネイルは ?_ex=幅x高さ で大きさを指定できる */
const IMAGE_SIZE = 300;

function hiResImage(url: string | undefined | null): string | null {
  if (!url) return null;
  if (/[?&]_ex=\d+x\d+/.test(url)) {
    return url.replace(/([?&]_ex=)\d+x\d+/, `$1${IMAGE_SIZE}x${IMAGE_SIZE}`);
  }
  return `${url}${url.includes("?") ? "&" : "?"}_ex=${IMAGE_SIZE}x${IMAGE_SIZE}`;
}

// 呼び出しの間隔。1100msだと、ビルド中に連続して呼ぶと 429(回数制限)になることがあったため、少し長くする
const MIN_INTERVAL_MS = 1500;
const MAX_ATTEMPTS = 4;
// 429のとき、次のやり直しまで待つ基本の時間(1回目4秒、2回目8秒、3回目12秒)。以前は1.5秒刻みで、制限が解けなかった
const BACKOFF_429_MS = 4000;
const MEMO_TTL_MS = 60 * 60 * 1000;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// 呼び出しを1本ずつの順番待ちにして、間隔をあける
let lastCallAt = 0;
let queue: Promise<unknown> = Promise.resolve();
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastCallAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();
    return fn();
  });
  queue = run.catch(() => undefined);
  return run;
}

// 同じキーワードの成功結果をプロセス内で使い回す(ビルド中の重複呼び出しを避ける)
const memo = new Map<string, { at: number; items: RakutenItem[] }>();

export async function searchRakutenItems(
  keyword: string,
  hits = 3,
  /** やり直しの設定。ビルド(静的生成)では既定の長めの待ち、リクエスト中に呼ぶAPIでは短くする */
  opts: { maxAttempts?: number; backoff429Ms?: number } = {}
): Promise<RakutenItem[] | null> {
  const maxAttempts = opts.maxAttempts ?? MAX_ATTEMPTS;
  const backoff429Ms = opts.backoff429Ms ?? BACKOFF_429_MS;
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId || !accessKey) {
    console.warn(
      `[rakuten] RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定のため「${keyword}」の検索をスキップしました`
    );
    return null;
  }

  const memoKey = `${keyword}\u0000${hits}`;
  const hit = memo.get(memoKey);
  if (hit && Date.now() - hit.at < MEMO_TTL_MS) return hit.items;

  const paramsObj: Record<string, string> = {
    format: "json",
    formatVersion: "2",
    keyword,
    applicationId,
    accessKey,
    hits: String(hits),
    imageFlag: "1", // 画像のある商品だけ
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
    let rawText = "";
    let status = 0;
    let data: RakutenSearchResponse = {};

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let transient = false;
      try {
        const res = await throttled(() =>
          fetch(`${ENDPOINT}?${query}`, {
            headers: { Referer: siteUrl, Origin: siteUrl },
            // 6時間キャッシュ(成功した200の応答だけがキャッシュされる)。
            // no-store にすると、ビルド時の静的生成で DYNAMIC_SERVER_USAGE になるため使わない
            next: { revalidate: 21600 },
          })
        );
        status = res.status;
        rawText = await res.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = {};
        }
        // 制限(429)・サーバーエラー・「too many」系のエラーは、間隔をあけてやり直す
        transient =
          status === 429 ||
          status >= 500 ||
          /too_?many|rate|limit/i.test(String(data.error ?? ""));
      } catch (e) {
        transient = true; // 通信エラー
        console.warn(`[rakuten] 「${keyword}」の通信エラー(${attempt}回目):`, e);
      }
      if (!transient) break;
      if (attempt < maxAttempts) {
        console.warn(`[rakuten] 「${keyword}」を${attempt}回目で取得できなかったため、やり直します (status=${status})`);
        await sleep((status === 429 ? backoff429Ms : 1500) * attempt);
      }
    }

    if (!rawText || (status === 0)) return null;
    if (Object.keys(data).length === 0) {
      console.warn(`[rakuten] 「${keyword}」のレスポンスがJSONとして解釈できませんでした。status=${status} body=${rawText.slice(0, 500)}`);
      return null;
    }

    if (status < 200 || status >= 300 || data.error) {
      console.warn(
        `[rakuten] 「${keyword}」の検索が失敗しました。status=${status} error=${data.error} description=${data.error_description}`
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

    const items: RakutenItem[] = data.Items.map((item) => ({
      name: item.itemName,
      price: item.itemPrice,
      url: item.affiliateUrl || item.itemUrl,
      imageUrl: hiResImage(item.mediumImageUrls?.[0]),
      shopName: item.shopName,
    }));
    memo.set(memoKey, { at: Date.now(), items });
    return items;
  } catch (err) {
    // ネットワークエラー等で記事ページ自体が落ちないよう、失敗時は「表示なし」にフォールバックする
    console.warn(`[rakuten] 「${keyword}」の検索中に例外が発生しました:`, err);
    return null;
  }
}
