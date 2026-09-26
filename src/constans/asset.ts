/**
 * Nilai assets.asset_status yang dipakai backend. Kolomnya varchar (bukan
 * enum DB), jadi daftarnya dikumpulkan dari kode:
 *
 * - AVAILABLE, PENDING_RECEIPT — procurement (models/procurement_flow.go)
 * - IN_MUTATION, IN_DISPOSAL, DISPOSED — selama/akhir mutasi & disposal
 * - IN_HANDOVER — selama ikut ajuan serah terima (models/handover_flow.go)
 * - ACTIVE, INACTIVE, MAINTENANCE, RETIRED — hasil stock opname
 *   (stockOpnameAssetStatusValue di services/stock_opname_flow_service.go)
 *
 * Nilainya dikirim apa adanya ke filter `asset_status` di GET /assets.
 */
export const assetStatuses = [
  "AVAILABLE",
  "ACTIVE",
  "PENDING_RECEIPT",
  "IN_MUTATION",
  "IN_DISPOSAL",
  "IN_HANDOVER",
  "MAINTENANCE",
  "INACTIVE",
  "RETIRED",
  "DISPOSED",
] as const

export type AssetStatus = (typeof assetStatuses)[number]
