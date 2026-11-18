import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import RakutenGifts from "@/components/RakutenGifts";
import { getMunicipalitiesPop } from "@/lib/cityPopulation";

const PATH = "/articles/finance-population-cross-analysis";

export const metadata = {
  alternates: { canonical: PATH },
  title: "財政力が高い街ほど人は増えるのか？財政力指数と人口増減を掛け合わせた分析",
  description:
    "財政力指数と2020→2025年の人口増減を全国1,700超の自治体で掛け合わせると、相関は0.63と強い一方、財政力が高い自治体の約7割は人口が減っていました。原発・空港の立地町と、つくば・流山など「増えている豊かな街」の違いを分析します。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return num / Math.sqrt(dx * dy);
}

export default function Page() {
  const { rows, label } = getMunicipalitiesPop();
  const data = rows
    .filter((c) => c.financeIndex != null && c.pop2020 > 0)
    .map((c) => ({
      name: c.name,
      fin: c.financeIndex as number,
      chg: ((c.population - c.pop2020) / c.pop2020) * 100,
    }));
  const r = corr(data.map((d) => d.fin), data.map((d) => d.chg));

  const rich = data.filter((d) => d.fin >= 0.8);
  const richUp = rich.filter((d) => d.chg > 0);
  const richDownList = rich.filter((d) => d.chg < 0).sort((a, b) => a.chg - b.chg).slice(0, 5);
  const richUpList = [...richUp].sort((a, b) => b.chg - a.chg).slice(0, 5);
  const poor = data.filter((d) => d.fin < 0.5);
  const poorUp = poor.filter((d) => d.chg > 0);
  const poorUpList = [...poorUp].sort((a, b) => b.chg - a.chg).slice(0, 5);
  const richGrowPct = Math.round((richUp.length / rich.length) * 100);
  const poorGrowPct = Math.round((poorUp.length / poor.length) * 100);

  const faq = [
    {
      q: "財政力指数と人口増減には関係がありますか？",
      a: `全国${data.length.toLocaleString()}自治体で計算した相関係数は${r.toFixed(2)}で、かなり強い関係があります。財政に余裕のある自治体ほど人口が減りにくい傾向は確かにあります。ただし、財政力指数0.8以上の自治体でも人口が増えたのは約${richGrowPct}%にとどまり、「財政が豊かなら人は増える」とまでは言えません。`,
    },
    {
      q: "財政力が高いのに人口が減っている自治体があるのはなぜですか？",
      a: "財政力指数は「その自治体の収入の強さ」であって、住民の増減とは別の仕組みで決まるからです。発電所や空港、大規模な工場がある自治体は、人口が少なくても固定資産税などの収入が大きく、指数が高くなります。収入の源泉が一つの施設に偏っている自治体では、人口減少と財政の豊かさが両立します。",
    },
    {
      q: "財政力が低いのに人口が増えている自治体はありますか？",
      a: `財政力指数0.5未満で人口が増えた自治体は${poorUp.length}つあります(${poorUpList.map((d) => d.name).join("、")}など)。大都市近郊のベッドタウンや、リゾート・観光で注目される地域など、財政力以外の理由で人が集まるケースです。全体から見れば例外的で、割合は約${poorGrowPct}%です。`,
    },
    {
      q: "移住先選びでは財政力指数をどう見ればいいですか？",
      a: "財政力指数は「街の体力」の目安として有効ですが、それだけで決めないことが大切です。人口の増減(特に引っ越しによる社会増減)と組み合わせて見ることで、「お金も人も集まる街」「お金はあるが人は減る街」「人は来るが財政は普通の街」のどこに当てはまるかが分かります。",
    },
  ];

  const row = (d: (typeof data)[number]) => (
    <tr key={d.name}>
      <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{d.name}</td>
      <td style={tdR}>{d.fin.toFixed(2)}</td>
      <td style={tdR}>
        {d.chg > 0 ? "+" : ""}
        {d.chg.toFixed(1)}%
      </td>
    </tr>
  );

  return (
    <ArticleLayout
      title="財政力が高い街ほど人は増えるのか？財政力指数と人口増減を掛け合わせた分析"
      summary={`財政力指数と人口増減(2020→2025年)の相関は${r.toFixed(2)}と強いのに、財政力が高い自治体の約${100 - richGrowPct}%は人口が減っていました。「お金の集まる街」と「人の集まる街」は、重なるようで重なりません。その理由を、発電所・空港の立地町と、成長する郊外都市の対比から読み解きます。`}
      heroLabel="財政力指数と人口増減の相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/finance"
      path={PATH}
      tags={["finance", "population"]}
      publishedAt="2026-11-16"
      dataNote={`対象は財政力指数と人口増減の両方が取れる全国${data.length.toLocaleString()}自治体。人口は${label}と令和2年国勢調査の比較。財政力指数は当サイト収録の地方財政データによる。相関係数はピアソンの積率相関。`}
      top3={[
        { rank: 1, name: "相関係数(財政力×人口増減)", value: r.toFixed(2) },
        { rank: 2, name: "財政力0.8以上で人口増の割合", value: `約${richGrowPct}%` },
        { rank: 3, name: "財政力0.5未満で人口増の割合", value: `約${poorGrowPct}%` },
      ]}
    >
      <div style={box}>
        <h2>結論:関係は強い。でも「豊かな街=人が増える街」ではない</h2>
        <p>
          財政力指数と人口増減の相関係数は<strong>{r.toFixed(2)}</strong>。
          統計的には「かなり強い関係」です。財政に余裕のある街ほど、
          人口が減りにくい傾向は確かにあります。
        </p>
        <p>
          ところが、財政力指数0.8以上の「豊かな自治体」{rich.length}つのうち、
          2020年から人口が増えたのは{richUp.length}つ、約{richGrowPct}%しか
          ありません。逆に財政力0.5未満の自治体で人口が増えたのは約{poorGrowPct}%。
          つまり関係は「財政が弱い街はほぼ例外なく減る」という形で強く、
          「財政が強い街は増える」という形では成り立っていないのです。
        </p>
      </div>

      <div style={box}>
        <h2>財政力が高いのに、人が減る街</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>自治体</th>
                <th style={thR}>財政力指数</th>
                <th style={thR}>人口増減(2020→2025)</th>
              </tr>
            </thead>
            <tbody>{richDownList.map(row)}</tbody>
          </table>
        </div>
        <p>
          上位には、原子力発電所のある町(玄海町・高浜町など)、
          空港のある町(芝山町は成田空港)など、「大きな施設が一つある町」が
          並びます。財政力指数は、人口が少なくても施設からの固定資産税などで
          収入が大きければ高くなります。収入の源泉が施設に偏った街では、
          「財政は豊か、でも住む人は減る」が両立します。
        </p>
        <p>
          ここから分かるのは、財政力指数は「街の収入の強さ」であって
          「街の人気」ではない、ということです。移住先として見るときに
          この違いを取り違えると、「財政がいいから安心」と思って選んだ街で、
          商店や交通の縮小に直面することになりかねません。
        </p>
      </div>

      <div style={box}>
        <h2>お金も人も集まる街には、共通点がある</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>自治体</th>
                <th style={thR}>財政力指数</th>
                <th style={thR}>人口増減(2020→2025)</th>
              </tr>
            </thead>
            <tbody>{richUpList.map(row)}</tbody>
          </table>
        </div>
        <p>
          増加率が突出している大熊町は、避難指示の解除で帰還が進んだ
          特殊なケースです。それを除くと、人口が増えている豊かな街は、つくば市(研究機関とつくばエクスプレス)、
          流山市・印西市(都心へのアクセスと子育て世代の流入)、長久手市
          (名古屋近郊で若い世帯が多い)など、「働く場所や交通の強み」と
          「子育て世代の受け皿」が揃った街です。施設一つに頼る財政ではなく、
          住民と企業が両方集まることで税収が育ち、さらに人が来る。
          好循環の入口は、財政ではなく人の流れのほうにあります。
        </p>
      </div>

      <div style={box}>
        <h2>財政が弱くても人が増える街は、例外だが存在する</h2>
        <p>
          財政力0.5未満で人口が増えたのは{poorUp.length}自治体です
          ({poorUpList.map((d) => d.name).join("、")}など)。
          札幌近郊のベッドタウン(南幌町)、リゾート需要のある地域(占冠村)、
          沖縄の町村など、立地や観光の強みで人を集めるケースです。
          ただし割合は約{poorGrowPct}%と小さく、「財政が弱くても人は来る」は
          一般論にはなりません。財政の弱さは、いずれ子育て支援や施設の
          維持に効いてくる可能性があります。
        </p>
      </div>

      <div style={box}>
        <h2>読み解き:街を見る4つの型</h2>
        <ul>
          <li>
            <strong>お金も人も集まる街:</strong>
            財政力が高く人口も増加。産業・交通・子育ての条件が揃った成長都市
          </li>
          <li>
            <strong>お金はあるが人が減る街:</strong>
            施設立地型に多い。財政の安心感と、暮らしの縮小が同時に進む
          </li>
          <li>
            <strong>人は来るが財政は普通の街:</strong>
            ベッドタウン型。住宅地としての人気が先行し、税収は後から育つ
          </li>
          <li>
            <strong>両方厳しい街:</strong>
            財政力0.5未満の自治体の約{100 - poorGrowPct}%が人口減少。
            サービス維持が課題になる
          </li>
        </ul>
        <p>
          移住先の検討では、財政力指数を単独で見るのではなく、人口の増減
          (とくに引っ越しによる社会増減)と並べて、この4つの型のどこかを
          確認するのが実践的です。手順は
          <Link prefetch={false} href="/articles/moving-city-data-guide" style={link}>
            移住先の選び方(5指標ガイド)
          </Link>
          にまとめています。
        </p>
      </div>

      <div style={box}>
        <h2>この分析の方法と限界</h2>
        <p>
          相関係数は、財政力指数と人口増減率の両方が取得できる
          {data.length.toLocaleString()}自治体で計算しました。人口増減には
          高齢化による自然減も含まれるため、財政力との関係には年齢構成の
          影響が混ざっています。また相関は因果関係を示すものではありません
          (財政が豊かだから人が増えるのか、人が増えるから財政が育つのかは、
          この分析だけでは切り分けられません)。施設立地の個別事情も
          自治体ごとに異なります。
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

      {/* 自治体の財政に関心を持った人向けに、ふるさと納税の返礼品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="ふるさと納税 返礼品"
        heading="楽天市場でふるさと納税の返礼品を見る"
        hits={3}
      />

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
