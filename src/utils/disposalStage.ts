// ============================================================
// Disposal stage helpers
// Mirror dari backend: models/disposal_flow.go + services/disposal_flow_service.go
// ============================================================

import i18n from "../i18n"

export const DISPOSAL_STAGE = {
  DRAFT: "DRAFT",
  PURCHASING: "PURCHASING",
  APPROVAL_REQUEST: "APPROVAL_REQUEST",
  APPROVAL_AGREEMENT: "APPROVAL_AGREEMENT",
  EXECUTE: "EXECUTE",
  FINANCE: "FINANCE",
  TAX: "TAX",
  ASSET_DELETION: "ASSET_DELETION",
  FINISHED: "FINISHED",
  REJECTED: "REJECTED",
  /** dibatalkan oleh pengaju sendiri — beda dengan REJECTED oleh approver */
  CANCELLED: "CANCELLED",
} as const

export type DisposalStage = (typeof DISPOSAL_STAGE)[keyof typeof DISPOSAL_STAGE]

export const DISPOSAL_TYPE = {
  DISPOSE: "DISPOSE",
  SELL: "SELL",
} as const

export type DisposalType = (typeof DISPOSAL_TYPE)[keyof typeof DISPOSAL_TYPE]

// Urutan stage per tipe disposal — sama persis dengan stagesForDisposalType di backend
const SELL_STAGES: DisposalStage[] = [
  DISPOSAL_STAGE.DRAFT,
  DISPOSAL_STAGE.PURCHASING,
  DISPOSAL_STAGE.APPROVAL_REQUEST,
  DISPOSAL_STAGE.APPROVAL_AGREEMENT,
  DISPOSAL_STAGE.EXECUTE,
  DISPOSAL_STAGE.FINANCE,
  DISPOSAL_STAGE.TAX,
  DISPOSAL_STAGE.ASSET_DELETION,
  DISPOSAL_STAGE.FINISHED,
]

const DISPOSE_STAGES: DisposalStage[] = [
  DISPOSAL_STAGE.DRAFT,
  DISPOSAL_STAGE.APPROVAL_REQUEST,
  DISPOSAL_STAGE.APPROVAL_AGREEMENT,
  DISPOSAL_STAGE.EXECUTE,
  DISPOSAL_STAGE.ASSET_DELETION,
  DISPOSAL_STAGE.FINISHED,
]

export function stagesForDisposalType(disposalType?: string | null): DisposalStage[] {
  return disposalType?.toUpperCase() === DISPOSAL_TYPE.SELL ? SELL_STAGES : DISPOSE_STAGES
}

export function stageIndex(disposalType: string | null | undefined, stage: string): number {
  return stagesForDisposalType(disposalType).indexOf(stage as DisposalStage)
}

/** true kalau transaksi sudah melewati (atau sedang berada di) stage tertentu */
export function hasReachedStage(
  disposalType: string | null | undefined,
  currentStage: string,
  target: DisposalStage
): boolean {
  const current = stageIndex(disposalType, currentStage)
  const targetIdx = stageIndex(disposalType, target)
  if (current < 0 || targetIdx < 0) return false
  return current >= targetIdx
}

/**
 * Fallback kalau key i18n belum ada. Nama stage sengaja English di semua locale
 * (lihat `disposalStage.stage.*` di src/i18n/locales) — ini nama enum backend.
 */
export const DISPOSAL_STAGE_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PURCHASING: "Purchasing",
  APPROVAL_REQUEST: "Approval Request",
  APPROVAL_AGREEMENT: "Approval Agreement",
  EXECUTE: "Execute",
  FINANCE: "Finance",
  TAX: "Tax",
  ASSET_DELETION: "Asset Deletion",
  FINISHED: "Finished",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
}

export function disposalStageLabel(stage?: string | null): string {
  if (!stage) return "-"
  const key = stage.toUpperCase()
  return i18n.t(`disposalStage.stage.${key}`, {
    defaultValue: DISPOSAL_STAGE_LABEL[key] ?? stage.replace(/_/g, " "),
  })
}

export const DISPOSAL_TYPE_LABEL: Record<string, string> = {
  DISPOSE: "Dispose",
  SELL: "Sell",
}

export function disposalTypeLabel(type?: string | null): string {
  if (!type) return "-"
  const key = type.toUpperCase()
  return i18n.t(`disposalStage.type.${key}`, {
    defaultValue: DISPOSAL_TYPE_LABEL[key] ?? type,
  })
}

export function isSell(disposalType?: string | null): boolean {
  return disposalType?.toUpperCase() === DISPOSAL_TYPE.SELL
}

/** Stage terminal — tidak ada aksi lanjutan */
export function isTerminalStage(stage?: string | null): boolean {
  const s = stage?.toUpperCase()
  return (
    s === DISPOSAL_STAGE.FINISHED ||
    s === DISPOSAL_STAGE.REJECTED ||
    s === DISPOSAL_STAGE.CANCELLED
  )
}

/**
 * Stage yang masih boleh dibatalkan pengaju — cermin cancelableStages di
 * services.CancelDisposal. Mulai EXECUTE sudah ada efek samping.
 */
export function canCancelAtStage(stage?: string | null): boolean {
  const s = stage?.toUpperCase()
  if (!s) return false
  return (
    s === DISPOSAL_STAGE.DRAFT ||
    s === DISPOSAL_STAGE.PURCHASING ||
    s === DISPOSAL_STAGE.APPROVAL_REQUEST ||
    s === DISPOSAL_STAGE.APPROVAL_AGREEMENT
  )
}

/** Stage yang boleh di-reject (backend menolak DRAFT / FINISHED / REJECTED) */
export function canRejectAtStage(stage?: string | null): boolean {
  const s = stage?.toUpperCase()
  if (!s) return false
  return s !== DISPOSAL_STAGE.DRAFT && !isTerminalStage(s)
}

export function formatRupiah(value?: number | null): string {
  if (value == null) return "-"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Mirror dari checkAllDisposalAttachments(requireApproved=false) di backend:
 * dokumen stage berjalan cukup ter-upload (PENDING/APPROVED), tidak boleh ada
 * yang REJECTED atau kurang dari jumlah yang diwajibkan.
 *
 * Berbeda dengan `all_can_proceed` pada response, yang memakai aturan ketat
 * (semua wajib APPROVED) dan dipakai backend untuk mengecek stage DRAFT.
 */
export function attachmentsUploadedForStage(
  assets: Array<{
    total_required: number
    total_approved: number
    total_pending: number
    total_rejected: number
  }>
): boolean {
  return assets.every(
    (a) =>
      a.total_rejected === 0 &&
      a.total_approved + a.total_pending >= a.total_required
  )
}
