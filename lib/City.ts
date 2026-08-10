export type City = {
  code: string;
  name: string;

  population: number;
  childPopulation: number;
  elderlyPopulation: number;

  area: number | null;
  populationDensity: number | null;

  financeIndex: number | null;

  birthRate?: number | null;
  agingRate?: number | null;
  declineRate?: number | null;

  inMigrants?: number | null;
  outMigrants?: number | null;
  households?: number | null;
  singleHouseholds?: number | null;

  marriages?: number | null;
  divorces?: number | null;

  // SSDSE-市区町村（SSDSE-A）由来の追加項目。
  // scripts/fetchSSDSE.ts を実行するまでは undefined のまま。
  laborForceCount?: number | null;
  unemployedCount?: number | null;
  primaryIndustryWorkers?: number | null;
  secondaryIndustryWorkers?: number | null;
  tertiaryIndustryWorkers?: number | null;
  doctorsCount?: number | null;
  hospitalCount?: number | null;
  clinicCount?: number | null;
  libraryCount?: number | null;
  elementarySchoolCount?: number | null;
  juniorHighSchoolCount?: number | null;
  retailStoreCount?: number | null;
  totalRevenue?: number | null;
  localTax?: number | null;
  educationExpense?: number | null;
  welfareExpense?: number | null;

  // SSDSE-市区町村（SSDSE-A）由来の追加項目 第2弾(2026-08)
  habitableArea?: number | null; // 可住地面積(ha)
  foreignPopulation?: number | null;
  births?: number | null;
  deaths?: number | null;
  ordinaryBalanceRatio?: number | null; // 経常収支比率(%)
  realDebtServiceRatio?: number | null; // 実質公債費比率(%)
  dentistsCount?: number | null;
  pharmacistsCount?: number | null;
  dentalClinicCount?: number | null;
  restaurantCount?: number | null;
  largeRetailStoreCount?: number | null;
  accommodationFoodEstablishments?: number | null;
  daycareCount?: number | null;

  // scripts/fetchDaytimePopulation.ts 実行後に追加される項目。
  daytimePopulation?: number | null; // 昼間人口(令和2年国勢調査)
  nighttimePopulation?: number | null; // 夜間人口(常住人口、同調査での参考値)

  // scripts/fetchVacantHouseRate.ts 実行後に追加される項目。
  vacantHouseCount?: number | null; // 空き家数
  totalHousingCount?: number | null; // 総住宅数

  // scripts/fetchElderlyFacilities.ts 実行後に追加される項目。
  elderlyHomeCount?: number | null; // 老人ホーム数

  // scripts/fetchYoungAdultMigration.ts 実行後に追加される項目。
  youngAdultNetMigration?: number | null; // 20代(20〜29歳)の転入超過数

  // scripts/fetchRecyclingRate.ts 実行後に追加される項目。
  recyclingRate?: number | null; // ごみのリサイクル率(%)
};
