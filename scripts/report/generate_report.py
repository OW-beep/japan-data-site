#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自治体調査レポート(プレミアム版)生成スクリプト

使い方:
  python3 -m venv .venv-report
  .venv-report/bin/pip install reportlab matplotlib
  .venv-report/bin/python scripts/report/generate_report.py 01403
  → public/reports/<slug>_municipal-report_sample.pdf を生成する

データは本サイトの data/*.json をそのまま使う。スコアの算出式は
lib/compositeScores.ts の定義に合わせている(母集団の定義は付録に明記)。
"""
import json
import math
import os
import sys

BASE = os.path.join(os.path.dirname(__file__), "..", "..")
DATA = os.path.join(BASE, "data")

# ---------------------------------------------------------------- data load
def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)

CITIES = load("cities.json")
POP25 = load("population-2025.json")["values"]
FUTURE = load("future-population.json")["values"]
FURUSATO = {r["name"]: r for r in load("furusato-nozei-r7.json")}
INCOME = load("taxable-income-r7.json")
PRICES = {r["code"].zfill(5): r for r in load("real-estate-price.json")}
CORP = {r["code"]: r for r in load("corporate-registration.json")}

def is_muni(c):
    parts = c["name"].split()
    return len(parts) == 2 and c["name"] != "東京都 特別区部"

MUNIS = [c for c in CITIES if is_muni(c)]
BY_CODE = {c["code"]: c for c in CITIES}

def pref_of(c):
    return c["name"].split()[0]

def short_of(c):
    return c["name"].split()[-1]

# ---------------------------------------------------------------- stats util
def mean(v):
    return sum(v) / len(v) if v else 0.0

def zscores(values):
    m = mean(values)
    sd = math.sqrt(sum((v - m) ** 2 for v in values) / len(values)) or 1.0
    return [(v - m) / sd for v in values]

def rank_desc(rows, key, code):
    """値が大きい順の順位(1始まり)と母数を返す"""
    vals = sorted(rows, key=lambda r: key(r), reverse=True)
    for i, r in enumerate(vals):
        if r["code"] == code:
            return i + 1, len(vals)
    return None, len(vals)

def rank_asc(rows, key, code):
    vals = sorted(rows, key=lambda r: key(r))
    for i, r in enumerate(vals):
        if r["code"] == code:
            return i + 1, len(vals)
    return None, len(vals)

def percentile_desc(rows, key, code):
    """上位何%か(小さいほど上位)"""
    r, n = rank_desc(rows, key, code)
    return (r / n * 100) if r else None

def avg_of(rows, key):
    vals = [key(r) for r in rows if key(r) is not None]
    return mean(vals) if vals else None

# ---------------------------------------------------------------- derived fields
def aging_rate(c):
    if c.get("elderlyPopulation") is not None and c.get("population"):
        return c["elderlyPopulation"] / c["population"] * 100
    return None

def child_rate(c):
    if c.get("childPopulation") is not None and c.get("population"):
        return c["childPopulation"] / c["population"] * 100
    return None

def vacancy_rate(c):
    if c.get("vacantHouseCount") is not None and c.get("totalHousingCount"):
        return c["vacantHouseCount"] / c["totalHousingCount"] * 100
    return None

def tax_ratio(c):
    if c.get("localTax") is not None and c.get("totalRevenue"):
        return c["localTax"] / c["totalRevenue"] * 100
    return None

def doctors_per_100k(c):
    if c.get("doctorsCount") is not None and c.get("population"):
        return c["doctorsCount"] / c["population"] * 100000
    return None

def unemployment_rate(c):
    if c.get("unemployedCount") is not None and c.get("laborForceCount"):
        return c["unemployedCount"] / c["laborForceCount"] * 100
    return None

def daytime_ratio(c):
    if c.get("daytimePopulation") and c.get("nighttimePopulation"):
        return c["daytimePopulation"] / c["nighttimePopulation"] * 100
    return None

def pop_change_2020_2025(c):
    p25 = POP25.get(c["code"])
    if p25 and c.get("population"):
        return (p25[0] - c["population"]) / c["population"] * 100
    return None

def income_per_taxpayer(code):
    """課税対象所得(千円)÷納税義務者数 = 1人あたり課税対象所得(千円)"""
    rows = INCOME.get("values") or {}
    r = rows.get(code)
    if isinstance(r, dict) and r.get("tp") and r.get("ti"):
        return r["ti"] / r["tp"]
    return None

def welfare_ratio(c):
    if c.get("welfareExpense") is not None and c.get("totalRevenue"):
        return c["welfareExpense"] / c["totalRevenue"] * 100
    return None

def industry_shares(c):
    p, s, t = (c.get("primaryIndustryWorkers") or 0,
               c.get("secondaryIndustryWorkers") or 0,
               c.get("tertiaryIndustryWorkers") or 0)
    tot = p + s + t
    if tot == 0:
        return None
    return [p / tot * 100, s / tot * 100, t / tot * 100]

# ---------------------------------------------------------------- composite scores
def fiscal_scores():
    base = [c for c in MUNIS
            if c.get("financeIndex") is not None
            and c.get("ordinaryBalanceRatio") is not None
            and c.get("totalRevenue")
            and c.get("localTax") is not None
            and c.get("realDebtServiceRatio") is not None]
    zf = zscores([c["financeIndex"] for c in base])
    zb = zscores([c["ordinaryBalanceRatio"] for c in base])
    zt = zscores([tax_ratio(c) for c in base])
    zd = zscores([c["realDebtServiceRatio"] for c in base])
    out = {}
    for i, c in enumerate(base):
        out[c["code"]] = zf[i] - zb[i] + zt[i] - zd[i]
    return out, len(base)

def living_scores():
    base = [c for c in MUNIS
            if vacancy_rate(c) is not None
            and c.get("retailStoreCount") is not None
            and c.get("restaurantCount") is not None
            and c.get("communityCenterCount") is not None
            and c.get("population")]
    zv = zscores([vacancy_rate(c) for c in base])
    zc = zscores([(c["retailStoreCount"] + c["restaurantCount"]) / c["population"] * 1000 for c in base])
    zg = zscores([c["communityCenterCount"] / c["population"] * 10000 for c in base])
    return {c["code"]: zc[i] + zg[i] - zv[i] for i, c in enumerate(base)}, len(base)

def young_family_scores():
    base = [c for c in MUNIS
            if c.get("daycareCount") is not None
            and c.get("childPopulation")
            and c.get("youngAdultNetMigration") is not None
            and c.get("marriages") is not None
            and c.get("population")]
    zd = zscores([c["daycareCount"] / (c["childPopulation"] / 1000) for c in base])
    zm = zscores([c["youngAdultNetMigration"] / c["population"] * 100 for c in base])
    zr = zscores([c["marriages"] / c["population"] * 1000 for c in base])
    return {c["code"]: zd[i] + zm[i] + zr[i] for i, c in enumerate(base)}, len(base)

def elderly_support_scores():
    base = [c for c in MUNIS
            if c.get("elderlyPopulation") is not None
            and c.get("doctorsCount") is not None
            and c.get("elderlyHomeCount") is not None
            and c.get("singleHouseholds") is not None
            and c.get("households")]
    zd = zscores([doctors_per_100k(c) or 0 for c in base])
    zh = zscores([(c["elderlyHomeCount"] / (c["elderlyPopulation"] / 1000)) if c["elderlyPopulation"] else 0 for c in base])
    zs = zscores([c["singleHouseholds"] / c["households"] * 100 for c in base])
    return {c["code"]: zd[i] + zh[i] - zs[i] for i, c in enumerate(base)}, len(base)

def grade(score_map, code):
    """スコア分布から S/A/B/C/D の5段階評価(上位10/30/60/85%)"""
    if code not in score_map:
        return None, None, None
    vals = sorted(score_map.values(), reverse=True)
    n = len(vals)
    rank = vals.index(score_map[code]) + 1
    pct = rank / n * 100
    g = "S" if pct <= 10 else "A" if pct <= 30 else "B" if pct <= 60 else "C" if pct <= 85 else "D"
    return g, rank, n

def peers_of(target, k=10):
    """人口規模が近い自治体(同一県を優先せず全国から対数距離で選ぶ)"""
    tp = target["population"]
    cand = [c for c in MUNIS if c["code"] != target["code"] and c.get("population")]
    cand.sort(key=lambda c: abs(math.log(c["population"]) - math.log(tp)))
    return sorted(cand[:k], key=lambda c: -(c.get("financeIndex") or 0))

if __name__ == "__main__":
    code = sys.argv[1]
    t = BY_CODE[code]
    fs, fn = fiscal_scores()
    print(t["name"], "fiscal:", fs.get(code), grade(fs, code), "base:", fn)
    for name, fn2 in [("living", living_scores), ("young", young_family_scores), ("elderly", elderly_support_scores)]:
        m, n = fn2()
        print(name, grade(m, code), "base:", n)
    print("income/taxpayer:", income_per_taxpayer(code))
    print("future:", FUTURE.get(code))
