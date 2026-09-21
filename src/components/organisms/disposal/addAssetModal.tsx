import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useAssetList } from "../../../hooks/query/asset/list"
import { useActiveHomebase } from "../../../hooks/query/homebase/active"
import { useAddAssetToDisposal } from "../../../hooks/mutation/disposal/addAsset"

/** sama dengan models.AssetStatusAvailable di backend */
const ASSET_STATUS_AVAILABLE = "AVAILABLE"

type AddAssetToDisposalModalProps = {
  transactionNumber: string
  /** asset_id yang sudah ada di draft ini — disembunyikan dari pilihan */
  existingAssetIds?: number[]
  onClose: () => void
  onSuccess?: () => void
}

export function AddAssetToDisposalModal({
  transactionNumber,
  existingAssetIds = [],
  onClose,
  onSuccess,
}: AddAssetToDisposalModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [disposalReason, setDisposalReason] = useState("")
  const [notes, setNotes] = useState("")
  const [search, setSearch] = useState("")

  const { t } = useTranslation()

  // Filter mengikuti validasi AddAssetToDisposal di backend:
  // status harus AVAILABLE dan cabangnya sama dengan homebase pembuat.
  // Aset yang sudah masuk disposal lain otomatis tidak ikut karena statusnya
  // sudah berubah jadi IN_DISPOSAL.
  const { branchCode, branchName, isLoading: isLoadingBranch } = useActiveHomebase()

  const { data: assetData, isLoading: isLoadingAssets } = useAssetList({
    page: 1,
    limit: 100,
    search: search.trim() || undefined,
    assetStatus: ASSET_STATUS_AVAILABLE,
    branchCode,
    enabled: !!branchCode,
  })

  const { mutate: addAsset, isPending } = useAddAssetToDisposal({ transactionNumber })

  const total = assetData?.data?.total ?? 0

  // Aset yang sudah ada di draft ini disaring di sisi klien — backend menolak
  // duplikat, tapi lebih baik tidak ditawarkan sejak awal.
  const assets = useMemo(() => {
    const taken = new Set(existingAssetIds)
    return (assetData?.data?.data ?? []).filter((a) => !taken.has(a.id))
  }, [assetData, existingAssetIds])

  const selectedAsset = assets.find((a) => a.id === selectedAssetId)
  const isLoadingOptions = isLoadingBranch || isLoadingAssets

  const handleSubmit = () => {
    if (!selectedAsset) {
      toast.error(t("addAssetModal.toast.noAsset"))
      return
    }
    if (!disposalReason.trim()) {
      toast.error(t("addAssetModal.toast.noReason"))
      return
    }

    addAsset(
      {
        asset_id: selectedAsset.id,
        asset_number: selectedAsset.asset_number,
        disposal_reason: disposalReason.trim(),
        notes: notes.trim(),
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
              {t("addAssetModal.title")}
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
        <div className="px-5 py-4 space-y-4">

          {/* Select Aset */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("addAssetModal.asset")} <span className="text-red-500">*</span>
            </label>

            {!branchCode && !isLoadingBranch ? (
              <p className="px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                {t("addAssetModal.noHomebase")}
              </p>
            ) : (
              <>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setSelectedAssetId(null)
                  }}
                  placeholder={t("addAssetModal.searchPlaceholder")}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />

                <select
                  value={selectedAssetId ?? ""}
                  onChange={(e) => setSelectedAssetId(Number(e.target.value) || null)}
                  disabled={isPending || isLoadingOptions}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingOptions
                      ? t("addAssetModal.assetLoading")
                      : assets.length === 0
                        ? t("addAssetModal.assetEmpty")
                        : t("addAssetModal.assetPlaceholder")}
                  </option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.asset_number} — {asset.asset_name}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-gray-400">
                  {t("addAssetModal.filterHint", {
                    branch: branchName || branchCode,
                  })}
                  {total > assets.length &&
                    ` · ${t("addAssetModal.moreResults", { count: total })}`}
                </p>
              </>
            )}
          </div>

          {/* Selected asset info preview */}
          {selectedAsset && (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                  {selectedAsset.asset_name}
                </p>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">
                  {selectedAsset.asset_number}
                </p>
              </div>
            </div>
          )}

          {/* Disposal Reason */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("addAssetModal.disposalReason")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={disposalReason}
              onChange={(e) => setDisposalReason(e.target.value)}
              placeholder={t("addAssetModal.disposalReasonPlaceholder")}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("addAssetModal.notes")}{" "}
              <span className="text-gray-400 font-normal">({t("addAssetModal.optional")})</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("addAssetModal.notesPlaceholder")}
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
            {t("addAssetModal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || isLoadingOptions || !selectedAssetId || !disposalReason.trim()}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("addAssetModal.submitting") : t("addAssetModal.submit")}
          </button>
        </div>

      </div>
    </div>
  )
}