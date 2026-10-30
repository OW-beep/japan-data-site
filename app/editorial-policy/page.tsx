import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/editorial-policy" },
  title: "編集方針",
  description:
    "全国自治体データランキングの、データの扱い・ランキングの作り方・独自指標・誤りの訂正・広告との関係についての方針です。",
};

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={h1}>編集方針</h1>
      <p style={p}>
        当サイトは、公的機関が公表している統計データを、比較しやすい形に整えて発信しています。
        ここでは、ランキングや記事を作るときに守っていることを説明します。
      </p>

      <h2 style={h2}>データの扱い</h2>
      <ul style={ul}>
        <li>
          使用するデータは、総務省統計局「e-Stat」をはじめとする公的機関の公表データです。
          各ランキング・記事の下部に、出典・対象年・対象範囲を明記しています。
        </li>
        <li>
          数値は、出典のデータをそのまま転載せず、指標の計算(割合・人口あたり・指数化など)と
          並べ替えを行って掲載しています。計算式は、各ランキングの「指標定義」に載せています。
        </li>
        <li>
          人口が少ない自治体は、少数の増減で値が大きく動きます。そのため、必要に応じて
          対象を人口3,000人以上などに限り、その条件を「対象」として明記しています。
        </li>
      </ul>

      <h2 style={h2}>解説文について</h2>
      <ul style={ul}>
        <li>
          各ランキングの「データで読む」の数値(中央値・分布・人口規模別・他の指標との相関など)は、
          掲載しているデータから計算して表示しています。データが更新されると、数値も更新されます。
        </li>
        <li>
          相関係数は「一緒に動く傾向の強さ」を示すだけで、原因と結果を示すものではないことを、
          解説の中で明記しています。
        </li>
        <li>
          データから言い切れないこと(理由・背景・よしあしの評価)は、断定せず、
          「可能性がある」などの表現にとどめるよう心がけています。
        </li>
      </ul>

      <h2 style={h2}>独自指標(スコア・指数)について</h2>
      <p style={p}>
        「財政健全度スコア」「子育て世代吸引力指数」など、当サイトが独自に作った指標は、
        どの指標を、どの重みで合成したかをページ内に明記しています。重みの付け方は便宜的なもので、
        唯一の正解ではありません。順位は目安として、元の指標とあわせてご覧ください。
      </p>

      <h2 style={h2}>誤りの訂正と更新</h2>
      <p style={p}>
        数値や記述の誤りに気づいた場合は、確認のうえ速やかに修正します。
        誤りのご指摘は、
        <Link prefetch={false} href="/contact" style={link}>
          お問い合わせページ
        </Link>
        から受け付けています。統計データは公表のタイミングで更新し、更新した記事には更新日を表示しています。
      </p>

      <h2 style={h2}>広告・アフィリエイトとの関係</h2>
      <p style={p}>
        当サイトには、Google AdSenseの広告と、アフィリエイトリンク(Amazonアソシエイト、楽天アフィリエイト、
        ASP経由の広告)が含まれます。広告が入ることで、ランキングの順位や解説の内容を変えることはありません。
        広告・アフィリエイトを含むブロックには「PR」と表示しています。
        詳しくは
        <Link prefetch={false} href="/about#ads" style={link}>
          「このサイトについて」
        </Link>
        をご覧ください。
      </p>

      <p style={{ ...p, marginTop: 32 }}>
        運営者については、
        <Link prefetch={false} href="/about" style={link}>
          このサイトについて
        </Link>
        をご覧ください。
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = { maxWidth: 800, margin: "0 auto", padding: "28px 24px", lineHeight: 1.9 };
const h1: React.CSSProperties = { fontSize: 30, fontWeight: 800, marginBottom: 24 };
const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 };
const p: React.CSSProperties = { color: "#374151" };
const ul: React.CSSProperties = { color: "#374151", paddingLeft: 22 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
