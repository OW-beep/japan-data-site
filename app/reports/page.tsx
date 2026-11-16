import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/reports" },
  title: "自治体調査レポート｜財政・人口・産業の総合診断+2050年試算(サンプル5件無料)",
  description:
    "1自治体を財政・人口・産業・医療・住宅まで総合診断した18ページ前後のPDFレポート。実写真、将来人口推計、2指標を掛け合わせた類型分析、2050年シナリオ試算、類似自治体ベンチマークを収録。泊村・夕張市・横浜市・つくば市・青ヶ島村のサンプルを無料公開中。",
};

const CHAPTERS = [
  ["表紙・総合評価", "現地の実写真と、財政健全度・生活基盤・子育て世代吸引力・高齢者支援体制の4スコア"],
  ["本レポートの使い方", "キーファクトと「目的別・読むべき章」。忙しい読み手が最短で要点にたどり着ける設計"],
  ["エグゼクティブサマリー", "強み・注視点・構造的リスクを1ページに要約。全国ポジションのパーセンタイル付き"],
  ["基本プロフィール", "人口・高齢化率・空き家率など主要指標を、全国順位・全国平均と並べて一覧化"],
  ["人口動態と将来推計", "出生・死亡・転入・転出の内訳と、社人研の将来推計(2050年まで)のグラフ"],
  ["財政健全度", "5つの財政指標を全国/県平均と比較。レーダーチャートと財政規模も"],
  ["産業・雇用・所得", "産業別就業者構成、完全失業率、納税者1人あたり課税対象所得、法人登記の動向"],
  ["医療・福祉・子育て・生活基盤", "医師数・保育所・学校・図書館・商業集積などを複合スコアで評価"],
  ["住宅・地価・ふるさと納税", "空き家率、地価・マンション価格、ふるさと納税受入額(1人あたり換算も)"],
  ["類似自治体ベンチマーク", "人口規模が近い全国10自治体と主要指標を比較"],
  ["多角分析① 掛け合わせによる類型化", "「財政力×人口動態」「高齢化×医療供給」の散布図で、全自治体の中での型を判定(3次分析)"],
  ["多角分析② 2050年シナリオ試算", "従属人口指数、医師1人あたり高齢者数、1人あたり歳入の変化と、人口半減・高齢化率50%の転換点(4次分析)"],
  ["ビジネス判断のための指標", "域内所得総額(市場規模)、生産年齢人口の将来、昼間人口、自治体の予算規模を立地・営業視点で整理"],
  ["考察", "財政の持続可能性、人口構造の転換、産業構造の含意、広域連携の必要性を文章で読み解く"],
  ["診断と展望・付録", "ルールベース自動診断と、全指標の定義・算出方法・出典・写真クレジット"],
];

const PERSONAS = [
  {
    group: "自治体で働く方へ",
    items: [
      ["議会・委員会の説明資料(職員)", "わかること:自団体の全国順位と、類似団体との差。使えること:説明資料の下敷きとしてそのまま転用でき、集計作業から解放される"],
      ["総合計画・施政方針の現状分析(首長・幹部)", "わかること:2050年までの人口と負荷のシナリオ、転換点の年。使えること:計画策定のたたき台になり、職員の数週間分の作業を数日に短縮"],
      ["ふるさと納税を伸ばしたい(担当者・中間事業者)", "わかること:受入額の全国での位置と、類似団体との差の大きさ。使えること:打ち手の優先順位付けと、首長・議会への提案根拠に"],
      ["移住・関係人口で選ばれたい(地方創生2.0対応)", "わかること:子育て世代吸引力など「選ばれる理由」の競合比較。使えること:PRの訴求点を、感覚ではなく数字で決められる"],
    ],
  },
  {
    group: "企業・事業者の方へ",
    items: [
      ["自治体向け営業の優先順位付け(B2G営業)", "わかること:財政力・予算規模・課題の所在。使えること:約1,700自治体のどこから当たるべきか、商談前の下調べと提案書の根拠に"],
      ["進出・出店の候補地選定(立地担当)", "わかること:地価・労働力・市場規模と、2050年まで担い手が保てるか。データセンター等の大型投資では財政力(支援余力)も。使えること:候補地の一次スクリーニングを1冊で完結"],
      ["医療・介護の出店・継続判断(2025年問題対応)", "わかること:高齢者数と医師供給の2050年試算、需要のピーク時期。使えること:出店計画と撤退判断の材料に"],
    ],
  },
  {
    group: "個人・メディア・研究者の方へ",
    items: [
      ["移住先をデータで決めたい(個人)", "わかること:子育て吸引力・生活基盤・地価・将来人口。パンフレットでは分からない「その街の将来の姿」。使えること:候補地を数字で絞り込む判断材料に"],
      ["特集記事の裏付け(メディア)", "わかること:ランキングと診断コメントという「記事のタネ」。使えること:記者の下調べの置き換えと、数字の裏取りに"],
      ["研究・提案の土台データ(大学・コンサル・金融機関)", "わかること:出典と算出方法が明記された一次データ一式。使えること:卒論・地域分析・クライアント提案の引用に耐える土台に"],
    ],
  },
];

const COMPARE = [
  ["価格", "1冊数万円〜数十万円が相場", "単体11,000円〜(自動分析で原価を圧縮)"],
  ["納期", "受注から数週間〜数ヶ月", "通常3営業日以内"],
  ["比較の基準", "対象自治体単体の記述が中心", "全1,740自治体を同一計算式で算出した順位・スコア"],
  ["将来推計", "人口推計のみ、または別料金", "2050年までの推計に財政・医療を掛けたシナリオ試算まで標準収録"],
  ["独自データ", "公的統計の転載が中心", "ふるさと納税・空き家率・地価・法人登記など、大手資料に載らない指標"],
  ["読み手への配慮", "専門家向けの記述", "キーファクトと目的別ガイドで、忙しい実務家が3分で要点把握"],
  ["根拠の透明性", "算出方法は非公開のことも", "全指標の定義・計算式・出典を付録に明記"],
];

const FAQS = [
  {
    q: "納期はどれくらいですか？",
    a: "レポートは自動生成のため、通常はご依頼から3営業日以内に納品できます。都道府県セットや法人向けの継続提供は、範囲に応じて別途ご案内します。",
  },
  {
    q: "特定の指標を深掘りしたり、比較先を指定したりできますか？",
    a: "比較レポートでは、比較先の自治体をご指定いただけます。追加の指標や独自の集計が必要な場合は、お問い合わせ時にご相談ください(内容により追加料金がかかる場合があります)。",
  },
  {
    q: "データの出典と鮮度は？",
    a: "国勢調査(2020年・2025年)、地方財政状況調査、市町村税課税状況等の調、ふるさと納税に関する現況調査、国立社会保障・人口問題研究所の将来推計など、すべて公的統計です。各レポートの付録に出典と算出方法を明記しています。",
  },
  {
    q: "請求書や領収書は発行できますか？",
    a: "はい、対応可能です。お問い合わせ時にその旨をお知らせください。",
  },
];

export default function Page() {
  return (
    <main style={wrap}>
      <p style={eyebrow}>MUNICIPAL RESEARCH REPORT</p>
      <h1 style={h1}>自治体調査レポート</h1>

      <p style={lead}>
        1つの自治体を、財政だけでなく人口・産業・医療・住宅・将来推計まで
        総合的に診断した<strong>全18ページ前後のPDFレポート</strong>です。
        現地の実写真、全自治体同一基準のスコアと順位、2指標を掛け合わせた
        類型分析、2050年までのシナリオ試算、書き下ろしの考察まで収録。
        大手シンクタンクの自治体レポートは1冊数万円〜数十万円が相場ですが、
        本レポートは公開統計の自動分析により、それ以上の情報量を
        手の届く価格と数日の納期で提供します。まず無料サンプルで
        質をご確認ください。
      </p>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル①</div>
        <h2 style={sampleTitle}>北海道 泊村 ― 財政健全度 全国2位(評価S)</h2>
        <p style={sampleDesc}>
          原子力発電所が立地し、財政力指数1.49、歳入は住民1人あたり
          約319万円。財政健全度は全国1,717団体中2位という突出した事例です。
          一方で2050年の人口は786人、高齢化率50%到達は2046年頃という
          転換点まで試算し、「豊かさと縮小の同居」を多角的に診断しています。
        </p>
        <img src="/reports/preview-tomari-cover-01.png" alt="泊村レポート表紙のプレビュー" style={previewImg} loading="lazy" />
        <img src="/reports/preview-tomari-analysis-12.png" alt="泊村レポート多角分析ページのプレビュー" style={previewImg} loading="lazy" />
        <br />
        <a
          href="/reports/tomari-mura_fiscal-health-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料)
        </a>
      </div>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル②</div>
        <h2 style={sampleTitle}>北海道 夕張市 ― 財政健全度 全国最下位(評価D)</h2>
        <p style={sampleDesc}>
          財政健全度スコアは全国1,717団体中1,717位。実質公債費比率
          67.4%、経常収支比率123.5%という数字から、自動診断が
          「地方債の許可制移行ラインに達している」と判定する対照的な
          事例です。厳しい状況の自治体も、同じ基準・同じフォーマットで
          機械的に診断できることを示しています。
        </p>
        <img src="/reports/preview-yubari-summary-03.png" alt="夕張市レポート要約ページのプレビュー" style={previewImg} loading="lazy" />
        <br />
        <a
          href="/reports/yubari-shi_fiscal-health-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料)
        </a>
      </div>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル③ 大規模自治体</div>
        <h2 style={sampleTitle}>神奈川県 横浜市 ― 日本最大の市(人口375万人)</h2>
        <p style={sampleDesc}>
          財政健全度は評価A(158位)、子育て世代吸引力は評価S。
          「大きな自治体は分析しなくても分かる」という先入観に反して、
          大都市にも順位と診断は必要です。政令市の幹部・職員の方、
          大都市への進出を考える企業の方に、まず見てほしいサンプルです。
        </p>
        <img src="/reports/preview-yokohama-cover-01.png" alt="横浜市レポート表紙のプレビュー" style={previewImg} loading="lazy" />
        <br />
        <a
          href="/reports/yokohama-shi_municipal-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料)
        </a>
      </div>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル④ 話題の自治体</div>
        <h2 style={sampleTitle}>茨城県 つくば市 ― 人口+11.2%の急成長都市</h2>
        <p style={sampleDesc}>
          財政健全度は評価S(117位)、財政力指数1.06、高齢化率は18.9%。
          GX戦略地域のデータセンター集積地にも選ばれた、いま最も
          勢いのある自治体のひとつです。ただし2050年には人口減少に
          転じる推計で、「成長の先」まで診断しています。
          成長自治体の職員の方、立地を検討する企業の方に。
        </p>
        <img src="/reports/preview-tsukuba-cover-01.png" alt="つくば市レポート表紙のプレビュー" style={previewImg} loading="lazy" />
        <br />
        <a
          href="/reports/tsukuba-shi_municipal-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料)
        </a>
      </div>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル⑤ ニッチな自治体</div>
        <h2 style={sampleTitle}>東京都 青ヶ島村 ― 人口168人、日本最小の自治体</h2>
        <p style={sampleDesc}>
          住民全員が大型バス4台に乗れてしまう、日本でいちばん小さな村。
          医師は1人、なのに子育て世代吸引力は評価S(72位)という
          意外な結果も出ました。統計上の「双子」は北海道の留寿都村。
          小さな自治体の職員の方も、数字好きの方も、楽しめるサンプルです。
        </p>
        <img src="/reports/preview-aogashima-cover-01.png" alt="青ヶ島村レポート表紙のプレビュー" style={previewImg} loading="lazy" />
        <br />
        <a
          href="/reports/aogashima-mura_municipal-report_sample.pdf"
          style={downloadButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          PDFサンプルを見る(無料)
        </a>
      </div>

      <h2 style={h2}>レポートの構成(全18ページ前後)</h2>
      <div>
        {CHAPTERS.map(([t, d], i) => (
          <p key={t} style={chapterRow}>
            <strong>{i + 1}. {t}</strong>
            <br />
            <span style={{ color: "var(--muted)" }}>{d}</span>
          </p>
        ))}
      </div>

      <h2 style={h2}>こんな需要に応えます ― ペルソナ別・10の用途</h2>
      <p style={p}>
        本レポートは「読んで終わり」ではなく、その先の仕事に使うことを
        前提に設計しています。共通するのは、<strong>自分で集計・比較・
        資料化する時間を買う</strong>という価値です。
      </p>
      {PERSONAS.map((g) => (
        <div key={g.group}>
          <h3 style={h3}>{g.group}</h3>
          {g.items.map(([t, d]) => (
            <p key={t} style={chapterRow}>
              <strong>{t}</strong>
              <br />
              <span style={{ color: "var(--muted)" }}>{d}</span>
            </p>
          ))}
        </div>
      ))}

      <h2 style={h2}>いま、自治体データの需要が伸びている理由</h2>
      <ul style={ul}>
        <li style={li}>
          <strong>B2G(自治体向け)営業の本格化</strong> ── 大手企業が全国1,700自治体への営業体制を次々に構築しています。商談の起点は「対象自治体の現状と課題の可視化」であり、財政と課題のデータが提案の前提になりました
        </li>
        <li style={li}>
          <strong>データセンターの地方分散</strong> ── 経済産業省はGX戦略地域のデータセンター集積地として9地域10地点を認定しました(2026年)。自治体側は電力・用地・労働力を示して誘致し、企業側は適地をデータで選ぶ時代になっています
        </li>
        <li style={li}>
          <strong>ふるさと納税は1.3兆円市場</strong> ── 総務省の公表では2025年度の寄付額は1兆3,314億円と過去最高を更新する一方、経費率ルールの引き下げ(2029年に40%)で競争は激化。受入額の分析と戦略立案の需要が高まっています
        </li>
        <li style={li}>
          <strong>地方創生2.0と「選ばれる地方」競争</strong> ── ふるさと住民登録で関係人口1,000万人を目指す国の方針のもと、自治体は自らの魅力をデータで語る必要に迫られています
        </li>
        <li style={li}>
          <strong>2025年問題の本格化</strong> ── 団塊世代が全員後期高齢者となり、医療・介護の需要と担い手不足が全自治体で同時に進みます。将来推計に基づく判断材料が不可欠です
        </li>
      </ul>

      <h2 style={h2}>大手シンクタンクの調査レポートとの違い</h2>
      <div>
        {COMPARE.map(([item, them, us]) => (
          <p key={item} style={chapterRow}>
            <strong>{item}</strong>
            <br />
            一般的な調査会社:<span style={{ color: "var(--muted)" }}>{them}</span>
            <br />
            本レポート:<strong>{us}</strong>
          </p>
        ))}
      </div>
      <p style={p}>
        シンクタンクの強みは、現地ヒアリングに基づく固有情報です。
        本レポートはそれを置き換えるものではなく、「全自治体を同じ物差しで
        測った数字と、その先の試算」を、速く・安く・透明な根拠で提供する
        ことに特化しています。ヒアリング前の下調べや、複数自治体の
        横並び比較では、むしろ本レポートの方が強い場面も多いはずです。
      </p>

      <h2 style={h2}>お金を払う価値があるか、正直なところ</h2>
      <p style={p}>
        本サイトのデータ自体は無料で公開しており、時間をかけて各ページを
        見比べれば、同じ数字にはたどり着けます。ただし、全国順位への
        換算、類似団体との比較、将来推計への接続、シナリオ試算、
        そして会議や商談にそのまま渡せる資料化までを自分でやると、
        慣れた人でも数日はかかります。レポートの価格は、
        その数日分の人件費より安く設定しています。
        「数字を集める時間」ではなく「数字で考える時間」を買う、
        という位置づけです。
      </p>

      <h2 style={h2}>提供形態と料金の目安</h2>
      <ul style={ul}>
        <li style={li}>単体レポート(自治体1つ):<strong>11,000円〜</strong></li>
        <li style={li}>比較レポート(対象自治体+指定の比較先):<strong>22,000円〜</strong></li>
        <li style={li}>都道府県セット(県内の全市区町村):<strong>55,000円〜</strong></li>
        <li style={li}>継続提供(全国データ・定期更新、法人向け):別途お見積もり</li>
      </ul>
      <p style={p}>
        いずれも目安です。内容・範囲に応じて正式なお見積もりをご案内します。
        ご希望の自治体名と用途を添えて、
        <Link prefetch={false} href="/contact" style={link}>
          お問い合わせページ
        </Link>
        からご連絡ください。
      </p>

      <h2 style={h2}>よくある質問</h2>
      <div>
        {FAQS.map((f) => (
          <p key={f.q} style={p}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </div>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: 20,
};

const eyebrow: React.CSSProperties = {
  color: "var(--indigo)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  marginBottom: 4,
};

const h1: React.CSSProperties = {
  marginTop: 4,
};

const h2: React.CSSProperties = {
  marginTop: 36,
};

const h3: React.CSSProperties = {
  marginTop: 24,
  marginBottom: 8,
};

const lead: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 16,
  lineHeight: 1.9,
};

const p: React.CSSProperties = {
  lineHeight: 1.9,
};

const ul: React.CSSProperties = {
  lineHeight: 1.9,
  paddingLeft: 20,
};

const li: React.CSSProperties = {
  marginBottom: 8,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
};

const sampleBox: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  padding: "24px 28px",
  margin: "28px 0",
};

const sampleLabel: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--indigo)",
  border: "1px solid var(--indigo)",
  borderRadius: 4,
  padding: "2px 8px",
  marginBottom: 10,
};

const sampleTitle: React.CSSProperties = {
  margin: "0 0 8px",
};

const sampleDesc: React.CSSProperties = {
  color: "var(--muted)",
  lineHeight: 1.8,
  marginBottom: 18,
};

const downloadButton: React.CSSProperties = {
  display: "inline-block",
  background: "var(--indigo)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: "12px 20px",
  borderRadius: 8,
  textDecoration: "none",
  marginTop: 14,
};

const previewImg: React.CSSProperties = {
  width: "48%",
  maxWidth: 330,
  height: "auto",
  border: "1px solid var(--line)",
  borderRadius: 8,
  marginRight: 8,
  verticalAlign: "top",
};

const chapterRow: React.CSSProperties = {
  lineHeight: 1.8,
  margin: "0 0 10px",
};
