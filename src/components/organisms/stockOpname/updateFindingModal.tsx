import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useUpdateStockOpnameFinding } from "../../../hooks/mutation/stockOpname/updateFinding"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"
import { getPhysicalStatusOptions, getConditionOptions, getAssetStatusOptions } from "./findingOptions"

type UpdateStockOpnameFindingModalProps = {
  transactionNumber: string
  item: StockOpnameItem
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateStockOpnameFindingModal({
  transactionNumber,
  item,
  onClose,
  onSuccess,
}: UpdateStockOpnameFindingModalProps) {
  const { t } = useTranslation()
  const [physicalStatus, setPhysicalStatus] = useState(item.found_physical_status ?? "")
  const [condition, setCondition] = useState(item.found_condition ?? "")
  const [assetStatus, setAssetStatus] = useState(item.found_asset_status ?? "")
  const [notes, setNotes] = useState(item.notes ?? "")

  const { mutate: updateFinding, isPending } = useUpdateStockOpnameFinding({ transactionNumber })

  const isMissing = physicalStatus === "MISSING"

  // Fisik "Tidak Ada" -> Kondisi otomatis "Tidak Ada" dan terkunci, karena
  // kondisi gak relevan buat dinilai kalau barangnya gak ada. Balik ke
  // "Ada" -> kondisi direset supaya user pilih ulang yang sesuai.
  useEffect(() => {
    if (isMissing) {
      setCondition("NOT_APPLICABLE")
    } else {
      setCondition((prev) => (prev === "NOT_APPLICABLE" ? "" : prev))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMissing])

  const physicalStatusOptions = getPhysicalStatusOptions(t)
  const conditionOptions = getConditionOptions(t).filter(
    (opt) => isMissing || opt.value !== "NOT_APPLICABLE"
  )
  const assetStatusOptions = getAssetStatusOptions(t)

  const handleSubmit = () => {
    if (!physicalStatus || !condition) {
      toast.error(t("stockOpnameFindingModal.toast.required"))
      return
    }

    updateFinding(
      {
        asset_id: item.asset_id,
        physical_status: physicalStatus,
        condition,
        asset_status: assetStatus || undefined,
        notes: notes.trim() || undefined,
      },
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
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("stockOpnameFindingModal.title")}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1 truncate">
              {item.asset_number} — {item.asset_name}
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
        <div className="px-5 py-4 space-y-4">

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameFindingModal.physicalStatus")} <span className="text-red-500">*</span>
            </label>
            <select
              value={physicalStatus}
              onChange={(e) => setPhysicalStatus(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">{t("stockOpnameFindingModal.physicalStatusPlaceholder")}</option>
              {physicalStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameFindingModal.condition")} <span className="text-red-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              disabled={isPending || isMissing}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">{t("stockOpnameFindingModal.conditionPlaceholder")}</option>
              {conditionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameFindingModal.assetStatus")}{" "}
              <span className="text-gray-400 font-normal">{t("stockOpnameFindingModal.assetStatusHint")}</span>
            </label>
            <select
              value={assetStatus}
              onChange={(e) => setAssetStatus(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {assetStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameFindingModal.notes")}{" "}
              <span className="text-gray-400 font-normal">({t("stockOpnameFindingModal.optional")})</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("stockOpnameFindingModal.notesPlaceholder")}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
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
            {t("stockOpnameFindingModal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !physicalStatus || !condition}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("stockOpnameFindingModal.submitting") : t("stockOpnameFindingModal.submit")}
          </button>
        </div>

      </div>
    </div>
  )
}
