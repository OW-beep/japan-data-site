type Row = {
  name: string;
  rate: number;
};

export default function DeclineSummary({
  top50,
  bottom50,
  average,
}: {
  top50: Row[];
  bottom50: Row[];
  average: number;
}) {
  if (top50.length === 0 || bottom50.length === 0) return null;

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
          background: "#dbeafe",
          color: "#1d4ed8",
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
        ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国平均は{average.toFixed(2)}%で、転入超過1位の
        <strong>{top50[0].name}</strong>は+{top50[0].rate.toFixed(2)}
        %、転出超過が最も大きい<strong>{bottom50[0].name}</strong>は
        {bottom50[0].rate.toFixed(2)}%でした。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        上位には、東日本大震災からの復興工事や大規模マンションの
        入居が続く地域と、都心部の再開発が進むエリアという、
        性質の異なる2種類の自治体が混在しています。どちらも
        「一時的な要因による転入超過」である可能性があるため、
        単年の数値だけで「人気の街」と判断するのは早計です。
        下位は農村部・山間部の自治体が中心で、こちらは長期的な
        過疎化の傾向を反映しています。
      </p>
    </section>
  );
}
