// 記事サムネイル用のシンプルなイラストアイコン集。
// サイトのブランドカラー(青系)で統一しています。

const BLUE = "#1d4ed8";
const LIGHT = "#93c5fd";
const PALE = "#dbeafe";

type IconProps = {
  size?: number;
};

// 都市・建物(人口全般)
export function CityIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="26" width="12" height="30" rx="1.5" fill={PALE} />
      <rect x="22" y="14" width="14" height="42" rx="1.5" fill={LIGHT} />
      <rect x="38" y="22" width="12" height="34" rx="1.5" fill={PALE} />
      <rect x="52" y="34" width="6" height="22" rx="1.5" fill={LIGHT} />
      {[30, 36, 42, 48].map((y) => (
        <rect key={y} x="26" y={y} width="3" height="3" fill={BLUE} />
      ))}
      {[32, 38].map((y) => (
        <rect key={"a" + y} x="41" y={y} width="3" height="3" fill={BLUE} />
      ))}
      <rect x="4" y="56" width="56" height="2" rx="1" fill={BLUE} />
    </svg>
  );
}

// 積み上がる棒グラフ(TOP50・集計系)
export function BarsIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="38" width="9" height="18" rx="2" fill={PALE} />
      <rect x="22" y="26" width="9" height="30" rx="2" fill={LIGHT} />
      <rect x="36" y="14" width="9" height="42" rx="2" fill={BLUE} />
      <rect x="50" y="30" width="9" height="26" rx="2" fill={LIGHT} />
    </svg>
  );
}

// 地図・集中(人口集中)
export function MapIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" fill={PALE} />
      <circle cx="32" cy="32" r="14" fill={LIGHT} />
      <circle cx="32" cy="32" r="6" fill={BLUE} />
    </svg>
  );
}

// 高層ビル(100万人都市)
export function SkylineIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="30" width="10" height="26" fill={LIGHT} />
      <rect x="22" y="10" width="10" height="46" fill={BLUE} />
      <rect x="34" y="20" width="10" height="36" fill={LIGHT} />
      <rect x="46" y="36" width="8" height="20" fill={PALE} />
      {[14, 26, 38].map((x) => (
        <rect key={x} x={x} y="16" width="2.5" height="2.5" fill="#fff" />
      ))}
    </svg>
  );
}

// 子ども(親子・子育て)
export function ChildIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="24" cy="20" r="7" fill={LIGHT} />
      <path
        d="M12 48c0-8 5.4-13 12-13s12 5 12 13"
        fill={PALE}
      />
      <circle cx="44" cy="28" r="5" fill={BLUE} />
      <path
        d="M35 50c0-6 4-10 9-10s9 4 9 10"
        fill={LIGHT}
      />
    </svg>
  );
}

// 高齢者・杖(高齢化)
export function ElderlyIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="28" cy="18" r="8" fill={LIGHT} />
      <path
        d="M14 54c0-11 6-18 14-18s14 7 14 18"
        fill={PALE}
      />
      <rect x="42" y="26" width="3" height="26" rx="1.5" fill={BLUE} />
      <path d="M42 26c0-4 3-6 6-6" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// 新芽・若さ(若い自治体)
export function SproutIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="30" y="30" width="4" height="26" rx="2" fill={BLUE} />
      <path
        d="M32 32c0-10-8-16-18-16 0 10 8 16 18 16z"
        fill={LIGHT}
      />
      <path
        d="M32 26c0-8 7-13 15-13 0 8-7 13-15 13z"
        fill={PALE}
      />
    </svg>
  );
}

// ハート・出生(出生率)
export function BirthIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 50S12 38 12 24c0-7 5.5-12 12-12 4 0 7 2 8 5 1-3 4-5 8-5 6.5 0 12 5 12 12 0 14-20 26-20 26z"
        fill={LIGHT}
      />
      <circle cx="32" cy="24" r="5" fill={BLUE} />
    </svg>
  );
}

// 下降(人口減少)
export function DeclineIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="14" width="9" height="16" rx="2" fill={BLUE} />
      <rect x="22" y="24" width="9" height="20" rx="2" fill={LIGHT} />
      <rect x="36" y="34" width="9" height="16" rx="2" fill={LIGHT} />
      <rect x="50" y="42" width="6" height="10" rx="2" fill={PALE} />
      <path
        d="M10 16 L54 44"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M46 42 L54 44 L52 36"
        stroke={BLUE}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconThumb({
  icon,
  bg = "#eff6ff",
}: {
  icon: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: 88,
        background: bg,
        borderRadius: 12,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
  );
}
