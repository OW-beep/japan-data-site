type Row = {
  name: string;
  perSchool: number;
};

export default function SchoolCrowdingSummary({
  ranking,
  average,
}: {
  ranking: Row[];
  average: number;
}) {
  if (ranking.length === 0) return null;

  const tenth = ranking[Math.min(9, ranking.length - 1)];

  return (
    <section
      style={{
        marginTop: 35,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 30,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#fce7f3",
          color: "#be185d",
          padding: "4px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        運営者コメント
      </div>

      <h2 style={{ marginTop: 0, fontSize: 24 }}>
        小学校1校あたり子ども人口ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        小学校1校あたりの子ども人口(0〜14歳)が最も多いのは
        <strong>{ranking[0].name}</strong>
        で{Math.round(ranking[0].perSchool).toLocaleString()}
        人。10位の<strong>{tenth.name}</strong>
        でも{Math.round(tenth.perSchool).toLocaleString()}
        人と、全国平均({Math.round(average).toLocaleString()}
        人)の3倍前後に達しています。上位には、子育て世代の
        転入が続く沖縄県の自治体や、大都市圏近郊の急成長
        ベッドタウン、特定企業の進出で人口が急増した町が
        並び、学校のキャパシティが人口増加に追いついていない
        可能性がうかがえます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        逆に1校あたりの子ども人口が極端に少ない自治体は、
        人口減少が進む離島・山村が中心です。児童数が少なくても
        学校を維持するのは、地域コミュニティを支える重要な
        役割がある一方、行政コストの面では大きな負担にも
        なっています。
      </p>
    </section>
  );
}
