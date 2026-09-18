import { useState } from "react"
import { useRejectStockOpname } from "../../../hooks/mutation/stockOpname/reject"

type RejectStockOpnameModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

const MIN_REASON_LENGTH = 10

export function RejectStockOpnameModal({
  transactionNumber,
  onClose,
  onSuccess,
}: RejectStockOpnameModalProps) {
  const [reason, setReason] = useState("")

  const { mutate: rejectStockOpname, isPending } = useRejectStockOpname({ transactionNumber })

  const isReasonValid = reason.trim().length >= MIN_REASON_LENGTH

  const handleSubmit = () => {
    if (!isReasonValid) return

    rejectStockOpname(
      { reason: reason.trim() },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Tolak Stock Opname
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {transactionNumber}
            </p>
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
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-red-700 dark:text-red-400">
              Stock opname akan ditolak dan tidak bisa dilanjutkan lagi.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan (minimal 10 karakter)"
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-all disabled:opacity-50"
            />
            {reason.length > 0 && !isReasonValid && (
              <p className="text-xs text-red-500">
                Alasan minimal {MIN_REASON_LENGTH} karakter ({reason.trim().length}/{MIN_REASON_LENGTH})
              </p>
            )}
          </div>
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
            disabled={isPending || !isReasonValid}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menolak..." : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  )
}
