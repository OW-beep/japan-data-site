import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import RakutenGifts from "@/components/RakutenGifts";
import { allAgriCities } from "@/lib/agriCity";
import { AGRI_META, getAgriItem, oku } from "@/lib/agriOutput";
import { isReleased, releaseDate } from "@/lib/release";

const PATH = "/articles/agri-prefecture-top";

function getRows() {
  const byPref = new Map<string, { code: string; city: string; total: number; rn: number }[]>();
  for (const [code, a] of allAgriCities()) {
    if (a.total == null || a.totalRn == null) continue;
    const l = byPref.get(a.pref) ?? [];
    l.push({ code, city: a.city, total: a.total, rn: a.totalRn });
    byPref.set(a.pref, l);
  }
  const rows = [...byPref.entries()].map(([pref, l]) => ({
    pref,
    top: l.sort((x, y) => y.total - x.total).slice(0, 3),
    sum: l.reduce((s, x) => s + x.total, 0),
    n: l.length,
  }));
  // 全国の農業産出額が多い県の順
  return rows.sort((a, b) => b.sum - a.sum);
}

export function generateMetadata() {
  if (!isReleased(PATH)) return {};
  const rows = getRows();
  const best = [...rows].sort((a, b) => a.top[0].rn - b.top[0].rn)[0];
  return {
    alternates: { canonical: PATH },
    title: `農業産出額が最も多い市町村、47都道府県一覧(令和6年)｜${best.pref}は${best.top[0].city}`,
    description: `都道府県ごとに、農業産出額(令和6年・推計)が最も多い市町村と上位3位を一覧にしました。全国1位は${best.pref}${best.top[0].city}(${oku(best.top[0].total)}億円)。農林水産省「市町村別農業産出額(推計)」を加工して作成。`,
  };
}

export default function Page() {
  if (!isReleased(PATH)) notFound();
  const rows = getRows();
  const nat = [...rows].sort((a, b) => a.top[0].rn - b.top[0].rn);
  const towns = rows.filter((r) => /[町村]$/.test(r.top[0].city));
  const hokkaido = rows.find((r) => r.pref === "北海道");
  const gaps = rows
    .map((r) => ({ r, ratio: r.top[1] ? r.top[0].total / r.top[1].total : 1 }))
    .sort((a, b) => b.ratio - a.ratio);
  const faq = [
    {
      q: "農業産出額が全国で最も多い市町村はどこですか？",
      a: `令和6年(推計)は${nat[0].pref}${nat[0].top[0].city}で${oku(nat[0].top[0].total)}億円、2位は${nat[1].pref}${nat[1].top[0].city}の${oku(nat[1].top[0].total)}億円です。`,
    },
    {
      q: "県内1位が町や村の都道府県はいくつありますか？",
      a: `${towns.length}つです(${towns.map((t) => `${t.pref}${t.top[0].city}`).join("、")})。`,
    },
    {
      q: "県内1位と2位の差が大きい県はどこですか？",
      a: `${gaps[0].r.pref}です。1位の${gaps[0].r.top[0].city}(${oku(gaps[0].r.top[0].total)}億円)は、2位の${gaps[0].r.top[1].city}の約${gaps[0].ratio.toFixed(1)}倍あります。特定の産地に生産が集中している県ほど、この差が大きくなります。`,
    },
    {
      q: "自分の県の主力品目はどうすれば分かりますか？",
      a: "県内1位の市町村がどの品目で稼いでいるかを見ると、その県の主力が見えてきます。市町村ごとの品目の内訳は「農業産出額が多い市町村の稼ぎ方」の記事で、上位20市町村について比べています。品目別の全国順位は品目別ランキングでも確認できます。",
    },
  ];
  // 県内1位の市町村が、全国でも50位以内に入っている都道府県の数
  const strongPrefs = rows.filter((r) => r.top[0].rn <= 50).length;

  return (
    <ArticleLayout
      title="農業産出額が最も多い市町村、47都道府県の一覧(令和6年)"
      summary={`都道府県ごとに、農業産出額(令和6年・推計)が最も多い市町村と上位3位を一覧にしました。全国1位は${nat[0].pref}${nat[0].top[0].city}(${oku(nat[0].top[0].total)}億円)、2位は${nat[1].top[0].city}(${oku(nat[1].top[0].total)}億円)。県内1位が町や村の都道府県は${towns.length}つあります。`}
      heroLabel="農業産出額が全国1位の市町村"
      heroValue={nat[0].top[0].city}
      rankingLink="/ranking/agri"
      path={PATH}
      tags={["industry"]}
      publishedAt={releaseDate(PATH, "2026-10-16")}
      updatedAt="2026-11-16"
      dataNote="農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、同年9月18日訂正)を加工して作成。東京都は特別区を1つにまとめた値。"
      top3={nat.slice(0, 3).map((r, i) => ({ rank: i + 1, name: `${r.pref} ${r.top[0].city}`, value: `${oku(r.top[0].total)}億円` }))}
    >
      <div style={box}>
        <h2>読み方</h2>
        <p>
          農林水産省の市町村別農業産出額は、都道府県の産出額を作付面積や飼養頭数などで市町村に割り振った<strong>推計</strong>です。
          実際の販売額とは一致しないことがあります。表は農業産出額(総合)の多い順に並べ、県ごとの最上位3市町村を載せています。
          北海道は{hokkaido ? `${hokkaido.n}市町村` : ""}の合計が大きい一方、県内1位の市町村は
          {hokkaido?.top[0].city}です。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別 農業産出額が多い市町村(上位3位)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>都道府県</th>
                <th style={{ ...th, textAlign: "left" }}>1位</th>
                <th style={{ ...th, textAlign: "left" }}>2位</th>
                <th style={{ ...th, textAlign: "left" }}>3位</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.pref}>
                  <td style={td}>{r.pref}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={i} style={{ ...td, textAlign: "left" }}>
                      {r.top[i] ? (
                        <>
                          {r.top[i].city}
                          <span style={{ color: "#6b7280", fontSize: 12 }}> {oku(r.top[i].total)}億円(全国{r.top[i].rn}位)</span>
                        </>
                      ) : (
                        "―"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280" }}>表の県の並びは、市町村の農業産出額を県ごとに合計した多い順です。</p>
      </div>

      <div style={box}>
        <h2>1位と2位の差が大きい県</h2>
        <p>
          県内1位が2位の何倍かで見ると、差が最も大きいのは{gaps[0].r.pref}で、{gaps[0].r.top[0].city}
          ({oku(gaps[0].r.top[0].total)}億円)が{gaps[0].r.top[1].city}({oku(gaps[0].r.top[1].total)}億円)の
          約{gaps[0].ratio.toFixed(1)}倍です。次いで{gaps[1].r.pref}の{gaps[1].ratio.toFixed(1)}倍、
          {gaps[2].r.pref}の{gaps[2].ratio.toFixed(1)}倍と続きます。
        </p>
      </div>

      <div style={box}>
        <h2>県内1位の顔ぶれから見えること</h2>
        <p>
          県内1位が町や村の都道府県は<strong>{towns.length}つ</strong>あります
          ({towns.map((t) => `${t.pref}${t.top[0].city}`).join("、")})。
          農業は都市部ではなく町村部が担っていることが多いため、県庁所在地や
          大きな市が1位になる県のほうが少数派です。
        </p>
        <p>
          また、県内1位の市町村が全国でも50位以内に入っている都道府県は
          {strongPrefs}つです。裏を返せば、半数以上の県では「県内では1位でも、
          全国では中位」という水準にとどまります。農業の強い地域が一部の
          県・地域に偏っていることが、県別の一覧からも読み取れます。
        </p>
        <p>
          北海道は市町村数が多く合計額も突出していますが、生産が道内の
          多くの市町村に分散しているため、県内1位の金額だけを見ると
          他県の1位と大きくは変わりません。「合計の大きさ」と「1位の大きさ」は
          別のものとして見る必要があります。
        </p>
      </div>

      <div style={box}>
        <h2>この一覧の使い道</h2>
        <p>
          <strong>旅行・特産品:</strong>
          旅行先の県で「農業の中心地」が分かれば、道の駅や直売所で買うべき
          名産の見当がつきます。県内1位の市町村は、その県の顔となる産地です。
        </p>
        <p>
          <strong>ふるさと納税:</strong>
          応援したい県が決まっている場合、県内1位の市町村は主力品目の
          返礼品がそろっていることが多い寄付先です。品目の内訳は
          <Link prefetch={false} href="/articles/agri-top-municipalities" style={link}>
            農業産出額が多い市町村の稼ぎ方
          </Link>
          、人口あたりの強さは
          <Link prefetch={false} href="/articles/agri-output-per-capita" style={link}>
            人口あたりの農業産出額が多い市町村
          </Link>
          で比べられます。
        </p>
        <p>
          <strong>調べ学習・仕事:</strong>
          「なぜこの町が県内1位なのか」は、気候・地形・品目の歴史をたどる
          入り口になります。数字は推計のため、引用する際は出典(農林水産省)と
          推計である旨をあわせて記載してください。
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
        <p>
          品目別の順位は
          <Link prefetch={false} href="/ranking/agri" style={link}>
            農業産出額 市町村ランキング(品目別)
          </Link>
          {getAgriItem("rice") && (
            <>
              、たとえば
              <Link prefetch={false} href="/ranking/agri/rice" style={link}>
                米
              </Link>
            </>
          )}
          をご覧ください。出典: 農林水産省(
          <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={link}>
            {AGRI_META.url}
          </a>
          )。
        </p>
      </div>

      {/* 農産物はふるさと納税の返礼品の中心でもあるため、特産品・返礼品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="ふるさと納税 特産品 返礼品"
        heading="楽天市場でふるさと納税の特産品・返礼品を見る"
        hits={5}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
