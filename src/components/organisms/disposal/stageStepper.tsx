import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import {
  DISPOSAL_STAGE,
  disposalStageLabel,
  stageIndex,
  stagesForDisposalType,
} from "../../../utils/disposalStage"

interface DisposalStageStepperProps {
  disposalType: string | null | undefined
  currentStage: string
  /** stage yang sedang dibuka detailnya — null berarti tertutup semua */
  selectedStage: string | null
  onSelectStage: (stage: string) => void
  /** detail stage terpilih, dirender di bawah stepper */
  children?: ReactNode
}

/**
 * Progres stage disposal. Jalurnya berbeda antara DISPOSE (6 stage)
 * dan SELL (9 stage) — lihat stagesForDisposalType.
 *
 * Tiap stage bisa diklik untuk membuka status stage tersebut (dokumen /
 * approval). Yang terbuka saat halaman dibuka adalah stage berjalan.
 */
export function DisposalStageStepper({
  disposalType,
  currentStage,
  selectedStage,
  onSelectStage,
  children,
}: DisposalStageStepperProps) {
  const { t } = useTranslation()
  const stages = stagesForDisposalType(disposalType)
  const isRejected = currentStage?.toUpperCase() === DISPOSAL_STAGE.REJECTED
  const activeIndex = stageIndex(disposalType, currentStage)

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("disposalStage.sectionTitle")}</h3>
        {isRejected && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {t("disposalStage.rejected")}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-start min-w-max gap-0">
          {stages.map((stage, index) => {
            const isDone = !isRejected && activeIndex > index
            const isActive = !isRejected && activeIndex === index
            const isLast = index === stages.length - 1
            const isSelected = selectedStage === stage

            return (
              <div key={stage} className="flex items-start">
                <button
                  type="button"
                  onClick={() => onSelectStage(stage)}
                  aria-expanded={isSelected}
                  title={t("disposalStage.openDetail", { stage: disposalStageLabel(stage) })}
                  className={`flex flex-col items-center w-24 pt-1 pb-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 ${
                    isSelected ? "bg-indigo-50/70 dark:bg-indigo-900/20" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-colors
                      ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : isActive
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-400"
                      }`}
                  >
                    {isDone ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-[11px] text-center leading-tight px-1 ${
                      isActive
                        ? "font-semibold text-indigo-600 dark:text-indigo-400"
                        : isDone
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-gray-400"
                    }`}
                  >
                    {disposalStageLabel(stage)}
                  </p>
                  {/* penanda stage yang sedang dibuka */}
                  <span
                    className={`mt-1 h-0.5 w-8 rounded-full transition-colors ${
                      isSelected ? "bg-indigo-500" : "bg-transparent"
                    }`}
                  />
                </button>

                {!isLast && (
                  <div
                    className={`h-0.5 w-6 mt-3.5 flex-shrink-0 ${
                      isDone ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {children && (
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  )
}
