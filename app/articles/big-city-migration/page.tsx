import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import AffiliateSlot from "@/components/AffiliateSlot";
import BookRecommendation from "@/components/BookRecommendation";
import RakutenGifts from "@/components/RakutenGifts";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { BOOKS } from "@/lib/amazonBooks";
import { getMunicipalities } from "@/lib/municipalities";
import { isDesignatedCity } from "@/lib/designatedCities";

export const metadata = {
  alternates: { canonical: "/articles/big-city-migration" },
  title:
    "引っ越し先に選ばれている大都市はどこ？政令指定都市と東京23区の転入超過を比べた",
  description:
    "政令指定都市20市と東京23区について、転入者と転出者の差(転入超過)を人口で割った「転入超過率」で比較。人が集まっている大都市、人が出ていっている大都市がどこかを、住民基本台帳人口移動報告のデータで調べました。引越し準備のポイントも紹介します。",
};

type Row = {
  code: string;
  name: string;
  short: string;
  population: number;
  net: number; // 転入超過数(人)
  netRate: number; // 転入超過率(%)
};

const sign = (n: number, d = 2) => `${n >= 0 ? "+" : ""}${n.toFixed(d)}`;
const signInt = (n: number) => `${n >= 0 ? "+" : ""}${n.toLocaleString()}`;

export default function Page() {
  const all = getMunicipalities()
    .filter((c) => c.inMigrants != null && c.outMigrants != null && c.population > 0)
    .map<Row>((c) => {
      const net = (c.inMigrants ?? 0) - (c.outMigrants ?? 0);
      return {
        code: c.code,
        name: c.name,
        short: c.name.split(" ").pop() ?? c.name,
        population: c.population,
        net,
        netRate: (net / c.population) * 100,
      };
    });

  const designated = all
    .filter((r) => isDesignatedCity(r.name))
    .sort((a, b) => b.netRate - a.netRate);
  const wards = all
    .filter((r) => r.name.startsWith("東京都 ") && r.name.endsWith("区"))
    .sort((a, b) => b.netRate - a.netRate);

  if (designated.length < 5) return null;

  const gain = designated.filter((r) => r.net > 0);
  const loss = designated.filter((r) => r.net < 0);
  const topD = designated[0];
  const botD = designated[designated.length - 1];

  const wardsGain = wards.filter((r) => r.net > 0).length;

  // 全国で転入超過「数」が最も多い自治体(率ではなく人数)
  const byNet = [...all].sort((a, b) => b.net - a.net);
  const top5Net = byNet.slice(0, 5);

  const faq = [
    {
      q: "政令指定都市の中で、転入超過率が最も高いのはどこですか？",
      a: `${topD.short}で、${sign(topD.netRate)}%(転入超過${signInt(topD.net)}人)です。反対に最も低いのは${botD.short}で、${sign(botD.netRate)}%(${signInt(botD.net)}人)です。`,
    },
    {
      q: "転入超過とは何ですか？",
      a: "1年間の転入者数から転出者数を引いた数のことです。プラスなら人口が移動によって増えており、マイナスなら移動によって減っています。人口で割った割合が転入超過率です。",
    },
    {
      q: "転入超過が多い=住みやすい街ですか？",
      a: "そうとは限りません。転入超過は、進学・就職での転入や、住宅の供給量にも左右されます。住みやすさは、家賃や通勤、子育て環境など、別の指標とあわせて確認してください。",
    },
    {
      q: "引越しをしたら、いつまでに住所変更をすればよいですか？",
      a: "新しい住所に住み始めた日から14日以内に、転入届を提出する必要があります。引越し前には、転出届の手続きも必要です(同じ市区町村内の引越しは、転居届になります)。",
    },
  ];

  return (
    <ArticleLayout
      title="引っ越し先に選ばれている大都市はどこ？政令指定都市と東京23区の転入超過を比べた"
      summary={`政令指定都市${designated.length}市のうち、転入超過(転入が転出を上回る)なのは${gain.length}市、転出超過は${loss.length}市でした。転入超過率が最も高いのは${topD.short}(${sign(topD.netRate)}%)です。`}
      heroLabel="転入超過の政令指定都市"
      heroValue={`${gain.length}市 / ${designated.length}市`}
      rankingLink="/ranking/decline"
      path="/articles/big-city-migration"
      tags={["migration", "population"]}
      publishedAt="2026-10-02"
      top3={designated.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${sign(r.netRate)}%`,
      }))}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して購入された場合、
        当サイトが報酬を受け取ることがあります。データの分析内容は、広告主の
        意向とは関係ありません。
      </p>

      <div style={box}>
        <h2>結論:政令指定都市の転入超過は{gain.length}市、転出超過は{loss.length}市</h2>

        <p>
          政令指定都市{designated.length}市の、1年間の転入者と転出者の差(転入超過)を
          調べました。人口に対する割合で最も高いのは
          <strong>{topD.name}</strong>({sign(topD.netRate)}%)、最も低いのは
          {botD.name}({sign(botD.netRate)}%)でした。
        </p>

        <RankingBarChart
          items={designated.slice(0, 10).map((r) => ({
            name: r.name,
            value: Math.max(r.netRate, 0),
            displayValue: `${sign(r.netRate)}%`,
          }))}
        />
        <p style={note}>
          グラフは転入超過率の上位10市です(マイナスの市は0として表示)。
          全20市の数値は下の表をご覧ください。
        </p>
      </div>

      <div style={box}>
        <h2>政令指定都市 転入超過率の一覧</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>市</th>
                <th style={thNum}>転入超過数(人)</th>
                <th style={thNum}>転入超過率</th>
                <th style={thNum}>人口(人)</th>
              </tr>
            </thead>
            <tbody>
              {designated.map((r, i) => (
                <tr key={r.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{signInt(r.net)}</td>
                  <td style={tdNum}>{sign(r.netRate)}%</td>
                  <td style={tdNum}>{r.population.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {wards.length >= 5 && (
        <div style={box}>
          <h2>東京23区の転入超過</h2>

          <p>
            東京都の特別区{wards.length}区のうち、転入超過なのは
            <strong>{wardsGain}区</strong>です。転入超過率が最も高いのは
            {wards[0].short}({sign(wards[0].netRate)}%)、最も低いのは
            {wards[wards.length - 1].short}(
            {sign(wards[wards.length - 1].netRate)}%)でした。
          </p>

          <ul>
            {wards.slice(0, 5).map((r) => (
              <li key={r.code}>
                {r.short}:{sign(r.netRate)}%({signInt(r.net)}人)
              </li>
            ))}
          </ul>
          <p style={note}>転入超過率が高い順の上位5区です。</p>
        </div>
      )}

      <div style={box}>
        <h2>「率」と「人数」では見える街が違う</h2>

        <p>
          転入超過を人数で比べると、全国で最も多いのは
          {top5Net
            .map((r) => `${r.name}(${signInt(r.net)}人)`)
            .join("、")}
          でした。人口の多い自治体は、率が小さくても人数が大きくなります。
          「どの街に人が集まっているか」は、率と人数の両方で見る必要があります。
        </p>

        <p>
          移動の全国的な傾向は、
          <Link prefetch={false} href="/ranking/decline" style={link}>
            社会増減率ランキング
          </Link>
          、若い世代の動きは
          <Link prefetch={false} href="/ranking/young-adult-migration" style={link}>
            20代純移動率ランキング
          </Link>
          、人の出入りの激しさは
          <Link prefetch={false} href="/ranking/churn" style={link}>
            人口の入れ替わり率ランキング
          </Link>
          で確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <ul>
          <li>1年分の移動の数字です。年によって順位が入れ替わることがあります。</li>
          <li>
            転入超過は、進学や就職で動く若い世代の影響を強く受けます。大学の多い
            自治体は、春に転入が増えやすくなります。
          </li>
          <li>
            転入超過が多いことは、住みやすさの評価ではありません。家賃、通勤、
            子育て環境などの指標とあわせて見てください。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>引越しが決まったら:手続きと準備のポイント</h2>

        <ul>
          <li>
            <strong>住所変更の手続き。</strong>
            新しい住所に住み始めた日から14日以内に、転入届を市区町村役場に提出します。
            引越し前には、転出届の手続きが必要です。
          </li>
          <li>
            <strong>引越し業者の見積もり。</strong>
            料金は時期や荷物の量で変わります。進学・就職・転勤が重なる3〜4月は
            繁忙期で、希望の日程が取りにくくなる傾向があります。複数社で
            見積もりを取って比べると安心です。
          </li>
          <li>
            <strong>梱包の準備。</strong>
            業者が資材を用意する場合もありますが、自分で用意する場合は、早めに
            そろえておくと作業が進めやすくなります。
          </li>
        </ul>
      </div>

      <AffiliateSlot topic="moving" />

      <RakutenGifts
        keyword="引越し 段ボール"
        heading="引越しの準備に:梱包用品を楽天市場で見る"
      />

      <div style={box}>
        <h2>Q&amp;A：転入超過についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          政令指定都市{designated.length}市のうち、転入超過は{gain.length}市、転出超過は
          {loss.length}市でした。人口の移動は、都市ごとに大きく異なります。引っ越し先を
          考えるときは、転入超過の大きさだけでなく、暮らしに関わる指標もあわせて
          比較してみてください。
        </p>

        <BookRecommendation books={[BOOKS.chihouShoumetsu]} />

        <p>
          <Link prefetch={false} href="/articles/decline" style={link}>
            社会増減率分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/population-churn-analysis" style={link}>
            人口の入れ替わり率ランキング分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/designated-cities-comparison" style={link}>
            政令指定都市20市の比較
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const prNote: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  lineHeight: 1.8,
  marginBottom: 20,
};

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 12,
  fontSize: 14,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const thNum: React.CSSProperties = { ...th, textAlign: "right" };

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
};

const tdNum: React.CSSProperties = { ...td, textAlign: "right" };

const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
