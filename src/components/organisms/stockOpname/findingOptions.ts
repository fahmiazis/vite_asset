import type { TFunction } from "i18next"
import type { StockOpnameConfig } from "../../../models/stockOpname/config"

export function getPhysicalStatusOptions(t: TFunction) {
  return [
    { value: "EXISTS", label: t("stockOpnameFindingModal.physicalStatusOptions.exists") },
    { value: "MISSING", label: t("stockOpnameFindingModal.physicalStatusOptions.missing") },
    { value: "BORROWED", label: t("stockOpnameFindingModal.physicalStatusOptions.borrowed") },
  ]
}

// Status fisik yang berarti asetnya gak ada di lokasi buat dicek -> kondisi
// gak relevan dinilai, dipaksa NOT_APPLICABLE (dipakai modal & grid "Lengkapi Data").
export function isPhysicalStatusAbsent(physicalStatus: string) {
  return physicalStatus === "MISSING" || physicalStatus === "BORROWED"
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

// borrowDocumentAcceptAttr bikin value `accept` buat <input type="file">
// dokumen peminjaman dari config saat ini (PDF/Word/Foto). Fallback ke PDF
// kalau config belum kebaca (loading) atau semuanya kebetulan dimatikan,
// biar input gak pernah kosong total.
export function borrowDocumentAcceptAttr(config?: StockOpnameConfig) {
  const parts: string[] = []
  if (!config || config.borrow_doc_allow_pdf) parts.push("application/pdf")
  if (config?.borrow_doc_allow_word) {
    parts.push("application/msword")
    parts.push("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  }
  if (config?.borrow_doc_allow_photo) {
    parts.push("image/jpeg", "image/png", "image/webp")
  }
  return parts.join(",")
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
