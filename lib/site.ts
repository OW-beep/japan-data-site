/**
 * サイト全体で使う基本設定をここに集約します。
 *
 * 独自ドメインを取得したら、Vercelの環境変数に
 *   NEXT_PUBLIC_SITE_URL=https://あなたの独自ドメイン
 * を追加するだけで、layout / robots.ts / sitemap.ts / OGP画像など
 * ドメインを参照している箇所すべてに反映されます。
 * 環境変数が無い場合は現在のVercelドメインにフォールバックします。
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://japan-data-site.vercel.app";

export const SITE_NAME = "全国自治体データランキング";

export const ADSENSE_CLIENT_ID = "ca-pub-4630812027939211";
