#!/usr/bin/env python3
"""
農林水産省「市町村別農業産出額(推計)」詳細品目別データ(Excel)から、
サイトで使う data/agri-output-r6.json を作る。

使い方:
  python3 scripts/build_agri_output.py <index-25.xlsx> data/agri-output-r6.json

元データ: https://www.maff.go.jp/j/tokei/kouhyou/sityoson_sansyutu/index.html
  「令和6年 市町村別農業産出額(推計)詳細品目別データ(EXCEL)」
  令和8年7月24日公表、同年9月18日訂正。
  2026年8月3日の正誤表(島根県浜田市・益田市、荒茶の全国順位)は、取得したExcelに反映済みであることを確認している。

注意:
  - 産出額の単位は「1,000万円」(÷10で億円)。
  - 値が x のものは秘匿(数値非公表)。順位と市町村名は公表されているので、表には「非公表」として載せる。合計・割合は公表値だけで計算する。
  - 都道府県別の産出額を作付面積・飼養頭数などで市町村に按分した推計。価格差・単収の差は反映されない。
"""
import json
import sys

import pandas as pd

# slug -> (Excelの「品目」列の値, 表示名)
ITEMS = {
    "total": ("農業産出額", "農業産出額(総合)"),
    "rice": ("米", "米"),
    "vegetables": ("野菜計", "野菜"),
    "tomato": ("トマト", "トマト"),
    "strawberry": ("いちご", "いちご"),
    "cabbage": ("キャベツ", "キャベツ"),
    "onion": ("たまねぎ", "たまねぎ"),
    "negi": ("ねぎ", "ねぎ"),
    "cucumber": ("きゅうり", "きゅうり"),
    "fruits": ("果実計", "果実"),
    "mikan": ("みかん", "みかん"),
    "apple": ("りんご", "りんご"),
    "grape": ("ぶどう", "ぶどう"),
    "peach": ("もも", "もも"),
    "pear": ("日本なし", "日本なし"),
    "beef": ("肉用牛", "肉用牛"),
    "milk": ("生乳", "生乳"),
    "pork": ("豚", "豚"),
    "egg": ("鶏卵", "鶏卵"),
    "broiler": ("ブロイラー", "ブロイラー"),
    "flowers": ("花き", "花き"),
    "sweetpotato": ("かんしょ", "さつまいも(かんしょ)"),
    "potato": ("ばれいしょ", "じゃがいも(ばれいしょ)"),
    "tea": ("茶（生葉）", "茶(生葉)"),
}
TOP_N = 100


def main(src, dst):
    df = pd.read_excel(src, dtype=str)
    df.columns = ["year", "pref_code", "city_code", "region", "pref", "city", "kind", "dept", "item", "val", "rank_nat", "rank_pref"]
    df["code"] = df.pref_code + df.city_code.astype(int).astype(str).str.zfill(3)

    out = {
        "meta": {
            "source": "農林水産省「市町村別農業産出額(推計)」令和6年",
            "url": "https://www.maff.go.jp/j/tokei/kouhyou/sityoson_sansyutu/index.html",
            "publishedAt": "2026-07-24",
            "correctedAt": "2026-09-18",
            "unit": "1000万円",
        },
        "items": {},
    }
    for slug, (key, label) in ITEMS.items():
        d = df[df.item == key].copy()
        if d.empty:
            raise SystemExit(f"品目が見つかりません: {key}")
        secret = int((d.val == "x").sum())
        d = d[d.rank_nat.str.fullmatch(r"\d+", na=False)].copy()  # 順位が付いているものだけ(秘匿でも順位は付く)
        d["rn"] = d.rank_nat.astype(int)
        d["rp"] = d.rank_pref.astype(int)
        d["v"] = d.val.apply(lambda x: int(x) if str(x).isdigit() else None)  # x(秘匿)は None
        d = d.sort_values("rn")
        num = d[d.v.notna() & (d.v > 0)]
        total = int(num.v.sum())  # 公表されている数値の合計(秘匿分は含まない)
        pref = num.groupby("pref").v.sum().sort_values(ascending=False)
        out["items"][slug] = {
            "key": key,
            "label": label,
            "dept": d.dept.iloc[0],
            "producers": int(len(num)),
            "secret": secret,
            "total": total,
            "prefTop": [[p, int(v)] for p, v in pref.head(5).items()],
            # 全国順位 TOP_N まで。v が null のものは数値非公表(秘匿)だが、順位と市町村名は公表されている
            "top": [
                {"code": r.code, "pref": r.pref, "city": r.city, "v": (None if pd.isna(r.v) else int(r.v)), "rn": int(r.rn), "rp": int(r.rp)}
                for r in d[d.rn <= TOP_N].itertuples()
            ],
        }
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote", dst, len(out["items"]), "items")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
