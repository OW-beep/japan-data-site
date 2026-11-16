/**
 * 自治体の位置を示す簡易マップ(模式図)。
 *
 * 都道府県タイルマップと同じレイアウトを使い、対象自治体が属する
 * 都道府県だけをハイライトする。地図ライブラリ・外部タイル・
 * クライアントJSは使わず、サーバー側でSVGを描くため軽量。
 * 県内の詳しい位置は都道府県単位までとし、あわせて面積・人口密度と、
 * 国土数値情報の標高メッシュを集計した地形指標(平均標高・最高標高・
 * 標高500m以上の土地の割合)を示す。
 */
import { PREFECTURE_TILE_LAYOUT } from "@/components/PrefectureTileMap";
import citiesData from "@/data/cities.json";
import elevationData from "@/data/elevation.json";

const ELEVATION = elevationData as unknown as Record<string, [number, number, number]>;

function elevationRankOf(code: string): { rank: number; total: number } | null {
  const mine = ELEVATION[code];
  if (!mine) return null;
  const all = (citiesData as unknown as { code: string }[])
    .map((r) => ELEVATION[r.code])
    .filter((v) => v != null);
  const rank = all.filter((v) => v[0] > mine[0]).length + 1;
  return { rank, total: all.length };
}

function terrainNote(avg: number, max: number, pct500: number): string {
  if (pct500 >= 50)
    return "面積の半分以上が平均標高500m以上のメッシュで占められる、山がちな地形です。";
  if (max >= 2000)
    return `標高${max.toLocaleString()}mに達する高山を含む、起伏の大きな地形です。`;
  if (avg >= 300) return "平均標高が高く、丘陵や山地の多い地形です。";
  if (max >= 1000) return "標高1,000mを超える山地を含む地形です。";
  if (avg < 30 && max < 200) return "ほぼ平坦な低地が広がる地形です。";
  if (avg < 100) return "低地から丘陵にかけての、なだらかな地形です。";
  return "丘陵地を中心とした地形です。";
}

const REGION: Record<string, string> = {
  北海道: "北海道",
  青森県: "東北", 岩手県: "東北", 宮城県: "東北", 秋田県: "東北", 山形県: "東北", 福島県: "東北",
  茨城県: "関東", 栃木県: "関東", 群馬県: "関東", 埼玉県: "関東", 千葉県: "関東", 東京都: "関東", 神奈川県: "関東",
  新潟県: "中部", 富山県: "中部", 石川県: "中部", 福井県: "中部", 山梨県: "中部", 長野県: "中部", 岐阜県: "中部", 静岡県: "中部", 愛知県: "中部",
  三重県: "近畿", 滋賀県: "近畿", 京都府: "近畿", 大阪府: "近畿", 兵庫県: "近畿", 奈良県: "近畿", 和歌山県: "近畿",
  鳥取県: "中国", 島根県: "中国", 岡山県: "中国", 広島県: "中国", 山口県: "中国",
  徳島県: "四国", 香川県: "四国", 愛媛県: "四国", 高知県: "四国",
  福岡県: "九州", 佐賀県: "九州", 長崎県: "九州", 熊本県: "九州", 大分県: "九州", 宮崎県: "九州", 鹿児島県: "九州",
  沖縄県: "沖縄",
};

type CityRow = { code: string; area: number | null; populationDensity: number | null };
const ROWS = citiesData as unknown as CityRow[];

function rankOf(code: string, key: "area" | "populationDensity"): { rank: number; total: number } | null {
  const valid = ROWS.filter((r) => r[key] != null && (r[key] as number) > 0);
  const me = valid.find((r) => r.code === code);
  if (!me) return null;
  const rank = valid.filter((r) => (r[key] as number) > (me[key] as number)).length + 1;
  return { rank, total: valid.length };
}

const CELL = 40;

export default function CityLocationMap({
  code,
  prefecture,
  cityName,
  area,
  density,
}: {
  code: string;
  prefecture: string;
  cityName: string;
  area: number | null;
  density: number | null;
}) {
  const region = REGION[prefecture];
  const areaRank = rankOf(code, "area");
  const densityRank = rankOf(code, "populationDensity");
  const elev = ELEVATION[code] ?? null;
  const elevRank = elev ? elevationRankOf(code) : null;
  const W = 11 * CELL;
  const H = 10 * CELL;

  return (
    <section style={{ margin: "36px 0" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
        {cityName}の位置と地理
      </h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.8, margin: "0 0 14px" }}>
        {cityName}は{region ? `${region}地方の` : ""}
        {prefecture}にあります。日本地図(模式図)では{prefecture}の位置を
        色付けしています。地形の目安として標高の集計値もあわせて示します。
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", maxWidth: 300, height: "auto", display: "block", flexShrink: 0 }}
          role="img"
          aria-label={`${prefecture}の位置を示す日本地図(模式図)`}
        >
          {PREFECTURE_TILE_LAYOUT.map((t) => {
            const home = t.name === prefecture;
            return (
              <g key={t.name}>
                <rect
                  x={t.x * CELL + 1.5}
                  y={t.y * CELL + 1.5}
                  width={CELL - 3}
                  height={CELL - 3}
                  rx={6}
                  fill={home ? "#2563eb" : "#e8edf5"}
                >
                  <title>{t.name}</title>
                </rect>
                <text
                  x={t.x * CELL + CELL / 2}
                  y={t.y * CELL + CELL / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={t.short.length >= 3 ? 10 : 12}
                  fontWeight={home ? 800 : 500}
                  fill={home ? "#fff" : "#94a3b8"}
                  style={{ pointerEvents: "none" }}
                >
                  {t.short}
                </text>
              </g>
            );
          })}
        </svg>
        <dl style={{ margin: 0, lineHeight: 2, fontSize: 15 }}>
          <div>
            <dt style={{ display: "inline", fontWeight: 700 }}>地方：</dt>
            <dd style={{ display: "inline", margin: 0 }}>{region}地方</dd>
          </div>
          <div>
            <dt style={{ display: "inline", fontWeight: 700 }}>都道府県：</dt>
            <dd style={{ display: "inline", margin: 0 }}>{prefecture}</dd>
          </div>
          {area != null && (
            <div>
              <dt style={{ display: "inline", fontWeight: 700 }}>面積：</dt>
              <dd style={{ display: "inline", margin: 0 }}>
                {area.toLocaleString()} km²
                {areaRank && `(全国の市区町村で${areaRank.rank.toLocaleString()}位/${areaRank.total.toLocaleString()}団体)`}
              </dd>
            </div>
          )}
          {density != null && (
            <div>
              <dt style={{ display: "inline", fontWeight: 700 }}>人口密度：</dt>
              <dd style={{ display: "inline", margin: 0 }}>
                {density.toLocaleString()} 人/km²
                {densityRank && `(全国${densityRank.rank.toLocaleString()}位)`}
              </dd>
            </div>
          )}
          {elev && (
            <div>
              <dt style={{ display: "inline", fontWeight: 700 }}>平均標高：</dt>
              <dd style={{ display: "inline", margin: 0 }}>
                約{elev[0].toLocaleString()} m
                {elevRank && `(全国${elevRank.rank.toLocaleString()}位)`}
              </dd>
            </div>
          )}
          {elev && (
            <div>
              <dt style={{ display: "inline", fontWeight: 700 }}>最高標高：</dt>
              <dd style={{ display: "inline", margin: 0 }}>
                約{elev[1].toLocaleString()} m
              </dd>
            </div>
          )}
          {elev && elev[2] > 0 && (
            <div>
              <dt style={{ display: "inline", fontWeight: 700 }}>標高500m以上の土地：</dt>
              <dd style={{ display: "inline", margin: 0 }}>約{elev[2]}%</dd>
            </div>
          )}
        </dl>
      </div>
      {elev && (
        <p style={{ color: "var(--muted)", lineHeight: 1.8, margin: "10px 0 0" }}>
          地形の特徴：{terrainNote(elev[0], elev[1], elev[2])}
        </p>
      )}
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
        ※模式図(タイルマップ)のため、実際の形状・面積比とは異なります。位置は都道府県単位までを示しています。
        標高は国土交通省「国土数値情報(標高・傾斜度3次メッシュ)」を自治体別に集計した近似値です
        (1kmメッシュの中心点が属する自治体に割り当てて集計)。
      </p>
    </section>
  );
}
