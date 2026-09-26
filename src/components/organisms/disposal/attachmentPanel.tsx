import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisposalAttachmentStatus } from "../../../hooks/query/disposal/attachmentStatus"
import { useMyProfile } from "../../../hooks/query/auth/myProfile"
import { ReviewAttachmentModal } from "./reviewAttachmentModal"
import {
  attachmentsUploadedForStage,
  disposalStageLabel,
} from "../../../utils/disposalStage"
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

/**
 * Kelengkapan dokumen satu aset punya tiga keadaan, bukan dua. Semua berkas
 * wajib sudah terunggah tapi belum direview bukan kesalahan pengunggah —
 * menyebutnya "belum lengkap" membuat orang yang bertugas mengunggah mengira
 * pekerjaannya kurang, padahal yang ditunggu adalah reviewer.
 */
type Completeness = "COMPLETE" | "UPLOADED" | "INCOMPLETE"

function completenessOf(asset: DisposalAssetAttachmentStatus): Completeness {
  if (asset.can_proceed) return "COMPLETE"
  // aturan "sudah terunggah" dipakai bersama pengecekan transisi stage
  if (attachmentsUploadedForStage([asset])) return "UPLOADED"
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

function AssetAttachmentCard({
  asset,
  canReview,
  canUpload,
  currentUserId,
  statusTab,
  onReview,
  onUpload,
}: {
  asset: DisposalAssetAttachmentStatus
  canReview: boolean
  canUpload: boolean
  currentUserId?: string
  statusTab: StatusTab
  onReview: (att: DisposalAttachment) => void
  onUpload: () => void
}) {
  const { t } = useTranslation()

  const visibleAttachments =
    statusTab === "ALL"
      ? asset.attachments
      : asset.attachments.filter((att) => att.status?.toUpperCase() === statusTab)

  const completeness = COMPLETENESS_STYLE[completenessOf(asset)]

  // Pengunggah tidak menilai dokumennya sendiri — dicerminkan dari backend,
  // yang menolak review kalau uploaded_by sama dengan reviewer.
  const canDecideOn = (att: DisposalAttachment) =>
    canReview &&
    att.status?.toUpperCase() === "PENDING" &&
    att.uploaded_by !== currentUserId

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
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${completeness.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${completeness.dot}`} />
            {t(`disposalStagePanel.card.${completeness.key}`)}
          </span>

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

interface DisposalAttachmentPanelProps {
  transactionNumber: string
  /** stage yang ditampilkan status dokumennya */
  stage: string
  /** true kalau dirender di dalam kartu lain (stepper) — chrome kartunya dilepas */
  embedded?: boolean
  /** tampilkan tombol review (butuh permission review_attachment) */
  canReview?: boolean
  /** false kalau stage ini bukan tanggung jawab user yang sedang login */
  canUpload?: boolean
  /** dipanggil saat user menekan Upload pada satu aset */
  onUploadForAsset: (assetNumber: string) => void
}

/** status review dokumen — sama dengan enum di backend */
const STATUS_TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const
type StatusTab = (typeof STATUS_TABS)[number]

/**
 * Menampilkan kelengkapan dokumen per aset untuk satu stage.
 * `can_proceed` dari backend menentukan apakah transisi stage akan diterima.
 */
export function DisposalAttachmentPanel({
  transactionNumber,
  stage,
  embedded = false,
  canReview = true,
  canUpload = true,
  onUploadForAsset,
}: DisposalAttachmentPanelProps) {
  const { t } = useTranslation()
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL")
  const [reviewTarget, setReviewTarget] = useState<DisposalAttachment | null>(null)
  const { data, isLoading } = useDisposalAttachmentStatus(transactionNumber, stage)
  const { data: profile } = useMyProfile()
  const currentUserId = profile?.data?.id

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
                      a.attachments.filter((att) => att.status?.toUpperCase() === tab)
                        .length,
                    0
                  )

            const active = statusTab === tab

            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
                  active
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t(`disposalStagePanel.tab.${tab}`)}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    active
                      ? "bg-indigo-50 dark:bg-indigo-900/40"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

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
