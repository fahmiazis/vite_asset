import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useSubmitDraftMutation } from "../../../hooks/mutation/mutation/submitDraftMutation"
import { useInitiateApprovalMutation } from "../../../hooks/mutation/mutation/initiateApprovalMutation"

type SubmitMutationModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

export function SubmitMutationModal({
  transactionNumber,
  onClose,
  onSuccess,
}: SubmitMutationModalProps) {
  const [notes, setNotes] = useState("")
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { mutate: submitMutation, isPending: isSubmitting }   = useSubmitDraftMutation(transactionNumber)
  const { mutate: initiateApproval, isPending: isInitiating } = useInitiateApprovalMutation(transactionNumber)

  const isPending = isSubmitting || isInitiating

  const handleSubmit = () => {
    submitMutation(
      { notes: notes.trim() },
      {
        onSuccess: () => {
          initiateApproval(undefined, {
            onSuccess: () => {
              toast.success(t("submitMutationModal.toast.success"))

              queryClient.invalidateQueries({
                queryKey: ["mutation-draft-detail", transactionNumber],
              })

              onSuccess?.()
              onClose()
            },
            onError: () => {
              toast.error(t("submitMutationModal.toast.errorInitiate"))
            },
          })
        },
        onError: () => {
          toast.error(t("submitMutationModal.toast.errorSubmit"))
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
              {t("submitMutationModal.title")}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1 truncate">
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
          {/* Info box */}
          <div className="flex gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              {t("submitMutationModal.warningMessage")}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("submitMutationModal.notes")}{" "}
              <span className="text-gray-400 font-normal">({t("submitMutationModal.optional")})</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("submitMutationModal.notesPlaceholder")}
              disabled={isPending}
              className="
                w-full px-3 py-2.5 text-sm
                border border-gray-300 dark:border-gray-700
                rounded-xl bg-white dark:bg-gray-900
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                resize-none transition-all disabled:opacity-50
              "
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("submitMutationModal.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("submitMutationModal.saving")
              : isInitiating
              ? t("submitMutationModal.processing")
              : t("submitMutationModal.submit")}
          </button>
        </div>

      </div>
    </div>
  )
}