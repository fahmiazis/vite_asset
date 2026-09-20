import { useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useUploadStockOpnameTemplate } from "../../../hooks/mutation/stockOpname/uploadTemplate"
import type { StockOpnameTemplateUploadResult } from "../../../models/stockOpname/template"

type UploadStockOpnameTemplateModalProps = {
  transactionNumber: string
  onClose: () => void
}

export function UploadStockOpnameTemplateModal({
  transactionNumber,
  onClose,
}: UploadStockOpnameTemplateModalProps) {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<StockOpnameTemplateUploadResult | null>(null)

  const { mutate: uploadTemplate, isPending } = useUploadStockOpnameTemplate({ transactionNumber })

  const handleSubmit = () => {
    if (!file) {
      toast.error(t("stockOpnameTemplateModal.toastUploadRequireFile"))
      return
    }
    uploadTemplate(file, {
      onSuccess: (data) => setResult(data.data),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {result ? t("stockOpnameTemplateModal.resultTitle") : t("stockOpnameTemplateModal.title")}
            </h3>
            {!result && (
              <p className="text-xs text-gray-400 mt-1">
                {t("stockOpnameTemplateModal.description")}
              </p>
            )}
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
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {!result ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("stockOpnameTemplateModal.fileLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                disabled={isPending}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 disabled:opacity-50"
              />
              {!file && (
                <p className="text-xs text-gray-400">{t("stockOpnameTemplateModal.noFileChosen")}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t("stockOpnameTemplateModal.updatedCount")}
                  </p>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                    {result.updated_count}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-3">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {t("stockOpnameTemplateModal.failedCount")}
                  </p>
                  <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                    {result.failed_count}
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {t("stockOpnameTemplateModal.errorsTitle")}
                  </p>
                  <div className="space-y-1.5">
                    {result.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="text-xs px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
                      >
                        <span className="font-medium text-red-700 dark:text-red-400">
                          {t("stockOpnameTemplateModal.errorRow")} {err.row} — {err.asset_number}
                        </span>
                        <p className="text-red-500 dark:text-red-400 mt-0.5">{err.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          {!result ? (
            <>
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {t("stockOpnameTemplateModal.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !file}
                className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? t("stockOpnameTemplateModal.uploading") : t("stockOpnameTemplateModal.submit")}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              {t("stockOpnameTemplateModal.close")}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
