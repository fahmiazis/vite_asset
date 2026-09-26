import { useTranslation } from "react-i18next"
import type { HandoverType } from "../../../constans/handover"

const STAGE_STYLE: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  APPROVAL: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  HANDOVER_RECEIVING: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  FINISHED: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
}

/** Nama stage adalah enum backend — sengaja tidak diterjemahkan. */
export function HandoverStageBadge({ stage }: { stage: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono whitespace-nowrap ${STAGE_STYLE[stage] ?? STAGE_STYLE.DRAFT}`}>
      {stage}
    </span>
  )
}

export function HandoverTypeBadge({ type }: { type: HandoverType }) {
  const { t } = useTranslation()
  const style =
    type === "RETURN"
      ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${style}`}>
      {t(`handover.type.${type}`)}
    </span>
  )
}
