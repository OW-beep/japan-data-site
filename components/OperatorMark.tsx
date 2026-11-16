/**
 * 運営者のアイコン代わりのマーク(顔写真の代わり)。
 * 実在の人物写真は使わず、サイトのテーマである「データのグラフ」を
 * あしらった図形で、運営者欄に一貫した視覚的な identity を持たせる。
 */
export default function OperatorMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="運営者のマーク"
      style={{ flexShrink: 0 }}
    >
      <circle cx="24" cy="24" r="24" fill="#1d4ed8" />
      <rect x="13" y="26" width="5" height="9" rx="1" fill="#fff" opacity="0.75" />
      <rect x="21.5" y="20" width="5" height="15" rx="1" fill="#fff" opacity="0.9" />
      <rect x="30" y="13" width="5" height="22" rx="1" fill="#f59e0b" />
    </svg>
  );
}
