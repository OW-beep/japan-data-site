#!/usr/bin/env python3
"""
国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5(2023)年推計)」のExcelを、
サイト用のJSON(data/future-population.json)に変換する。

入力(研究所のページ「2. 都道府県・市区町村別の総人口、年齢3区分別人口および割合」からダウンロード):
  kekkahyo1.xlsx   結果表1   総人口および指数
  kekkahyo3_1.xlsx 結果表3-1 年齢別人口割合 0〜14歳
  kekkahyo3_2.xlsx 結果表3-2 年齢別人口割合 15〜64歳
  kekkahyo3_3.xlsx 結果表3-3 年齢別人口割合 65歳以上
  kekkahyo3_4.xlsx 結果表3-4 年齢別人口割合 75歳以上

使い方:
  python3 scripts/build_future_population.py [Excelを置いたフォルダ(省略時は data/ipss)]

出力:
  data/future-population.json
    values[5桁コード] = { n: 名前, k: 市などの別, p: 総人口[2020..2050の7点], c: 0〜14歳の割合,
                         w: 15〜64歳の割合, e: 65歳以上の割合, o: 75歳以上の割合 }
    ※ 割合は%。年は 2020, 2025, 2030, 2035, 2040, 2045, 2050 の順。

注意:
  ・推計の基準は令和2(2020)年の国勢調査。2025年以降は「推計」であり、実績ではない。
  ・福島県「浜通り地域」の13市町村は個別の推計がなく、コード 07999 の1行にまとめられている。
  ・東京23区は区ごとの行(コード13101〜13123)。サイトの「特別区部(13100)」は、ここで合算して作る。
"""
import json
import os
import sys
from datetime import date

import pandas as pd

YEARS = [2020, 2025, 2030, 2035, 2040, 2045, 2050]
SRC = sys.argv[1] if len(sys.argv) > 1 else "data/ipss"
OUT = "data/future-population.json"


def read(name: str, ncols_value: int, first_col: int = 4) -> pd.DataFrame:
    df = pd.read_excel(os.path.join(SRC, name), header=None)
    d = df.iloc[5:].copy()
    d = d[d[0].notna()]
    d["code"] = d[0].map(lambda v: str(int(v)).zfill(5))
    d["kind"] = d[1].astype(str)
    d["pref"] = d[2].fillna("").astype(str)
    d["name"] = d[3].fillna("").astype(str)
    vals = d.iloc[:, first_col : first_col + ncols_value].astype(float)
    vals.columns = YEARS
    out = pd.concat([d[["code", "kind", "pref", "name"]].reset_index(drop=True), vals.reset_index(drop=True)], axis=1)
    return out.set_index("code")


pop = read("kekkahyo1.xlsx", 7)
child = read("kekkahyo3_1.xlsx", 7)
work = read("kekkahyo3_2.xlsx", 7)
eld = read("kekkahyo3_3.xlsx", 7)
old = read("kekkahyo3_4.xlsx", 7)

# ── 整合性の検査 ──
assert pop.index.is_unique, "コードが重複している"
for nm, t in [("0-14", child), ("15-64", work), ("65+", eld), ("75+", old)]:
    assert list(t.index) == list(pop.index), f"{nm} の行の並びが総人口表と一致しない"
tot = child[YEARS] + work[YEARS] + eld[YEARS]
err = (tot - 100).abs().max().max()
print(f"3区分の割合の合計と100の最大差: {err:.4f}")
assert err < 0.01, "年齢3区分の割合の合計が100にならない"
assert (old[YEARS] <= eld[YEARS] + 1e-9).all().all(), "75歳以上の割合が65歳以上を超えている"

values = {}
for code, r in pop.iterrows():
    values[code] = {
        "n": (r["pref"] + " " + r["name"]) if r["name"] != "" else r["pref"],
        "k": r["kind"],
        "p": [int(round(r[y])) for y in YEARS],
        "c": [round(float(child.loc[code, y]), 2) for y in YEARS],
        "w": [round(float(work.loc[code, y]), 2) for y in YEARS],
        "e": [round(float(eld.loc[code, y]), 2) for y in YEARS],
        "o": [round(float(old.loc[code, y]), 2) for y in YEARS],
    }

# 東京23区の合算(特別区部 13100)。割合は人口で重みづけして、年齢別人口を足してから割る。
wards = [c for c in values if c.startswith("131") and values[c]["k"] == "0" and "13101" <= c <= "13123"]
if len(wards) == 23:
    agg = {"n": "東京都 特別区部", "k": "0", "p": [], "c": [], "w": [], "e": [], "o": []}
    for i in range(len(YEARS)):
        tp = sum(values[c]["p"][i] for c in wards)
        agg["p"].append(tp)
        for key in ["c", "w", "e", "o"]:
            agg[key].append(round(sum(values[c]["p"][i] * values[c][key][i] for c in wards) / tp, 2))
    values["13100"] = agg
    print("東京23区を合算して 13100 を作成")

meta = {
    "source": "国立社会保障・人口問題研究所『日本の地域別将来推計人口(令和5(2023)年推計)』結果表1・3-1〜3-4",
    "url": "https://www.ipss.go.jp/pp-shicyoson/j/shicyoson23/t-page.asp",
    "baseYear": 2020,
    "years": YEARS,
    "assumption": "出生中位・死亡中位",
    "rows": len(values),
    "builtAt": date.today().isoformat(),
    "kinds": "a=都道府県, 0=政令市の区(東京23区を含む), 1=政令市, 2=その他の市, 3=町村, 9=浜通り地域",
}
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({"meta": meta, "values": values}, f, ensure_ascii=False, separators=(",", ":"))
print(f"{len(values)} 行を {OUT} に保存({os.path.getsize(OUT)/1024:.0f} KB)")

# ── サイトの自治体コードとの突き合わせ ──
try:
    cities = json.load(open("data/cities.json", encoding="utf-8"))
    site = [c["code"] for c in cities]
    hit = [c for c in site if c in values]
    miss = [c for c in site if c not in values]
    print(f"サイトの自治体 {len(site)} 件のうち、推計あり {len(hit)} 件({len(hit)/len(site)*100:.1f}%)、なし {len(miss)} 件")
    names = {c["code"]: c["name"] for c in cities}
    print("推計がないサイト側の自治体(先頭30件):", [names[c] for c in miss[:30]])
except FileNotFoundError:
    pass
