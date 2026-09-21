import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisposalAttachmentStatus } from "../../../hooks/query/disposal/attachmentStatus"
import { DisposalAttachmentPanel } from "./attachmentPanel"
import { disposalStageLabel, stagesForDisposalType } from "../../../utils/disposalStage"

interface StageBlockProps {
  transactionNumber: string
  stage: string
  isCurrent: boolean
  onUploadForAsset: (assetNumber: string) => void
  onResolved: (stage: string, hasDocuments: boolean) => void
}

/**
 * Satu blok dokumen untuk satu stage. Stage yang tidak punya config attachment
 * tidak dirender sama sekali — query key-nya sama dengan yang dipakai panel di
 * dalam stepper, jadi react-query tidak menambah request.
 */
function StageDocumentBlock({
  transactionNumber,
  stage,
  isCurrent,
  onUploadForAsset,
  onResolved,
}: StageBlockProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useDisposalAttachmentStatus(transactionNumber, stage)

  const assets = data?.data?.assets ?? []
  const hasDocuments = assets.some(
    (asset) => asset.total_required > 0 || asset.attachments.length > 0
  )

  // lapor ke induk lewat effect — setState saat render komponen lain dilarang
  useEffect(() => {
    if (!isLoading) onResolved(stage, hasDocuments)
  }, [isLoading, hasDocuments, stage, onResolved])

  if (isLoading || !hasDocuments) return null

  const required = assets.reduce((sum, a) => sum + a.total_required, 0)
  const approved = assets.reduce((sum, a) => sum + a.total_approved, 0)

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {disposalStageLabel(stage)}
          </h4>
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {t("disposalStagePanel.currentStage")}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {t("disposalDocuments.summary", { approved, required })}
        </span>
      </div>

      <DisposalAttachmentPanel
        embedded
        transactionNumber={transactionNumber}
        stage={stage}
        onUploadForAsset={onUploadForAsset}
      />
    </div>
  )
}

interface DisposalDocumentsSectionProps {
  transactionNumber: string
  disposalType: string | null | undefined
  currentStage: string
  onUploadForAsset: (assetNumber: string) => void
}

/**
 * Semua dokumen dari seluruh stage dikumpulkan di satu tempat.
 *
 * Panel per stage di dalam stepper tetap ada untuk alur kerja harian, tapi
 * approver (dan auditor) butuh satu tempat untuk melihat dokumen lintas stage
 * tanpa harus mengklik stage satu per satu.
 */
export function DisposalDocumentsSection({
  transactionNumber,
  disposalType,
  currentStage,
  onUploadForAsset,
}: DisposalDocumentsSectionProps) {
  const { t } = useTranslation()
  const stages = stagesForDisposalType(disposalType)

  // dipakai hanya untuk menentukan perlu tidaknya pesan "tidak ada dokumen"
  const [resolved, setResolved] = useState<Record<string, boolean>>({})

  const handleResolved = useCallback((stage: string, hasDocuments: boolean) => {
    setResolved((prev) =>
      prev[stage] === hasDocuments ? prev : { ...prev, [stage]: hasDocuments }
    )
  }, [])

  const allResolved = stages.every((stage) => stage in resolved)
  const anyDocuments = Object.values(resolved).some(Boolean)

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("disposalDocuments.title")}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{t("disposalDocuments.subtitle")}</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <StageDocumentBlock
            key={stage}
            transactionNumber={transactionNumber}
            stage={stage}
            isCurrent={stage === currentStage}
            onUploadForAsset={onUploadForAsset}
            onResolved={handleResolved}
          />
        ))}
      </div>

      {allResolved && !anyDocuments && (
        <p className="text-sm text-gray-400 text-center py-6">
          {t("disposalDocuments.empty")}
        </p>
      )}
    </div>
  )
}
