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

  // scripts/fetchVacantHouseRate.ts 実行後に追加される項目。
  // 実行前は undefined のまま(要: statsDataId の確認と設定)。
  vacantHouseCount?: number | null; // 空き家数
  totalHousingCount?: number | null; // 総住宅数
};