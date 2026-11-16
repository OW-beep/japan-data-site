import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/reports" },
  title: "自治体調査レポート｜財政・人口・産業の総合診断+2050年試算(サンプル5件無料)",
  description:
    "1自治体を財政・人口・産業・医療・住宅まで総合診断した17ページ前後のPDFレポートが単体1,980円(税込)から。法人向けには全指標Excelと課題→想定調達対応表付きの商談前ブリーフィング・パック(19,800円)も。実写真、将来人口推計、掛け合わせ分析、2050年シナリオ試算を収録。サンプル5件を無料公開中。",
};

const SAMPLES_MATRIX = [
  ["泊村(北海道)", "人口1,479人の村", "2位", "財政力指数1.49、歳入1人あたり約319万円。「豊かさと縮小の同居」を診断", "財政担当・自治体職員"],
  ["夕張市(北海道)", "人口5,610人、財政の立て直しに挑む市", "1,717位", "課題の大きさを正確に測り、再生に向けた論点を整理", "自治体関係者・メディア・研究者"],
  ["横浜市(神奈川)", "人口375万人、日本最大の市", "158位", "大都市にも順位と診断。子育て世代吸引力は171位", "政令市の職員・進出企業"],
  ["つくば市(茨城)", "人口26.9万人、急成長都市", "117位", "人口+11.2%。勢いのあるまちの「成長の先」まで診断", "成長自治体の職員・立地検討企業"],
  ["青ヶ島村(東京)", "人口168人、日本最小の村", "1,281位", "医師は1人でも、子育て世代吸引力は72位という意外性", "小規模自治体・数字好きの方"],
];

const CHAPTER_GROUPS = [
  ["導入", "表紙(実写真+4つの複合スコア)/ 本レポートの使い方(キーファクトと目的別ガイド)/ エグゼクティブサマリー(強み・注視点・長期的な課題)"],
  ["基礎データ", "基本プロフィール(全国順位・平均と一覧比較)/ 人口動態と将来推計(2050年まで)/ 財政健全度(5指標の比較とレーダー)"],
  ["分野別の診断", "産業・雇用・所得 / 医療・福祉・子育て・生活基盤 / 住宅・地価・ふるさと納税"],
  ["掛け合わせ分析", "類似自治体ベンチマーク(近い10団体)/ 多角分析① 2指標の類型化(3次分析)/ 多角分析② 2050年シナリオ試算(4次分析)/ ビジネス判断のための指標"],
  ["まとめ", "考察(書き下ろしの読み解き)/ 診断と展望 / 付録(全指標の定義・算出方法・出典)"],
];

const TRENDS = [
  ["B2G(自治体向け)営業の本格化", "大手企業が全国1,700自治体への営業体制を次々に構築。商談の起点は「対象自治体の現状と課題の可視化」で、財政と課題のデータが提案の前提になりました"],
  ["データセンターの地方分散", "経済産業省はGX戦略地域のデータセンター集積地として9地域10地点を認定(2026年)。自治体は電力・用地・労働力を示して誘致し、企業は適地をデータで選ぶ時代に"],
  ["ふるさと納税は1.3兆円市場", "総務省の公表では2025年度の寄付額は1兆3,314億円と過去最高の一方、経費率ルールの引き下げ(2029年に40%)で競争は激化。受入額の分析と戦略立案の需要が拡大"],
  ["地方創生2.0と「選ばれる地方」競争", "ふるさと住民登録で関係人口1,000万人を目指す国の方針のもと、自治体は自らの魅力をデータで語る必要に迫られています"],
  ["2025年問題の本格化", "団塊世代が全員後期高齢者となり、医療・介護の需要と担い手不足が全自治体で同時に進行。将来推計に基づく判断材料が不可欠です"],
];

const PERSONAS = [
  {
    group: "企業・事業者の方へ",
    items: [
      ["自治体向け営業の優先順位付け(B2G営業)", "わかること:財政力・予算規模・課題の所在。使えること:約1,700自治体のどこから当たるべきか、商談前の下調べと提案書の根拠に"],
      ["進出・出店の候補地選定(立地担当)", "わかること:地価・労働力・市場規模と、2050年まで担い手が保てるか。データセンター等の大型投資では財政力(支援余力)も。使えること:候補地の一次スクリーニングを1冊で完結"],
      ["医療・介護の出店・継続判断(2025年問題対応)", "わかること:高齢者数と医師供給の2050年試算、需要のピーク時期。使えること:出店計画と撤退判断の材料に"],
    ],
  },
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
    group: "個人・メディア・研究者の方へ",
    items: [
      ["移住先をデータで決めたい(個人)", "わかること:子育て吸引力・生活基盤・地価・将来人口。パンフレットでは分からない「その街の将来の姿」。使えること:候補地を数字で絞り込む判断材料に"],
      ["特集記事の裏付け(メディア)", "わかること:ランキングと診断コメントという「記事のタネ」。使えること:記者の下調べの置き換えと、数字の裏取りに"],
      ["研究・提案の土台データ(大学・コンサル・金融機関)", "わかること:出典と算出方法が明記された一次データ一式。使えること:卒論・地域分析・クライアント提案の引用に耐える土台に"],
    ],
  },
];

const COMPARE = [
  ["価格", "1冊数万円〜数十万円が相場", "単体1,980円(税込)から(自動分析で原価を圧縮)"],
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
    a: "通常はご依頼から3営業日以内に納品できます。都道府県セットや法人向けの継続提供は、範囲に応じて別途ご案内します。",
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
    a: "はい。見積書・納品書・請求書・領収書を発行でき、法人の請求書払いにも対応します。お問い合わせ時にその旨をお知らせください。",
  },
  {
    q: "社内で共有したり、提案書に引用したりできますか？",
    a: "法人ブリーフィング・パックと法人継続プランでは、同一法人内での共有と、出典を明記したうえでの提案書への引用・図表の転載が可能です。単体・比較・5自治体パックは購入された方ご本人の利用範囲となります。再販売・再配布はいずれもご遠慮ください。",
  },
  {
    q: "RESASやe-Statなど、無料の公的ツールとの違いは？",
    a: "RESASやe-Statは無料で高機能です。本レポートが売っているのはデータそのものではなく、複数自治体を同じ物差しで横並びにした順位と考察、会議や商談にそのまま渡せるPDFの形、そして「調べる時間」です。ご自身で集計できる方には無料ツールで十分な場面も多い、というのが正直なところです。",
  },
];

export default function Page() {
  return (
    <main style={wrap}>
      <p style={eyebrow}>MUNICIPAL RESEARCH REPORT</p>
      <h1 style={h1}>自治体調査レポート</h1>

      <p style={lead}>
        1つの自治体を、財政だけでなく人口・産業・医療・住宅・将来推計まで
        総合的に診断した<strong>全17ページ前後のPDFレポート</strong>です。
        現地の実写真、全自治体同一基準のスコアと順位、2指標を掛け合わせた
        類型分析、2050年までのシナリオ試算、書き下ろしの考察まで収録。
        大手シンクタンクの自治体レポートは1冊数万円〜数十万円が相場ですが、
        本レポートは公開統計の自動分析により、それ以上の情報量を
        <strong>単体1,980円(税込)から</strong>、数日の納期で提供します。
        なお本レポートは、自治体に優劣の烙印を押すためのものではありません。
        順位は「全国の中での立ち位置」を示す物差しであり、下位の分野は
        その地域の苦手分野・伸びしろとして読み解きます。
        法人向けには、対象5自治体のレポートに全指標Excelと
        「課題→想定される調達」対応表を付けた
        <strong>商談前ブリーフィング・パック(19,800円)</strong>も用意しています。
        まず無料サンプルで質をご確認ください。
      </p>

      <div style={{ ...sampleBox, border: "2px solid var(--indigo)" }}>
        <div style={sampleLabel}>法人向け</div>
        <h2 style={sampleTitle}>商談前ブリーフィング・パック ― 自治体向け営業の下調べを、まとめて外注できます</h2>
        <p style={sampleDesc}>
          「どの自治体に、どの課題を切り口に売るか」。自治体向けの営業では、
          商談の前に自治体の現状と課題を調べるだけで毎回数時間かかります。
          本パックは、その下調べをそのまま引き受ける法人専用のセットです。
        </p>
        <table style={tbl}>
          <tbody>
            <tr>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>セット内容</td>
              <td style={td}>対象5自治体の総合レポート(PDF)/ 全指標のExcelデータ / 「自治体の課題→想定される調達・商材カテゴリ」対応表 / 訪問時の質問リスト</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>利用範囲</td>
              <td style={td}>同一法人内での共有可。提案書への引用・図表の転載は出典明記で可</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>価格</td>
              <td style={td}><strong>19,800円(税込)</strong>。継続利用は月額9,800円(対象自治体の入れ替え・データ更新付き)</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>お取引</td>
              <td style={td}>見積書・納品書・請求書を発行します。請求書払い対応</td>
            </tr>
          </tbody>
        </table>
        <a href="/contact" style={downloadButton}>
          法人パックを問い合わせる
        </a>
      </div>

      <h2 style={h2}>無料サンプル5件 ― 比較表</h2>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>サンプル</th>
            <th style={th}>規模・タイプ</th>
            <th style={th}>財政健全度</th>
            <th style={th}>見どころ</th>
            <th style={th}>おすすめの読者</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLES_MATRIX.map((r) => (
            <tr key={r[0]}>
              <td style={{ ...td, fontWeight: 700 }}>{r[0]}</td>
              <td style={td}>{r[1]}</td>
              <td style={td}>{r[2]} / 1,717団体</td>
              <td style={td}>{r[3]}</td>
              <td style={td}>{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={sampleBox}>
        <div style={sampleLabel}>サンプル①</div>
        <h2 style={sampleTitle}>北海道 泊村 ― 財政健全度 全国2位</h2>
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
        <h2 style={sampleTitle}>北海道 夕張市 ― 財政の立て直しに挑むまち</h2>
        <p style={sampleDesc}>
          財政健全度は全国1,717団体中1,717位、実質公債費比率67.4%、
          経常収支比率123.5%。数字の上では最も厳しい位置にありますが、
          このレポートの目的は自治体に優劣をつけることではありません。
          課題の大きさを正確に測り、立て直しに向けた論点を整理することです。
          注目される自治体こそ、感情ではなくデータで現在地を確認する
          材料として使ってほしいサンプルです。
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
        <div style={sampleLabel}>サンプル③</div>
        <h2 style={sampleTitle}>神奈川県 横浜市 ― 日本最大の市(人口375万人)</h2>
        <p style={sampleDesc}>
          財政健全度は158位、子育て世代吸引力は171位。
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
        <div style={sampleLabel}>サンプル④</div>
        <h2 style={sampleTitle}>茨城県 つくば市 ― 人口+11.2%の急成長都市</h2>
        <p style={sampleDesc}>
          財政健全度は117位、財政力指数1.06、高齢化率は18.9%。
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
        <div style={sampleLabel}>サンプル⑤</div>
        <h2 style={sampleTitle}>東京都 青ヶ島村 ― 人口168人、日本最小の自治体</h2>
        <p style={sampleDesc}>
          住民全員が大型バス4台に乗れてしまう、日本でいちばん小さな村。
          医師は1人、なのに子育て世代吸引力は72位という
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

      <h2 style={h2}>レポートの構成(全17ページ前後)</h2>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>ブロック</th>
            <th style={th}>収録内容</th>
          </tr>
        </thead>
        <tbody>
          {CHAPTER_GROUPS.map(([g, d]) => (
            <tr key={g}>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>{g}</td>
              <td style={td}>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={h2}>こんな需要に応えます ― ペルソナ別・10の用途</h2>
      <p style={p}>
        本レポートは「読んで終わり」ではなく、その先の仕事に使うことを
        前提に設計しています。共通するのは、<strong>自分で集計・比較・
        資料化する時間を買う</strong>という価値です。
      </p>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>用途</th>
            <th style={th}>わかること</th>
            <th style={th}>使えること</th>
          </tr>
        </thead>
        <tbody>
          {PERSONAS.map((g) => (
            <Fragment key={g.group}>
              <tr>
                <td colSpan={3} style={tdGroup}>{g.group}</td>
              </tr>
              {g.items.map(([t, d]) => {
                const [know, use] = d.split("使えること:");
                return (
                  <tr key={t}>
                    <td style={{ ...td, fontWeight: 700 }}>{t}</td>
                    <td style={td}>{know.replace("わかること:", "")}</td>
                    <td style={td}>{use}</td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>

      <h2 style={h2}>いま、自治体データの需要が伸びている理由</h2>
      <table style={tbl}>
        <tbody>
          {TRENDS.map(([t, d]) => (
            <tr key={t}>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>{t}</td>
              <td style={td}>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={h2}>大手シンクタンクの調査レポートとの違い</h2>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>項目</th>
            <th style={th}>一般的な調査会社</th>
            <th style={th}>本レポート</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE.map(([item, them, us]) => (
            <tr key={item}>
              <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>{item}</td>
              <td style={{ ...td, color: "var(--muted)" }}>{them}</td>
              <td style={{ ...td, fontWeight: 700 }}>{us}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

      <h2 style={h2}>提供形態と料金</h2>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>提供形態</th>
            <th style={th}>料金</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>単体レポート(自治体1つ・全17ページ前後)</td>
            <td style={{ ...td, fontWeight: 700 }}>1,980円(税込)</td>
          </tr>
          <tr>
            <td style={td}>比較レポート(対象自治体+指定の比較先、計2自治体)</td>
            <td style={{ ...td, fontWeight: 700 }}>2,980円(税込)</td>
          </tr>
          <tr>
            <td style={td}>5自治体パック</td>
            <td style={{ ...td, fontWeight: 700 }}>7,980円(税込)(1自治体あたり約1,596円)</td>
          </tr>
          <tr>
            <td style={td}>法人ブリーフィング・パック(5自治体+全指標Excel+課題→想定調達対応表+法人内共有・引用ライセンス)</td>
            <td style={{ ...td, fontWeight: 700 }}>19,800円(税込)</td>
          </tr>
          <tr>
            <td style={td}>法人継続プラン(月額・対象自治体の入れ替えとデータ更新付き)</td>
            <td style={{ ...td, fontWeight: 700 }}>月額9,800円(税込)</td>
          </tr>
          <tr>
            <td style={td}>都道府県セット・その他法人向け提供</td>
            <td style={td}>別途お見積もり</td>
          </tr>
        </tbody>
      </table>
      <p style={p}>
        ご希望の自治体名と用途を添えて、
        <Link prefetch={false} href="/contact" style={link}>
          お問い合わせページ
        </Link>
        からご連絡ください。
      </p>

      <h2 style={h2}>ご利用条件(ライセンス)</h2>
      <table style={tbl}>
        <tbody>
          <tr>
            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>社内共有</td>
            <td style={td}>法人パック・法人継続プラン:同一法人内は共有可。単体・比較・5自治体パック:購入者ご本人の利用</td>
          </tr>
          <tr>
            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>引用・転載</td>
            <td style={td}>法人パック・法人継続プラン:出典明記で提案書への引用・図表の転載可。その他のプラン:出典明記の引用は可、図表の転載はお問い合わせください</td>
          </tr>
          <tr>
            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>再販売・再配布</td>
            <td style={td}>不可(レポート・Excelデータとも)</td>
          </tr>
          <tr>
            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>書類・支払い</td>
            <td style={td}>見積書・納品書・請求書・領収書を発行。法人の請求書払い対応</td>
          </tr>
          <tr>
            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>データの時点</td>
            <td style={td}>各レポートの付録に出典と時点を明記。統計の更新に合わせ、法人継続プランでは更新版を提供</td>
          </tr>
        </tbody>
      </table>

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

const tbl: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "14px 0 22px",
  fontSize: 13.5,
  lineHeight: 1.7,
};

const th: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--indigo)",
  color: "#fff",
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 700,
};

const td: React.CSSProperties = {
  border: "1px solid var(--line)",
  padding: "8px 10px",
  verticalAlign: "top",
};

const tdGroup: React.CSSProperties = {
  border: "1px solid var(--line)",
  padding: "8px 10px",
  verticalAlign: "top",
  background: "var(--surface)",
  fontWeight: 700,
};
