#!/usr/bin/env python3
"""
農林水産省「市町村別農業産出額(推計)」令和6年の Excel から、市町村ごとの
データ data/agri-city-r6.json を作る(市町村ページの「強み」・農業関連の記事用)。

使い方:
  python3 scripts/build_agri_city.py <index-25.xlsx> data/agri-city-r6.json

各市町村について:
  total / totalRn / totalRp ... 農業産出額(1,000万円)・全国順位・県内順位
  parts ... 米・野菜・果実・花き・畜産の産出額(1,000万円、秘匿は null)
  strengths ... 「強み」の候補。品目ごとの全国順位が 30 位以内のもの(最大3つ、順位の良い順)
               ただし、その品目の順位が付いた市町村が MIN_PRODUCERS 以上ある品目だけ
               (生産する市町村が少ない品目で「全国3位」と言っても意味が薄いため)。
               v は秘匿のとき null(順位は公表されている)。

注意: 按分による推計。価格差・単収の差は反映されない。
"""
import json
import sys

import pandas as pd

# Excelの「品目」→ 楽天市場の検索に使う商品名(返礼品として探しやすいもの)
PRODUCT = {
    "米": "米", "そば": "そば", "ばれいしょ": "じゃがいも", "かんしょ": "さつまいも",
    "だいこん": "大根", "にんじん": "にんじん", "さといも": "里芋", "やまのいも": "長芋",
    "はくさい": "白菜", "キャベツ": "キャベツ", "ほうれんそう": "ほうれん草", "レタス": "レタス",
    "ねぎ": "ねぎ", "たまねぎ": "玉ねぎ", "ブロッコリー": "ブロッコリー", "きゅうり": "きゅうり",
    "なす": "なす", "トマト": "トマト", "ピーマン": "ピーマン", "いちご": "いちご",
    "メロン": "メロン", "すいか": "すいか", "みかん": "みかん", "りんご": "りんご",
    "ぶどう": "ぶどう", "日本なし": "梨", "西洋なし": "洋梨", "もも": "桃",
    "おうとう": "さくらんぼ", "びわ": "びわ", "かき": "柿", "くり": "栗", "うめ": "梅",
    "すもも": "すもも", "キウイフルーツ": "キウイ", "茶（生葉）": "お茶",
    "こんにゃくいも": "こんにゃく", "肉用牛": "牛肉", "豚": "豚肉", "鶏卵": "卵",
    "ブロイラー": "鶏肉", "生乳": "牛乳",
}
PARTS = {"rice": "米", "veg": "野菜計", "fruit": "果実計", "flower": "花き", "livestock": "畜産計"}
RANK_MAX = 30
MIN_PRODUCERS = 40
PER_CITY = 3


def to_int(x):
    return int(x) if str(x).isdigit() else None


def main(src, dst):
    df = pd.read_excel(src, dtype=str)
    df.columns = ["year", "pref_code", "city_code", "region", "pref", "city", "kind", "dept", "item", "val", "rank_nat", "rank_pref"]
    df["code"] = df.pref_code + df.city_code.astype(int).astype(str).str.zfill(3)
    df["rn"] = df.rank_nat.apply(to_int)
    df["v"] = df.val.apply(to_int)

    producers = df[df.rn.notna()].groupby("item").code.nunique()
    ok_items = {i for i in PRODUCT if producers.get(i, 0) >= MIN_PRODUCERS}

    out = {}
    tot = df[df.item == "農業産出額"].set_index("code")
    byitem = {k: df[df.item == v].set_index("code") for k, v in PARTS.items()}
    st = df[df.item.isin(ok_items) & df.rn.notna() & (df.rn <= RANK_MAX)]

    for code, r in tot.iterrows():
        entry = {
            "pref": r.pref, "city": r.city,
            "total": to_int(r.val), "totalRn": to_int(r.rank_nat), "totalRp": to_int(r.rank_pref),
            "parts": {k: (None if code not in d.index else to_int(d.loc[code].val)) for k, d in byitem.items()},
        }
        s = st[st.code == code].assign(vv=lambda t: t.v.fillna(0)).sort_values(["rn", "vv"], ascending=[True, False])  # 同順位は金額が公表されていて大きいものを先に
        entry["strengths"] = [
            {"item": x.item, "product": PRODUCT[x.item], "rn": int(x.rn), "v": (None if pd.isna(x.v) else int(x.v))}
            for x in s.head(PER_CITY).itertuples()
        ]
        out[code] = entry
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    n_s = sum(1 for e in out.values() if e["strengths"])
    print("wrote", dst, len(out), "cities;", n_s, "with strengths; items used:", len(ok_items))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
