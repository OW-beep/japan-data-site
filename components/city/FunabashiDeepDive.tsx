import Link from "next/link";

import { getMunicipalities } from "@/lib/municipalities";
import { getAgeGroups2025, getPopulation2025 } from "@/lib/population2025";
import { FUTURE_YEARS, getFuture } from "@/lib/futurePopulation";
import { getTax, incomeRank } from "@/lib/taxableIncome";
import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";
import elevationData from "@/data/elevation.json";
import type { City } from "@/lib/City";

/**
 * 船橋市(12204)専用の「深掘り分析」セクション。
 *
 * 船橋市ページを旗艦ページとして厚くするための特設ブロックで、
 * ほかの自治体ページには表示しない(呼び出し側で code === "12204" の
 * ときだけ描画する)。
 *
 * ・数字はすべて、サイト収録の lib/data からビルド時に計算する
 *   (クライアントJS・外部API・地図ライブラリは使わない)。
 * ・近隣都市の位置関係は、静的なSVGタイルマップ(模式図)で示す。
 * ・姉妹サイト「CivicScope船橋」への動線を、導入部と末尾CTAに置く。
 * ・順位は「全国1,740自治体(政令指定都市の区・東京都特別区部を除く)」
 *   での位置を示す物差しであり、自治体の優劣を示すものではない。
 */

const CODE = "12204";
const CIVICSCOPE_URL = "https://civic-scope-funabashi.vercel.app/";

const ELEVATION = elevationData as unknown as Record<string, [number, number, number]>;

/** 近隣比較表に出す自治体(船橋市 + 近隣8市) */
const NEIGHBOR_CODES = [
  "12204", // 船橋市
  "12100", // 千葉市
  "12207", // 松戸市
  "12203", // 市川市
  "12217", // 柏市
  "12221", // 八千代市
  "12216", // 習志野市
  "12227", // 浦安市
  "12224", // 鎌ケ谷市
];

/** タイルマップ(模式図)の配置。[列, 行]。上が北 */
const TILES: { code: string; x: number; y: number }[] = [
  { code: "12207", x: 1, y: 0 }, // 松戸市(北西)
  { code: "12224", x: 2, y: 0 }, // 鎌ケ谷市(北)
  { code: "12221", x: 3, y: 0 }, // 八千代市(北東)
  { code: "12217", x: 4, y: 0 }, // 柏市(北東)
  { code: "12203", x: 0, y: 1 }, // 市川市(西)
  { code: "12204", x: 1, y: 1 }, // 船橋市(中心)
  { code: "12216", x: 2, y: 1 }, // 習志野市(東)
  { code: "12100", x: 3, y: 1 }, // 千葉市(東・南東)
  { code: "12227", x: 0, y: 2 }, // 浦安市(南西・湾岸)
];

const num = (v: number) => v.toLocaleString("ja-JP");
const signed = (v: number) => `${v > 0 ? "+" : ""}${num(v)}`;
const signedPct = (v: number, digits = 2) => `${v > 0 ? "+" : ""}${v.toFixed(digits)}%`;

function growthOf(c: City): number | null {
  const p = getPopulation2025(c.code);
  if (p == null || !(c.population > 0)) return null;
  return ((p - c.population) / c.population) * 100;
}

export default function FunabashiDeepDive() {
  const munis = getMunicipalities();
  const me = munis.find((c) => c.code === CODE);
  if (!me) return null;

  const total = munis.length; // 1,740
  const byCode = new Map(munis.map((c) => [c.code, c]));

  // --- 人口(2020→2025) ---
  const pop2020 = me.population;
  const pop2025 = getPopulation2025(CODE) ?? pop2020;
  const growthPct = ((pop2025 - pop2020) / pop2020) * 100;
  const popRank = munis.filter((c) => c.population > pop2020).length + 1;
  const growthRank =
    munis.filter((c) => {
      const g = growthOf(c);
      return g != null && g > growthPct;
    }).length + 1;
  const bigCities = munis.filter((c) => c.population >= 500_000);
  const bigGrew = bigCities.filter((c) => (getPopulation2025(c.code) ?? 0) > c.population).length;

  // --- 高齢化率(2020年国勢調査ベース) ---
  const agingRate = (me.elderlyPopulation / pop2020) * 100;
  const natAging =
    (munis.reduce((s, c) => s + c.elderlyPopulation, 0) / munis.reduce((s, c) => s + c.population, 0)) * 100;
  const agingRankFromLow =
    munis.filter((c) => (c.elderlyPopulation / c.population) * 100 < agingRate).length + 1;

  // --- 財政 ---
  const finList = munis.filter((c) => c.financeIndex != null);
  const financeRank =
    me.financeIndex != null ? finList.filter((c) => (c.financeIndex as number) > (me.financeIndex as number)).length + 1 : null;

  // --- 移動(社会増減・自然増減・若者純移動) ---
  const social = (me.inMigrants ?? 0) - (me.outMigrants ?? 0);
  const natural = (me.births ?? 0) - (me.deaths ?? 0);
  const young = me.youngAdultNetMigration ?? 0;
  const youngRank = munis.filter((c) => (c.youngAdultNetMigration ?? Number.NEGATIVE_INFINITY) > young).length + 1;

  // --- 暮らしの指標 ---
  const vacantRate =
    me.vacantHouseCount != null && me.totalHousingCount ? (me.vacantHouseCount / me.totalHousingCount) * 100 : null;
  const housingRows = munis.filter((c) => c.vacantHouseCount != null && c.totalHousingCount);
  const natVacant =
    (housingRows.reduce((s, c) => s + (c.vacantHouseCount as number), 0) /
      housingRows.reduce((s, c) => s + (c.totalHousingCount as number), 0)) *
    100;
  const doctorsPer = me.doctorsCount != null ? (me.doctorsCount / pop2020) * 100_000 : null;
  const singleRate =
    me.singleHouseholds != null && me.households ? (me.singleHouseholds / me.households) * 100 : null;
  const foreignRate = me.foreignPopulation != null ? (me.foreignPopulation / pop2020) * 100 : null;
  const daytimeRatio = me.daytimePopulation != null ? (me.daytimePopulation / pop2020) * 100 : null;

  // --- 所得・ふるさと納税・地形 ---
  const tax = getTax(CODE);
  const taxRank = incomeRank(CODE);
  const furusato = getFurusatoNozeiRanking().find((r) => r.name === me.name) ?? null;
  const elev = ELEVATION[CODE] ?? null;

  // --- 将来推計 ---
  const future = getFuture(CODE);
  const peakIdx = future ? future.pop.indexOf(Math.max(...future.pop)) : -1;
  const peakYear = peakIdx >= 0 ? FUTURE_YEARS[peakIdx] : null;

  // --- 子ども人口(2020→2025) ---
  const child2025 = getAgeGroups2025(CODE)?.child ?? null;

  // --- 近隣比較 ---
  const neighborRows = NEIGHBOR_CODES.map((code) => byCode.get(code))
    .filter((c): c is City => c != null)
    .map((c) => ({
      code: c.code,
      name: c.name.split(" ").slice(1).join(" "),
      pop: c.population,
      growth: growthOf(c),
      aging: (c.elderlyPopulation / c.population) * 100,
      finance: c.financeIndex,
      daytime: c.daytimePopulation != null ? (c.daytimePopulation / c.population) * 100 : null,
      young: c.youngAdultNetMigration,
      home: c.code === CODE,
    }))
    .sort((a, b) => (a.home === b.home ? b.pop - a.pop : a.home ? -1 : 1));

  const strengths: { title: string; figure: string; note: React.ReactNode }[] = [
    {
      title: "今も増え続ける大都市",
      figure: `人口 ${num(pop2025)}人`,
      note: (
        <>
          2020年から{signedPct(growthPct)}の増加(増加率は全国{growthRank}位)。人口50万人以上の
          {bigCities.length}自治体のうち、2020→2025年で増えたのは{bigGrew}だけです。人口規模は全国{popRank}位、
          千葉県では千葉市に次ぐ2番目です。
        </>
      ),
    },
    {
      title: "若者が集まる街",
      figure: `20代の純移動 ${signed(young)}人`,
      note: (
        <>
          20代の転入超過は全国{youngRank}位({num(total)}自治体)。転入{num(me.inMigrants ?? 0)}人・転出
          {num(me.outMigrants ?? 0)}人で、社会増減も{signed(social)}人と、引っ越しによる増加が続いています。
        </>
      ),
    },
    {
      title: "安定した財政",
      figure: `財政力指数 ${me.financeIndex?.toFixed(2)}`,
      note: (
        <>
          全国{financeRank}位({num(finList.length)}団体)。実質公債費比率は{me.realDebtServiceRatio?.toFixed(1)}%と低く、
          借入への依存が小さい財政です。経常収支比率は{me.ordinaryBalanceRatio?.toFixed(1)}%です。
        </>
      ),
    },
    {
      title: "商業・生活の集積",
      figure: `大型小売店 ${num(me.largeRetailStoreCount ?? 0)}店`,
      note: (
        <>
          小売店舗は{num(me.retailStoreCount ?? 0)}店、飲食店は{num(me.restaurantCount ?? 0)}店、保育所は
          {num(me.daycareCount ?? 0)}か所。昼間人口は{num(me.daytimePopulation ?? 0)}人と、市内で働き、
          買い物をする人の厚みがあります。
        </>
      ),
    },
    ...(future && peakYear != null
      ? [
          {
            title: "2050年まで人口を維持する推計",
            figure: `2050年 ${num(future.pop[6])}人`,
            note: (
              <>
                国立社会保障・人口問題研究所の推計では、人口のピークは{peakYear}年の{num(future.pop[peakIdx])}人。
                その後も緩やかな動きにとどまり、2050年でも2020年の水準をほぼ維持します。
              </>
            ),
          },
        ]
      : []),
  ];

  const miniStats: { label: string; value: string }[] = [
    ...(tax
      ? [
          {
            label: "課税所得(納税者1人あたり)",
            value: `約${Math.round(tax.incomePerTaxpayer)}万円${taxRank ? `(全国${taxRank.rank}位)` : ""}`,
          },
        ]
      : []),
    ...(vacantRate != null
      ? [{ label: "空き家率", value: `${vacantRate.toFixed(1)}%(全国平均${natVacant.toFixed(1)}%)` }]
      : []),
    ...(singleRate != null ? [{ label: "単身世帯率", value: `${singleRate.toFixed(1)}%` }] : []),
    ...(me.foreignPopulation != null && foreignRate != null
      ? [{ label: "外国人住民", value: `${num(me.foreignPopulation)}人(${foreignRate.toFixed(1)}%)` }]
      : []),
    ...(furusato
      ? [
          {
            label: "ふるさと納税の受入額",
            value: `約${(furusato.amountYen / 100_000_000).toFixed(1)}億円(${num(furusato.count)}件)`,
          },
        ]
      : []),
    ...(doctorsPer != null
      ? [{ label: "医師数(人口10万人あたり)", value: `${Math.round(doctorsPer)}人(病院${num(me.hospitalCount ?? 0)}・診療所${num(me.clinicCount ?? 0)})` }]
      : []),
  ];

  // --- 将来推計の折れ線グラフ(模式図ではなく実数プロット) ---
  const chart = (() => {
    if (!future) return null;
    const W = 640;
    const H = 196;
    const padL = 52;
    const padR = 16;
    const padT = 26;
    const padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const yMin = 600_000;
    const yMax = 680_000;
    const x = (i: number) => padL + (plotW / (future.pop.length - 1)) * i;
    const y = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    const points = future.pop.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const grid = [620_000, 640_000, 660_000];
    return (
      <figure style={{ margin: "16px 0 4px" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`船橋市の将来推計人口。2020年${num(future.pop[0])}人から${peakYear ?? ""}年に${num(future.pop[peakIdx])}人でピークを迎え、2050年は${num(future.pop[6])}人の推計です`}
          style={{ width: "100%", height: "auto", display: "block", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}
        >
          <title>船橋市の将来推計人口(社人研推計)</title>
          {grid.map((g) => (
            <g key={g}>
              <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="#e5e7eb" />
              <text x={padL - 8} y={y(g) + 4} textAnchor="end" fontSize={11} fill="#6b7280">
                {g / 10_000}万人
              </text>
            </g>
          ))}
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={2.5} />
          {future.pop.map((v, i) => (
            <g key={FUTURE_YEARS[i]}>
              <circle cx={x(i)} cy={y(v)} r={i === peakIdx ? 5.5 : 4} fill={i === peakIdx ? "#1d4ed8" : "#2563eb"} stroke="#fff" strokeWidth={1.5} />
              {(i === 0 || i === peakIdx || i === future.pop.length - 1) && (
                <text
                  x={x(i)}
                  y={y(v) - 10}
                  textAnchor={i === 0 ? "start" : i === future.pop.length - 1 ? "end" : "middle"}
                  fontSize={11.5}
                  fontWeight={700}
                  fill="#1e3a8a"
                >
                  {num(v)}人
                </text>
              )}
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize={11.5} fill="#475569">
                {FUTURE_YEARS[i]}年
              </text>
            </g>
          ))}
          {peakYear != null && (
            <text x={x(peakIdx)} y={y(future.pop[peakIdx]) + 22} textAnchor="middle" fontSize={11} fill="#1d4ed8">
              ピーク
            </text>
          )}
        </svg>
        <figcaption style={cap}>
          国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5(2023)年推計)」より。2020年は国勢調査の実績、
          以降は推計です。縦軸は60万人から表示しています。
        </figcaption>
      </figure>
    );
  })();

  // --- 近隣タイルマップ(模式図) ---
  const tileMap = (() => {
    const TW = 128;
    const TH = 66;
    const GAP = 8;
    const W = 5 * TW + 4 * GAP;
    const H = 3 * TH + 2 * GAP;
    const bayX = 1 * (TW + GAP);
    const bayY = 2 * (TH + GAP);
    return (
      <figure style={{ margin: "14px 0 4px" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="船橋市と近隣8市の位置関係を示す模式図。北に松戸市・鎌ケ谷市・八千代市・柏市、西に市川市、東に習志野市・千葉市、南西に浦安市があり、南は東京湾です"
          style={{ width: "100%", maxWidth: 672, height: "auto", display: "block" }}
        >
          <title>船橋市と近隣都市の位置関係(模式図)</title>
          <rect x={bayX} y={bayY} width={W - bayX} height={TH} rx={10} fill="#dbeafe" />
          <text x={bayX + (W - bayX) / 2} y={bayY + TH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill="#1d4ed8">
            東京湾
          </text>
          {TILES.map((t) => {
            const c = byCode.get(t.code);
            if (!c) return null;
            const home = t.code === CODE;
            const short = c.name.split(" ").slice(1).join(" ");
            const tx = t.x * (TW + GAP);
            const ty = t.y * (TH + GAP);
            return (
              <a key={t.code} href={`/city/${t.code}`}>
                <rect
                  x={tx}
                  y={ty}
                  width={TW}
                  height={TH}
                  rx={10}
                  fill={home ? "#2563eb" : "#eef2f7"}
                  stroke={home ? "#1d4ed8" : "#cbd5e1"}
                  strokeWidth={home ? 2 : 1}
                >
                  <title>{`${c.name}のページへ`}</title>
                </rect>
                <text x={tx + TW / 2} y={ty + 27} textAnchor="middle" fontSize={15} fontWeight={800} fill={home ? "#fff" : "#1f2937"} style={{ pointerEvents: "none" }}>
                  {short}
                </text>
                <text x={tx + TW / 2} y={ty + 48} textAnchor="middle" fontSize={11.5} fill={home ? "#dbeafe" : "#64748b"} style={{ pointerEvents: "none" }}>
                  {(c.population / 10_000).toFixed(1)}万人
                </text>
              </a>
            );
          })}
        </svg>
        <figcaption style={cap}>
          模式図のため、実際の距離・面積・形状とは異なります(上が北)。タイルを選ぶと各市のページへ移動します。人口は令和2年国勢調査です。
          なお船橋市は、平均標高約{elev ? elev[0] : "―"}m・最高標高約{elev ? elev[1] : "―"}mと、起伏の少ない平坦な地形です
          (国土数値情報の標高メッシュを集計した近似値)。
        </figcaption>
      </figure>
    );
  })();

  return (
    <>
      {/* ============ 1. 導入 + 強みカード ============ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>船橋市 深掘り分析</h2>
        <p style={p}>
          船橋市は、千葉県で2番目に大きな都市でありながら、今も人口が増え続けている全国でも数少ない大都市です。
          このセクションでは、当サイトが収録する全国{num(total)}自治体のデータから、船橋市の強みと今後の焦点を
          深掘りします。順位は全国の中での立ち位置を示す物差しとして使っています。
          船橋市だけを分野別に掘り下げた姉妹サイト
          <a href={CIVICSCOPE_URL} target="_blank" rel="noopener noreferrer" style={link}>
            CivicScope船橋
          </a>
          もあわせてご覧ください。
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "18px 0 6px" }}>
          {strengths.map((s) => (
            <article
              key={s.title}
              style={{
                flex: "1 1 200px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderTop: "4px solid #2563eb",
                borderRadius: 14,
                padding: "16px 18px 8px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 6px", color: "#1e3a8a" }}>{s.title}</h3>
              <div style={{ fontSize: 21, fontWeight: 800, color: "#2563eb", lineHeight: 1.35, marginBottom: 8 }}>{s.figure}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.85, color: "#4b5563", margin: "0 0 10px" }}>{s.note}</p>
            </article>
          ))}
        </div>

        <dl
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 28px",
            margin: "10px 0 0",
            padding: "14px 18px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            fontSize: 14,
          }}
        >
          {miniStats.map((m) => (
            <div key={m.label}>
              <dt style={{ display: "inline", color: "#6b7280" }}>{m.label}：</dt>
              <dd style={{ display: "inline", margin: 0, fontWeight: 700 }}>{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============ 2. 独自見解 ============ */}
      <section style={card}>
        <h2 style={h2}>編集部の読み解き</h2>

        <h3 style={h3}>「プラトー型」の大都市 ― ピークが遅く、その後もほぼ横ばい</h3>
        <p style={p}>
          全国の大都市の将来推計は、その多くが「緩やかな減少」を前提に描かれます。そのなかで船橋市の推計は、
          {peakYear}年に{future ? num(future.pop[peakIdx]) : ""}人でピークを迎え、2050年でも
          {future ? num(future.pop[6]) : ""}人と、2020年の水準をほぼ維持する軌跡です。山型に減っていくのではなく、
          高い水準で横ばいに移る「プラトー(高原)型」と言えます。ただし、この維持を支えているのは自然増減では
          ありません。出生{num(me.births ?? 0)}人に対して死亡{num(me.deaths ?? 0)}人で、自然減は
          {num(natural)}人。増加のエンジンは、20代の純移動{signed(young)}人に代表される、若年層の社会増の側にあります。
        </p>
        {chart}

        <h3 style={h3}>ベッドタウンでありながら、自己完結度が高い</h3>
        <p style={p}>
          船橋市は東京のベッドタウンと見られがちですが、昼間人口は{num(me.daytimePopulation ?? 0)}人、
          昼間人口比率は{daytimeRatio?.toFixed(1)}あります。近隣の市川市(81)・松戸市(82)と比べても昼間の厚みがあり、
          大型小売店{num(me.largeRetailStoreCount ?? 0)}店・小売店舗{num(me.retailStoreCount ?? 0)}店の集積が、
          市内の雇用と消費を下支えしています。「寝に帰るだけの街」ではなく、昼も人が集まる街であることが、
          人口の維持を下支えする条件の一つになっています。
        </p>

        <h3 style={h3}>前提条件は「流入が続くこと」</h3>
        <p style={p}>
          正直に言えば、このプラトーは「若い世代の流入が続くこと」が前提条件です。推計は2020年時点までの
          傾向をもとにした見通しで、流入が細れば軌跡は変わります。人口が維持されるかどうかは、住宅の供給や
          子育て環境、昼間の働く場といった、流入を支える条件が続くかにかかっています。次の節の近隣比較と
          「伸びしろ」は、その前提を点検するための材料です。
        </p>
      </section>

      {/* ============ 3. 近隣比較(地図 + 表) ============ */}
      <section style={card}>
        <h2 style={h2}>近隣都市との比較</h2>
        <p style={p}>
          船橋市と、周囲の8市のおおまかな位置関係と、主要指標の比較です。人口の増減率では八千代市・柏市・千葉市も
          増加しており、県北西部一帯に人の流れが集まっていることが分かります。そのなかで船橋市は、規模の大きさと
          若者の流入、昼間の厚みの組み合わせに特徴があります。
        </p>
        {tileMap}
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>自治体</th>
                <th style={th}>人口(2020年)</th>
                <th style={th}>人口増減率(2020→2025)</th>
                <th style={th}>高齢化率</th>
                <th style={th}>財政力指数</th>
                <th style={th}>昼間人口比率</th>
                <th style={th}>若者純移動(20代)</th>
              </tr>
            </thead>
            <tbody>
              {neighborRows.map((r) => (
                <tr key={r.code} style={r.home ? { background: "#eff6ff" } : undefined}>
                  <td style={tdL}>
                    <Link prefetch={false} href={`/city/${r.code}`} style={link}>
                      {r.name}
                    </Link>
                    {r.home && <span style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 700 }}>（このページ）</span>}
                  </td>
                  <td style={td}>{num(r.pop)}人</td>
                  <td style={td}>{r.growth != null ? signedPct(r.growth) : "―"}</td>
                  <td style={td}>{r.aging.toFixed(1)}%</td>
                  <td style={td}>{r.finance != null ? r.finance.toFixed(2) : "―"}</td>
                  <td style={td}>{r.daytime != null ? Math.round(r.daytime) : "―"}</td>
                  <td style={td}>{r.young != null ? signed(r.young) : "―"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={cap}>
          人口・高齢化率・昼間人口比率は令和2年国勢調査、人口増減率は令和7年国勢調査との比較、財政力指数は地方財政の
          公表値、若者純移動は20〜29歳の転入超過数(当サイト収録データ)です。昼間人口比率は夜間人口(常住人口)を100とした値です。
        </p>
      </section>

      {/* ============ 4. 伸びしろ ============ */}
      <section style={card}>
        <h2 style={h2}>伸びしろ・今後の焦点</h2>
        <p style={p}>
          強みの一方で、数字が示す今後の焦点もあります。いずれも「これから向き合うテーマ」として、事実を整理します。
        </p>
        <h3 style={h3}>自然減の拡大と、社会増への依存</h3>
        <p style={p}>
          出生{num(me.births ?? 0)}人に対して死亡{num(me.deaths ?? 0)}人と、自然減は{num(natural)}人まで
          広がっています。現在の人口増は社会増({signed(social)}人)が自然減を上回ることで成り立っており、
          流入の勢いが弱まると、人口の軌跡は変わります。
        </p>
        <h3 style={h3}>子ども人口の減少ペース</h3>
        <p style={p}>
          子ども(15歳未満)人口は、2020年の{num(me.childPopulation)}人から2025年には
          {child2025 != null ? `${num(child2025)}人` : "減少"}
          になりました。若い世代が集まる街だからこそ、その世代が子育て期に入ってからも住み続けられる環境づくりが、
          次の流入と定着を左右します。保育所は{num(me.daycareCount ?? 0)}か所、小学校{num(me.elementarySchoolCount ?? 0)}校・
          中学校{num(me.juniorHighSchoolCount ?? 0)}校が現在の受け皿です。
        </p>
        <h3 style={h3}>高齢化の進展への備え</h3>
        <p style={p}>
          高齢化率は{agingRate.toFixed(1)}%と、全国平均({natAging.toFixed(1)}%)より低く、低い方から
          {num(agingRankFromLow)}位という若い構成です。ただし推計では2050年に
          {future ? future.elderly[6].toFixed(1) : ""}%まで上昇します。現在は病院{num(me.hospitalCount ?? 0)}か所・
          診療所{num(me.clinicCount ?? 0)}か所、医師は人口10万人あたり{doctorsPer != null ? Math.round(doctorsPer) : ""}人。
          人口が維持される街だからこそ、医療・介護の受け皿を計画的に広げていくことが焦点になります。
        </p>
      </section>

      {/* ============ 5. CivicScope船橋 CTA ============ */}
      <section
        style={{
          background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          borderRadius: 18,
          padding: "30px 30px 26px",
          marginBottom: 40,
          color: "#fff",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>船橋市のデータをもっと深く見るなら</h2>
        <p style={{ lineHeight: 1.95, margin: "0 0 18px", color: "#dbeafe" }}>
          姉妹サイト「CivicScope船橋」は、人口・子育て・防災など分野別のダッシュボードで、船橋市だけを
          掘り下げているデータメディアです。このページの「全国の中での船橋市」とは別の角度から、
          「船橋市の中の動き」を追うことができます。
        </p>
        <a
          href={CIVICSCOPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#1d4ed8",
            fontWeight: 800,
            fontSize: 16,
            padding: "12px 26px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          CivicScope船橋を開く(外部サイト)
        </a>
      </section>

      <p style={cap}>
        出典:総務省統計局「国勢調査」(令和2年・令和7年)、国立社会保障・人口問題研究所「日本の地域別将来推計人口
        (令和5(2023)年推計)」、総務省「地方財政状況調査」「市町村税課税状況等の調(令和7年度)」
        「ふるさと納税に関する現況調査結果」、国土交通省「国土数値情報」ほか、当サイト収録データ。
        順位は全国{num(total)}自治体(政令指定都市の区・東京都特別区部を除く)での順位で、財政力指数の順位は
        指数のある{num(finList.length)}団体が対象です。課税所得は総務省『市町村税課税状況等の調』に基づく
        納税義務者1人あたりの課税対象所得です。
      </p>
    </>
  );
}

const h2: React.CSSProperties = { fontSize: 26, fontWeight: 800, margin: "0 0 12px" };
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 800, margin: "22px 0 8px", color: "#1f2937" };
const p: React.CSSProperties = { margin: "0 0 12px", lineHeight: 1.95, color: "#374151" };
const cap: React.CSSProperties = { fontSize: 12.5, color: "#6b7280", lineHeight: 1.8, margin: "8px 0 0" };
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: "28px 30px 18px",
  marginBottom: 40,
};
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 640, fontSize: 14, background: "#fff" };
const th: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e2e8f0", background: "#f1f5f9", fontWeight: 700, textAlign: "right", whiteSpace: "nowrap" };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e2e8f0", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
