import type { TFunction } from "i18next"
import type { StockOpnameConfig } from "../../../models/stockOpname/config"
import type { StockOpnamePhysicalStatusMaster } from "../../../models/stockOpname/statusMaster"

// Physical status & condition SEKARANG master data (bisa ditambah admin
// lewat halaman /dashboard/stock-opname/status-master), bukan hardcode lagi
// — labelnya dari database (single-language, gak ikut i18n), sama seperti
// nama kategori aset / branch yang juga master data.

export function getPhysicalStatusOptions(masters: StockOpnamePhysicalStatusMaster[]) {
  return masters.map((m) => ({ value: m.code, label: m.label }))
}

export function requiresBorrowDocument(masters: StockOpnamePhysicalStatusMaster[], physicalStatus: string) {
  return masters.find((m) => m.code === physicalStatus)?.requires_borrow_document ?? false
}

// Kondisi yang boleh dipilih ngikutin relasi status fisik -> kondisi yang
// diatur di master data (allowed_conditions), bukan hardcode lagi — misal
// "Tidak Ada" cuma boleh kondisi "Tidak Ada". Status fisik belum dipilih =
// belum ada opsi kondisi.
export function getConditionOptions(masters: StockOpnamePhysicalStatusMaster[], physicalStatus: string) {
  const allowed = masters.find((m) => m.code === physicalStatus)?.allowed_conditions ?? []
  return allowed.map((c) => ({ value: c.code, label: c.label }))
}

// isConditionLocked: status fisik cuma punya 1 kondisi yang boleh ->
// kondisinya otomatis kepilih & dropdown dikunci.
export function isConditionLocked(masters: StockOpnamePhysicalStatusMaster[], physicalStatus: string) {
  return getConditionOptions(masters, physicalStatus).length === 1
}

// reconcileCondition: dipanggil begitu status fisik berubah. Kondisi yang
// masih diizinkan dipertahankan; kalau cuma ada 1 opsi langsung dipilih;
// selain itu direset kosong biar dipilih ulang.
export function reconcileCondition(
  masters: StockOpnamePhysicalStatusMaster[],
  physicalStatus: string,
  currentCondition: string
) {
  const options = getConditionOptions(masters, physicalStatus)
  if (options.length === 1) return options[0].value
  return options.some((o) => o.value === currentCondition) ? currentCondition : ""
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
