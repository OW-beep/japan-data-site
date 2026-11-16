import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities2025 } from "@/lib/city2025";

const PATH = "/articles/aging-doctors-mismatch-analysis";
const MIN_POP = 30_000;
const AGING_THRESHOLD = 35;

export const metadata = {
  alternates: { canonical: PATH },
  title: "高齢化が進む街ほど医師が少ない？高齢化率と医師数を掛け合わせた「医療ミスマッチ」分析",
  description:
    "高齢化率と人口あたり医師数を全国の自治体で掛け合わせると、相関は弱く、実態は「拠点病院があるかどうか」で決まっていました。高齢化率50%で医師が平均の3割しかいない街と、高齢化しても医師が多い例外の街を分析。老後の移住で見るべき指標も解説します。",
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
  const data = getMunicipalities2025()
    .filter((c) => c.agingRate != null && c.doctorsCount != null && c.population >= MIN_POP)
    .map((c) => ({
      name: c.name,
      age: c.agingRate as number,
      doc: ((c.doctorsCount as number) / c.population) * 100_000,
      pop: c.population,
    }));
  const r = corr(data.map((d) => d.age), data.map((d) => d.doc));
  const avgDoc = data.reduce((s, d) => s + d.doc, 0) / data.length;

  const mismatch = data
    .filter((d) => d.age >= AGING_THRESHOLD && d.doc < avgDoc * 0.6)
    .sort((a, b) => b.age - a.age)
    .slice(0, 6);
  const exceptions = data
    .filter((d) => d.age >= AGING_THRESHOLD && d.doc > avgDoc * 1.5)
    .sort((a, b) => b.doc - a.doc)
    .slice(0, 5);

  const faq = [
    {
      q: "高齢化が進んでいる街は、医師も少ないのですか？",
      a: `人口${MIN_POP.toLocaleString()}人以上の${data.length}自治体で計算すると、高齢化率と人口あたり医師数の相関係数は${r.toFixed(2)}と弱く、「高齢化が進むほど医師が少ない」とは一概に言えません。医師が多いかは、その街に拠点病院があるかどうかに大きく左右されます。`,
    },
    {
      q: "高齢化しているのに医師が多い街があるのはなぜですか？",
      a: "地域の中核病院や大学病院がある街です。たとえば旭川市(北海道)のように、周辺地域全体の医療を担う拠点都市では、高齢化が進んでいても医師が集まります。医師数は市単独ではなく、医療圏(周辺自治体を含む範囲)で見る必要があります。",
    },
    {
      q: "老後の移住先を選ぶとき、医療では何を見ればいいですか？",
      a: "高齢化率ではなく、人口あたりの医師数・病院数と、自宅から拠点病院までの実際の移動時間です。あわせて、休日夜間の救急体制と、かかりつけ医(診療所)の数も確認してください。この記事のミスマッチの表にあるように、高齢化率だけでは医療の手薄さは分かりません。",
    },
    {
      q: "人口あたり医師数が少ない街は、医療が受けられないのですか？",
      a: "そうとは限りません。近隣の拠点都市の病院がカバーしている地域も多く、医師数が少なくてもアクセスが良い街はあります。逆に医師数が多くても、それは周辺から患者が集まる拠点という意味で、自市の住民の利便性と一致しないこともあります。医師数は「目安」として、距離とあわせて判断してください。",
    },
  ];

  const table = (list: typeof data) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>自治体</th>
            <th style={thR}>高齢化率</th>
            <th style={thR}>医師数(人口10万人あたり)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.name}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{d.name}</td>
              <td style={tdR}>{d.age.toFixed(1)}%</td>
              <td style={tdR}>{Math.round(d.doc).toLocaleString()}人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ArticleLayout
      title="高齢化が進む街ほど医師が少ない？「医療ミスマッチ」を掛け合わせて分析"
      summary={`「高齢化が進んだ街では医療が手薄になる」は本当か。高齢化率と医師数を掛け合わせると相関は${r.toFixed(2)}と弱く、決め手は高齢化率ではなく「拠点病院があるか」でした。高齢化率50%でも医師が平均の3割の街と、高齢化しても医師が多い街の違いを読み解きます。`}
      heroLabel="高齢化率と医師数の相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/doctors"
      path={PATH}
      tags={["aging", "medical"]}
      publishedAt="2026-11-16"
      dataNote={`対象は人口${MIN_POP.toLocaleString()}人以上で高齢化率・医師数の両方が取れる${data.length}自治体。高齢化率は令和7年国勢調査ベース、医師数は当サイト収録の医療データ(人口10万人あたりに換算)。医師数の平均は対象自治体の単純平均。`}
      top3={[
        { rank: 1, name: "相関係数(高齢化率×医師数)", value: r.toFixed(2) },
        { rank: 2, name: "医師数の平均(10万人あたり)", value: `${Math.round(avgDoc)}人` },
        { rank: 3, name: "ミスマッチの自治体", value: `${mismatch.length}市を抽出` },
      ]}
    >
      <div style={box}>
        <h2>結論:高齢化率では、医療の手薄さは測れない</h2>
        <p>
          直感的には「高齢化が進んだ街ほど、お年寄りが多くて医師が足りない」
          と考えがちです。ところが、人口{MIN_POP.toLocaleString()}人以上の
          {data.length}自治体で相関係数を計算すると<strong>{r.toFixed(2)}</strong>。
          関係はごく弱く、高齢化率から医師の多さはほとんど予測できません。
        </p>
        <p>
          実際にデータを並べると、決め手は高齢化率そのものではなく、
          <strong>その街(または近隣)に拠点病院があるか</strong>でした。
          高齢化と医療の「ミスマッチ」は、特定の条件の街で起きています。
        </p>
      </div>

      <div style={box}>
        <h2>ミスマッチの街:高齢化率{AGING_THRESHOLD}%以上、医師は平均の6割未満</h2>
        {table(mismatch)}
        <p>
          筆頭の南房総市は高齢化率が5割に達しながら、人口10万人あたりの
          医師数は平均({Math.round(avgDoc)}人)の3割ほどしかありません。
          房総半島の先端という地理的条件もあり、大きな病院は近隣市に
          頼る構造です。こうした街では、高齢化で医療需要が増える一方、
          供給側の拡充が追いつきにくいという問題が起きやすくなります。
        </p>
        <p>
          共通するのは、海沿いや半島部、山間部など、拠点都市から距離のある
          地域であることです。高齢化そのものより「距離」が、医療アクセスの
          実質的な壁になっています。
        </p>
      </div>

      <div style={box}>
        <h2>例外の街:高齢化しても医師が多いのは「医療の拠点」</h2>
        {table(exceptions)}
        <p>
          逆に、高齢化率{AGING_THRESHOLD}%以上でも医師が多い街もあります。
          旭川市は道北の医療拠点で、大学病院をはじめ大きな病院が集まります。
          小松島市・洲本市・南丹市・倉吉市も、それぞれ地域の中核病院を
          抱える街です。医師は「住む人の数」ではなく「病院の立地」に
          集まるため、拠点の有無でこれだけの差がつきます。
        </p>
        <p>
          注意したいのは、拠点の街の医師数の多さは、周辺地域全体の患者を
          受け止めた結果だという点です。自市の高齢化率と医師数を1対1で
          結びつけて「この街は医療が充実」と判断すると、実態とずれる
          ことがあります。
        </p>
      </div>

      <div style={box}>
        <h2>読み解き:老後の住まい選びで、見るべきはこの3つ</h2>
        <ol>
          <li>
            <strong>高齢化率ではなく、医師数と病院数:</strong>
            医療の供給は
            <Link prefetch={false} href="/ranking/doctors" style={link}>
              医師数ランキング
            </Link>
            で直接確認できます。高齢化率は需要側の数字にすぎません。
          </li>
          <li>
            <strong>拠点病院までの距離:</strong>
            自市に大きな病院がなくても、車で30分圏に拠点があれば
            実質的なアクセスは確保できます。地図で確認してください。
          </li>
          <li>
            <strong>その街が「拠点」か「周辺」か:</strong>
            拠点の街は高齢化しても医療が維持されやすく、周辺の街は
            拠点までの交通手段(バス・送迎)が生命線になります。
          </li>
        </ol>
        <p>
          移住先選び全体の手順は
          <Link prefetch={false} href="/articles/moving-city-data-guide" style={link}>
            移住先の選び方(5指標ガイド)
          </Link>
          にまとめています。医療は、その中でも現地確認の比重が
          最も大きい項目です。
        </p>
      </div>

      <div style={box}>
        <h2>この分析の方法と限界</h2>
        <p>
          医師数は自治体単位の集計で、診療科の内訳(内科・外科・小児科など)や、
          非常勤を含めた実際の診療体制までは区別していません。また医療は
          市町村を越えて利用されるため、自治体単位の比較には構造的な
          限界があります。個別の街の医療体制は、自治体や医療機関の
          公表情報で必ず確認してください。
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
