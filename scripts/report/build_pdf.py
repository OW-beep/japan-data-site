# -*- coding: utf-8 -*-
"""プレミアム版レポートのPDF組み立て(reportlab)"""
import os
import sys
import tempfile
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
import generate_report as G
import charts

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, Image, PageBreak,
                                KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# IPAexフォント(IPAフォントライセンス v1.0)。Noto CJKはCFFアウトラインのため
# reportlabで埋め込めず、TrueType形式のIPAexゴシックを使う。太字ウェイトは
# 存在しないため、見出しも同フォントで組み、色と大きさで階層を表現する。
_FDIR = os.path.join(os.path.dirname(__file__), "fonts")
pdfmetrics.registerFont(TTFont("Noto", os.path.join(_FDIR, "ipaexg.ttf")))
pdfmetrics.registerFont(TTFont("NotoB", os.path.join(_FDIR, "ipaexg.ttf")))
pdfmetrics.registerFontFamily("Noto", normal="Noto", bold="NotoB")

NAVY = colors.HexColor("#14335c")
NAVY_D = colors.HexColor("#0f2a50")
ORANGE = colors.HexColor("#f97316")
TEAL = colors.HexColor("#0e7c86")
GRAY = colors.HexColor("#64748b")
LINE = colors.HexColor("#e2e8f0")
BG = colors.HexColor("#f1f5f9")
TODAY = date.today().strftime("%Y年%m月%d日")

S = {
    "h1": ParagraphStyle("h1", fontName="NotoB", fontSize=17, leading=24, textColor=NAVY_D, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="NotoB", fontSize=13.5, leading=19, textColor=NAVY, spaceBefore=10, spaceAfter=5),
    "h3": ParagraphStyle("h3", fontName="NotoB", fontSize=11, leading=16, textColor=NAVY_D, spaceBefore=6, spaceAfter=3),
    "p": ParagraphStyle("p", fontName="Noto", fontSize=9.9, leading=16, textColor=colors.HexColor("#1f2937")),
    "small": ParagraphStyle("small", fontName="Noto", fontSize=8.7, leading=13, textColor=GRAY),
    "cell": ParagraphStyle("cell", fontName="Noto", fontSize=9.3, leading=13.5),
    "cellB": ParagraphStyle("cellB", fontName="NotoB", fontSize=9.3, leading=13.5),
    "cellW": ParagraphStyle("cellW", fontName="NotoB", fontSize=9.3, leading=13.5, textColor=colors.white),
}

def fmt(v, digits=2, unit=""):
    if v is None:
        return "―"
    return f"{v:,.{digits}f}{unit}"

def fmt_yen(amount):
    """金額を億円/万円で読みやすく"""
    if amount is None:
        return "―"
    if amount >= 100_000_000:
        return f"{amount / 1e8:.1f}億円"
    return f"{amount / 10000:,.0f}万円"

def signed(v, digits=1):
    if v is None:
        return "―"
    return f"{v:+.{digits}f}"

def tbl(data, widths, header=True, align_right_from=1):
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    style = [
        ("FONTNAME", (0, 0), (-1, -1), "Noto"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.3),
        ("LEADING", (0, 0), (-1, -1), 13.5),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]
    if header:
        style += [("BACKGROUND", (0, 0), (-1, 0), NAVY),
                  ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                  ("FONTNAME", (0, 0), (-1, 0), "NotoB")]
        for r in range(1, len(data)):
            if r % 2 == 0:
                style.append(("BACKGROUND", (0, r), (-1, r), BG))
    if align_right_from is not None:
        style.append(("ALIGN", (align_right_from, 0), (-1, -1), "RIGHT"))
    t.setStyle(TableStyle(style))
    return t

def header_para(text):
    return Paragraph(f'<font color="#ffffff">{text}</font>', S["cellW"])

def cimg(path, width):
    """PNGの実アスペクト比で高さを決める(縦横比の潰れ=文字かぶり防止)"""
    from PIL import Image as PILImage
    with PILImage.open(path) as im:
        w, h = im.size
    return Image(path, width=width, height=width * h / w)

# ------------------------------------------------------------------ diagnosis
def diagnose(t, ctx):
    strong, watch, risk = [], [], []
    fi = t.get("financeIndex")
    if fi is not None:
        if fi >= 1.0:
            strong.append(f"財政力指数が{fi:.2f}と1.0を超え、地方交付税の不交付団体に近い自立した財政基盤を持つ(全国平均{G.avg_of(ctx['fiscal_base'], lambda c: c.get('financeIndex')):.2f})。")
        elif fi >= 0.6:
            strong.append(f"財政力指数は{fi:.2f}と全国平均を上回り、自主財源の厚みがある。")
        elif fi < 0.3:
            risk.append(f"財政力指数が{fi:.2f}と低く、地方交付税への依存度が高い。国の財政制度の見直しが直撃しやすい構造。")
    rds = t.get("realDebtServiceRatio")
    if rds is not None:
        if rds >= 25:
            risk.append(f"実質公債費比率が{rds:.1f}%と、地方債の許可制移行ライン(25%)に達している。起債の自由度が大きく制約される水準。")
        elif rds >= 18:
            risk.append(f"実質公債費比率が{rds:.1f}%と早期健全化基準(25%)に近づいている。新規の大型事業は慎重な判断が必要。")
        elif rds < 8:
            strong.append(f"実質公債費比率は{rds:.1f}%と低く、借入余力にゆとりがある。")
    obr = t.get("ordinaryBalanceRatio")
    if obr is not None:
        if obr >= 95:
            watch.append(f"経常収支比率が{obr:.1f}%と高く、財政の硬直化が進んでいる。新たな政策に回せる余力が小さい。")
        elif obr <= 85:
            strong.append(f"経常収支比率は{obr:.1f}%と低めで、政策的な投資に回せる余力を残している。")
    chg = ctx["pop_change"]
    if chg is not None:
        if chg <= -10:
            risk.append(f"人口は2020→2025年で{chg:.1f}%減少した。全国でも減少幅の大きい層に属し、税収と公共サービスの維持が年々難しくなる。")
        elif chg >= 0:
            strong.append(f"人口は2020→2025年で{chg:+.1f}%と増加した。減少が9割の自治体の中で例外的な強さ。")
    fut = ctx["future"]
    if fut:
        p50, p20 = fut["p"][6], fut["p"][0]
        d = (p50 - p20) / p20 * 100
        if d <= -50:
            risk.append(f"将来推計では2050年の人口が{p50:,}人と、2020年比{d:.0f}%まで減少する。施設の統廃合と行政サービスの集約は避けて通れない。")
        watch.append(f"2050年の高齢化率は{fut['e'][6]:.1f}%まで上昇する推計(2020年{fut['e'][0]:.1f}%)。医療・介護の需要増と担い手不足が同時に進む。")
    doc = G.doctors_per_100k(t)
    if doc is not None and doc < 100:
        watch.append(f"人口10万人あたり医師数は{doc:.0f}人と全国平均(約{ctx.get('doctors_avg', 179):.0f}人)を大きく下回る。医療アクセスは近隣都市への依存度が高い。")
    vac = G.vacancy_rate(t)
    if vac is not None and vac >= 25:
        watch.append(f"空き家率は{vac:.1f}%と高い。別荘等の二次的住宅を含む数字ではあるが、放置空き家の増加には継続的な対策が要る。")
    fur = ctx.get("furusato")
    if fur and t.get("population"):
        per = fur["amountYen"] / t["population"]
        if per >= 100000:
            strong.append(f"ふるさと納税の受入額は住民1人あたり約{per:,.0f}円と突出している。返礼品のブランド力が地域の稼ぐ力になっている。")
    inc = ctx.get("income")
    inc_avg = ctx.get("income_avg")
    if inc and inc_avg:
        if inc >= inc_avg * 1.2:
            strong.append(f"納税者1人あたり課税対象所得は{inc:,.0f}千円と全国平均を2割以上上回る。")
        elif inc <= inc_avg * 0.8:
            watch.append(f"納税者1人あたり課税対象所得は{inc:,.0f}千円と全国平均を下回る。雇用の質と量の底上げが課題。")
    if not strong:
        strong.append("突出した強みは限定的で、指標全般が全国平均前後に分布している。強みの欠如そのものが、移住・企業立地の訴求力を弱めている。")
    if not watch:
        watch.append("短期的には大きな懸念材料は見当たらない。ただし将来人口推計に基づく長期の備えは別途必要。")
    return strong, watch, risk

# ------------------------------------------------------------------ main build
def build(code, out_path):
    t = G.BY_CODE[code]
    pref = G.pref_of(t)
    name = G.short_of(t)
    pref_rows = [c for c in G.MUNIS if G.pref_of(c) == pref]
    tmp = tempfile.mkdtemp()

    fiscal_map, fiscal_n = G.fiscal_scores()
    living_map, living_n = G.living_scores()
    young_map, young_n = G.young_family_scores()
    elderly_map, elderly_n = G.elderly_support_scores()
    fiscal_base = [c for c in G.MUNIS if c["code"] in fiscal_map]

    f_grade, f_rank, _ = G.grade(fiscal_map, code)
    l_grade, l_rank, _ = G.grade(living_map, code)
    y_grade, y_rank, _ = G.grade(young_map, code)
    e_grade, e_rank, _ = G.grade(elderly_map, code)

    fut = G.FUTURE.get(code)
    pop25 = G.POP25.get(code)
    pop_change = G.pop_change_2020_2025(t)
    fur = G.FURUSATO.get(t["name"])
    price = G.PRICES.get(code)
    corp = G.CORP.get(code)
    income = G.income_per_taxpayer(code)
    income_vals = [G.income_per_taxpayer(c["code"]) for c in G.MUNIS]
    income_vals = [v for v in income_vals if v]
    income_avg = G.mean(income_vals) if income_vals else None
    income_rank = None
    if income:
        income_rank = sorted(income_vals, reverse=True).index(income) + 1

    ctx = {"fiscal_base": fiscal_base, "pop_change": pop_change,
           "future": fut, "furusato": fur, "income": income, "income_avg": income_avg,
           "doctors_avg": G.avg_of(G.MUNIS, lambda c: G.doctors_per_100k(c))}
    strong, watch, risk = diagnose(t, ctx)

    # ---------- charts
    chart_files = {}
    if fut:
        p = os.path.join(tmp, "future.png")
        charts.future_chart([2020, 2025, 2030, 2035, 2040, 2045, 2050], fut["p"], fut["e"], p)
        chart_files["future"] = p
    def avg_rows(rows, key):
        return G.avg_of(rows, key)
    fiscal_inds = [
        ("財政力指数", t.get("financeIndex"), avg_rows(pref_rows, lambda c: c.get("financeIndex")), avg_rows(G.MUNIS, lambda c: c.get("financeIndex")), ""),
        ("経常収支比率(%)", t.get("ordinaryBalanceRatio"), avg_rows(pref_rows, lambda c: c.get("ordinaryBalanceRatio")), avg_rows(G.MUNIS, lambda c: c.get("ordinaryBalanceRatio")), ""),
        ("自主財源比率(%)", G.tax_ratio(t), avg_rows(pref_rows, G.tax_ratio), avg_rows(G.MUNIS, G.tax_ratio), ""),
        ("実質公債費比率(%)", t.get("realDebtServiceRatio"), avg_rows(pref_rows, lambda c: c.get("realDebtServiceRatio")), avg_rows(G.MUNIS, lambda c: c.get("realDebtServiceRatio")), ""),
        ("民生費比率(%)", G.welfare_ratio(t), avg_rows(pref_rows, G.welfare_ratio), avg_rows(G.MUNIS, G.welfare_ratio), ""),
    ]
    p = os.path.join(tmp, "fiscal.png")
    charts.fiscal_bars([(lb, tv, pv, nv, u) for lb, tv, pv, nv, u in fiscal_inds if tv is not None], p)
    chart_files["fiscal"] = p

    def dev(key, invert=False):
        vals = [key(c) for c in fiscal_base if key(c) is not None]
        tv = key(t)
        if tv is None or not vals:
            return 50.0
        m = G.mean(vals)
        sd = (sum((v - m) ** 2 for v in vals) / len(vals)) ** 0.5 or 1
        z = (tv - m) / sd
        if invert:
            z = -z
        return max(15, min(85, 50 + 10 * z))
    radar_labels = ["財政力指数", "経常収支比率\n(低いほど良い)", "自主財源比率", "実質公債費比率\n(低いほど良い)", "地方税\n1人あたり"]
    tax_per_cap = (t["localTax"] * 1000 / t["population"]) if t.get("localTax") and t.get("population") else None
    radar_vals = [
        dev(lambda c: c.get("financeIndex")),
        dev(lambda c: c.get("ordinaryBalanceRatio"), invert=True),
        dev(G.tax_ratio),
        dev(lambda c: c.get("realDebtServiceRatio"), invert=True),
        dev(lambda c: (c["localTax"] * 1000 / c["population"]) if c.get("localTax") and c.get("population") else None),
    ]
    p = os.path.join(tmp, "radar.png")
    charts.radar_chart(radar_labels, radar_vals, p)
    chart_files["radar"] = p

    shares = G.industry_shares(t)
    if shares:
        all_shares = [G.industry_shares(c) for c in G.MUNIS]
        all_shares = [s for s in all_shares if s]
        nat_shares = [G.mean([s[i] for s in all_shares]) for i in range(3)]
        p = os.path.join(tmp, "industry.png")
        charts.industry_chart(shares, nat_shares, p)
        chart_files["industry"] = p

    pct_items = []
    def add_pct(label, rows, key, code_, asc=False):
        r, n = (G.rank_asc(rows, key, code_) if asc else G.rank_desc(rows, key, code_))
        if r:
            pct_items.append((label, r / n * 100))
    add_pct("財政力指数", G.MUNIS, lambda c: c.get("financeIndex") or -1, code)
    add_pct("高齢化率", G.MUNIS, lambda c: G.aging_rate(c) or -1, code)
    add_pct("人口増減率(20→25)", G.MUNIS, lambda c: G.pop_change_2020_2025(c) if G.pop_change_2020_2025(c) is not None else -999, code)
    add_pct("医師数/10万人", G.MUNIS, lambda c: G.doctors_per_100k(c) or -1, code)
    if income_rank:
        pct_items.append(("課税所得/納税者", income_rank / len(income_vals) * 100))
    p = os.path.join(tmp, "pct.png")
    charts.percentile_strip(pct_items, p)
    chart_files["pct"] = p

    # ---------- photos / national future / advanced analysis (3次・4次分析)
    photo = None
    _cred = os.path.join(os.path.dirname(__file__), "assets", "credits.json")
    if os.path.exists(_cred):
        import json as _json
        _credits = _json.load(open(_cred, encoding="utf-8"))
        if code in _credits:
            _fp = os.path.join(os.path.dirname(__file__), "assets", _credits[code]["file"])
            if os.path.exists(_fp):
                photo = {"path": _fp, **_credits[code]}

    nat_fut = None
    SC = {}
    if fut:
        rows_f = [G.FUTURE[c["code"]] for c in G.MUNIS if c["code"] in G.FUTURE]
        def _agg(idx):
            P = sum(r["p"][idx] for r in rows_f)
            return {"p": P,
                    "c": sum(r["p"][idx] * r["c"][idx] for r in rows_f) / P,
                    "w": sum(r["p"][idx] * r["w"][idx] for r in rows_f) / P,
                    "e": sum(r["p"][idx] * r["e"][idx] for r in rows_f) / P}
        nat_fut = {"2020": _agg(0), "2050": _agg(6)}
        yrs = [2020, 2025, 2030, 2035, 2040, 2045, 2050]
        def _cross_year(vals, thresh, mode):
            for i in range(1, len(vals)):
                a, b = vals[i - 1], vals[i]
                hit = (b <= thresh) if mode == "below" else (b >= thresh)
                if hit:
                    if b == a:
                        return float(yrs[i])
                    return yrs[i - 1] + (thresh - a) / (b - a) * 5
            return None
        SC["half_year"] = _cross_year(fut["p"], fut["p"][0] / 2, "below")
        SC["elderly50_year"] = _cross_year(fut["e"], 50.0, "above")
        SC["dep2020"] = (fut["c"][0] + fut["e"][0]) / fut["w"][0] * 100
        SC["dep2050"] = (fut["c"][6] + fut["e"][6]) / fut["w"][6] * 100
        SC["old2020"] = fut["e"][0] / fut["w"][0]
        SC["old2050"] = fut["e"][6] / fut["w"][6]
        SC["elderly2020"] = fut["p"][0] * fut["e"][0] / 100
        SC["elderly2050"] = fut["p"][6] * fut["e"][6] / 100
        SC["work2020"] = fut["p"][0] * fut["w"][0] / 100
        SC["work2050"] = fut["p"][6] * fut["w"][6] / 100

        xs, ys = [], []
        for c in G.MUNIS:
            pc = G.pop_change_2020_2025(c)
            if c.get("financeIndex") is not None and pc is not None:
                xs.append(min(c["financeIndex"], 2.0))
                ys.append(max(-45, min(35, pc)))
        p1 = os.path.join(tmp, "scatter1.png")
        charts.scatter_position(
            xs, ys, min(t["financeIndex"] or 0, 2.0),
            max(-45, min(35, pop_change or 0)), name,
            "財政力指数", "人口増減率 2020→2025(%)", p1,
            x_ref=G.avg_of(G.MUNIS, lambda c: c.get("financeIndex")), y_ref=0,
            x_lim=(0, 2.0), y_lim=(-45, 35),
            quad_labels={(1, 1): "好循環型", (0, 1): "成長途上型",
                         (1, 0): "豊かな縮小型", (0, 0): "縮小・調整型"})
        chart_files["scatter1"] = p1

        xs2, ys2 = [], []
        for c in G.MUNIS:
            ar, dc = G.aging_rate(c), G.doctors_per_100k(c)
            if ar is not None and dc is not None:
                xs2.append(ar)
                ys2.append(min(dc, 600))
        p2 = os.path.join(tmp, "scatter2.png")
        charts.scatter_position(
            xs2, ys2, G.aging_rate(t) or 0, min(G.doctors_per_100k(t) or 0, 600), name,
            "高齢化率(%)", "医師数 / 人口10万人", p2,
            x_ref=G.avg_of(G.MUNIS, lambda c: G.aging_rate(c)),
            y_ref=G.avg_of(G.MUNIS, lambda c: G.doctors_per_100k(c)),
            x_lim=(15, 65), y_lim=(0, 600),
            quad_labels={(1, 1): "医療集積型", (0, 1): "都市型",
                         (1, 0): "医療広域連携型", (0, 0): "標準型"})
        chart_files["scatter2"] = p2

        p3 = os.path.join(tmp, "dep.png")
        charts.dependency_chart([
            ("老年人口指数", fut["e"][0] / fut["w"][0] * 100, fut["e"][6] / fut["w"][6] * 100),
            ("従属人口指数", SC["dep2020"], SC["dep2050"]),
        ], p3)
        chart_files["dep"] = p3

    # ---------- trivia prep (おまけ:似ている自治体など)
    twin = None
    try:
        feats = []
        keys = [
            lambda c: G.aging_rate(c),
            lambda c: c.get("financeIndex"),
            lambda c: G.pop_change_2020_2025(c),
            lambda c: G.child_rate(c),
            lambda c: G.vacancy_rate(c),
        ]
        cols = []
        for k in keys:
            vals = [k(c) for c in G.MUNIS]
            ok = [v for v in vals if v is not None]
            m = G.mean(ok)
            sd = (sum((v - m) ** 2 for v in ok) / len(ok)) ** 0.5 or 1
            cols.append((m, sd))
        def zvec(c):
            out = []
            for k, (m, sd) in zip(keys, cols):
                v = k(c)
                out.append(0.0 if v is None else (v - m) / sd)
            return out
        tz = zvec(t)
        best, bestd = None, 1e18
        for c in G.MUNIS:
            if c["code"] == code:
                continue
            cz = zvec(c)
            d = sum((a - b) ** 2 for a, b in zip(tz, cz))
            if d < bestd:
                best, bestd = c, d
        twin = best
    except Exception:
        twin = None

    # ---------- trivia strings (各章に織り込む)
    TRIV = {"profile": [], "population": [], "peers": [], "housing": []}
    pop_now_t = (G.POP25.get(code) or [t["population"]])[0]
    if t.get("area"):
        TRIV["profile"].append(f"面積は東京ドーム約{t['area'] / 0.0468:,.0f}個分({t['area']:,.2f}km²)。")
    pr_, _pn = G.rank_asc(G.MUNIS, lambda c: c.get("population") or 10 ** 9, code)
    if pr_ and pr_ <= 10:
        TRIV["profile"].append(f"人口は全国で{pr_}番目に少ない(少ない順)。日本で最も小さな自治体のひとつである。")
    if fut:
        doc_line = (f"(村に常駐する医師は1人だけ、という計算)"
                    if (t.get("doctorsCount") or 0) <= 2 else "")
        TRIV["population"].append(
            f"「100人の村」にすると:子どもが{fut['c'][0]:.0f}人、現役世代が{fut['w'][0]:.0f}人、高齢者が{fut['e'][0]:.0f}人。"
            f"医師は100人あたり{(t.get('doctorsCount') or 0) / fut['p'][0] * 100:.2f}人{doc_line}。")
    if pop_now_t >= 55000:
        TRIV["population"].append(f"人口{pop_now_t:,}人は、満員の東京ドーム(約55,000人)約{pop_now_t / 55000:.0f}杯分。")
    elif pop_now_t < 1000:
        TRIV["population"].append(f"人口{pop_now_t:,}人は、大型バス(45人乗り)約{max(1, round(pop_now_t / 45))}台で全員が移動できてしまう規模。")
    if twin:
        TRIV["peers"].append(
            f"統計上の「双子」は{twin['name']}(高齢化率{fmt(G.aging_rate(twin), 1)}%、財政力指数{fmt(twin.get('financeIndex'), 2)})。"
            "高齢化率・財政力・人口動態・子ども割合・空き家率の5指標で最も似ている自治体で、施策の先行事例を探すなら、まずこの自治体を調べるのが近道になる。")
    vr_t = G.vacancy_rate(t)
    if vr_t is not None:
        TRIV["housing"].append(
            f"住宅100軒のうち空き家は{vr_t:.0f}軒。数字だけ見ると多く感じるが、別荘などの二次的住宅を含む統計なので、実態は現地でしか分からない。")

    # ---------- document
    story = []
    W = A4[0] - 36 * mm

    def add_trivia(key):
        for ln in TRIV.get(key, []):
            story.append(Paragraph(f"トリビア| {ln}", S["p"]))

    # cover
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph("自治体調査レポート", ParagraphStyle("ct", fontName="Noto", fontSize=13, textColor=GRAY)))
    story.append(Paragraph(f"{pref} {name}", ParagraphStyle("cn", fontName="NotoB", fontSize=40, leading=50, textColor=NAVY_D)))
    story.append(Paragraph("財政・人口・産業・生活基盤の総合診断", ParagraphStyle("cs", fontName="Noto", fontSize=15, textColor=NAVY)))
    if photo:
        story.append(Spacer(1, 6 * mm))
        story.append(Image(photo["path"], width=W, height=W * 0.56))
        story.append(Paragraph(
            f"写真:{photo['subject']}(撮影:{photo['author']}、{photo['license']}、{photo['source']})",
            S["small"]))
    story.append(Spacer(1, 8 * mm))
    score_rows = [
        [Paragraph("財政健全度", S["cellB"]), Paragraph("生活基盤", S["cellB"]),
         Paragraph("子育て世代吸引力", S["cellB"]), Paragraph("高齢者支援体制", S["cellB"])],
        [Paragraph(f"{f_rank:,}位<font size=8> / {fiscal_n:,}団体</font>" if f_rank else "―", S["cell"]),
         Paragraph(f"{l_rank:,}位<font size=8> / {living_n:,}団体</font>" if l_rank else "対象外", S["cell"]),
         Paragraph(f"{y_rank:,}位<font size=8> / {young_n:,}団体</font>" if y_rank else "―", S["cell"]),
         Paragraph(f"{e_rank:,}位<font size=8> / {elderly_n:,}団体</font>" if e_rank else "―", S["cell"])],
    ]
    story.append(tbl(score_rows, [W / 4] * 4, header=False, align_right_from=None))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(
        f"発行日:{TODAY} ／ 発行:全国自治体データランキング(japan-data-site) ／ "
        "本レポートは公的統計をもとに自動生成した調査資料です。データの定義・出典は最終章に記載しています。",
        S["small"]))
    story.append(PageBreak())

    # how to use (用途別ガイド+キーファクト)
    story.append(Paragraph("本レポートの使い方", S["h1"]))
    story.append(Paragraph(
        "本レポートは、会議資料・提案書・記事・計画策定の「下敷き」として、そのまま使える形を目指して構成しています。"
        "時間のない方は、まずキーファクトとエグゼクティブサマリー(次ページ)だけでも全体像がつかめます。", S["p"]))
    story.append(Paragraph("キーファクト(この自治体の要点)", S["h2"]))
    facts = [
        f"財政健全度:全国{f_rank:,}位/{fiscal_n:,}団体、財政力指数{fmt(t.get('financeIndex'), 2)}",
        f"人口:{pop25[0]:,}人(2025年、2020年比{pop_change:+.1f}%)、高齢化率{fmt(G.aging_rate(t), 1)}%",
    ]
    if fut:
        facts.append(f"2050年推計人口:{fut['p'][6]:,}人(2020年比{(fut['p'][6] - fut['p'][0]) / fut['p'][0] * 100:+.0f}%)、高齢化率{fut['e'][6]:.1f}%")
        if SC.get("half_year"):
            facts.append(f"転換点:人口が2020年の半分になるのは{SC['half_year']:.0f}年頃")
        if fut["e"][0] >= 50:
            facts.append("転換点:高齢化率は2020年時点で既に50%を超えている")
        elif SC.get("elderly50_year"):
            facts.append(f"転換点:高齢化率が50%に達するのは{SC['elderly50_year']:.0f}年頃")
    if fur:
        facts.append(f"ふるさと納税受入額:{fmt_yen(fur['amountYen'])}(住民1人あたり約{fur['amountYen'] / t['population']:,.0f}円)")
    for f_ in facts:
        story.append(Paragraph(f"・{f_}", S["p"]))
    story.append(Paragraph("目的別・読むべき章", S["h2"]))
    guide = [[header_para("読み手・目的"), header_para("まず読む章"), header_para("使いどころ")],
             ["自治体職員(議会・委員会対応)", "要約・1・3・12", "自団体の立ち位置を数字で説明する資料の下敷きに"],
             ["首長・幹部(計画策定・EBPM)", "要約・9・11・12", "総合計画や施政方針の現状分析と、将来シナリオの共有に"],
             ["自治体向け営業(B2G)", "要約・3・10", "対象自治体の課題と予算余力を見極め、提案の根拠に"],
             ["企業立地・進出検討", "4・6・9・10", "地価・労働力・市場規模と2050年までの持続可能性の評価に"],
             ["医療・介護・福祉の事業者", "5・9", "高齢者数と医療供給の将来推計による出店・継続判断に"],
             ["ふるさと納税の関係者", "6・7", "受入額の位置づけと、類似団体との差の把握に"],
             ["メディア・研究者", "2・7・8", "特集や研究の一次データと、比較の切り口の発見に"]]
    story.append(tbl(guide, [W * 0.27, W * 0.16, W * 0.57], align_right_from=None))
    story.append(Paragraph("章番号は本レポートの章立てに対応します。数値の定義と出典は付録にまとめています。", S["small"]))
    story.append(PageBreak())

    # executive summary
    story.append(Paragraph("エグゼクティブサマリー", S["h1"]))
    lead = (f"{pref}{name}の財政健全度は全国{fiscal_n:,}団体中{f_rank:,}位。"
            f"人口は2025年国勢調査で{pop25[0]:,}人(2020年比{pop_change:+.1f}%)、高齢化率は{fmt(G.aging_rate(t),1)}%。")
    if fut:
        lead += f"将来推計では2050年に{fut['p'][6]:,}人まで減少し、高齢化率は{fut['e'][6]:.1f}%に達する見通しです。"
    story.append(Paragraph(lead, S["p"]))
    story.append(Paragraph("強み", S["h3"]))
    for s_ in strong:
        story.append(Paragraph(f"・{s_}", S["p"]))
    story.append(Paragraph("注視点", S["h3"]))
    for s_ in watch:
        story.append(Paragraph(f"・{s_}", S["p"]))
    if risk:
        story.append(Paragraph("長期的な課題", S["h3"]))
        for s_ in risk:
            story.append(Paragraph(f"・{s_}", S["p"]))
    story.append(Paragraph("全国ポジション(パーセンタイル)", S["h2"]))
    story.append(cimg(chart_files["pct"], W))
    story.append(Paragraph("各指標について、全国の自治体の中で上位何%に位置するかを示す。左端(0%)が最上位。財政力指数・医師数・課税所得は高いほど、人口増減率は大きいほど上位として計算している。高齢化率は高い順の位置を示すため、右側にあるほど高齢化が進んでいない。", S["small"]))
    story.append(PageBreak())

    # profile
    story.append(Paragraph("1. 基本プロフィール", S["h1"]))
    def prof_row(label, value, key=None, digits=2, unit="", asc=False):
        row = [label, value]
        if key:
            r, n = (G.rank_asc(G.MUNIS, key, code) if asc else G.rank_desc(G.MUNIS, key, code))
            row += [f"{r:,}位 / {n:,}" if r else "―", fmt(avg_rows(G.MUNIS, key), digits, unit)]
        return row
    prof = [[header_para("指標"), header_para("当自治体"), header_para("全国順位"), header_para("全国平均")]]
    prof.append(prof_row("人口(2025年国勢調査)", f"{pop25[0]:,}人" if pop25 else "―", lambda c: (G.POP25.get(c['code']) or [None])[0] or -1))
    prof.append(prof_row("人口増減率 2020→2025(%)", fmt(pop_change, 1), lambda c: G.pop_change_2020_2025(c) if G.pop_change_2020_2025(c) is not None else -999, 1))
    prof.append(prof_row("世帯数", f"{t['households']:,}世帯" if t.get("households") else "―"))
    prof.append(prof_row("面積(km²)", fmt(t.get("area"), 2)))
    prof.append(prof_row("人口密度(人/km²)", fmt(t.get("populationDensity"), 1), lambda c: c.get("populationDensity") or -1, 1))
    prof.append(prof_row("高齢化率(%)", fmt(G.aging_rate(t), 1), lambda c: G.aging_rate(c) or -1, 1))
    prof.append(prof_row("子ども割合(%)", fmt(G.child_rate(t), 1), lambda c: G.child_rate(c) or -1, 1))
    prof.append(prof_row("出生率(合計特殊出生率)", fmt(t.get("birthRate"), 2), lambda c: c.get("birthRate") or -1))
    prof.append(prof_row("昼夜間人口比率(%)", fmt(G.daytime_ratio(t), 1), lambda c: G.daytime_ratio(c) or -1, 1))
    prof.append(prof_row("空き家率(%)", fmt(G.vacancy_rate(t), 1), lambda c: G.vacancy_rate(c) or -1, 1))
    story.append(tbl(prof, [W * 0.34, W * 0.22, W * 0.22, W * 0.22]))
    story.append(Paragraph("人口・世帯は国勢調査(2020年/2025年)、面積は国土地理院、高齢化率等は国勢調査の年齢別人口から算出。出生率は人口動態統計ベース。空き家率は住宅・土地統計調査ベースで、別荘等の二次的住宅を含む。", S["small"]))
    add_trivia("profile")
    story.append(PageBreak())

    # population dynamics
    story.append(Paragraph("2. 人口動態と将来推計", S["h1"]))
    births, deaths = t.get("births"), t.get("deaths")
    nat = (births - deaths) if births is not None and deaths is not None else None
    soc = ((t.get("inMigrants") or 0) - (t.get("outMigrants") or 0)) if t.get("inMigrants") is not None else None
    dyn = [[header_para("項目"), header_para("人数"), header_para("備考")],
           ["出生数", f"{births:,}人" if births is not None else "―", "人口動態統計"],
           ["死亡数", f"{deaths:,}人" if deaths is not None else "―", ""],
           ["自然増減", f"{nat:+,}人" if nat is not None else "―", "出生−死亡"],
           ["転入数", f"{t['inMigrants']:,}人" if t.get("inMigrants") is not None else "―", "住民基本台帳移動報告"],
           ["転出数", f"{t['outMigrants']:,}人" if t.get("outMigrants") is not None else "―", ""],
           ["社会増減", f"{soc:+,}人" if soc is not None else "―", "転入−転出"],
           ["20代の純移動", f"{t['youngAdultNetMigration']:+,}人" if t.get("youngAdultNetMigration") is not None else "―", "若年層の流出入を示す重要指標"]]
    story.append(tbl(dyn, [W * 0.3, W * 0.25, W * 0.45], align_right_from=1))
    if fut:
        story.append(Paragraph("将来推計人口(国立社会保障・人口問題研究所)", S["h2"]))
        story.append(cimg(chart_files["future"], W))
        fut_tbl = [[header_para("年"), header_para("2020"), header_para("2025"), header_para("2030"), header_para("2040"), header_para("2050")],
                   ["推計人口"] + [f"{v:,}人" for v in [fut["p"][0], fut["p"][1], fut["p"][2], fut["p"][4], fut["p"][6]]],
                   ["高齢化率"] + [f"{v:.1f}%" for v in [fut["e"][0], fut["e"][1], fut["e"][2], fut["e"][4], fut["e"][6]]]]
        story.append(tbl(fut_tbl, [W * 0.16] + [W * 0.168] * 5))
        story.append(Paragraph("推計は令和5(2023)年推計。出生・死亡・移動の仮定に基づくもので、政策や開発動向によって実際の人口は変わりうる。", S["small"]))
    add_trivia("population")
    story.append(PageBreak())

    # fiscal
    story.append(Paragraph("3. 財政健全度", S["h1"]))
    story.append(Paragraph(
        f"財政健全度スコアは、財政力指数・経常収支比率・自主財源比率・実質公債費比率を標準化(Zスコア)して統合した本サイト独自の指標。"
        f"{name}のスコアは{fiscal_map.get(code, 0):+.2f}で、全国{fiscal_n:,}団体中{f_rank:,}位に位置する。順位は優劣の判定ではなく、全国の中での立ち位置を示す物差しとして使う。", S["p"]))
    story.append(cimg(chart_files["fiscal"], W))
    story.append(Paragraph("レーダーチャート(偏差値・全国平均=50)", S["h2"]))
    radar_img = Image(chart_files["radar"], width=66 * mm, height=66 * mm)
    expl = Paragraph(
        "5つの財政指標を偏差値化し、全国平均(50)と比較したもの。面積が大きいほど財政の体力が強い。"
        "経常収支比率と実質公債費比率は低いほど健全なため、向きを反転させている。"
        f"地方税1人あたりは{fmt(tax_per_cap, 0)}円(全国平均{fmt(avg_rows(G.MUNIS, lambda c: (c['localTax'] * 1000 / c['population']) if c.get('localTax') and c.get('population') else None), 0)}円)。", S["p"])
    story.append(Table([[radar_img, expl]], colWidths=[74 * mm, W - 74 * mm],
                       style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")])))
    rev = [[header_para("財政規模"), header_para("金額"), header_para("1人あたり")],
           ["歳入総額", f"{t['totalRevenue']:,}千円" if t.get("totalRevenue") else "―",
            f"{t['totalRevenue'] * 1000 / t['population']:,.0f}円" if t.get("totalRevenue") and t.get("population") else "―"],
           ["地方税", f"{t['localTax']:,}千円" if t.get("localTax") is not None else "―",
            f"{tax_per_cap:,.0f}円" if tax_per_cap else "―"],
           ["民生費", f"{t['welfareExpense']:,}千円" if t.get("welfareExpense") is not None else "―", ""],
           ["教育費", f"{t['educationExpense']:,}千円" if t.get("educationExpense") is not None else "―", ""]]
    story.append(tbl(rev, [W * 0.3, W * 0.35, W * 0.35]))
    story.append(Paragraph("財政指標は地方財政状況調査(決算)ベース。金額は千円単位の公表値をそのまま記載している。", S["small"]))
    story.append(PageBreak())

    # economy
    story.append(Paragraph("4. 産業・雇用・所得", S["h1"]))
    if shares:
        story.append(Paragraph("産業別就業者構成", S["h2"]))
        story.append(cimg(chart_files["industry"], W))
    eco = [[header_para("指標"), header_para("当自治体"), header_para("全国平均"), header_para("全国順位")]]
    def eco_row(label, val, key, digits=1, unit="", asc=False):
        r, n = (G.rank_asc(G.MUNIS, key, code) if asc else G.rank_desc(G.MUNIS, key, code))
        return [label, fmt(val, digits, unit), fmt(avg_rows(G.MUNIS, key), digits, unit), f"{r:,}位/{n:,}" if r else "―"]
    eco.append(eco_row("完全失業率(%)", G.unemployment_rate(t), lambda c: G.unemployment_rate(c) or -1, 1))
    eco.append(eco_row("課税対象所得/納税者(千円)", income, lambda c: G.income_per_taxpayer(c["code"]) or -1, 0))
    eco.append(eco_row("労働力率(%)", (t["laborForceCount"] / t["population"] * 100) if t.get("laborForceCount") and t.get("population") else None,
                       lambda c: (c["laborForceCount"] / c["population"] * 100) if c.get("laborForceCount") and c.get("population") else -1, 1))
    story.append(tbl(eco, [W * 0.34, W * 0.2, W * 0.2, W * 0.26]))
    if corp:
        story.append(Paragraph(
            f"法人登記ベースの事業所動向:新規設立{corp['newCount']:,}件・廃止{corp['closeCount']:,}件・純増減{corp['netGrowth']:+,}件。"
            "経済の新陳代謝を示す指標で、純増が続く地域は起業・進出の勢いがある。", S["p"]))
    story.append(PageBreak())

    # livability
    story.append(Paragraph("5. 医療・福祉・子育て・生活基盤", S["h1"]))
    story.append(Paragraph(
        f"生活基盤充実度は全国{f'{l_rank:,}位' if l_rank else '対象外'}、子育て世代吸引力は全国{f'{y_rank:,}位' if y_rank else '対象外'}、高齢者支援体制は全国{f'{e_rank:,}位' if e_rank else '対象外'}。"
        "いずれも本サイトの複合スコア(算出方法は付録)。単一指標ではなく、関連指標を束ねて地域の特徴を測っている。順位が下位の分野は「劣っている」ではなく、その地域の苦手分野・伸びしろとして読んでほしい。", S["p"]))
    liv = [[header_para("指標"), header_para("当自治体"), header_para("全国平均"), header_para("全国順位")]]
    liv.append(eco_row("医師数/人口10万人", G.doctors_per_100k(t), lambda c: G.doctors_per_100k(c) or -1, 0))
    liv.append(eco_row("歯科医師数/人口10万人", (t["dentistsCount"] / t["population"] * 100000) if t.get("dentistsCount") is not None and t.get("population") else None,
                       lambda c: (c["dentistsCount"] / c["population"] * 100000) if c.get("dentistsCount") is not None and c.get("population") else -1, 0))
    liv.append(eco_row("病院・診療所数", (t.get("hospitalCount") or 0) + (t.get("clinicCount") or 0), lambda c: (c.get("hospitalCount") or 0) + (c.get("clinicCount") or 0), 0))
    liv.append(eco_row("保育所等(園)", t.get("daycareCount"), lambda c: c.get("daycareCount") or -1, 0))
    liv.append(eco_row("小学校(校)", t.get("elementarySchoolCount"), lambda c: c.get("elementarySchoolCount") or -1, 0))
    liv.append(eco_row("図書館(館)", t.get("libraryCount"), lambda c: c.get("libraryCount") or -1, 0))
    liv.append(eco_row("小売店・飲食店/千人", ((t["retailStoreCount"] + t["restaurantCount"]) / t["population"] * 1000) if t.get("retailStoreCount") is not None and t.get("restaurantCount") is not None and t.get("population") else None,
                       lambda c: ((c["retailStoreCount"] + c["restaurantCount"]) / c["population"] * 1000) if c.get("retailStoreCount") is not None and c.get("restaurantCount") is not None and c.get("population") else -1, 1))
    story.append(tbl(liv, [W * 0.34, W * 0.2, W * 0.2, W * 0.26]))
    story.append(Paragraph("施設数は社会・人口統計体系等の公的統計ベース。人口あたりで見る場合は各自治体ページのランキングも参照のこと。", S["small"]))
    story.append(PageBreak())

    # housing & furusato
    story.append(Paragraph("6. 住宅・地価・ふるさと納税", S["h1"]))
    hou = [[header_para("指標"), header_para("当自治体"), header_para("全国平均"), header_para("全国順位")]]
    hou.append(eco_row("空き家率(%)", G.vacancy_rate(t), lambda c: G.vacancy_rate(c) or -1, 1))
    if price and price.get("landPricePerSqm"):
        hou.append(eco_row("地価(円/m²・取引平均)", price["landPricePerSqm"], lambda c: (G.PRICES.get(c["code"]) or {}).get("landPricePerSqm") or -1, 0))
    if price and price.get("condoPricePerSqm"):
        hou.append(eco_row("マンション価格(円/m²)", price["condoPricePerSqm"], lambda c: (G.PRICES.get(c["code"]) or {}).get("condoPricePerSqm") or -1, 0))
    hou.append(eco_row("リサイクル率(%)", t.get("recyclingRate"), lambda c: c.get("recyclingRate") or -1, 1))
    story.append(tbl(hou, [W * 0.34, W * 0.2, W * 0.2, W * 0.26]))
    if fur:
        per = fur["amountYen"] / t["population"] if t.get("population") else None
        story.append(Paragraph(
            f"ふるさと納税の受入額は{fmt_yen(fur['amountYen'])}({fur['count']:,}件、令和7年度・総務省現況調査)。"
            f"住民1人あたりでは約{per:,.0f}円となり、地域産品のブランド力と寄付者への訴求力を示す。"
            "受入額は自治体の自主財源に準じる収入であり、財政力指数には直接含まれない点に注意。", S["p"]))
    add_trivia("housing")
    story.append(PageBreak())

    # peers
    story.append(Paragraph("7. 類似自治体ベンチマーク", S["h1"]))
    story.append(Paragraph("人口規模が近い全国10自治体と主要指標を比較する。規模の近い団体同士の比較は、都道府県平均や全国平均では見えない「同規模の中での位置」を明らかにする。", S["p"]))
    peers = G.peers_of(t, 10)
    peer_rows = [[header_para("自治体"), header_para("人口"), header_para("財政力指数"), header_para("高齢化率"), header_para("人口増減率")]]
    allp = sorted(peers + [t], key=lambda c: -c["population"])
    for c in allp:
        mark = "▶ " if c["code"] == code else ""
        peer_rows.append([mark + c["name"],
                          f"{(G.POP25.get(c['code']) or [c['population']])[0]:,}人",
                          fmt(c.get("financeIndex"), 2),
                          fmt(G.aging_rate(c), 1, "%"),
                          fmt(G.pop_change_2020_2025(c), 1, "%", )])
    story.append(tbl(peer_rows, [W * 0.3, W * 0.18, W * 0.16, W * 0.16, W * 0.2]))
    story.append(Paragraph("▶が本レポートの対象自治体。類似団体の選定は人口(2020年国勢調査)の対数距離による。", S["small"]))
    add_trivia("peers")
    story.append(PageBreak())

    # ---- 8. positioning (3次分析:2指標の掛け合わせによる類型化)
    story.append(Paragraph("8. 多角分析①:2指標の掛け合わせによる位置づけ", S["h1"]))
    story.append(Paragraph(
        "単一指標の順位だけでは、自治体の「型」は分からない。ここでは2つの指標を掛け合わせ、"
        "全自治体の分布の中で対象自治体がどの類型に属するかを示す(3次分析)。", S["p"]))
    if "scatter1" in chart_files:
        story.append(Paragraph("財政力×人口動態", S["h2"]))
        story.append(cimg(chart_files["scatter1"], W))
        fi_t = t.get("financeIndex") or 0
        fi_avg = G.avg_of(G.MUNIS, lambda c: c.get("financeIndex")) or 0
        growing = (pop_change or 0) >= 0
        if fi_t >= fi_avg and growing:
            quad1 = "好循環型"
            quad1_txt = "財政力と人口維持を両立している数少ない類型。税収基盤が人口を支え、人口が税収を支える循環が成立している。"
        elif fi_t >= fi_avg and not growing:
            quad1 = "豊かな縮小型"
            quad1_txt = "財政力は高いが人口は減っている。現在の豊かさが特定の税源に依存していないか、その税源が将来も続くかが最大の論点になる。"
        elif fi_t < fi_avg and growing:
            quad1 = "成長途上型"
            quad1_txt = "人口は増えているが財政力はまだ平均以下。増加した人口が税収に結びつくまでには時間差があり、子育て・教育支出が先行する局面。"
        else:
            quad1 = "縮小・調整型"
            quad1_txt = "財政力と人口の両面で調整が要る、日本で最も多い類型。広域連携と選択と集中が前提になる。"
        story.append(Paragraph(f"{name}は「{quad1}」に位置する。{quad1_txt}", S["p"]))
    if "scatter2" in chart_files:
        story.append(Paragraph("高齢化×医療供給", S["h2"]))
        story.append(cimg(chart_files["scatter2"], W))
        ar_t = G.aging_rate(t) or 0
        dc_t = G.doctors_per_100k(t) or 0
        ar_avg = G.avg_of(G.MUNIS, lambda c: G.aging_rate(c)) or 0
        dc_avg = G.avg_of(G.MUNIS, lambda c: G.doctors_per_100k(c)) or 0
        if ar_t >= ar_avg and dc_t >= dc_avg:
            quad2_txt = "高齢化が進んでいるが医療供給も厚い「医療集積型」。拠点病院が周辺自治体の需要も吸収している可能性が高い。"
        elif ar_t >= ar_avg and dc_t < dc_avg:
            quad2_txt = "高齢化が進む一方で、医療供給は地域内に限られる「医療広域連携型」。近隣都市との医療連携が鍵になる類型。"
        elif ar_t < ar_avg and dc_t >= dc_avg:
            quad2_txt = "高齢化が緩やかで医療供給が厚い「都市型」。医療は地域の雇用と流入の基盤にもなっている。"
        else:
            quad2_txt = "高齢化・医療供給とも平均前後の「標準型」。今後の高齢化の進み方次第で、医療広域連携型へ移行しないかが焦点。"
        story.append(Paragraph(f"高齢化率{ar_t:.1f}%・医師数{dc_t:.0f}人/10万人で、{name}は{quad2_txt}", S["p"]))
    story.append(PageBreak())

    # ---- 9. 2050 scenario (4次分析:推計×財政・医療の試算)
    story.append(Paragraph("9. 多角分析②:2050年シナリオ試算", S["h1"]))
    if fut and SC:
        story.append(Paragraph(
            "将来推計に財政・医療の数字を掛け合わせ、「このまま推移したら何が起きるか」を試算する(4次分析)。"
            "推計そのものではなく、推計から導かれる負荷の変化こそが、計画と投資の判断材料になる。", S["p"]))
        story.append(cimg(chart_files["dep"], W))
        story.append(Paragraph("老年人口指数=高齢者÷生産年齢人口×100、従属人口指数=(年少+老年)÷生産年齢人口×100。", S["small"]))
        doc_n = t.get("doctorsCount") or 0
        eld_per_doc_2020 = (SC["elderly2020"] / doc_n) if doc_n else None
        eld_per_doc_2050 = (SC["elderly2050"] / doc_n) if doc_n else None
        rev_pc_2020 = (t["totalRevenue"] * 1000 / fut["p"][0]) if t.get("totalRevenue") else None
        rev_pc_2050 = (t["totalRevenue"] * 1000 / fut["p"][6]) if t.get("totalRevenue") else None
        scen = [[header_para("試算項目"), header_para("2020年"), header_para("2050年"), header_para("変化")],
                [Paragraph("生産年齢人口1人あたり高齢者数", S["cell"]), f"{SC['old2020']:.2f}人", f"{SC['old2050']:.2f}人", f"{SC['old2050'] / SC['old2020']:.1f}倍"],
                [Paragraph("従属人口指数(全国)", S["cell"]), f"{SC['dep2020']:.0f}({(nat_fut['2020']['c'] + nat_fut['2020']['e']) / nat_fut['2020']['w'] * 100:.0f})",
                 f"{SC['dep2050']:.0f}({(nat_fut['2050']['c'] + nat_fut['2050']['e']) / nat_fut['2050']['w'] * 100:.0f})", ""],
                [Paragraph("高齢者数", S["cell"]), f"{SC['elderly2020']:,.0f}人", f"{SC['elderly2050']:,.0f}人", f"{(SC['elderly2050'] - SC['elderly2020']) / SC['elderly2020'] * 100:+.0f}%"],
                [Paragraph("生産年齢人口", S["cell"]), f"{SC['work2020']:,.0f}人", f"{SC['work2050']:,.0f}人", f"{(SC['work2050'] - SC['work2020']) / SC['work2020'] * 100:+.0f}%"]]
        if eld_per_doc_2020:
            scen.append([Paragraph("医師1人あたり高齢者数(医師数一定と仮定)", S["cell"]), f"{eld_per_doc_2020:.0f}人", f"{eld_per_doc_2050:.0f}人", f"{eld_per_doc_2050 / eld_per_doc_2020:.1f}倍"])
        if rev_pc_2020:
            scen.append([Paragraph("住民1人あたり歳入(歳入総額を維持した場合)", S["cell"]), f"{rev_pc_2020:,.0f}円", f"{rev_pc_2050:,.0f}円", f"{rev_pc_2050 / rev_pc_2020:.1f}倍"])
        story.append(tbl(scen, [W * 0.4, W * 0.2, W * 0.2, W * 0.2]))
        tp_lines = []
        if SC.get("half_year"):
            tp_lines.append(f"人口が2020年の半分({fut['p'][0] // 2:,}人)になるのは{SC['half_year']:.0f}年頃")
        else:
            tp_lines.append("人口は2050年時点でも2020年の半分を下回らない")
        if fut["e"][0] >= 50:
            tp_lines.append("高齢化率は2020年時点で既に50%を超えている")
        elif SC.get("elderly50_year"):
            tp_lines.append(f"高齢化率が50%に達するのは{SC['elderly50_year']:.0f}年頃")
        else:
            tp_lines.append("高齢化率は2050年でも50%に到達しない")
        story.append(Paragraph("転換点:" + " ／ ".join(tp_lines) + "。転換点は、施設の統廃合やサービス水準の見直しを「いつまでに決めるか」の目安になる。", S["p"]))
        story.append(Paragraph("試算の前提:人口・年齢構成は社人研推計、医師数と歳入総額は直近公表値を据え置いた単純試算であり、政策対応や経済動向は織り込んでいない。負荷の方向と大きさを読むための材料として使うこと。", S["small"]))
    story.append(PageBreak())

    # ---- 10. business indicators
    story.append(Paragraph("10. ビジネス判断のための指標", S["h1"]))
    story.append(Paragraph(
        "立地・出店・営業の判断に使う数字を集めた。自治体の「規模」と「将来の担い手」を金額と人数で把握するための章で、"
        "市場規模の推定には課税対象所得の総額(住民の所得の合計)を用いている。", S["p"]))
    inc_row = (G.INCOME.get("values") or {}).get(code) or {}
    biz = [[header_para("指標"), header_para("数値"), header_para("読み方")]]
    if inc_row.get("ti"):
        biz.append(["域内所得総額(課税対象所得の合計)", f"約{inc_row['ti'] / 100000:,.0f}億円",
                    "消費・サービス市場の土台の大きさ。1人あたり所得とあわせて見る"])
    if fut:
        biz.append(["生産年齢人口(2020年→2050年推計)", f"{SC['work2020']:,.0f}人 → {SC['work2050']:,.0f}人",
                    "雇用できる人数の天井。2050年まで保てるかが立地の持続性を左右する"])
    if t.get("daytimePopulation"):
        biz.append(["昼間人口(通勤・通学の流入先規模)", f"{t['daytimePopulation']:,}人",
                    "昼間人口が夜間人口を上回る自治体は、周辺から人を集める拠点性を持つ"])
    if price and price.get("landPricePerSqm"):
        biz.append(["地価(取引平均)", f"{price['landPricePerSqm']:,}円/m²",
                    "用地コストの水準。同規模自治体との比較は7章・付録の順位を参照"])
    if corp:
        biz.append(["事業所の新設・廃止(法人登記)", f"新設{corp['newCount']:,}件 / 廃止{corp['closeCount']:,}件",
                    "経済の新陳代謝。新設が廃止を上回る地域は起業・進出の勢いがある"])
    if t.get("totalRevenue") and t.get("financeIndex") is not None:
        biz.append(["自治体の予算規模(歳入総額)", f"{t['totalRevenue'] / 100000:,.0f}億円",
                    "B2G営業では市場規模そのもの。財政力指数とあわせて支払い余力を読む"])
    story.append(tbl(biz, [W * 0.3, W * 0.26, W * 0.44], align_right_from=None))
    story.append(Paragraph("これらの指標は入口のスクリーニングに使うもの。実際の立地・出店判断では、電力・通信・交通などのインフラ条件と現地確認が別途必要になる。", S["small"]))
    story.append(PageBreak())

    # ---- 11. considerations (考察)
    story.append(Paragraph("11. 考察:数字の先にある構造", S["h1"]))
    cons = []
    fi_t = t.get("financeIndex")
    rds_t = t.get("realDebtServiceRatio")
    if fi_t is not None and fut:
        cons.append(("財政の持続可能性",
                     f"財政力指数{fi_t:.2f}という現在の立ち位置は、2050年に人口が{fut['p'][6]:,}人になる未来とセットで評価すべきである。"
                     f"歳入総額を現在水準で維持できても、住民1人あたりに換算した行政コストは構造的に上昇し続ける。"
                     + (f"実質公債費比率{rds_t:.1f}%は借入余力の現在地を示しており、大型投資の判断は「今の余力」ではなく「返済期間中の人口」で測る必要がある。" if rds_t is not None else "")))
    if fut and SC:
        cons.append(("人口構造の転換",
                     f"生産年齢人口1人あたりの高齢者数は、2020年の{SC['old2020']:.2f}人から2050年には{SC['old2050']:.2f}人になる。"
                     "これは「支える側の負担」の問題であると同時に、医療・介護・生活支援という需要そのものが地域内で拡大し続けることも意味する。"
                     "人口減少を一律に悪と捉えるのではなく、需要の質が「モノの消費」から「人の支援」へ移る転換として読むことが重要である。"))
    shares_t = G.industry_shares(t)
    if shares_t:
        dom = max(shares_t)
        dom_label = ["第1次産業", "第2次産業", "第3次産業"][shares_t.index(dom)]
        cons.append(("産業構造の含意",
                     f"就業者の最大セクターは{dom_label}で構成比{dom:.0f}%。"
                     + ("一極集中の度合いが高く、その産業の浮沈が地域経済全体に直結する構造である。強みであると同時に、分散の効かないリスクでもある。" if dom >= 60 else "産業構成は比較的分散しており、単一産業の変動が地域全体に直結しにくい構造である。")
                     + (f"法人登記では新設{corp['newCount']:,}件・廃止{corp['closeCount']:,}件と、入れ替わり自体は起きている。この新陳代謝をどう育てるかが、産業政策の実質的な中身になる。" if corp else "")))
    dc_t = G.doctors_per_100k(t)
    if dc_t is not None and fut:
        cons.append(("生活基盤と広域連携",
                     f"医師数は人口10万人あたり{dc_t:.0f}人で、2050年の高齢者数を現在の医師数で割ると1人あたり{SC['elderly2050'] / (t.get('doctorsCount') or 1):.0f}人を抱える計算になる。"
                     "医療・介護・買い物といった生活基盤を単独自治体で完結させる発想は、人口規模の小さい自治体ほど成立しにくい。"
                     "近隣自治体との役割分担を前提に、自団体が「何を担い、何を委ねるか」を決めることが、今後の地域運営の中心課題になる。"))
    for ttl, txt in cons:
        story.append(Paragraph(ttl, S["h2"]))
        story.append(Paragraph(txt, S["p"]))
    story.append(Paragraph("本章は、本レポートのデータと公的統計の範囲内で導ける考察であり、現地の固有事情(個別施設の計画、地元企業の動向等)は含んでいない。", S["small"]))
    story.append(PageBreak())

    # diagnosis & outlook
    story.append(Paragraph("12. 診断と展望", S["h1"]))
    story.append(Paragraph("強み", S["h2"]))
    for s_ in strong:
        story.append(Paragraph(f"・{s_}", S["p"]))
    story.append(Paragraph("注視点", S["h2"]))
    for s_ in watch:
        story.append(Paragraph(f"・{s_}", S["p"]))
    if risk:
        story.append(Paragraph("長期的な課題", S["h2"]))
        for s_ in risk:
            story.append(Paragraph(f"・{s_}", S["p"]))
    story.append(Paragraph("本診断は、公的統計の指標と閾値に基づくルールベースの自動診断です。個別の政策判断にあたっては、現地の事情とあわせてご検討ください。", S["small"]))
    story.append(PageBreak())

    # appendix
    story.append(Paragraph("付録:指標の定義・算出方法・出典", S["h1"]))
    story.append(Paragraph(
        "財政健全度スコア:財政力指数・経常収支比率・自主財源比率(地方税÷歳入総額)・実質公債費比率を、財政指標が揃う全国"
        f"{fiscal_n:,}団体で標準化(Zスコア)し、「財政力＋自主財源−経常収支−公債費」で統合した。本レポートでは順位を優劣の判定には使わず、全国の中での立ち位置を示す物差しとして扱う。"
        "生活基盤充実度:商業集積(小売店+飲食店/千人)・公民館数/万人・空き家率(逆)を標準化して統合。"
        "子育て世代吸引力:保育所定員/子ども千人・20代純移動率・婚姻率を標準化して統合。"
        "高齢者支援体制:医師数/10万人・老人ホーム数/高齢者千人・単身世帯比率(逆)を標準化して統合。", S["p"]))
    story.append(Paragraph(
        "出典:総務省統計局「国勢調査」(2020年・2025年)、総務省「地方財政状況調査」「市町村税課税状況等の調」「ふるさと納税に関する現況調査」、"
        "国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5年推計)」、国土交通省「不動産情報ライブラリ」、厚生労働省「人口動態統計」ほか。"
        "数値は公表時点のもので、出典元の訂正等により変わる場合がある。", S["p"]))
    story.append(Paragraph(
        "免責:本レポートは公的統計の二次分析であり、特定の自治体の政策・財政運営に対する公式の評価ではありません。"
        "投資・移住・進出等の判断は、必ず一次情報と現地確認をあわせて行ってください。"
        f"発行:全国自治体データランキング(https://japan-data-site.vercel.app) ／ 発行日:{TODAY} ／ 本レポートの無断転載・再配布はご遠慮ください。", S["p"]))
    if photo:
        story.append(Paragraph(
            f"表紙写真:{photo['subject']}、撮影:{photo['author']}、ライセンス:{photo['license']}、出典:{photo['source']}。"
            "写真はWikimedia Commonsで公開されている実写真を使用し、ライセンス条件に従ってクレジットを記載している。", S["p"]))

    # ---------- doc template with footer
    def footer(canvas, doc):
        canvas.saveState()
        if doc.page > 1:
            canvas.setFont("Noto", 7.5)
            canvas.setFillColor(GRAY)
            canvas.drawString(18 * mm, 12 * mm, f"全国自治体データランキング 自治体調査レポート|{pref} {name}")
            canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, f"{doc.page}")
            canvas.setStrokeColor(LINE)
            canvas.line(18 * mm, 15 * mm, A4[0] - 18 * mm, 15 * mm)
        canvas.restoreState()

    def cover_bg(canvas, doc):
        if doc.page == 1:
            canvas.saveState()
            canvas.setFillColor(NAVY_D)
            canvas.rect(0, A4[1] - 38 * mm, A4[0], 38 * mm, stroke=0, fill=1)
            canvas.setFillColor(ORANGE)
            canvas.rect(0, A4[1] - 40 * mm, A4[0], 2 * mm, stroke=0, fill=1)
            canvas.setFillColor(colors.white)
            canvas.setFont("NotoB", 11)
            canvas.drawString(18 * mm, A4[1] - 22 * mm, "全国自治体データランキング")
            canvas.setFont("Noto", 9)
            canvas.drawString(18 * mm, A4[1] - 29 * mm, "MUNICIPAL RESEARCH REPORT")
            canvas.restoreState()
        footer(canvas, doc)

    doc = BaseDocTemplate(out_path, pagesize=A4,
                          leftMargin=18 * mm, rightMargin=18 * mm,
                          topMargin=16 * mm, bottomMargin=18 * mm,
                          title=f"自治体調査レポート {pref}{name}",
                          author="全国自治体データランキング")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=cover_bg)])
    doc.build(story)
    return out_path

SLUGS = {
    "01403": "tomari-mura_fiscal-health-report_sample",
    "01209": "yubari-shi_fiscal-health-report_sample",
    "14100": "yokohama-shi_municipal-report_sample",
    "08220": "tsukuba-shi_municipal-report_sample",
    "13402": "aogashima-mura_municipal-report_sample",
}

if __name__ == "__main__":
    code = sys.argv[1]
    slug = SLUGS.get(code, f"{code}_municipal-report_sample")
    _base = os.path.join(os.path.dirname(__file__), "..", "..")
    out = os.path.join(_base, "public", "reports", f"{slug}.pdf")
    build(code, out)
    print("wrote", out)
