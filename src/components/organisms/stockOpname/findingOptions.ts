import type { TFunction } from "i18next"
import type { StockOpnameConfig } from "../../../models/stockOpname/config"
import type { StockOpnameConditionMaster, StockOpnamePhysicalStatusMaster } from "../../../models/stockOpname/statusMaster"

// Physical status & condition SEKARANG master data (bisa ditambah admin
// lewat halaman /dashboard/stock-opname/status-master), bukan hardcode lagi
// — labelnya dari database (single-language, gak ikut i18n), sama seperti
// nama kategori aset / branch yang juga master data.

export function getPhysicalStatusOptions(masters: StockOpnamePhysicalStatusMaster[]) {
  return masters.map((m) => ({ value: m.code, label: m.label }))
}

// isPhysicalStatusAbsent: status fisik yang berarti asetnya gak ada di
// lokasi buat dicek -> kondisi gak relevan dinilai, dipaksa ke condition
// yang is_not_applicable_value=true (dipakai modal & grid "Lengkapi Data").
export function isPhysicalStatusAbsent(masters: StockOpnamePhysicalStatusMaster[], physicalStatus: string) {
  return masters.find((m) => m.code === physicalStatus)?.requires_not_applicable_condition ?? false
}

export function requiresBorrowDocument(masters: StockOpnamePhysicalStatusMaster[], physicalStatus: string) {
  return masters.find((m) => m.code === physicalStatus)?.requires_borrow_document ?? false
}

// notApplicableConditionCode: dipakai buat auto-set condition begitu
// physical_status pindah ke status yang isPhysicalStatusAbsent — ambil kode
// condition pertama yang ditandai is_not_applicable_value=true.
export function notApplicableConditionCode(masters: StockOpnameConditionMaster[]) {
  return masters.find((m) => m.is_not_applicable_value)?.code ?? ""
}

export function isConditionNotApplicableValue(masters: StockOpnameConditionMaster[], condition: string) {
  return masters.find((m) => m.code === condition)?.is_not_applicable_value ?? false
}

// includeNotApplicable=false -> buang opsi yang is_not_applicable_value
// (dipakai saat physical_status BUKAN yang "absent", biar user gak bisa
// pilih kondisi "Tidak Ada" padahal asetnya ada).
export function getConditionOptions(masters: StockOpnameConditionMaster[], includeNotApplicable: boolean) {
  return masters
    .filter((m) => includeNotApplicable || !m.is_not_applicable_value)
    .map((m) => ({ value: m.code, label: m.label }))
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
