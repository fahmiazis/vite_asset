import { useTranslation } from "react-i18next"

/**
 * Penanda di daftar untuk pengajuan yang dikembalikan approver.
 *
 * Transaksi yang direvisi kembali ke DRAFT, jadi di tabel tampilannya identik
 * dengan draft yang belum pernah diajukan. Tanpa penanda ini pengaju tidak
 * punya cara tahu ada yang harus dikerjakan.
 */
export function RevisionBadge({ show }: { show?: boolean }) {
  const { t } = useTranslation()
  if (!show) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {t("revisionDecision.badge")}
    </span>
  )
}
