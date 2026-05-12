import { useState } from "react"
import toast from "react-hot-toast"
import { useAssetList } from "../../../hooks/query/asset/list"
import { useAddAssetToDisposal } from "../../../hooks/mutation/disposal/addAsset"

type AddAssetToDisposalModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

export function AddAssetToDisposalModal({
  transactionNumber,
  onClose,
  onSuccess,
}: AddAssetToDisposalModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [disposalReason, setDisposalReason] = useState("")
  const [notes, setNotes] = useState("")

  const { data: assetData, isLoading: isLoadingAssets } = useAssetList({ page: 1, limit: 100 })
  const { mutate: addAsset, isPending } = useAddAssetToDisposal({ transactionNumber })

  const assets = assetData?.data?.data ?? []
  const selectedAsset = assets.find((a) => a.id === selectedAssetId)

  const handleSubmit = () => {
    if (!selectedAsset) {
      toast.error("Pilih aset terlebih dahulu")
      return
    }
    if (!disposalReason.trim()) {
      toast.error("Alasan disposal wajib diisi")
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
              Tambah aset disposal
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
              Aset <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAssetId ?? ""}
              onChange={(e) => setSelectedAssetId(Number(e.target.value) || null)}
              disabled={isPending || isLoadingAssets}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">
                {isLoadingAssets ? "Memuat aset..." : "Pilih aset..."}
              </option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.asset_number} — {asset.asset_name}
                </option>
              ))}
            </select>
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
              Alasan disposal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={disposalReason}
              onChange={(e) => setDisposalReason(e.target.value)}
              placeholder="cth. Rusak dan tidak dapat diperbaiki"
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth. Kondisi sudah tidak layak pakai"
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
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || isLoadingAssets || !selectedAssetId || !disposalReason.trim()}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : "Tambah aset"}
          </button>
        </div>

      </div>
    </div>
  )
}