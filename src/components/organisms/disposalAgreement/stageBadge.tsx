import { useTranslation } from "react-i18next"

/** stage agreement: APPROVAL_AGREEMENT / FINISHED / REJECTED */
export function AgreementStageBadge({ stage }: { stage: string }) {
  const { t } = useTranslation()
  const key = stage?.toUpperCase()

  const cls: Record<string, string> = {
    APPROVAL_AGREEMENT: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    FINISHED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    REJECTED: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
        cls[key] ?? cls.APPROVAL_AGREEMENT
      }`}
    >
      {t(`disposalAgreement.stage.${key}`, { defaultValue: stage })}
    </span>
  )
}
