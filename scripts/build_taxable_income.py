#!/usr/bin/env python3
"""
総務省「市町村税課税状況等の調」(令和7年度)のExcelを、サイト用のJSON(data/taxable-income-r7.json)に変換する。

入力(総務省「地方税に関する統計等」の「市町村税課税状況等の調」からダウンロード):
  J51-25-b.xlsx  第11表 課税標準額段階別令和7年度分所得割額等に関する調(合計)
                 → 所得割の納税義務者数、課税対象所得(ア〜キの計)など
  J51-25-a.xlsx  第2表 令和7年度個人の市町村民税の納税義務者等に関する調
                 → 所得者区分(給与・営業等・農業・その他)別の納税義務者数
  J51-25-c.xlsx  第21表 令和7年度軽自動車税に関する調(賦課期日現在台数・課税台数)
                 → 軽四輪乗用(自家用)の台数

使い方:
  python3 scripts/build_taxable_income.py [Excelを置いたフォルダ(省略時は data/soumu)]

出力 data/taxable-income-r7.json:
  values[5桁コード] = {
    n: 名前, tp: 所得割の納税義務者数(人), ti: 課税対象所得(千円), st: 株式等の所得(千円: 一般株式等譲渡+上場株式等譲渡+上場株式等配当),
    sal: 給与所得者の納税義務者数, biz: 営業等所得者, farm: 農業所得者, oth: その他の所得者, hse: 家屋敷等のみ, all: 計(均等割を納める者の合計),
    kei: 軽自動車(四輪・乗用・自家用)の台数(賦課期日現在)
  }

注意:
  ・令和7年度の課税は、令和6年中の所得にもとづく。住民税は、1月1日の住所の市町村で課税される(勤務地ではなく住所地)。
  ・団体コードは6桁(最後の1桁は検査数字)。サイトの5桁コードとは、先頭5桁で突き合わせる。
  ・政令指定都市は市全体で集計されている(区別の値はない)。東京23区は区ごと。
"""
import json
import os
import re
import sys
from datetime import date

import pandas as pd

SRC = sys.argv[1] if len(sys.argv) > 1 else "data/soumu"
OUT = "data/taxable-income-r7.json"


def code5(v) -> str:
    return str(int(float(v))).zfill(6)[:5]


# ── 第11表: 課税対象所得 ──
b = pd.read_excel(os.path.join(SRC, "J51-25-b.xlsx"), header=None).iloc[4:]
b = b[b[4] == "市町村民税"]
vals = {}
for _, r in b.iterrows():
    c = code5(r[1])
    vals[c] = {
        "n": f"{r[2]} {r[3]}",
        "tp": int(r[5]),
        "ti": int(r[13]),
        "st": int(r[9]) + int(r[10]) + int(r[11]),
    }

# ── 第2表: 所得者区分別の納税義務者数(合計_均等割を納める者_納税義務者数) ──
a = pd.read_excel(os.path.join(SRC, "J51-25-a.xlsx"), sheet_name=0, header=None).iloc[4:]
cat = {"給与所得者": "sal", "営業等所得者": "biz", "農業所得者": "farm", "その他の所得者": "oth", "家屋敷等のみ": "hse", "計": "all"}
for _, r in a.iterrows():
    k = cat.get(str(r[4]).strip())
    if k is None:
        continue
    c = code5(r[1])
    if c in vals:
        vals[c][k] = int(r[5])

# ── 第21表: 軽自動車(四輪・乗用・自家用)の台数。「(新税率適用分)」などの内訳行は除く ──
cc = pd.read_excel(os.path.join(SRC, "J51-25-c.xlsx"), header=None).iloc[2:]
target = "軽自動車及び小型特殊自動車・一般・四輪車・乗用・自家用"
cc = cc[cc[4].astype(str).str.replace(r"\s", "", regex=True) == target]
for _, r in cc.iterrows():
    c = code5(r[1])
    if c in vals:
        vals[c]["kei"] = int(r[5])

# ── 整合性の検査 ──
n = len(vals)
miss = {k: sum(1 for v in vals.values() if k not in v) for k in ["tp", "ti", "st", "sal", "biz", "farm", "oth", "hse", "all", "kei"]}
print(f"{n} 団体。欠けている項目: {miss}")
bad_sum = [c for c, v in vals.items() if "all" in v and v["all"] > 0 and abs(v["sal"] + v["biz"] + v["farm"] + v["oth"] + v["hse"] - v["all"]) > 2]
print(f"所得者区分(家屋敷等のみを含む)の合計が『計』とずれる団体: {len(bad_sum)}")
assert not bad_sum, "所得者区分の合計が計と一致しない"
per = {c: v["ti"] / v["tp"] for c, v in vals.items() if v["tp"] > 0}  # 千円/人
srt = sorted(per.items(), key=lambda x: -x[1])
print("納税義務者1人あたり課税対象所得 上位5:", [(vals[c]["n"], round(x / 10, 1)) for c, x in srt[:5]], "万円")
print("下位5:", [(vals[c]["n"], round(x / 10, 1)) for c, x in srt[-5:]], "万円")
tot_tp = sum(v["tp"] for v in vals.values())
tot_ti = sum(v["ti"] for v in vals.values())
print(f"全体: 納税義務者 {tot_tp:,}人、課税対象所得 {tot_ti/1e9:.1f}兆円、1人あたり {tot_ti/tot_tp/10:.1f}万円")

meta = {
    "source": "総務省『市町村税課税状況等の調』令和7年度 第2表・第11表・第21表",
    "url": "https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/ichiran09_19.html",
    "fiscalYear": 2025,
    "incomeYear": 2024,
    "rows": n,
    "builtAt": date.today().isoformat(),
    "note": "課税対象所得=総所得金額等+分離長期・短期譲渡所得+一般株式等・上場株式等の譲渡所得+上場株式等の配当所得+先物取引の雑所得。所得控除前。住所地ベース。",
}
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({"meta": meta, "values": vals}, f, ensure_ascii=False, separators=(",", ":"))
print(f"保存: {OUT} ({os.path.getsize(OUT)/1024:.0f} KB)")

try:
    cities = json.load(open("data/cities.json", encoding="utf-8"))
    site = [c["code"] for c in cities]
    hit = [c for c in site if c in vals]
    print(f"サイトの自治体 {len(site)} 件のうち、データあり {len(hit)} 件。ない {len(site)-len(hit)} 件(主に政令市の区)")
    nm = {c["code"]: c["name"] for c in cities}
    ward_like = [c for c in site if c not in vals and re.search(r"[区]$", nm[c])]
    others = [nm[c] for c in site if c not in vals and c not in ward_like]
    print("区以外でデータがない自治体:", others)
except FileNotFoundError:
    pass
