import type { TFunction } from "i18next"

export function getPhysicalStatusOptions(t: TFunction) {
  return [
    { value: "EXISTS", label: t("stockOpnameFindingModal.physicalStatusOptions.exists") },
    { value: "MISSING", label: t("stockOpnameFindingModal.physicalStatusOptions.missing") },
  ]
}

export function getConditionOptions(t: TFunction) {
  return [
    { value: "GOOD", label: t("stockOpnameFindingModal.conditionOptions.good") },
    { value: "FAIR", label: t("stockOpnameFindingModal.conditionOptions.fair") },
    { value: "POOR", label: t("stockOpnameFindingModal.conditionOptions.poor") },
    { value: "BROKEN", label: t("stockOpnameFindingModal.conditionOptions.broken") },
    { value: "NOT_APPLICABLE", label: t("stockOpnameFindingModal.conditionOptions.na") },
  ]
}

export function getAssetStatusOptions(t: TFunction) {
  return [
    { value: "", label: t("stockOpnameFindingModal.assetStatusOptions.unchanged") },
    { value: "ACTIVE", label: t("stockOpnameFindingModal.assetStatusOptions.active") },
    { value: "INACTIVE", label: t("stockOpnameFindingModal.assetStatusOptions.inactive") },
    { value: "MAINTENANCE", label: t("stockOpnameFindingModal.assetStatusOptions.maintenance") },
    { value: "RETIRED", label: t("stockOpnameFindingModal.assetStatusOptions.retired") },
  ]
}
