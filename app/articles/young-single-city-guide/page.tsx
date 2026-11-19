import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities2025 } from "@/lib/city2025";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import { shortName } from "@/lib/cityPopulation";

const PATH = "/articles/young-single-city-guide";

/** 地価(円/m²)を自治体コードで引けるようにする。政令指定都市は区の平均で市単位に寄せる */
function buildPriceMap(): Map<string, number> {
  const map = new Map<string, number>();
  const wards = new Map<string, number[]>();
  getRealEstatePriceRanking().forEach((r) => {
    if (r.landPricePerSqm == null) return;
    map.set(r.code, r.landPricePerSqm);
    if (!r.code.endsWith("00")) {
      const cityCode = r.code.slice(0, 3) + "00";
      wards.set(cityCode, [...(wards.get(cityCode) ?? []), r.landPricePerSqm]);
    }
  });
  wards.forEach((v, k) => {
    if (!map.has(k)) map.set(k, v.reduce((a, b) => a + b, 0) / v.length);
  });
  return map;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export const metadata = {
  alternates: { canonical: PATH },
  title: "初めての一人暮らしの街選び｜地価と若者の動きで見る、家賃を抑えて失敗しない方法",
  description:
    "進学・就職で初めて一人暮らしをする人向けに、家賃と地価の関係、通勤圏の考え方をデータで解説。人口10万人以上の市で「地価は東京の3分の1以下なのに20代が集まっている市」39市など、掛け合わせの実データと、数字では見えない確認リストをまとめました。",
};

export default function Page() {
  const priceMap = buildPriceMap();
  const base = getMunicipalities2025()
    .filter((c) => c.population >= 100000)
    .map((c) => ({
      code: c.code,
      name: c.name,
      pop: c.population,
      land: priceMap.get(c.code) ?? null,
      youngMig:
        c.youngAdultNetMigration != null
          ? (c.youngAdultNetMigration / c.population) * 1000
          : null,
      daytime:
        c.daytimePopulation != null && c.nighttimePopulation
          ? (c.daytimePopulation / c.nighttimePopulation) * 100
          : null,
      childRate: (c.childPopulation / c.population) * 100,
    }));

  const withLand = base.filter((c) => c.land != null);
  const tokyo = withLand.filter((c) => c.code.startsWith("13"));
  const DESIGNATED = new Set([
    "札幌市", "仙台市", "さいたま市", "千葉市", "横浜市", "川崎市", "相模原市",
    "新潟市", "静岡市", "浜松市", "名古屋市", "京都市", "大阪市", "堺市",
    "神戸市", "岡山市", "広島市", "北九州市", "福岡市", "熊本市",
  ]);
  const designated = withLand.filter((c) => DESIGNATED.has(shortName(c.name)));
  const others = withLand.filter(
    (c) => !c.code.startsWith("13") && !designated.includes(c)
  );
  const medTokyo = median(tokyo.map((c) => c.land!));
  const medDesignated = median(designated.map((c) => c.land!));
  const medOthers = median(others.map((c) => c.land!));

  // log地価と20代純移動率の相関
  const pairs = base.filter((c) => c.land != null && c.youngMig != null);
  const mx = pairs.reduce((s, c) => s + Math.log(c.land!), 0) / pairs.length;
  const my = pairs.reduce((s, c) => s + (c.youngMig ?? 0), 0) / pairs.length;
  let num = 0, dx = 0, dy = 0;
  pairs.forEach((c) => {
    num += (Math.log(c.land!) - mx) * ((c.youngMig ?? 0) - my);
    dx += (Math.log(c.land!) - mx) ** 2;
    dy += ((c.youngMig ?? 0) - my) ** 2;
  });
  const corrLandYoung = num / Math.sqrt(dx * dy);

  const tokyoThird = medTokyo / 3;
  const valueCities = pairs
    .filter((c) => c.land! <= tokyoThird && (c.youngMig ?? 0) > 0)
    .sort((a, b) => (b.youngMig ?? 0) - (a.youngMig ?? 0));

  const pick = (name: string) => base.find((c) => c.name === name);
  const examples = [
    pick("埼玉県 富士見市"),
    pick("埼玉県 三郷市"),
    pick("神奈川県 座間市"),
    pick("千葉県 八千代市"),
    pick("兵庫県 明石市"),
    pick("愛知県 東海市"),
  ].filter((c): c is NonNullable<typeof c> => c != null);

  const faq = [
    {
      q: "家賃の相場はどうやって調べればいいですか？",
      a: "物件サイトの募集家賃が実態に一番近い数字です。この記事の地価は「街ごとの相場の水準」を比べるための目安で、地価が高い街ほど家賃も高い傾向があります。候補を絞る段階では地価、実際に部屋を探す段階では募集家賃、という使い分けが現実的です。",
    },
    {
      q: "家賃が安い街を選べば失敗しませんか？",
      a: "安さには理由があります。駅から遠い、買い物の店が少ない、通勤に時間がかかる、といった不便さと引き換えの場合が少なくありません。地価と20代の転入の掛け合わせで見ると、地価が高い街ほど若者が集まる傾向(相関" + corrLandYoung.toFixed(2) + ")がありました。家賃だけでなく、通勤時間と生活の便を含めた「総コスト」で考えてください。",
    },
    {
      q: "昼夜間人口比率が低い街(ベッドタウン)は避けるべきですか？",
      a: "避ける必要はありません。比率が低い街は「働く場所は都心、住む場所は郊外」という性格で、住宅街として静かな一方、昼間は店や施設が空いていることもあります。夜勤や在宅勤務が多い人は、昼間の街の様子も含めて現地で確認すると安心です。",
    },
    {
      q: "初めての一人暮らしで、内見のときに必ず見るべき点は？",
      a: "駅からの実際の歩行時間(夜道の明るさを含む)、最寄りのスーパーとコンビニ、ゴミ集積所の状態、携帯電話の電波とネット回線の種類、水回りの水圧です。どれも統計には表れないので、夕方以降の時間帯にもう一度歩くのがおすすめです。",
    },
    {
      q: "地価データがない街はどう考えればいいですか？",
      a: "取引件数が少ない地域では地価の実勢価格が出ないことがあります。その場合は近隣の市の地価と、物件サイトの募集家賃で代用してください。データがないこと自体は、その街の良し悪しを意味しません。",
    },
    {
      q: "家賃は月収のどれくらいに抑えるべきですか？",
      a: "手取りの3分の1以下が昔からの目安ですが、車が要る地域では車両費、都心では定期代の安さまで含めて考える必要があります。この記事の候補のように地価が中くらいの街では、家賃を抑えた分を貯蓄や移動の自由に回しやすく、結果として長く住み続けられるケースが多くなります。",
    },
  ];

  return (
    <ArticleLayout
      title="初めての一人暮らしの街選び｜地価と若者の動きで見る、家賃を抑えて失敗しない方法"
      summary="進学・就職で初めて一人暮らしをするとき、「家賃の安さ」だけで街を選ぶと、通勤と買い物の不便さで後悔しがちです。この記事では、地価・若者の転入・昼夜間人口のデータを使って、無理のない家賃で暮らしやすい街を絞る方法を解説します。"
      heroLabel="地価が東京の1/3以下で20代が転入超過の市(人口10万人以上)"
      heroValue={`${valueCities.length}市`}
      rankingLink="/ranking/real-estate-price"
      path={PATH}
      tags={["migration", "household", "population"]}
      publishedAt="2026-11-19"
      dataNote="人口・移動: 令和7年国勢調査(確定値)および住民基本台帳人口移動報告(2025年、20代の転入超過数)。地価: 国土交通省「不動産情報ライブラリ」の取引実勢価格(政令指定都市は区の平均)。対象は人口10万人以上の市・特別区。"
      top3={valueCities.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: shortName(c.name),
        value: `20代純移動 +${(c.youngMig ?? 0).toFixed(1)}‰`,
      }))}
    >
      <div style={box}>
        <h2>結論:「家賃の安さ」ではなく「地価と若者の動き」の両方を見る</h2>
        <p>
          初めての一人暮らしで後悔の定番は、家賃を抑えたつもりが、
          通勤に片道1時間以上かかり、買い物も不便で、結局引っ越す
          パターンです。家賃は月々の固定費ですが、時間と不便さも
          コストです。
        </p>
        <p>
          この記事では、人口10万人以上の{base.length}市・特別区について、
          地価(家賃水準の土台)と20代の転入超過を掛け合わせます。
          「東京よりずっと地価が低いのに、若者が集まっている市」が
          {valueCities.length}市ありました。先輩の若者が実際に選んでいる
          街は、初めての一人暮らしの候補として心強い材料になります。
        </p>
      </div>

      <div style={box}>
        <h2>家賃相場は地価と連動する</h2>
        <p>
          家賃は、土地の値段と建物のコストで決まります。地価の高い
          場所ほど、大家さんは高い家賃を取らないと割に合わないため、
          街全体の家賃水準は地価とほぼ連動します。まず「相場の物差し」
          として、エリアごとの地価の中央値を比べます。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>エリア(人口10万人以上の市)</th>
                <th style={thR}>地価の中央値(円/m²)</th>
                <th style={thR}>東京23区を100とすると</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>東京都(23区)</td>
                <td style={tdR}>{Math.round(medTokyo).toLocaleString()}</td>
                <td style={tdR}>100</td>
              </tr>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>政令指定都市</td>
                <td style={tdR}>{Math.round(medDesignated).toLocaleString()}</td>
                <td style={tdR}>{Math.round((medDesignated / medTokyo) * 100)}</td>
              </tr>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>その他の市</td>
                <td style={tdR}>{Math.round(medOthers).toLocaleString()}</td>
                <td style={tdR}>{Math.round((medOthers / medTokyo) * 100)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          東京23区の地価中央値は1m²あたり約{(medTokyo / 10000).toFixed(0)}万円で、
          政令指定都市の約{(medDesignated / medTokyo).toFixed(1)}倍、その他の市の
          約{(medTokyo / medOthers).toFixed(1)}倍です。同じ広さの部屋でも、
          エリアを変えるだけで家賃の土台がこれだけ変わります。
          市ごとの地価は
          <Link href="/ranking/real-estate-price" style={link}>地価ランキング</Link>
          で確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>掛け合わせで分かったこと:地価が高い街ほど、若者が集まっている</h2>
        <p>
          直感に反するようですが、人口10万人以上の市で地価と20代の
          純移動率(人口千人あたり)の相関を取ると、{corrLandYoung.toFixed(2)}という
          強い正の相関がありました。20代の転入が最も多いのは東京都
          墨田区(+13.6‰)、品川区(+12.6‰)、中央区(+12.4‰)など、
          地価の高い都心の区です。仕事・学校・店の集積が、家賃の高さを
          押しのけて若者を集めています。
        </p>
        <p>
          つまり「安い街」は多くの場合「若者が集まっていない街」でも
          あります。それが悪いわけではありませんが、初めての土地で
          友人や同世代のコミュニティを求めるなら、無視できない
          サインです。狙い目はその中間、地価は東京の3分の1以下
          (1m²あたり約{(tokyoThird / 10000).toFixed(0)}万円以下)なのに
          20代が転入超過の市です。{valueCities.length}市ありました。
        </p>
        <RankingBarChart
          title="地価は東京の1/3以下・20代が転入超過の市(20代純移動率 ‰)"
          items={valueCities.slice(0, 6).map((c) => ({
            name: shortName(c.name),
            value: Number((c.youngMig ?? 0).toFixed(1)),
            displayValue: `+${(c.youngMig ?? 0).toFixed(1)}‰`,
          }))}
        />
        <p>
          埼玉県富士見市・三郷市、神奈川県座間市など、都心への通勤圏に
          ありながら地価を抑えられたベッドタウンが並びます。
          若者の動きの全体像は
          <Link href="/ranking/young-inflow" style={link}>若者流入ランキング</Link>
          、街ごとの移動の内訳は
          <Link href="/articles/youth-migration-ranking-analysis" style={link}>若者移動の分析記事</Link>
          も参考になります。
        </p>
      </div>

      <div style={box}>
        <h2>通勤・通学圏の考え方:昼夜間人口比率で街の性格を見る</h2>
        <p>
          昼夜間人口比率は「昼間の人口÷夜間(常住)人口」です。
          100を大きく下回る街は、住民の多くが昼間は市外へ働きに
          出るベッドタウン。たとえば富士見市は75で、典型的な
          住宅都市です。逆に100を超える街は、働く場所や学校が
          市内に集まっています。
        </p>
        <p>
          ベッドタウン自体は悪くありません。住宅地として静かで、
          家賃も抑えられます。ただし、自分の生活リズムが「昼は市外、
          夜だけ帰る」形に合うかが判断の分かれ目です。在宅勤務や
          夜勤がある人は、昼間の街の様子(開いている店、人の多さ)を
          確認しておくと、住んでからの違和感が減ります。
        </p>
      </div>

      <div style={box}>
        <h2>データで候補を絞る手順と実例</h2>
        <ol>
          <li>
            <strong>通勤・通学の上限時間を決める:</strong>
            片道45分など、自分が許容できる範囲を先に決めます。
          </li>
          <li>
            <strong>範囲内の市の地価を比べる:</strong>
            地価ランキングで候補の水準を確認し、高すぎる市を外します。
          </li>
          <li>
            <strong>若者の動きで裏を取る:</strong>
            20代の純移動がプラスかを見ます。同世代が選んでいる
            街かどうかは、住みやすさの代理指標になります。
          </li>
          <li>
            <strong>自治体ページで生活の便を見る:</strong>
            買い物アクセスや人口密度を自治体ページで確認し、
            最後に現地へ行きます。
          </li>
        </ol>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>市</th>
                <th style={thR}>地価(円/m²)</th>
                <th style={thR}>20代純移動(‰)</th>
                <th style={thR}>昼夜間人口比率</th>
                <th style={{ ...th, textAlign: "left" }}>性格</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((c) => (
                <tr key={c.code}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    <Link href={`/city/${c.code}`} style={link}>{c.name}</Link>
                  </td>
                  <td style={tdR}>{c.land != null ? Math.round(c.land).toLocaleString() : "—"}</td>
                  <td style={tdR}>{c.youngMig != null ? `+${c.youngMig.toFixed(1)}` : "—"}</td>
                  <td style={tdR}>{c.daytime != null ? Math.round(c.daytime) : "—"}</td>
                  <td style={{ ...td, textAlign: "left" }}>
                    {c.name.includes("東海")
                      ? "職住近接型"
                      : (c.daytime ?? 100) >= 90
                        ? "バランス型"
                        : "ベッドタウン型"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          愛知県東海市は昼夜間人口比率102と職住が近接し、地価も
          96,188円/m²に抑えられています。兵庫県明石市は子育て世代にも
          人気で、子ども人口比率14.0%と高めです。候補が2市に絞れたら
          <Link href="/compare" style={link}>自治体比較ツール</Link>
          で数字を並べて比べられます。
        </p>
      </div>

      <div style={box}>
        <h2>家賃以外のコストも見積もる</h2>
        <p>
          一人暮らしの負担は家賃だけではありません。契約時には
          敷金・礼金・仲介手数料などで家賃の4〜5か月分が目安に
          なる初期費用がかかります。家賃を月5,000円抑えるより、
          礼金なしの物件を選ぶ方が初年度の支出は下がる、という
          ことも起こります。
        </p>
        <p>
          通勤・通学の定期代と時間も見落としがちなコストです。
          家賃が1万円安くても、片道の通勤が30分延びれば、月に
          約20時間を移動に使う計算になります。時給換算すれば
          家賃差を上回ることも珍しくありません。「家賃+定期代+
          時間」の合計で比べるのが、データで候補を絞ったあとの
          最後の物差しです。
        </p>
        <p>
          優先順位は立場でも変わります。学生なら大学までの距離と
          自転車圏、アルバイト先の多さ(昼夜間人口比率が高い街は
          店も多い傾向)が効きます。新社会人なら、転勤や転職で
          数年で動く可能性を見越し、家具家電付きや短期契約の
          選択肢がある街を選ぶと身軽です。どちらも、最初から
          完璧な街を探すより、「2年住んで合わなければ動ける」
          前提で選ぶ方が失敗は小さくなります。
        </p>
      </div>

      <div style={box}>
        <h2>数字で見えないものの確認リスト</h2>
        <p>
          データで候補を絞ったあとは、現地でしか分からないものを
          確認します。内見のついでに、次の項目をチェックしてください。
        </p>
        <ul>
          <li>駅から部屋までの実際の道のり(夜道の明るさ、坂の有無)</li>
          <li>最寄りのスーパー・コンビニまでの距離と営業時間</li>
          <li>夕方・夜の街の様子(人通り、街灯、騒音)</li>
          <li>ゴミ集積所と共用部分の管理状態</li>
          <li>携帯電話の電波と、建物に来ているネット回線の種類</li>
          <li>水回りの水圧と、雨の日の浸水リスク(ハザードマップ)</li>
        </ul>
        <p>
          地価は自治体全体の平均値で、駅前と郊外では別世界です。
          「市」の単位の数字は候補の絞り込みまで、最後の決め手は
          必ず現地確認にしてください。データの出典と限界は
          <Link href="/methodology" style={link}>データの出典と算出方法</Link>
          にまとめています。引っ越し全般の進め方は
          <Link href="/articles/moving-city-data-guide" style={link}>引っ越し先の街選びガイド</Link>
          もどうぞ。
        </p>
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
        <CompareCTA />
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
