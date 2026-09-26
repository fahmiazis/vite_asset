import { useState } from "react"
import { useTranslation } from "react-i18next"
import { previewKindOf } from "../../../utils/attachmentPreview"

interface ReviewAttachmentDialogProps {
  fileName: string
  attachmentType?: string | null
  assetNumber?: string
  uploadedBy?: string
  mimeType?: string | null
  /** object URL berkas; null selama dimuat atau kalau gagal */
  fileUrl: string | null
  isLoadingFile: boolean
  fileError: unknown
  /** false = dialog jadi mode lihat, tanpa tombol keputusan */
  canDecide?: boolean
  isPending?: boolean
  onApprove: () => void
  onReject: (reason: string) => void
  onClose: () => void
}

/**
 * Dialog review satu dokumen — dipakai disposal dan mutation.
 *
 * Preview mengisi hampir seluruh dialog supaya dokumen terbaca tanpa perlu
 * di-zoom, dan keputusannya langsung (tidak ada langkah "simpan review"
 * terpisah). Komponennya murni presentasional: pemanggil yang menyediakan
 * berkas dan aksi approve/reject, karena endpoint tiap flow berbeda.
 */
export function ReviewAttachmentDialog({
  fileName,
  attachmentType,
  assetNumber,
  uploadedBy,
  mimeType,
  fileUrl,
  isLoadingFile,
  fileError,
  canDecide = true,
  isPending = false,
  onApprove,
  onReject,
  onClose,
}: ReviewAttachmentDialogProps) {
  const { t } = useTranslation()
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [reason, setReason] = useState("")

  const previewKind = previewKindOf(mimeType, fileName)
  const hasPreview = previewKind !== "none" && !!fileUrl && !fileError

  const handleDownload = () => {
    if (!fileUrl) return
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden flex flex-col ${
          hasPreview || isLoadingFile ? "h-[92vh]" : "max-h-[92vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("reviewAttachmentModal.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{fileName}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!fileUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t("reviewAttachmentModal.download")}
            </button>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview — mengisi seluruh ruang yang tersisa */}
        <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900">
          {isLoadingFile ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : fileError ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400 py-16 px-4">
              {t("reviewAttachmentModal.loadError")}
            </p>
          ) : previewKind === "image" && fileUrl ? (
            <div className="h-full overflow-auto flex items-start justify-center p-3">
              <img src={fileUrl} alt={fileName} className="max-w-full object-contain" />
            </div>
          ) : previewKind === "pdf" && fileUrl ? (
            <iframe src={fileUrl} title={fileName} className="w-full h-full bg-white" />
          ) : (
            <p className="text-center text-sm text-gray-400 py-16 px-4">
              {t("reviewAttachmentModal.noPreview")}
            </p>
          )}
        </div>

        {/* Info ringkas — satu baris, tidak memakan ruang preview */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          <span>
            {t("reviewAttachmentModal.documentType")}:{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {attachmentType ?? "-"}
            </span>
          </span>
          {assetNumber && (
            <span>
              {t("reviewAttachmentModal.asset")}:{" "}
              <span className="font-mono">{assetNumber}</span>
            </span>
          )}
          {uploadedBy && (
            <span>
              {t("reviewAttachmentModal.uploadedBy")}: {uploadedBy}
            </span>
          )}
        </div>

        {/* Footer — keputusannya langsung, tanpa langkah simpan terpisah.
            Kalau user tidak berhak memutuskan (atau dokumennya sudah direview),
            dialog ini jadi mode lihat saja. */}
        <div className="flex gap-2 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex-shrink-0">
          {!canDecide ? (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t("reviewAttachmentModal.close")}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
              >
                {t("reviewAttachmentModal.reject")}
              </button>
              <button
                onClick={onApprove}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? t("reviewAttachmentModal.saving") : t("reviewAttachmentModal.approve")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dialog alasan penolakan */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-900/60"
            onClick={() => !isPending && setShowRejectDialog(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t("reviewAttachmentModal.confirmReject")}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{fileName}</p>

            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1.5">
              {t("reviewAttachmentModal.rejectionReason")} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
              placeholder={t("reviewAttachmentModal.rejectionPlaceholder")}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none disabled:opacity-50"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowRejectDialog(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {t("reviewAttachmentModal.cancel")}
              </button>
              <button
                onClick={() => onReject(reason.trim())}
                disabled={isPending || reason.trim().length === 0}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? t("reviewAttachmentModal.saving")
                  : t("reviewAttachmentModal.reject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
