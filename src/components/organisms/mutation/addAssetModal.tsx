import { useState } from "react"
import toast from "react-hot-toast"
import { useAddAssetDraftMutation } from "../../../hooks/mutation/mutation/addAssetDraftMutation"
import { useAssetList } from "../../../hooks/query/asset/list"
import { useQueryClient } from "@tanstack/react-query"

type AddAssetModalProps = {
    transactionNumber: string
    onClose: () => void
    onSuccess?: () => void
}

export function AddAssetModal({
    transactionNumber,
    onClose,
    onSuccess,
}: AddAssetModalProps) {
    const queryClient = useQueryClient()
    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
    const [fromLocation, setFromLocation] = useState("")
    const [toLocation, setToLocation] = useState("")
    const [notes, setNotes] = useState("")

    const { data: assetData, isLoading: isLoadingAssets } = useAssetList()
    const { mutate: addAsset, isPending } = useAddAssetDraftMutation(transactionNumber)

    const assets = assetData?.data?.data ?? []
    const selectedAsset = assets.find((a) => a.id === selectedAssetId)

    const handleSubmit = () => {
        if (!selectedAsset) {
            toast.error("Pilih aset terlebih dahulu")
            return
        }
        if (!fromLocation.trim() || !toLocation.trim()) {
            toast.error("Lokasi asal dan tujuan wajib diisi")
            return
        }

        addAsset(
            {
                asset_id: selectedAsset.id,
                asset_number: selectedAsset.asset_number,
                from_location: fromLocation.trim(),
                to_location: toLocation.trim(),
                notes: notes.trim(),
            },
            {
                onSuccess: () => {
                    toast.success("Aset berhasil ditambahkan")
                    queryClient.invalidateQueries({ queryKey: ["mutation-detail"] })
                    onSuccess?.()
                    onClose()
                },
                onError: () => {
                    toast.error("Gagal menambahkan aset")
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
                            Tambah aset
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

                    {/* Select aset */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Aset
                        </label>
                        <select
                            value={selectedAssetId ?? ""}
                            onChange={(e) => setSelectedAssetId(Number(e.target.value) || null)}
                            disabled={isPending || isLoadingAssets}
                            className="
                w-full px-3 py-2.5 text-sm
                border border-gray-300 dark:border-gray-700
                rounded-xl bg-white dark:bg-gray-900
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                disabled:opacity-50
              "
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

                    {/* Lokasi asal & tujuan */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Lokasi asal
                            </label>
                            <input
                                type="text"
                                value={fromLocation}
                                onChange={(e) => setFromLocation(e.target.value)}
                                placeholder="cth. Gedung A Lt. 2"
                                disabled={isPending}
                                className="
                  w-full px-3 py-2.5 text-sm
                  border border-gray-300 dark:border-gray-700
                  rounded-xl bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                  placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  disabled:opacity-50
                "
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Lokasi tujuan
                            </label>
                            <input
                                type="text"
                                value={toLocation}
                                onChange={(e) => setToLocation(e.target.value)}
                                placeholder="cth. Gedung B Lt. 1"
                                disabled={isPending}
                                className="
                  w-full px-3 py-2.5 text-sm
                  border border-gray-300 dark:border-gray-700
                  rounded-xl bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                  placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  disabled:opacity-50
                "
                            />
                        </div>
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
                            placeholder="Alasan pemindahan aset..."
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
                        className="
              flex-1 px-4 py-2 text-sm font-medium
              border border-gray-300 dark:border-gray-700
              text-gray-700 dark:text-gray-300
              rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors disabled:opacity-50
            "
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending || isLoadingAssets}
                        className="
              flex-1 px-4 py-2 text-sm font-medium
              bg-indigo-600 hover:bg-indigo-700
              text-white rounded-xl transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
                    >
                        {isPending ? "Menyimpan..." : "Tambah aset"}
                    </button>
                </div>

            </div>
        </div>
    )
}