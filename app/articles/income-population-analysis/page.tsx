import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

const PATH = "/articles/income-population-analysis";

// 納税義務者1人あたり課税対象所得(令和7年度課税)の低い順に4等分したグループごとの平均人口増減率(2020→2025年)
// chg は減少幅の大きさ(正の数)として持ち、表示時にマイナスを付ける
const QUARTILES = [
  { label: "低い25%", inc: 271, chg: 10.59, grow: 1.6 },
  { label: "中低", inc: 297, chg: 8.09, grow: 3.0 },
  { label: "中高", inc: 324, chg: 5.88, grow: 6.0 },
  { label: "高い25%", inc: 403, chg: 1.89, grow: 28.3 },
];

const GROW_HIGH = [
  { name: "つくば市(茨城県)", inc: 452, chg: 11.3 },
  { name: "中央区(東京都)", inc: 882, chg: 7.5 },
  { name: "流山市(千葉県)", inc: 452, chg: 7.6 },
  { name: "印西市(千葉県)", inc: 418, chg: 7.5 },
  { name: "長久手市(愛知県)", inc: 485, chg: 5.5 },
  { name: "港区(東京都)", inc: 1810, chg: 4.6 },
];

const HIGH_SHRINK = [
  { name: "渋谷区(東京都)", inc: 1394, chg: -2.1 },
  { name: "千代田区(東京都)", inc: 1291, chg: -0.6 },
  { name: "芦屋市(兵庫県)", inc: 761, chg: -2.5 },
  { name: "猿払村(北海道)", inc: 752, chg: -4.2 },
];

const LOW_GROW = [
  { name: "占冠村(北海道)", inc: 280, chg: 13.8 },
  { name: "宜野座村(沖縄県)", inc: 273, chg: 7.7 },
  { name: "八重瀬町(沖縄県)", inc: 293, chg: 5.6 },
  { name: "名護市(沖縄県)", inc: 287, chg: 3.9 },
  { name: "海士町(島根県)", inc: 299, chg: 3.5 },
];

export const metadata = {
  alternates: { canonical: PATH },
  title: "平均所得が高い街は人口が増えるのか｜課税所得×人口増減を1,740自治体で分析",
  description:
    "納税義務者1人あたりの課税対象所得と2020→2025年の人口増減を全国1,740自治体で掛け合わせると、相関は0.40。人口が増えた169自治体の72.8%が所得の上位25%でした。ただし高所得でも減る街、平均以下でも増える街もあり、所得は「稼げる仕事の土台」を見る指標でした。",
};

function QuartileChart() {
  const zeroY = 64;
  const scale = 13; // 1% = 13px
  const barW = 92;
  const startX = 70;
  const step = 145;
  return (
    <svg
      viewBox="0 0 640 300"
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="課税所得のグループ別、平均人口増減率の棒グラフ。所得が最も低いグループはマイナス10.59%、最も高いグループはマイナス1.89%で、所得が高いほど減少幅が小さい"
    >
      <text x={320} y={24} textAnchor="middle" fontSize={15} fontWeight={700} fill="#111827">
        課税所得のグループ別 平均人口増減率(2020→2025年)
      </text>
      <line x1={40} x2={620} y1={zeroY} y2={zeroY} stroke="#9ca3af" strokeWidth={1.5} />
      <text x={34} y={zeroY + 4} textAnchor="end" fontSize={12} fill="#6b7280">
        0%
      </text>
      {QUARTILES.map((q, i) => {
        const h = q.chg * scale;
        const x = startX + i * step;
        return (
          <g key={q.label}>
            <rect
              x={x}
              y={zeroY}
              width={barW}
              height={h}
              rx={4}
              fill={i === QUARTILES.length - 1 ? "#2563eb" : "#94a3b8"}
            />
            <text
              x={x + barW / 2}
              y={zeroY + h - 10}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill="#ffffff"
            >
              −{q.chg.toFixed(2)}%
            </text>
            <text x={x + barW / 2} y={zeroY + 175} textAnchor="middle" fontSize={14} fontWeight={600} fill="#111827">
              {q.label}
            </text>
            <text x={x + barW / 2} y={zeroY + 195} textAnchor="middle" fontSize={12} fill="#6b7280">
              所得平均 {q.inc}万円
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Page() {
  const faq = [
    {
      q: "平均所得が高い街は、人口が増えているのですか？",
      a: "「増えている」とまでは言えませんが、「減りにくい」傾向ははっきりあります。全国1,740自治体で計算した相関係数は0.40で、所得が最も高い25%のグループは平均−1.89%の減少にとどまり、最も低い25%のグループ(−10.59%)と比べて減少幅が5分の1以下でした。実際に人口が増えた169自治体のうち、72.8%が所得の上位25%に入っています。",
    },
    {
      q: "なぜ所得と人口の増減に関係があるのですか？",
      a: "課税所得は、その街と周辺に「稼げる仕事がどれだけあるか」を映す目安だからだと考えられます。働く場がある街は、働き盛りの世代が住み続け、引っ越してくる理由も生まれます。ただし逆向きの関係――人が集まる街だから所得も高くなる――もあり得るため、この分析だけで因果関係は断定できません。",
    },
    {
      q: "所得が高いのに人口が減っている街もありますか？",
      a: "あります。渋谷区は納税者1人あたり1,394万円と全国屈指の高所得ですが、人口は−2.1%でした。芦屋市(761万円)も−2.5%、ホタテ漁で知られる北海道猿払村(752万円)も−4.2%です。成熟した住宅地や一次産業が中心の村では、所得が高くても高齢化による自然減が進みます。所得はあくまで一つの側面です。",
    },
    {
      q: "移住先選びで所得データは見たほうがいいですか？",
      a: "仕事の土台を見る指標として有効です。ただし課税所得は「納税義務者1人あたり」の数字で、株式の売却益なども含むため年によってぶれることがあり、世帯の年収とは意味が異なります。所得だけでなく、人口増減そのものや年齢構成と並べて見ることをおすすめします。当サイトの課税所得ランキングと人口増減の記事で、あわせて確認できます。",
    },
  ];

  const cityTable = (list: typeof GROW_HIGH) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thR}>課税所得(納税者1人あたり)</th>
            <th style={thR}>人口増減(2020→2025)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.name}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{d.name}</td>
              <td style={tdR}>{d.inc.toLocaleString()}万円</td>
              <td style={tdR}>
                {d.chg > 0 ? "+" : "−"}
                {Math.abs(d.chg).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ArticleLayout
      title="平均所得が高い街は人口が増えるのか｜課税所得×人口増減を1,740自治体で分析"
      summary="課税所得と人口増減(2020→2025年)の相関は0.40。所得が高い自治体ほど人口が減りにくい傾向ははっきりあります。人口が増えた169自治体の72.8%は所得の上位25%でした。ただし主役は「所得そのもの」ではなく、その背景にある「稼げる仕事の土台」だと考えられます。"
      heroLabel="課税所得と人口増減の相関係数"
      heroValue="0.40"
      rankingLink="/ranking/taxable-income"
      path={PATH}
      tags={["population", "labor"]}
      publishedAt="2026-11-21"
      dataNote="対象は全国1,740自治体(東京都特別区部を除く。福島県双葉町は国勢調査の人口データがないため対象外)。課税所得は総務省「市町村税課税状況等の調」令和7年度(令和6年中の所得)による納税義務者1人あたりの課税対象所得。人口増減は令和2年→令和7年(2020→2025年)国勢調査の比較。相関係数はピアソンの積率相関。"
      top3={[
        { rank: 1, name: "相関係数(課税所得×人口増減)", value: "0.40" },
        { rank: 2, name: "人口が増えた自治体に占める所得上位25%の割合", value: "72.8%" },
        { rank: 3, name: "所得上位25%の平均人口増減率(下位25%は−10.59%)", value: "−1.89%" },
      ]}
    >
      <div style={box}>
        <h2>結論:所得が高い街ほど「減りにくい」。増えた街の7割超は所得上位</h2>
        <p>
          納税義務者1人あたりの課税対象所得と、2020→2025年の人口増減の
          相関係数は<strong>0.40</strong>でした。これまで当サイトが
          掛け合わせてきた指標の中では、財政力指数(0.63)に次ぐ強さです。
        </p>
        <p>
          顔ぶれを見ると傾向はもっと鮮明です。この5年間で人口が増えた
          169自治体のうち、所得の上位25%に入る自治体が72.8%を占めました。
          人口が増えた自治体の所得の平均は約396万円で、減った自治体の
          平均(約316万円)を大きく上回ります。「お金持ちの街が増える」
          という単純な話ではなく、所得は「その街で稼げるかどうか」を
          映す鏡として、人口の動きと結びついているようです。
        </p>
      </div>

      <div style={box}>
        <h2>4分位で見ると:所得が高いグループほど、減少幅が小さい</h2>
        <QuartileChart />
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>課税所得のグループ</th>
                <th style={thR}>所得の平均</th>
                <th style={thR}>平均人口増減率</th>
                <th style={thR}>人口が増えた割合</th>
              </tr>
            </thead>
            <tbody>
              {QUARTILES.map((q) => (
                <tr key={q.label}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{q.label}</td>
                  <td style={tdR}>{q.inc}万円</td>
                  <td style={tdR}>−{q.chg.toFixed(2)}%</td>
                  <td style={tdR}>{q.grow.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          所得の低い順に4等分すると、平均の人口増減率は
          −10.59% → −8.09% → −5.88% → −1.89%と、一段ずつ
          減少幅が小さくなります。人口が増えた割合に至っては、
          最も低いグループの1.6%(435団体中7団体)に対し、
          最も高いグループでは28.3%(同123団体)と、18倍近い差が
          つきました。
        </p>
        <p>
          市区と町村に分けても傾向は同じです。市区(815団体)では
          相関0.47とやや強く、町村(925団体)でも0.31ありました。
          大都市だけの話ではなく、町村の規模でも「稼げる土台が
          あるところは減りにくい」という構図が見えます。
        </p>
      </div>

      <div style={box}>
        <h2>所得と成長が重なる街:都心・研究都市・ベッドタウン</h2>
        <p>
          所得の上位25%に入り、かつ人口が増えた代表例です。
        </p>
        {cityTable(GROW_HIGH)}
        <p>
          顔ぶれは3つのタイプに分かれます。港区・中央区のような
          都心、研究学園都市のつくば市、そして流山市・印西市・
          長久手市のような、子育て世代が流入する成長ベッドタウンです。
          共通するのは、街の中か通勤圏に「稼げる仕事」がはっきり
          存在することです。なお、所得が500万円以上の自治体は
          全国で30しかなく、その平均増減率は−0.37%でした。
          超高所得の顔ぶれは東京の区と一部の市に限られます。
        </p>
      </div>

      <div style={box}>
        <h2>例外①:所得が高くても減る街はある</h2>
        {cityTable(HIGH_SHRINK)}
        <p>
          渋谷区は所得1,394万円と全国2位でありながら、人口は
          −2.1%でした。千代田区も−0.6%と微減です。都心の高所得区は、
          住宅価格の高さや世帯構成の変化の中で、人口が頭打ちに
          なることがあります。芦屋市のような成熟した住宅地も
          同じで、所得の高さと引き換えに、住民の高齢化による
          自然減が静かに進みます。
        </p>
        <p>
          北海道猿払村は、ホタテ漁の好調で所得752万円と村ながら
          全国トップ10に入りますが、人口は−4.2%でした。一次産業の
          収入は高くても、働き手の世代交代や進学・就職での転出は
          別問題として残ります。所得が高いことは、その街の将来を
          保証しません。
        </p>
      </div>

      <div style={box}>
        <h2>例外②:所得が平均以下でも増える街はある</h2>
        {cityTable(LOW_GROW)}
        <p>
          所得が全国の中央値(約310万円)を下回りながら人口が増えた
          街もあります。北海道占冠村はリゾート、沖縄県の宜野座村・
          八重瀬町・名護市は出生率の高さと若い年齢構成、島根県
          海士町は離島への移住施策で知られる町です。所得以外の
          強み――観光資源、年齢構成の若さ、移住の受け入れ――が
          人口を押し上げることもある、ということです。
        </p>
        <p>
          もう一つ、所得では説明できない特殊な動きもあります。
          福島県の大熊町(+81.0%)、富岡町(+36.0%)、浪江町(+33.9%)は、
          原発事故からの帰還が進んだ自治体です。所得は大熊町で
          約354万円と突出してはいません。人口の動きには、災害からの
          復興のような、その街固有の事情が大きく作用する場合が
          あります。
        </p>
      </div>

      <div style={box}>
        <h2>読み解き:移住先選びで、所得をどう見るか</h2>
        <ul>
          <li>
            <strong>所得は「仕事の土台」の目安:</strong>
            所得が高い街は、街の中か通勤圏に稼げる仕事がある可能性が
            高く、人口も減りにくい傾向があります。就職・転職を伴う
            移住では、まず見る価値のある指標です
          </li>
          <li>
            <strong>ただし「高所得＝安泰」ではない:</strong>
            渋谷区や芦屋市のように、成熟した高所得の街でも人口が
            減ることはあります。年齢構成と人口増減そのものを
            必ず並べて確認してください
          </li>
          <li>
            <strong>数字の性質を知っておく:</strong>
            課税所得は納税義務者1人あたりで、株式の売却益なども
            含むため年によってぶれます。「平均年収」の感覚とは
            少し違う数字として読むのが正確です
          </li>
        </ul>
        <p>
          所得そのものの順位は
          <Link prefetch={false} href="/ranking/taxable-income" style={link}>
            課税所得ランキング
          </Link>
          、所得が高い街の顔ぶれは
          <Link prefetch={false} href="/articles/municipal-income-analysis" style={link}>
            所得が高い市区町村ランキングの記事
          </Link>
          、2020→2025年の人口増減の全体像は
          <Link prefetch={false} href="/articles/population-change-2025" style={link}>
            人口増減(2020→2025)の記事
          </Link>
          で確認できます。「自治体の豊かさ」と人口の関係は、
          街の財布を見る
          <Link prefetch={false} href="/articles/finance-population-cross-analysis" style={link}>
            財政力指数との掛け合わせ分析
          </Link>
          でも扱っています。住民の所得(0.40)と自治体の財政力(0.63)、
          どちらも人口の減りにくさと結びつきますが、財政力のほうが
          やや強い関係でした。移住先の検討手順は
          <Link prefetch={false} href="/articles/moving-city-data-guide" style={link}>
            移住先の選び方(5指標ガイド)
          </Link>
          にまとめています。
        </p>
      </div>

      <div style={box}>
        <h2>この分析の方法と限界</h2>
        <p>
          課税所得は令和7年度の課税データ(令和6年中の所得)で、
          住民税の課税状況をもとにした「納税義務者1人あたりの
          課税対象所得」です。給与だけでなく事業所得や株式等の
          譲渡所得も含み、所得控除前の金額のため、いわゆる平均年収
          とは数字が異なります。人口増減は2020→2025年の国勢調査の
          比較で、所得はその期間の終わり頃(2024年中)の値です。
          相関は因果関係を示すものではありません(所得が高いから
          人が増えるのか、人が集まる街だから所得も高いのかは、
          この分析だけでは切り分けられません)。対象は東京都
          特別区部を除く全国1,740自治体で、福島県双葉町は国勢調査の
          人口データがないため対象外としています。出典は総務省
          「市町村税課税状況等の調」令和7年度と、総務省統計局
          「国勢調査」(令和2年・令和7年)です。
        </p>
        <CompareCTA />
      </div>

      <div style={box}>
        <h2>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
