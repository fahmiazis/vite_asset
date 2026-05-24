import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useRemoveAssetFromDisposal } from "../../../hooks/mutation/disposal/deleteAsset"

type RemoveAssetModalProps = {
  transactionNumber: string
  assetId: number
  assetName?: string
  onClose: () => void
  onSuccess?: () => void
}

export function RemoveAssetModal({
  transactionNumber,
  assetId,
  assetName,
  onClose,
  onSuccess,
}: RemoveAssetModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { mutate: removeAsset, isPending } = useRemoveAssetFromDisposal({
    transactionNumber,
  })

  const handleSubmit = () => {
    removeAsset(
      { asset_id: assetId },
      {
        onSuccess: () => {
          toast.success(t("removeAssetModal.toast.success"))

          queryClient.invalidateQueries({
            queryKey: ["disposal", transactionNumber],
          })

          onSuccess?.()
          onClose()
        },

        onError: () => {
          toast.error(t("removeAssetModal.toast.error"))
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
              {t("removeAssetModal.title")}
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
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 dark:text-red-400">
                {t("removeAssetModal.confirmationMessage")}
              </p>
              {assetName && (
                <p className="text-xs text-red-500 dark:text-red-500 mt-0.5 font-mono">
                  {assetName}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {t("removeAssetModal.warningMessage")}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("removeAssetModal.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("removeAssetModal.removing") : t("removeAssetModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}