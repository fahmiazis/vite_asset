import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"

import { useExecuteAsset } from "../../../hooks/mutation/transaction/executeAsset"

type ExecuteAssetModalProps = {
    transactionNumber: string
    onClose: () => void
    onSuccess?: () => void
}

export function ExecuteAssetModal({
    transactionNumber,
    onClose,
    onSuccess,
}: ExecuteAssetModalProps) {
    const [notes, setNotes] = useState("")

    const { t } = useTranslation()

    const queryClient = useQueryClient()

    const { mutate: executeAsset, isPending } =
        useExecuteAsset(transactionNumber)

    const handleSubmit = () => {
        executeAsset(
            { notes },
            {
                onSuccess: () => {
                    toast.success(t("executeAsset.success"))

                    queryClient.invalidateQueries({
                        queryKey: [
                            "approval-transaction",
                            transactionNumber,
                        ],
                    })

                    onSuccess?.()
                    onClose()
                },

                onError: () => {
                    toast.error(t("executeAsset.error"))
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
                            {t("executeAsset.title")}
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

                {/* Body */}
                <div className="px-5 py-4 space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        {t("executeAsset.notes")}{" "}
                        <span className="text-gray-400 font-normal">
                            ({t("executeAsset.optional")})
                        </span>
                    </label>

                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t("executeAsset.placeholder")}
                        disabled={isPending}
                        className="
                            w-full
                            px-3 py-2.5
                            text-sm
                            border border-gray-300 dark:border-gray-700
                            rounded-xl
                            focus:outline-none
                            focus:ring-2 focus:ring-indigo-500
                            bg-white dark:bg-gray-900
                            text-gray-800 dark:text-gray-100
                            placeholder:text-gray-400
                            resize-none
                            transition-all
                            disabled:opacity-50
                        "
                    />
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="
                            flex-1
                            px-4 py-2
                            text-sm font-medium
                            border border-gray-300 dark:border-gray-700
                            text-gray-700 dark:text-gray-300
                            rounded-xl
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            transition-colors
                            disabled:opacity-50
                        "
                    >
                        {t("executeAsset.cancel")}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="
                            flex-1
                            px-4 py-2
                            text-sm font-medium
                            bg-indigo-600 hover:bg-indigo-700
                            text-white
                            rounded-xl
                            transition-colors
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {isPending
                            ? t("executeAsset.submitting")
                            : t("executeAsset.submit")}
                    </button>
                </div>
            </div>
        </div>
    )
}