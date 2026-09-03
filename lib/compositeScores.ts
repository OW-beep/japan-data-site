import { getMunicipalities } from "@/lib/municipalities";

function zScores(values: number[]) {
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sd = Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  );
  return values.map((v) => (v - mean) / sd);
}

/** 財政健全度スコア:財政力指数・経常収支比率・自主財源比率・実質公債費比率を統合 */
export function getFiscalHealthScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.financeIndex != null &&
      c.ordinaryBalanceRatio != null &&
      c.totalRevenue &&
      c.localTax != null &&
      c.realDebtServiceRatio != null
  );

  const withTaxRatio = base.map((c) => ({
    ...c,
    taxRatio: ((c.localTax ?? 0) / (c.totalRevenue ?? 1)) * 100,
  }));

  const zFin = zScores(withTaxRatio.map((c) => c.financeIndex ?? 0));
  const zBal = zScores(withTaxRatio.map((c) => c.ordinaryBalanceRatio ?? 0));
  const zTax = zScores(withTaxRatio.map((c) => c.taxRatio));
  const zDebt = zScores(withTaxRatio.map((c) => c.realDebtServiceRatio ?? 0));

  return withTaxRatio
    .map((c, i) => ({ ...c, score: zFin[i] - zBal[i] + zTax[i] - zDebt[i] }))
    .sort((a, b) => b.score - a.score);
}

/** 高齢者支援体制スコア:医師数・老人ホーム定員・独居高齢者率を統合(高齢化率TOP300限定) */
export function getElderlySupportScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.elderlyPopulation != null &&
      c.doctorsCount != null &&
      c.elderlyHomeCount != null &&
      c.singleHouseholds != null &&
      c.households
  );

  const withRates = base.map((c) => ({
    ...c,
    agingRate: (c.elderlyPopulation / c.population) * 100,
    doctorsPer10k: ((c.doctorsCount ?? 0) / c.population) * 100000,
    homesPer1kElderly:
      c.elderlyPopulation > 0
        ? (c.elderlyHomeCount ?? 0) / (c.elderlyPopulation / 1000)
        : 0,
    singleRatio: ((c.singleHouseholds ?? 0) / (c.households ?? 1)) * 100,
  }));

  const zDoctors = zScores(withRates.map((c) => c.doctorsPer10k));
  const zHomes = zScores(withRates.map((c) => c.homesPer1kElderly));
  const zSingle = zScores(withRates.map((c) => c.singleRatio));

  const scored = withRates.map((c, i) => ({
    ...c,
    score: zDoctors[i] + zHomes[i] - zSingle[i],
  }));

  // 高齢化率TOP300のみを対象にする(元記事の定義と揃える)
  return [...scored]
    .sort((a, b) => b.agingRate - a.agingRate)
    .slice(0, 300)
    .sort((a, b) => b.score - a.score);
}

/** 産業の多様性指数(HHI):第1〜3次産業の就業者比率から算出。値が高いほど一極集中 */
export function getIndustryDiversityScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.primaryIndustryWorkers != null &&
      c.secondaryIndustryWorkers != null &&
      c.tertiaryIndustryWorkers != null
  );

  return base
    .map((c) => {
      const total =
        (c.primaryIndustryWorkers ?? 0) +
        (c.secondaryIndustryWorkers ?? 0) +
        (c.tertiaryIndustryWorkers ?? 0);
      if (total === 0) return null;
      const shares = [
        (c.primaryIndustryWorkers ?? 0) / total,
        (c.secondaryIndustryWorkers ?? 0) / total,
        (c.tertiaryIndustryWorkers ?? 0) / total,
      ];
      const hhi = shares.reduce((s, v) => s + v * v, 0);
      const labels = ["第1次産業", "第2次産業", "第3次産業"];
      const dominantIndex = shares.indexOf(Math.max(...shares));
      return {
        ...c,
        score: hhi,
        dominantLabel: labels[dominantIndex],
        dominantShare: shares[dominantIndex] * 100,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.score - a.score);
}

/** 子育て世代吸引力指数:保育所定員・20代純移動率・婚姻率を統合 */
export function getYoungFamilyAttractivenessScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.daycareCount != null &&
      c.childPopulation &&
      c.youngAdultNetMigration != null &&
      c.marriages != null
  );

  const withRates = base.map((c) => ({
    ...c,
    daycarePer1kChild: (c.daycareCount ?? 0) / (c.childPopulation / 1000),
    migrRate: ((c.youngAdultNetMigration ?? 0) / c.population) * 100,
    marriageRate: ((c.marriages ?? 0) / c.population) * 1000,
  }));

  const zDaycare = zScores(withRates.map((c) => c.daycarePer1kChild));
  const zMigr = zScores(withRates.map((c) => c.migrRate));
  const zMarriage = zScores(withRates.map((c) => c.marriageRate));

  return withRates
    .map((c, i) => ({
      ...c,
      score: zDaycare[i] + zMigr[i] + zMarriage[i],
    }))
    .sort((a, b) => b.score - a.score);
}

/** 生活基盤充実度指数:商業集積・公民館数・空き家率(逆)を統合 */
export function getLivingInfrastructureScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.vacantHouseCount != null &&
      c.totalHousingCount &&
      c.retailStoreCount != null &&
      c.restaurantCount != null &&
      c.communityCenterCount != null
  );

  const withRates = base.map((c) => ({
    ...c,
    vacancyRate: ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100,
    commercePerCapita:
      (((c.retailStoreCount ?? 0) + (c.restaurantCount ?? 0)) / c.population) *
      1000,
    communityPer10k: ((c.communityCenterCount ?? 0) / c.population) * 10000,
  }));

  const zVacancy = zScores(withRates.map((c) => c.vacancyRate));
  const zCommerce = zScores(withRates.map((c) => c.commercePerCapita));
  const zCommunity = zScores(withRates.map((c) => c.communityPer10k));

  return withRates
    .map((c, i) => ({
      ...c,
      score: zCommerce[i] + zCommunity[i] - zVacancy[i],
    }))
    .sort((a, b) => b.score - a.score);
}

/** 昼夜間人口比率×財政力:「豊かなベッドタウン」を見つけるためのスコア */
export function getBedroomTownFinanceScores() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.daytimePopulation &&
      c.nighttimePopulation &&
      c.financeIndex != null
  );

  return base
    .map((c) => ({
      ...c,
      dayNightRatio: ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100,
      score: c.financeIndex ?? 0,
    }))
    .sort((a, b) => a.dayNightRatio - b.dayNightRatio); // ベッドタウン度が高い順
}
