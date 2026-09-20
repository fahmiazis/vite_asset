import { useState } from "react"
import { useReviewDisposalAttachment } from "../../../hooks/mutation/disposal/reviewAttachment"
import type { DisposalAttachment } from "../../../models/disposal/detail"

interface ReviewAttachmentModalProps {
  attachment: DisposalAttachment
  onClose: () => void
}

/**
 * Review dokumen disposal (PUT /transactions/disposal/attachments/:id/review).
 * Attachment stage DRAFT wajib APPROVED sebelum transaksi bisa pindah stage.
 */
export function ReviewAttachmentModal({ attachment, onClose }: ReviewAttachmentModalProps) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED")
  const [reason, setReason] = useState("")

  const { mutate: review, isPending } = useReviewDisposalAttachment({
    onSuccess: onClose,
  })

  const reasonMissing = decision === "REJECTED" && reason.trim().length === 0

  const handleSubmit = () => {
    review({
      id: attachment.id,
      payload: {
        status: decision,
        rejection_reason: decision === "REJECTED" ? reason.trim() : undefined,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Review Dokumen</h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{attachment.file_name}</p>
          </div>
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

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>
              Jenis dokumen:{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {attachment.attachment_type ?? "-"}
              </span>
            </p>
            <p>
              Aset: <span className="font-mono">{attachment.asset_number}</span>
            </p>
            <p>Diupload oleh: {attachment.uploaded_by}</p>
          </div>

          {/* Pilihan keputusan */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDecision("APPROVED")}
              disabled={isPending}
              className={`px-3 py-2.5 text-sm font-medium rounded-xl border transition-colors disabled:opacity-50 ${
                decision === "APPROVED"
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Setujui
            </button>
            <button
              type="button"
              onClick={() => setDecision("REJECTED")}
              disabled={isPending}
              className={`px-3 py-2.5 text-sm font-medium rounded-xl border transition-colors disabled:opacity-50 ${
                decision === "REJECTED"
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Tolak
            </button>
          </div>

          {decision === "REJECTED" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Alasan penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                placeholder="Jelaskan kenapa dokumen ditolak agar pengupload bisa memperbaiki"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none disabled:opacity-50"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || reasonMissing}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              decision === "APPROVED"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Menyimpan..." : "Simpan Review"}
          </button>
        </div>
      </div>
    </div>
  )
}
