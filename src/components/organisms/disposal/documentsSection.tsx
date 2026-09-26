import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisposalAttachmentStatus } from "../../../hooks/query/disposal/attachmentStatus"
import { DisposalAttachmentPanel } from "./attachmentPanel"
import {
  disposalStageLabel,
  hasReachedStage,
  DISPOSAL_STAGE,
  stagesForDisposalType,
} from "../../../utils/disposalStage"

interface StageBlockProps {
  transactionNumber: string
  stage: string
  isCurrent: boolean
  canUpload: boolean
  canReview: boolean
  /**
   * true = blok hanya muncul kalau benar-benar ada berkas terunggah.
   * Dipakai saat transaksi berakhir di stage terminal, karena urutan stage
   * tidak lagi bisa dipakai untuk menentukan sejauh mana transaksi berjalan.
   */
  requireUploads: boolean
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
  canUpload,
  canReview,
  requireUploads,
  onUploadForAsset,
  onResolved,
}: StageBlockProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useDisposalAttachmentStatus(transactionNumber, stage)

  const assets = data?.data?.assets ?? []
  const hasDocuments = requireUploads
    ? assets.some((asset) => asset.attachments.length > 0)
    : assets.some((asset) => asset.total_required > 0 || asset.attachments.length > 0)

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
        canUpload={canUpload}
        canReview={canReview}
        onUploadForAsset={onUploadForAsset}
      />
    </div>
  )
}

interface DisposalDocumentsSectionProps {
  transactionNumber: string
  disposalType: string | null | undefined
  currentStage: string
  /** apakah user boleh mengunggah dokumen di stage tersebut */
  canUploadAtStage?: (stage: string) => boolean
  /** false = tombol keputusan review disembunyikan */
  canReview?: boolean
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
  canUploadAtStage,
  canReview = true,
  onUploadForAsset,
}: DisposalDocumentsSectionProps) {
  const { t } = useTranslation()

  // Dokumen sebuah stage baru relevan setelah transaksi sampai di stage itu.
  // Tanpa filter ini, konfigurasi attachment membuat blok stage berikutnya
  // sudah tampil sejak DRAFT. Di stage terminal (ditolak / dibatalkan) urutan
  // stage tidak bisa dipakai, jadi yang dipakai adalah berkas yang benar-benar
  // sudah terunggah.
  const normalized = currentStage?.toUpperCase()
  const terminal =
    normalized === DISPOSAL_STAGE.REJECTED ||
    normalized === DISPOSAL_STAGE.CANCELLED
  const stages = stagesForDisposalType(disposalType).filter(
    (stage) => terminal || hasReachedStage(disposalType, currentStage, stage)
  )

  // dipakai hanya untuk menentukan perlu tidaknya pesan "tidak ada dokumen"
  const [resolved, setResolved] = useState<Record<string, boolean>>({})

  const handleResolved = useCallback((stage: string, hasDocuments: boolean) => {
    setResolved((prev) =>
      prev[stage] === hasDocuments ? prev : { ...prev, [stage]: hasDocuments }
    )
  }, [])

  const allResolved = stages.every((stage) => stage in resolved)
  const anyDocuments = stages.some((stage) => resolved[stage])

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
            canUpload={canUploadAtStage ? canUploadAtStage(stage) : true}
            canReview={canReview}
            requireUploads={terminal}
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
