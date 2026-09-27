import i18n from "../i18n"

/**
 * Urutan stage procurement — sama dengan nextStage di
 * services/transaction_email_service.go (TxProcurement).
 */
export const PROCUREMENT_STAGES = [
  "DRAFT",
  "ASSET_VERIFICATION",
  "APPROVAL",
  "PROCESS_BUDGET",
  "EXECUTE_ASET",
  "GR",
  "FINISHED",
] as const

/** stage akhir di luar jalur normal */
export const PROCUREMENT_TERMINAL_STAGES = ["REJECTED", "CANCELLED"]

/** nama stage tetap English di semua locale (identitas data, bukan kalimat) */
export function procurementStageLabel(stage: string) {
  return i18n.t(`procurementStage.stage.${stage}`, { defaultValue: stage })
}

export function procurementStageIndex(stage: string) {
  return PROCUREMENT_STAGES.indexOf(stage?.toUpperCase() as (typeof PROCUREMENT_STAGES)[number])
}

/** true kalau transaksi sudah pernah sampai di `stage` */
export function hasReachedProcurementStage(currentStage: string, stage: string) {
  const current = procurementStageIndex(currentStage)
  const target = procurementStageIndex(stage)
  return current >= 0 && target >= 0 && target <= current
}
