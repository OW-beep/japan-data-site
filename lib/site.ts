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

/** お問い合わせ先のメールアドレス */
export const CONTACT_EMAIL = "openwave25@gmail.com";

/**
 * お問い合わせフォーム(Formspree)のフォームID。
 * https://formspree.io で、このサイト用のフォームを作成し、発行されたIDを
 * Vercelの環境変数 NEXT_PUBLIC_FORMSPREE_FORM_ID に設定してください。
 * 未設定の間は、フォームは出さず、メールでの案内だけを表示します。
 */
export const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? "";
