import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutationAttachmentStatus } from "../../../hooks/query/mutation/attachmentStatus"
import { useMyProfile } from "../../../hooks/query/auth/myProfile"
import { ReviewMutationAttachmentModal } from "./reviewAttachmentModal"
import {
  AttachmentStatusPill,
  CompletenessBadge,
  formatBytes,
} from "../common/attachmentBadges"
import type {
  MutationAssetAttachmentStatus,
  MutationAttachment,
} from "../../../models/mutation/attachmentStatus"

/** status review dokumen — sama dengan enum di backend */
const STATUS_TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const
type StatusTab = (typeof STATUS_TABS)[number]

function AssetAttachmentCard({
  asset,
  canReview,
  canUpload,
  currentUserId,
  statusTab,
  onReview,
  onUpload,
}: {
  asset: MutationAssetAttachmentStatus
  canReview: boolean
  canUpload: boolean
  currentUserId?: string
  statusTab: StatusTab
  onReview: (att: MutationAttachment) => void
  onUpload: () => void
}) {
  const { t } = useTranslation()

  const visibleAttachments =
    statusTab === "ALL"
      ? asset.attachments
      : asset.attachments.filter((att) => att.status?.toUpperCase() === statusTab)

  const missing = Math.max(
    0,
    asset.total_required - asset.total_approved - asset.total_pending - asset.total_rejected
  )

  // Pengunggah tidak menilai dokumennya sendiri — dicerminkan dari backend,
  // yang menolak review kalau uploaded_by sama dengan reviewer.
  const canDecideOn = (att: MutationAttachment) =>
    canReview &&
    att.status?.toUpperCase() === "PENDING" &&
    att.uploaded_by !== currentUserId

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
            {missing > 0 && ` · ${t("disposalStagePanel.card.missing", { count: missing })}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <CompletenessBadge asset={asset} />

          {canUpload && (
            <button
              onClick={onUpload}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
            >
              {t("disposalStagePanel.card.upload")}
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        {visibleAttachments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            {statusTab === "ALL"
              ? t("disposalStagePanel.card.noUploads")
              : t("disposalStagePanel.card.noneWithStatus")}
          </p>
        ) : (
          visibleAttachments.map((att) => (
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

                {/* Dokumen selalu bisa dibuka — yang sudah disetujui atau
                    ditolak pun masih perlu bisa dilihat. Yang dibatasi adalah
                    keputusan review-nya, bukan aksesnya. */}
                <button
                  onClick={() => onReview(att)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                >
                  {canDecideOn(att)
                    ? t("disposalStagePanel.card.review")
                    : t("disposalStagePanel.card.view")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface MutationAttachmentPanelProps {
  transactionNumber: string
  /** tampilkan tombol keputusan review */
  canReview?: boolean
  /** false kalau bukan giliran user ini yang mengunggah */
  canUpload?: boolean
  /** dipanggil saat user menekan Upload pada satu aset */
  onUploadForAsset: (assetNumber: string) => void
}

/**
 * Kelengkapan dokumen per aset untuk satu transaksi mutasi.
 *
 * Berbeda dengan disposal, dokumen mutasi tidak dipisah per stage — satu
 * transaksi punya satu kumpulan dokumen per aset, jadi panelnya tidak
 * memerlukan pemilih stage.
 */
export function MutationAttachmentPanel({
  transactionNumber,
  canReview = true,
  canUpload = true,
  onUploadForAsset,
}: MutationAttachmentPanelProps) {
  const { t } = useTranslation()
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL")
  const [reviewTarget, setReviewTarget] = useState<MutationAttachment | null>(null)

  const { data, isLoading } = useMutationAttachmentStatus(transactionNumber)
  const { data: profile } = useMyProfile()
  const currentUserId = profile?.data?.id

  const status = data?.data

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      {reviewTarget && (
        <ReviewMutationAttachmentModal
          attachment={reviewTarget}
          // keputusan hanya untuk yang berhak, masih PENDING, dan bukan
          // dokumen yang diunggah user itu sendiri
          canDecide={
            canReview &&
            reviewTarget.status?.toUpperCase() === "PENDING" &&
            reviewTarget.uploaded_by !== currentUserId
          }
          onClose={() => setReviewTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("mutationDocuments.title")}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{t("mutationDocuments.subtitle")}</p>
        </div>

        {status && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              status.all_can_proceed
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status.all_can_proceed ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
            {status.all_can_proceed
              ? t("disposalStagePanel.allComplete")
              : t("disposalStagePanel.someIncomplete")}
          </span>
        )}
      </div>

      {/* Tab status dokumen — biar user langsung tahu mana yang masih perlu
          ditindaklanjuti tanpa membaca satu per satu */}
      {status && status.assets.length > 0 && (
        <div className="flex items-center gap-1 mb-3 border-b border-gray-100 dark:border-gray-800">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "ALL"
                ? status.assets.reduce((sum, a) => sum + a.attachments.length, 0)
                : status.assets.reduce(
                    (sum, a) =>
                      sum +
                      a.attachments.filter((att) => att.status?.toUpperCase() === tab).length,
                    0
                  )

            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
                  statusTab === tab
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t(`disposalStagePanel.tab.${tab}`)}
                <span className="ml-1 text-gray-400">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !status || status.assets.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          {t("mutationDocuments.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {status.assets.map((asset) => (
            <AssetAttachmentCard
              key={asset.asset_id}
              asset={asset}
              canReview={canReview}
              canUpload={canUpload}
              currentUserId={currentUserId}
              statusTab={statusTab}
              onReview={setReviewTarget}
              onUpload={() => onUploadForAsset(asset.asset_number)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
