import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useApproveTransactionApproval } from "../../../hooks/mutation/mutation/approve"
import { useMutationApprovalStatus } from "../../../hooks/query/mutation/approvalStatus"

type ApproveModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

export function ApproveModal({
  transactionNumber,
  onClose,
  onSuccess,
}: ApproveModalProps) {
  const [notes, setNotes] = useState("")
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { mutate: approve, isPending } =
    useApproveTransactionApproval(transactionNumber)

  const { data: approvalData } =
    useMutationApprovalStatus(transactionNumber)

  const pendingIndex =
    approvalData?.data.approvals.findIndex(
      (a) => a.status?.toLowerCase() === "pending"
    ) ?? 0

  const targetApprovalId =
    approvalData?.data.approvals[pendingIndex]?.id ?? ""

  const handleSubmit = () => {
    approve(
      {
        transaction_approval_id: targetApprovalId,
        notes,
      },
      {
        onSuccess: () => {
          toast.success(t("approveModal.toast.success"))

          queryClient.invalidateQueries({
            queryKey: ["mutation-approval-status", transactionNumber],
          })

          onSuccess?.()
          onClose()
        },
        onError: () => {
          toast.error(t("approveModal.toast.error"))
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t("approveModal.title")}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {transactionNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Info card */}
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-500/5 px-4 py-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10A8 8 0 114 4.5a8 8 0 0114 5.5zm-8-3a1 1 0 10-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                  {t("approveModal.confirmationTitle")}
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                  {t("approveModal.confirmationDescriptions")}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("approveModal.notes")}{" "}
              <span className="text-gray-400 font-normal">({t("approveModal.optional")})</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("approveModal.notesPlaceholder")}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {t("approveModal.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending || !targetApprovalId}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isPending ? t("approveModal.approving") : t("approveModal.approve")}
          </button>
        </div>

      </div>
    </div>
  )
}