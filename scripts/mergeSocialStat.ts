import fs from "fs";

import cities from "../data/cities.json" assert { type:"json" };

import {
    getFinanceIndex,
    toArray
} from "../lib/socialStat";

async function run(){

    console.log("財政力指数取得");

    const json=
        await getFinanceIndex();

    const rows=
        toArray(
            json
            ?.GET_STATS_DATA
            ?.STATISTICAL_DATA
            ?.DATA_INF
            ?.VALUE
        );

    const financeMap=
        new Map<string,number>();

    for(const r of rows){

        financeMap.set(
            String(r["@area"]),
            Number(r["$"])
        );

    }

    const merged=(cities as any[]).map(c=>({

        ...c,

        financialPowerIndex:
            financeMap.get(c.code) ?? null

    }));

    fs.writeFileSync(

        "data/cities.json",

        JSON.stringify(
            merged,
            null,
            2
        )

    );

    console.log("財政力指数追加完了");

}

run();