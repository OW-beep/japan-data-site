import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "データ分析記事一覧",
  description:
    "全国自治体データランキングが公開している、データ分析記事の一覧です。",
};

const articles = [
  {
    href: "/articles/population-about",
    title: "人口とは？",
    desc: "人口データの見方や集計方法をわかりやすく解説します。",
  },
  {
    href: "/articles/population-top50",
    title: "人口ランキングTOP50",
    desc: "人口が多い自治体をランキング形式で紹介します。",
  },
  {
    href: "/articles/population-concentration",
    title: "人口集中はどこで起きている？",
    desc: "都市への人口集中をデータから分析します。",
  },
  {
    href: "/articles/million-cities",
    title: "100万人都市一覧",
    desc: "人口100万人以上の都市を一覧で比較できます。",
  },
  {
    href: "/articles/child-top50",
    title: "子ども人口ランキング",
    desc: "子ども人口が多い自治体ランキングです。",
  },
  {
    href: "/articles/aging-top50",
    title: "高齢化率ランキング",
    desc: "高齢化率が高い自治体ランキングです。",
  },
  {
    href: "/articles/youngest-municipalities",
    title: "若い自治体ランキング",
    desc: "平均年齢が若い自治体を紹介します。",
  },
  {
    href: "/articles/birth-rate",
    title: "出生率ランキング",
    desc: "出生率が高い自治体ランキングです。",
  },
  {
    href: "/articles/decline",
    title: "社会増減率分析",
    desc: "転入超過1位はなぜ人口847人の町なのかを分析します。",
  },
  {
    href: "/articles/density-analysis",
    title: "人口密度ランキング分析",
    desc: "なぜ東京都特別区が上位を独占するのかを分析します。",
  },
  {
    href: "/articles/area-analysis",
    title: "面積ランキング分析",
    desc: "北海道と山間部の市町村が上位を占める理由を分析します。",
  },
  {
    href: "/articles/finance-analysis",
    title: "財政力指数ランキング分析",
    desc: "なぜ小さな村が全国トップなのかを分析します。",
  },
  {
    href: "/articles/household-analysis",
    title: "単独世帯割合分析",
    desc: "都心と被災地、正反対の理由で1人暮らしが多い自治体を分析します。",
  },
  {
    href: "/articles/population-finance",
    title: "人口規模と財政力の関係",
    desc: "大都市は本当に財政が強いのかをデータで分析します。",
  },
  {
    href: "/articles/prefecture-composite",
    title: "都道府県総合スコア",
    desc: "4指標を組み合わせて都道府県を比較・分析します。",
  },
  {
    href: "/articles/aging-gap",
    title: "少子高齢化ギャップ分析",
    desc: "高齢化率が子ども人口割合を最大62.9ポイント上回る自治体を分析します。",
  },
  {
    href: "/articles/aging-finance",
    title: "高齢化率と財政力指数の関係",
    desc: "相関係数-0.71。それでも財政が強い「例外」自治体を分析します。",
  },
  {
    href: "/articles/density-aging",
    title: "人口密度と高齢化率の相関分析",
    desc: "相関係数-0.72。それでも密集した高齢化都市がある理由を分析します。",
  },
  {
    href: "/articles/migration-child",
    title: "転入超過と子ども人口割合の関係",
    desc: "相関係数0.30。「人が集まる町」と「子育て世代が集まる町」の違いを分析します。",
  },
  {
    href: "/articles/household-aging-ushape",
    title: "単独世帯割合と高齢化率のU字関係",
    desc: "相関係数はほぼ0。それでも隠れているU字型の関係を分析します。",
  },
  {
    href: "/articles/density-finance",
    title: "人口密度と財政力指数の関係",
    desc: "相関係数0.73。過疎地なのに財政が豊かな自治体の理由を分析します。",
  },
  {
    href: "/articles/child-finance",
    title: "子ども人口割合と財政力指数の関係",
    desc: "相関係数0.40。成田空港の町の財政力が強い理由を分析します。",
  },
  {
    href: "/articles/doctors-analysis",
    title: "医師数ランキング分析",
    desc: "医科大学の城下町が上位独占。医師ゼロの29町村の実態も解説。",
  },
  {
    href: "/articles/unemployment-analysis",
    title: "完全失業率ランキング分析",
    desc: "福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのかを解説。",
  },
  {
    href: "/articles/industry-structure",
    title: "産業構造分析",
    desc: "農業の町・ものづくりの町・サービス業の町、3タイプを比較。",
  },
  {
    href: "/articles/tax-composition",
    title: "財政の中身分析",
    desc: "地方税自主財源比率63.8%の村と1.7%の村、その差を解説。",
  },
  {
    href: "/articles/school-crowding",
    title: "学校規模ランキング分析",
    desc: "1校2293人のマンモス校の町と、21人の離島の小学校。",
  },
  {
    href: "/articles/welfare-aging",
    title: "民生費と高齢化率の意外な関係",
    desc: "相関係数-0.61。高齢化率が高いほど民生費比率が下がる理由。",
  },
  {
    href: "/articles/habitable-density",
    title: "可住地人口密度ランキング分析",
    desc: "三重県尾鷲市は「見た目より混んでいる」自治体だった。",
  },
  {
    href: "/articles/natural-change",
    title: "自然増減率ランキング分析",
    desc: "全国1740自治体中、自然増加はわずか34自治体だけ。",
  },
  {
    href: "/articles/foreign-population",
    title: "外国人人口比率ランキング分析",
    desc: "1位は19%の長野県の農村。農業・製造業・都心という3パターン。",
  },
  {
    href: "/articles/shopping-access",
    title: "買い物難民ランキング分析",
    desc: "過疎の山村より郊外ニュータウンが危ない、意外な実態。",
  },
  {
    href: "/articles/daycare-access",
    title: "保育園あたり子ども人口ランキング分析",
    desc: "人口20万人以上の都市で比較すると、東京23区と大阪府内の自治体で驚くほど差が開く。",
  },
  {
    href: "/articles/restaurant-density",
    title: "飲食店密度ランキング分析",
    desc: "千代田区とベッドタウン、対極にある2つの街の姿。",
  },
  {
    href: "/articles/balance-ratio-analysis",
    title: "経常収支比率ランキング分析",
    desc: "原発立地自治体はなぜ強く、夕張市はなぜ最下位なのか。",
  },
  {
    href: "/articles/marriage-rate-analysis",
    title: "婚姻率ランキング分析",
    desc: "同じ東京都でも、都心の区と郊外の市でここまで差が出る理由。",
  },
  {
    href: "/articles/vacant-house-analysis",
    title: "空き家率ランキング分析",
    desc: "軽井沢町と夕張市、上位に並ぶ「性質の違う空き家」。",
  },
  {
    href: "/articles/daytime-ratio-analysis",
    title: "昼夜間人口比率ランキング分析",
    desc: "千代田区が1355%になる理由と、福島県の被災地が上位に入った背景。",
  },
  {
    href: "/articles/elderly-home-analysis",
    title: "高齢者施設数ランキング分析",
    desc: "旭川市が「福祉の街」と呼ばれる理由、東京23区が手薄になりがちな背景。",
  },
  {
    href: "/articles/young-adult-migration-analysis",
    title: "20代純移動率ランキング分析",
    desc: "若者に選ばれる街、東京だけでなく大阪市の各区が上位に。",
  },
];

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        📖 データ分析記事一覧
      </h1>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国自治体データをもとにした分析記事の一覧です。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {articles.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "block",
              padding: 22,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                marginBottom: 6,
              }}
            >
              {a.title}
            </div>

            <div style={{ color: "#6b7280", fontSize: 14 }}>
              {a.desc}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
