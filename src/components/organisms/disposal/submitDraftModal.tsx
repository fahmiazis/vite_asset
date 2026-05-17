import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useSubmitDisposal } from "../../../hooks/mutation/disposal/submitDraft"

type SubmitDisposalModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

export function SubmitDisposalModal({
  transactionNumber,
  onClose,
  onSuccess,
}: SubmitDisposalModalProps) {
  const [notes, setNotes] = useState("")
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { mutate: submitDisposal, isPending } = useSubmitDisposal({
    transactionNumber,
  })

  const handleSubmit = () => {
    submitDisposal(
      { notes },
      {
        onSuccess: () => {
          toast.success(t("submitDisposalModal.toast.success"))

          queryClient.invalidateQueries({
            queryKey: ["disposal", transactionNumber],
          })

          onSuccess?.()
          onClose()
        },

        onError: () => {
          toast.error(t("submitDisposalModal.toast.error"))
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
              {t("submitDisposalModal.title")}
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
              {t("submitDisposalModal.infoMessage")}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("submitDisposalModal.notes")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("submitDisposalModal.optional")})
              </span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("submitDisposalModal.notesPlaceholder")}
              disabled={isPending}
              className="
                w-full px-3 py-2.5 text-sm
                border border-gray-300 dark:border-gray-700
                rounded-xl
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                bg-white dark:bg-gray-900
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400
                resize-none transition-all
                disabled:opacity-50
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
            {t("submitDisposalModal.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("submitDisposalModal.submitting") : t("submitDisposalModal.submit")}
          </button>
        </div>
      </div>
    </div>
  )
}