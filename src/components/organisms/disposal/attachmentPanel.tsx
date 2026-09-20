import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisposalAttachmentStatus } from "../../../hooks/query/disposal/attachmentStatus"
import { ReviewAttachmentModal } from "./reviewAttachmentModal"
import { disposalStageLabel } from "../../../utils/disposalStage"
import type { DisposalAttachment } from "../../../models/disposal/detail"
import type { DisposalAssetAttachmentStatus } from "../../../models/disposal/attachmentStatus"

function formatBytes(size?: number | null) {
  if (size == null) return "-"
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentStatusPill({ status }: { status: string }) {
  const { t } = useTranslation()
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    REJECTED: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  }
  const key = status?.toUpperCase()
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[key] ?? map.PENDING}`}>
      {t(`disposalStagePanel.attachmentStatus.${key}`, { defaultValue: status })}
    </span>
  )
}

function AssetAttachmentCard({
  asset,
  canReview,
  onReview,
  onUpload,
}: {
  asset: DisposalAssetAttachmentStatus
  canReview: boolean
  onReview: (att: DisposalAttachment) => void
  onUpload: () => void
}) {
  const { t } = useTranslation()
  const missing = Math.max(
    0,
    asset.total_required - asset.total_approved - asset.total_pending - asset.total_rejected
  )

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
        <div className="min-w-0">
          <p className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
            {asset.asset_number}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("disposalStagePanel.card.approvedOf", {
              done: asset.total_approved,
              total: asset.total_required,
            })}
            {asset.total_pending > 0 &&
              ` · ${t("disposalStagePanel.card.pending", { count: asset.total_pending })}`}
            {asset.total_rejected > 0 &&
              ` · ${t("disposalStagePanel.card.rejected", { count: asset.total_rejected })}`}
            {missing > 0 &&
              ` · ${t("disposalStagePanel.card.missing", { count: missing })}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
              asset.can_proceed
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${asset.can_proceed ? "bg-emerald-500" : "bg-amber-400"}`} />
            {asset.can_proceed
              ? t("disposalStagePanel.card.complete")
              : t("disposalStagePanel.card.incomplete")}
          </span>

          <button
            onClick={onUpload}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
          >
            {t("disposalStagePanel.card.upload")}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {asset.attachments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            {t("disposalStagePanel.card.noUploads")}
          </p>
        ) : (
          asset.attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {att.attachment_type ?? att.file_name}
                  {att.is_required && <span className="text-red-500 ml-0.5">*</span>}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {att.file_name} · {formatBytes(att.file_size)}
                </p>
                {att.status?.toUpperCase() === "REJECTED" && att.rejection_reason && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {t("disposalStagePanel.card.rejectionReason")}: {att.rejection_reason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <AttachmentStatusPill status={att.status} />
                {canReview && att.status?.toUpperCase() === "PENDING" && (
                  <button
                    onClick={() => onReview(att)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                  >
                    {t("disposalStagePanel.card.review")}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface DisposalAttachmentPanelProps {
  transactionNumber: string
  /** stage yang ditampilkan status dokumennya */
  stage: string
  /** true kalau dirender di dalam kartu lain (stepper) — chrome kartunya dilepas */
  embedded?: boolean
  /** tampilkan tombol review (butuh permission review_attachment) */
  canReview?: boolean
  /** dipanggil saat user menekan Upload pada satu aset */
  onUploadForAsset: (assetNumber: string) => void
}

/**
 * Menampilkan kelengkapan dokumen per aset untuk satu stage.
 * `can_proceed` dari backend menentukan apakah transisi stage akan diterima.
 */
export function DisposalAttachmentPanel({
  transactionNumber,
  stage,
  embedded = false,
  canReview = true,
  onUploadForAsset,
}: DisposalAttachmentPanelProps) {
  const { t } = useTranslation()
  const [reviewTarget, setReviewTarget] = useState<DisposalAttachment | null>(null)
  const { data, isLoading } = useDisposalAttachmentStatus(transactionNumber, stage)

  const status = data?.data

  return (
    <div
      className={
        embedded
          ? ""
          : "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
      }
    >
      {reviewTarget && (
        <ReviewAttachmentModal
          attachment={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("disposalStagePanel.documentsTitle", { stage: disposalStageLabel(stage) })}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("disposalStagePanel.documentsHint")}
          </p>
        </div>

        {status && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              status.all_can_proceed
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.all_can_proceed ? "bg-emerald-500" : "bg-amber-400"}`} />
            {status.all_can_proceed
              ? t("disposalStagePanel.allComplete")
              : t("disposalStagePanel.someIncomplete")}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !status || status.assets.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">
          {t("disposalStagePanel.noDocuments")}
        </p>
      ) : (
        <div className="space-y-3">
          {status.assets.map((asset) => (
            <AssetAttachmentCard
              key={asset.asset_id}
              asset={asset}
              canReview={canReview}
              onReview={setReviewTarget}
              onUpload={() => onUploadForAsset(asset.asset_number)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
