import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useAttachTransaction } from "../../../hooks/query/attachmentSetting/attachTransaction"
import type { transactionAttachmentState } from "../../../models/attachmentSetting/transactionAttachment"
import { useReviewAttachment } from "../../../hooks/mutation/attachSetting/reviewAttachment"
import { useTranslation } from "react-i18next"
import { axiosPrivate } from "../../../libs/instance"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function isImageMime(mime: string) {
  return mime.startsWith("image/")
}

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
}

function formatAttachmentName(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// ─── File Icon ────────────────────────────────────────────────────────────────

function FileTypeIcon({ mime }: { mime: string }) {
  if (isImageMime(mime)) {
    return (
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="14 2 14 8 20 8" />
        <line strokeLinecap="round" strokeWidth={1.5} x1="16" y1="13" x2="8" y2="13" />
        <line strokeLinecap="round" strokeWidth={1.5} x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  )
}

// ─── Preview Panel ────────────────────────────────────────────────────────────

function PreviewPanel({
  item,
  onClose,
}: {
  item: transactionAttachmentState
  onClose: () => void
}) {
  const [zoomed, setZoomed] = useState(false)
  const [objectURL, setObjectURL] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const isImage = isImageMime(item.mime_type)
  const ImageURL = import.meta.env.VITE_IMAGE_ACCESS

  const { t } = useTranslation()

  const fileURL = `${ImageURL}/api/v1/attachments/${item.id}/file`

  useEffect(() => {
    let url: string
    axiosPrivate
      .get(fileURL, { responseType: "blob" })
      .then((res) => {
        url = URL.createObjectURL(res.data)
        setObjectURL(url)
      })
      .catch(() => setLoadError(true))

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [fileURL])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full mx-4 bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            <FileTypeIcon mime={item.mime_type} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {formatAttachmentName(item.attachment_type)}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {item.file_name} · {formatFileSize(item.file_size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isImage && (
              <button
                onClick={() => setZoomed((z) => !z)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title={zoomed ? t("reviewAttachmentModal.zoomOut") : t("reviewAttachmentModal.zoomIn")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {zoomed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  )}
                </svg>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-gray-50 dark:bg-gray-900" style={{ maxHeight: "70vh" }}>
          {/* Loading state */}
          {!objectURL && !loadError && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {loadError && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm text-red-500">{t("reviewAttachmentModal.failedLoad")}</p>
            </div>
          )}

          {/* Content */}
          {objectURL && (
            isImage ? (
              <div className="flex items-center justify-center p-4 min-h-64">
                <img
                  src={objectURL}
                  alt={item.file_name}
                  className="rounded-lg object-contain transition-transform duration-200"
                  style={{
                    maxWidth: zoomed ? "200%" : "100%",
                    maxHeight: "60vh",
                    cursor: zoomed ? "zoom-out" : "zoom-in",
                  }}
                  onClick={() => setZoomed((z) => !z)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.file_name}</p>
                  <p className="text-xs text-gray-400 mt-1">{t("reviewAttachmentModal.previewUnavailable")}</p>
                </div>
                <a
                  href={objectURL}
                  download={item.file_name}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  {t("reviewAttachmentModal.openFile")}
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </div >
  )
}

// ─── Attachment Row ───────────────────────────────────────────────────────────

function AttachmentRow({
  item,
  onPreview,
  onReview,
  isReviewing,
}: {
  item: transactionAttachmentState
  onPreview: () => void
  onReview: (status: "approved" | "rejected", rejection_reason?: string) => void
  isReviewing: boolean
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState<string>(item.rejection_reason ?? "")

  const statusLower = item.status.toLowerCase()

  const handleConfirmReject = () => {
    onReview("rejected", reason)
    setShowRejectForm(false)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-950">
        <FileTypeIcon mime={item.mime_type} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {formatAttachmentName(item.attachment_type)}
            </p>
            {item.is_required && (
              <span className="text-red-500 text-xs flex-shrink-0">*</span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {item.file_name} · {formatFileSize(item.file_size)}
          </p>
          {item.reviewed_by && (
            <p className="text-xs text-gray-400 mt-0.5">
              By{" "}
              <span className="text-gray-600 dark:text-gray-300">{item.reviewed_by}</span>
              {" · "}{formatDate(item.reviewed_at)}
            </p>
          )}
        </div>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0 ${STATUS_CLASS[statusLower] ?? "bg-gray-100 text-gray-600"}`}
        >
          {item.status}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Preview */}
          <button
            onClick={onPreview}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
            </svg>
            Preview
          </button>

          {/* Approve */}
          <button
            onClick={() => onReview("approved")}
            disabled={isReviewing || statusLower === "approved"}
            title="Approve"
            className="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} points="20 6 9 17 4 12" />
            </svg>
          </button>

          {/* Reject */}
          <button
            onClick={() => setShowRejectForm((v) => !v)}
            disabled={isReviewing || statusLower === "rejected"}
            title="Reject"
            className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <line strokeLinecap="round" strokeWidth={2.5} x1="18" y1="6" x2="6" y2="18" />
              <line strokeLinecap="round" strokeWidth={2.5} x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reject form */}
      {showRejectForm && (
        <div className="px-4 pb-4 pt-2 bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-800">
          <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1.5">
            Alasan penolakan{" "}
            <span className="font-normal text-red-400">(opsional)</span>
          </p>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Dokumen buram, mohon upload ulang..."
            className="w-full px-3 py-2 text-xs border border-red-200 dark:border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowRejectForm(false)}
              className="flex-1 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={isReviewing}
              className="flex-1 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isReviewing ? "Menyimpan..." : "Konfirmasi Tolak"}
            </button>
          </div>
        </div>
      )}

      {/* Existing rejection reason display */}
      {!showRejectForm && item.rejection_reason && statusLower === "rejected" && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400">
            <span className="font-medium">Alasan: </span>
            {item.rejection_reason}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
      </div>
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-md" />
      <div className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

type ReviewAttachmentModalProps = {
  transactionId: string       // dipakai untuk query key & URL
  transactionNumber: string   // untuk display header
  transactionType: string
  stage: string
  onClose: () => void
}

export function ReviewAttachmentModal({
  transactionId,
  transactionNumber,
  transactionType,
  stage,
  onClose,
}: ReviewAttachmentModalProps) {
  const [previewItem, setPreviewItem] =
    useState<transactionAttachmentState | null>(null)

  const [reviewingId, setReviewingId] = useState<number | null>(null)

  const { t } = useTranslation()
  const { data, isLoading, error } =
    useAttachTransaction(transactionId)

  const { mutate: reviewMutate } =
    useReviewAttachment(transactionId)

  const attachments = data?.data ?? []

  const pendingCount = attachments.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length

  const approvedCount = attachments.filter(
    (a) => a.status.toLowerCase() === "approved"
  ).length

  const rejectedCount = attachments.filter(
    (a) => a.status.toLowerCase() === "rejected"
  ).length

  const handleReview = (
    id: number,
    status: "approved" | "rejected",
    rejection_reason?: string
  ) => {
    setReviewingId(id)

    reviewMutate(
      {
        id,
        payload: {
          status: status.toUpperCase() as
            | "APPROVED"
            | "REJECTED",
          rejection_reason,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            status === "approved"
              ? t("reviewAttachmentModal.approvedSuccess")
              : t("reviewAttachmentModal.rejectedSuccess")
          )
        },

        onError: () => {
          toast.error(
            t("reviewAttachmentModal.reviewFailed")
          )
        },

        onSettled: () => {
          setReviewingId(null)
        },
      }
    )
  }

  // Better async handling
  const handleApproveAll = async () => {
    const pending = attachments.filter(
      (a) => a.status.toLowerCase() === "pending"
    )

    try {
      await Promise.all(
        pending.map(
          (item) =>
            new Promise<void>((resolve, reject) => {
              reviewMutate(
                {
                  id: item.id,
                  payload: {
                    status: "APPROVED",
                  },
                },
                {
                  onSuccess: () => resolve(),
                  onError: () => reject(),
                }
              )
            })
        )
      )

      toast.success(
        t("reviewAttachmentModal.allApprovedSuccess")
      )
    } catch {
      toast.error(
        t("reviewAttachmentModal.bulkApproveFailed")
      )
    } finally {
      onClose()
    }
  }

  return (
    <>
      {previewItem && (
        <PreviewPanel
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t("reviewAttachmentModal.title")}
              </h3>

              <p className="text-xs text-gray-400 mt-1 break-all">
                {transactionNumber} · {transactionType} · {stage}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label={t("reviewAttachmentModal.close")}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Summary */}
          {!isLoading && !error && (
            <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">

              <span className="text-xs text-gray-400">
                {t(
                  attachments.length > 1
                    ? "reviewAttachmentModal.files"
                    : "reviewAttachmentModal.file",
                  {
                    count: attachments.length,
                  }
                )}
              </span>

              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />

              {pendingCount > 0 && (
                <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-md">
                  {t(
                    "reviewAttachmentModal.pending",
                    {
                      count: pendingCount,
                    }
                  )}
                </span>
              )}

              {approvedCount > 0 && (
                <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md">
                  {t(
                    "reviewAttachmentModal.approved",
                    {
                      count: approvedCount,
                    }
                  )}
                </span>
              )}

              {rejectedCount > 0 && (
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md">
                  {t(
                    "reviewAttachmentModal.rejected",
                    {
                      count: rejectedCount,
                    }
                  )}
                </span>
              )}
            </div>
          )}

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">

            {isLoading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-red-500">
                  {t("reviewAttachmentModal.failedLoad")}
                </p>
              </div>
            )}

            {!isLoading &&
              !error &&
              attachments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">

                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </div>

                  <p className="text-sm text-gray-500">
                    {t("reviewAttachmentModal.empty")}
                  </p>
                </div>
              )}

            {!isLoading &&
              !error &&
              attachments.map((item) => (
                <AttachmentRow
                  key={item.id}
                  item={item}
                  onPreview={() =>
                    setPreviewItem(item)
                  }
                  onReview={(
                    status,
                    rejection_reason
                  ) =>
                    handleReview(
                      item.id,
                      status,
                      rejection_reason
                    )
                  }
                  isReviewing={
                    reviewingId === item.id
                  }
                />
              ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">

            <p className="text-xs text-gray-400">
              {t(
                "reviewAttachmentModal.requiredNote"
              )}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t("reviewAttachmentModal.close")}
              </button>

              {pendingCount > 0 && (
                <button
                  onClick={handleApproveAll}
                  disabled={reviewingId !== null}
                  className="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {t(
                    "reviewAttachmentModal.approveAll",
                    {
                      count: pendingCount,
                    }
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}