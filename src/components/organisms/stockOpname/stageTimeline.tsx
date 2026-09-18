import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"
import type { StockOpnameStage } from "../../../models/stockOpname/detail"

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function getStepperStages(t: TFunction) {
  return [
    { key: "DRAFT", label: t("stockOpnameStepper.submit") },
    { key: "APPROVAL", label: t("stockOpnameStepper.approval") },
    { key: "EXECUTE_STOCK_OPNAME", label: t("stockOpnameStepper.execute") },
    { key: "FINISHED", label: t("stockOpnameStepper.done") },
  ]
}

const STEPPER_ICONS: Record<string, ReactNode> = {
  DRAFT: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  APPROVAL: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  EXECUTE_STOCK_OPNAME: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  FINISHED: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

/** Stepper ringkas: Submit -> Approval -> Eksekusi -> Selesai */
export function StockOpnameStepper({ currentStage }: { currentStage: string }) {
  const { t } = useTranslation()
  const stepperStages = getStepperStages(t)
  const isRejected = currentStage === "REJECTED"
  const activeIndex = stepperStages.findIndex((s) => s.key === currentStage)
  const currentIndex = isRejected ? stepperStages.length : activeIndex

  return (
    <div className="flex items-center">
      {stepperStages.map((stage, index) => {
        const isDone = !isRejected && index < currentIndex
        const isCurrent = !isRejected && index === currentIndex
        const isLast = index === stepperStages.length - 1

        const circleClass = isRejected
          ? "bg-red-100 border-red-300 text-red-500 dark:bg-red-900/30 dark:border-red-700"
          : isDone || isCurrent
          ? "bg-indigo-600 border-indigo-600 text-white"
          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-400"

        const lineClass = isRejected
          ? "bg-gray-200 dark:bg-gray-700"
          : index < currentIndex
          ? "bg-indigo-600"
          : "bg-gray-200 dark:bg-gray-700"

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${circleClass}`}>
                {STEPPER_ICONS[stage.key]}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${isCurrent && !isRejected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
                {stage.label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${lineClass}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Riwayat perpindahan stage, satu baris per transisi (from_stage -> to_stage) */
export function StockOpnameStageHistory({ stages }: { stages: StockOpnameStage[] }) {
  const { t } = useTranslation()

  if (stages.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        {t("stockOpnameDetail.noStageHistory")}
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1
        return (
          <div key={stage.id ?? index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0
                ${isLast
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 mt-1 min-h-4 bg-gray-200 dark:bg-gray-700" />
              )}
            </div>

            <div className="pb-4 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                      {stage.from_stage ?? "—"}
                    </p>
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {stage.to_stage}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {stage.action}
                    {stage.actor_name && (
                      <span className="ml-1">· {t("stockOpnameDetail.by")} {stage.actor_name}</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {formatDateTime(stage.created_at)}
                </span>
              </div>

              {stage.notes && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                  "{stage.notes}"
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
