#!/usr/bin/env python3
"""
/search 用の軽量な自治体インデックス data/city-search-index.json を作る。
(全自治体データ cities.json は約2.7MBあり、ブラウザに送ると重いため、名前・コード・人口だけに絞る)

使い方: python3 scripts/build_city_search_index.py
人口は令和7年国勢調査(確定値)があればそれ、なければ令和2年。cities.json か population-2025.json を更新したら実行する。
"""
import json

cities = json.load(open("data/cities.json", encoding="utf-8"))
pop25 = json.load(open("data/population-2025.json", encoding="utf-8"))["values"]
out = []
for c in cities:
    v = pop25.get(c["code"])
    out.append({"c": c["code"], "n": c["name"], "p": int(v[0]) if v and v[0] else int(c["population"])})
json.dump(out, open("data/city-search-index.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("wrote data/city-search-index.json", len(out))
