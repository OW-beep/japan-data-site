import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

const PATH = "/articles/foreign-population-cross-analysis";

// 外国人比率(2020年国勢調査)を低い順に4等分したグループごとの平均人口増減率(2020→2025年)
// chg は減少幅の大きさ(正の数)として持ち、表示時にマイナスを付ける
const QUARTILES = [
  { label: "低い25%", ratio: 0.37, chg: 8.64 },
  { label: "中低", ratio: 0.77, chg: 7.62 },
  { label: "中高", ratio: 1.27, chg: 6.34 },
  { label: "高い25%", ratio: 3.01, chg: 3.85 },
];

const URBAN = [
  { name: "豊島区", ratio: 8.5, chg: 1.3 },
  { name: "新宿区", ratio: 7.8, chg: 3.4 },
  { name: "台東区", ratio: 6.8, chg: 7.9 },
  { name: "蕨市", ratio: 8.5, chg: 1.6 },
];

const INDUSTRY = [
  { name: "占冠村", ratio: 11.1, chg: 13.8 },
  { name: "南牧村", ratio: 13.9, chg: 3.0 },
  { name: "高浜市", ratio: 7.1, chg: 4.3 },
  { name: "恩納村", ratio: 6.8, chg: 3.0 },
  { name: "美濃加茂市", ratio: 8.2, chg: 0.2 },
  { name: "大泉町", ratio: 17.6, chg: -1.6 },
];

const EXCEPTIONS = [
  { name: "川上村", ratio: 19.0, chg: -3.9 },
  { name: "常総市", ratio: 7.8, chg: -4.8 },
];

export const metadata = {
  alternates: { canonical: PATH },
  title: "外国人が多い街は人口が減りにくいのか？外国人比率と人口増減を掛け合わせた分析",
  description:
    "外国人比率と2020→2025年の人口増減を全国1,740自治体で掛け合わせると、相関は0.30。外国人が多い街ほど減りにくい傾向は、転入の多さではなく、若い世代が多い年齢構成による自然減の緩やかさで説明できました。都市型と産業型、2つの顔を分析します。",
};

function QuartileChart() {
  const zeroY = 64;
  const scale = 21; // 1% = 21px
  const barW = 92;
  const startX = 70;
  const step = 145;
  return (
    <svg
      viewBox="0 0 640 308"
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="外国人比率のグループ別、平均人口増減率の棒グラフ。比率が最も低いグループはマイナス8.64%、最も高いグループはマイナス3.85%で、比率が高いほど減少幅が小さい"
    >
      <text x={320} y={24} textAnchor="middle" fontSize={15} fontWeight={700} fill="#111827">
        外国人比率のグループ別 平均人口増減率(2020→2025年)
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
            <text x={x + barW / 2} y={278} textAnchor="middle" fontSize={14} fontWeight={600} fill="#111827">
              {q.label}
            </text>
            <text x={x + barW / 2} y={298} textAnchor="middle" fontSize={12} fill="#6b7280">
              比率平均 {q.ratio.toFixed(2)}%
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
      q: "外国人が多い街は、人口が増えているのですか？",
      a: "「増えている」とまでは言えませんが、「減りにくい」傾向ははっきりあります。全国1,740自治体で計算した相関係数は0.30で、外国人比率が最も高い25%のグループは平均−3.85%の減少にとどまり、最も低い25%のグループ(−8.64%)と比べて減少幅が半分以下でした。外国人比率5%以上の44団体では、人口が増えた割合が36.4%と、全体の9.7%を大きく上回っています。",
    },
    {
      q: "なぜ外国人比率が高いと人口が減りにくいのですか？",
      a: "転入の多さよりも、年齢構成が関係していると考えられます。外国人比率と社会増減率(転入−転出)の相関は0.10と弱い一方、自然増減率(出生−死亡)との相関は0.29ありました。外国人住民は働き盛りの若い世代が中心で、その自治体では出生数が相対的に多く、死亡数が年齢構成のうえで少なくなりやすい。つまり「外国人が引っ越してきて増える」というより、「若い世代が暮らす街は自然減が緩やか」という構成の効果です。因果関係を断定するものではありません。",
    },
    {
      q: "外国人比率が高いのに人口が減っている街もありますか？",
      a: "あります。長野県川上村は外国人比率19.0%と全国トップ級ですが、人口は−3.9%でした。茨城県常総市も7.8%で−4.8%です。比率の高さはあくまで一つの目安で、その街の産業の動きや、もともとの年齢構成によって結果は変わります。",
    },
    {
      q: "移住先選びで外国人比率は見たほうがいいですか？",
      a: "人口の減りにくさを見る補助的な目安にはなります。ただし外国人比率そのものよりも、人口増減の内訳(自然増減と社会増減)と、その街でどんな産業と暮らしが成り立っているかを合わせて見ることが大切です。外国人比率の順位は当サイトのランキングで、人口の動きは2020→2025年の人口増減をまとめた記事で確認できます。",
    },
  ];

  const cityTable = (list: typeof URBAN) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thR}>外国人比率(2020年)</th>
            <th style={thR}>人口増減(2020→2025)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.name}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{d.name}</td>
              <td style={tdR}>{d.ratio.toFixed(1)}%</td>
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
      title="外国人が多い街は人口が減りにくいのか？外国人比率と人口増減を掛け合わせた分析"
      summary="外国人比率と人口増減(2020→2025年)の相関は0.30。外国人住民が多い自治体ほど人口が減りにくい傾向は確かにあります。ただし分解すると、効いていたのは転入の多さではなく、若い世代が多い年齢構成による「自然減の緩やかさ」でした。"
      heroLabel="外国人比率と人口増減の相関係数"
      heroValue="0.30"
      rankingLink="/ranking/foreign-population"
      path={PATH}
      tags={["population", "international"]}
      publishedAt="2026-11-18"
      dataNote="対象は全国1,740自治体(東京都特別区部を除く)。外国人比率は令和2年(2020年)国勢調査、人口増減は令和2年→令和7年(2025年)国勢調査の比較で、外国人比率は2020年時点の値をその後の5年間の増減と組み合わせている。相関係数はピアソンの積率相関。出典:総務省統計局「国勢調査」。"
      top3={[
        { rank: 1, name: "相関係数(外国人比率×人口増減)", value: "0.30" },
        { rank: 2, name: "外国人比率5%以上で人口増の割合", value: "36.4%(全体9.7%)" },
        { rank: 3, name: "人口が増えた自治体の外国人比率(平均)", value: "2.32%(全体1.35%)" },
      ]}
    >
      <div style={box}>
        <h2>結論:減りにくい傾向はある。でも主役は「転入」ではなかった</h2>
        <p>
          外国人比率と人口増減の相関係数は<strong>0.30</strong>。
          強い相関とは言えませんが、全国1,740自治体を通して見ると、
          外国人住民が多い自治体ほど人口が減りにくい傾向は確かにあります。
          人口が増えた169の自治体では、外国人比率の平均が2.32%と
          全体平均(1.35%)の1.7倍で、その62.1%が全体平均以上の比率でした。
        </p>
        <p>
          直感的には「外国人が引っ越してくるから人口が減らない」と
          考えがちです。しかし増減の内訳に分解すると、転入による
          社会増減との相関は0.10しかありませんでした。効いていたのは
          出生と死亡の差である自然増減のほうで、これは外国人住民の
          年齢構成――働き盛りの若い世代が多いこと――で説明できます。
          この記事では、その分解の結果を中心に読み解きます。
        </p>
      </div>

      <div style={box}>
        <h2>4分位で見ると:比率が高いグループほど、減少幅が小さい</h2>
        <QuartileChart />
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>外国人比率のグループ</th>
                <th style={thR}>外国人比率の平均</th>
                <th style={thR}>平均人口増減率</th>
              </tr>
            </thead>
            <tbody>
              {QUARTILES.map((q) => (
                <tr key={q.label}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{q.label}</td>
                  <td style={tdR}>{q.ratio.toFixed(2)}%</td>
                  <td style={tdR}>−{q.chg.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          外国人比率の低い順に4等分すると、平均の人口増減率は
          −8.64% → −7.62% → −6.34% → −3.85%と、一段ずつ
          減少幅が小さくなります。どのグループも平均では減少している
          のが日本の人口の現状ですが、「減り方の緩やかさ」には
          はっきりした差があります。
        </p>
        <p>
          外国人比率5%以上の44団体に絞ると、平均の人口増減率は
          −1.16%で、うち36.4%は人口が増えていました(全体では
          人口増は9.7%)。なお、この関係は大都市だけの話では
          ありません。市・区だけでは相関は0.41とやや強く、町村では
          0.20、人口50万人未満の自治体に限っても0.29と、規模を
          問わず同じ方向の傾向が見られます。
        </p>
      </div>

      <div style={box}>
        <h2>分解すると見える核心:効いているのは自然増減のほう</h2>
        <p>
          人口の増減は、出生と死亡の差(自然増減)と、転入と転出の差
          (社会増減)に分解できます。外国人比率との相関をそれぞれ
          計算すると、結果は対照的でした。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>組み合わせ</th>
                <th style={thR}>相関係数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>外国人比率 × 自然増減率</td>
                <td style={tdR}>0.29</td>
              </tr>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>外国人比率 × 社会増減率</td>
                <td style={tdR}>0.10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          つまり、外国人比率が高い自治体で人口が減りにくいのは、
          「外国人が次々に引っ越してくるから」では主にありません。
          外国人住民は働き盛りの若い世代が中心です。そういう世代が
          一定割合暮らす自治体では、子どもが生まれる数が相対的に
          多く、死亡数は年齢構成のうえで少なくなります。住民全体の
          年齢構成が若寄りになることで、自然減のペースが緩やかに
          なる――これが、相関0.30の中身だと考えられます。
        </p>
        <p>
          言い換えると、外国人比率は「その街に若い世代がどれだけ
          暮らしているか」を映す鏡の一つです。若い世代が多い街は、
          出生と死亡のバランスで人口が減りにくい。これは国籍を
          問わず、年齢構成の話として理解するのが正確です。
          もちろん、もともと若い世代が集まる街に外国人住民も
          集まりやすいという逆向きの関係もあり得るため、ここでは
          因果関係までは断定しません。
        </p>
      </div>

      <div style={box}>
        <h2>2つのタイプ:都市型と産業型</h2>
        <p>
          外国人比率が高い自治体の顔ぶれは、大きく2つのタイプに
          分かれます。1つは、働く場や学校が集まり、国際性のある
          都市のタイプです。
        </p>
        {cityTable(URBAN)}
        <p>
          東京の区や蕨市のように、仕事と交通の利便性が高い街には、
          働き手・留学生など若い世代が国籍を問わず集まります。
          人口が増えている街が多いのも、このタイプの特徴です。
        </p>
        <p>
          もう1つは、地域の産業の働き手として定住するタイプです。
        </p>
        {cityTable(INDUSTRY)}
        <p>
          北海道占冠村はリゾート、長野県南牧村・川上村は高原野菜、
          群馬県大泉町や岐阜県美濃加茂市、愛知県高浜市は製造業、
          沖縄県恩納村は観光と、産業の顔はさまざまです。共通するのは、
          その産業を支える働き手として外国人住民が地域に根づき、
          街の年齢構成を若く保つ一助になっていることです。
          大泉町のように人口が微減の街でも、減少幅は全国の
          平均的な姿より小さくとどまっています。
        </p>
      </div>

      <div style={box}>
        <h2>例外も正直に:比率が高くても減る街はある</h2>
        {cityTable(EXCEPTIONS)}
        <p>
          長野県川上村は、外国人比率19.0%と全国トップ級でありながら、
          人口は−3.9%でした。高原野菜の産地として働き手が集まっても、
          村全体の人口の動きは、進学や就職での転出、もともとの年齢
          構成など、ほかの要因にも左右されます。茨城県常総市も
          比率7.8%で−4.8%と、減少を免れてはいません。
        </p>
        <p>
          相関0.30という数字は、あくまで全体の傾向です。個々の街の
          将来を外国人比率だけで読み切ることはできません。比率は
          「若い世代が暮らす街かどうか」を見る入口として使い、
          個別の事情と合わせて判断することが大切です。
        </p>
      </div>

      <div style={box}>
        <h2>読み解き:この数字をどう使うか</h2>
        <ul>
          <li>
            <strong>人口の減りにくさは「年齢構成」で見る:</strong>
            人口が減りにくい街を探すなら、増減の総数だけでなく、
            自然増減と社会増減の内訳を確認するのが近道です
          </li>
          <li>
            <strong>外国人比率は「若い世代の暮らし」の目安:</strong>
            比率が高い街は、働き盛りの世代が一定数暮らし、地域の
            産業やサービスがその世代に支えられている可能性があります
          </li>
          <li>
            <strong>単独の指標で判断しない:</strong>
            川上村のような例外がある以上、比率は入口の目安に
            とどめ、人口の動き全体と並べて見てください
          </li>
        </ul>
        <p>
          外国人比率そのものの順位は
          <Link prefetch={false} href="/ranking/foreign-population" style={link}>
            外国人比率ランキング
          </Link>
          、出生と死亡のバランスは
          <Link prefetch={false} href="/ranking/natural-change" style={link}>
            自然増減率ランキング
          </Link>
          、引っ越しによる動きは
          <Link prefetch={false} href="/ranking/decline" style={link}>
            社会増減率ランキング
          </Link>
          で確認できます。外国人住民が多い自治体の顔ぶれは
          <Link prefetch={false} href="/articles/foreign-population" style={link}>
            外国人人口の多い自治体の分析
          </Link>
          、2020→2025年の人口増減の全体像は
          <Link prefetch={false} href="/articles/population-change-2025" style={link}>
            人口増減(2020→2025)の記事
          </Link>
          にまとめています。移住先の検討では、こうした指標を
          組み合わせて見る手順を
          <Link prefetch={false} href="/articles/moving-city-data-guide" style={link}>
            移住先の選び方(5指標ガイド)
          </Link>
          で紹介しています。
        </p>
      </div>

      <div style={box}>
        <h2>この分析の方法と限界</h2>
        <p>
          外国人比率は令和2年(2020年)国勢調査時点の値で、人口増減は
          その後の5年間(2020→2025年)の変化です。つまり「2020年
          時点で外国人比率が高かった自治体が、その後どう変化したか」
          を見た分析であり、期間中に比率自体がどう変わったかは
          追えていません。また相関は因果関係を示すものでは
          ありません(外国人住民が多いから減りにくいのか、若い世代が
          集まる街だから外国人比率も高いのかは、この分析だけでは
          切り分けられません)。対象は東京都特別区部を除く全国
          1,740自治体です。出典は総務省統計局「国勢調査」
          (令和2年・令和7年)です。
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
