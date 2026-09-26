import { useTranslation } from "react-i18next"

// ============================================================
// Penanda status dokumen — dipakai panel disposal dan mutation.
// ============================================================

export function formatBytes(size?: number | null) {
  if (size == null) return "-"
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/** status review satu dokumen */
export function AttachmentStatusPill({ status }: { status: string }) {
  const { t } = useTranslation()
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    REJECTED: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  }
  const key = status?.toUpperCase()
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[key] ?? map.PENDING}`}
    >
      {t(`disposalStagePanel.attachmentStatus.${key}`, { defaultValue: status })}
    </span>
  )
}

/**
 * Kelengkapan dokumen satu aset punya tiga keadaan, bukan dua. Semua berkas
 * wajib sudah terunggah tapi belum direview bukan kesalahan pengunggah —
 * menyebutnya "belum lengkap" membuat orang yang bertugas mengunggah mengira
 * pekerjaannya kurang, padahal yang ditunggu adalah reviewer.
 */
export type Completeness = "COMPLETE" | "UPLOADED" | "INCOMPLETE"

interface CompletenessInput {
  can_proceed: boolean
  total_required: number
  total_approved: number
  total_pending: number
  total_rejected: number
}

export function completenessOf(asset: CompletenessInput): Completeness {
  if (asset.can_proceed) return "COMPLETE"

  const uploaded = asset.total_approved + asset.total_pending
  if (asset.total_rejected === 0 && uploaded >= asset.total_required) return "UPLOADED"

  return "INCOMPLETE"
}

const COMPLETENESS_STYLE: Record<Completeness, { pill: string; dot: string; key: string }> = {
  COMPLETE: {
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
    key: "complete",
  },
  UPLOADED: {
    pill: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    dot: "bg-sky-500",
    key: "uploaded",
  },
  INCOMPLETE: {
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-400",
    key: "incomplete",
  },
}

export function CompletenessBadge({ asset }: { asset: CompletenessInput }) {
  const { t } = useTranslation()
  const style = COMPLETENESS_STYLE[completenessOf(asset)]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {t(`disposalStagePanel.card.${style.key}`)}
    </span>
  )
}
