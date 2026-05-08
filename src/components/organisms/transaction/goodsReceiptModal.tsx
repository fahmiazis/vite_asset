import { useState } from "react"
import toast from "react-hot-toast"
import { useGoodsReceipt } from "../../../hooks/mutation/transaction/goodsReceipt"
import { useQueryClient } from "@tanstack/react-query"
import type { Item, Asset } from "../../../models/transaction/detailWStages"

type GoodsReceiptModalProps = {
    transactionNumber: string
    items: Item[]
    onClose: () => void
    onSuccess?: () => void
}

type GRFormState = {
    notes: string
}

const initialForm: GRFormState = {
    notes: "",
}

export function GoodsReceiptModal({
    transactionNumber,
    items,
    onClose,
    onSuccess,
}: GoodsReceiptModalProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
    const [form, setForm] = useState<GRFormState>(initialForm)

    const queryClient = useQueryClient()
    const { mutate: submitGR, isPending } = useGoodsReceipt(transactionNumber)

    const handleSelectItem = (itemId: string) => {
        const item = items.find((i) => i.id === Number(itemId)) ?? null
        setSelectedItem(item)
        setSelectedAsset(null) // reset asset saat item berubah
    }

    const handleSelectAsset = (assetId: string) => {
        const asset = selectedItem?.assets.find((a) => a.id === Number(assetId)) ?? null
        setSelectedAsset(asset)
    }

    const handleChange = (field: keyof GRFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const isValid = selectedItem && selectedAsset

    const handleSubmit = () => {
        if (!selectedItem || !selectedAsset) return

        submitGR(
            {
                asset_id: selectedAsset.id,
                asset_number: selectedAsset.asset_number,
                gr_date: new Date().toISOString().split("T")[0],
                notes: form.notes,
            },
            {
                onSuccess: () => {
                    toast.success("Goods Receipt berhasil disubmit")
                    queryClient.invalidateQueries({ queryKey: ["approval-transaction", transactionNumber] })
                    onSuccess?.()
                    onClose()
                },
                onError: () => {
                    toast.error("Gagal submit Goods Receipt")
                },
            }
        )
    }

    const grStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: "bg-amber-50 text-amber-600 border-amber-200",
            done: "bg-emerald-50 text-emerald-600 border-emerald-200",
            cancelled: "bg-red-50 text-red-600 border-red-200",
        }
        return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-500 border-gray-200"
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Goods Receipt
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">{transactionNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4">

                    {/* Select Item */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Pilih Item <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedItem?.id ?? ""}
                            onChange={(e) => handleSelectItem(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        >
                            <option value="">-- Pilih item --</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.item_name} · {item.category_name} · {item.quantity} unit
                                </option>
                            ))}
                        </select>

                        {/* Selected item info */}
                        {selectedItem && (
                            <div className="mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                            {selectedItem.item_name}
                                        </p>
                                        <p className="text-xs text-indigo-400 mt-0.5">
                                            {selectedItem.category_name} · {selectedItem.branch_code}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                        {selectedItem.quantity} unit
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Select Asset — muncul setelah item dipilih */}
                    {selectedItem && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Asset Number <span className="text-red-500">*</span>
                            </label>

                            {selectedItem.assets.length === 0 ? (
                                <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
                                    Tidak ada asset tersedia untuk item ini
                                </p>
                            ) : (
                                <>
                                    <select
                                        value={selectedAsset?.id ?? ""}
                                        onChange={(e) => handleSelectAsset(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    >
                                        <option value="">-- Pilih asset number --</option>
                                        {selectedItem.assets.map((asset) => (
                                            <option
                                                key={asset.id}
                                                value={asset.id}
                                                disabled={asset.gr_status?.toLowerCase() === 'done'}
                                            >
                                                {asset.asset_number} · {asset.asset_name}
                                                {asset.gr_status?.toLowerCase() === 'done' ? ' (sudah GR)' : ''}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Selected asset info */}
                                    {selectedAsset && (
                                        <div className="mt-2 flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div>
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {selectedAsset.asset_number}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {selectedAsset.asset_name}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${grStatusBadge(selectedAsset.gr_status)}`}>
                                                    GR: {selectedAsset.gr_status}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${grStatusBadge(selectedAsset.asset_status)}`}>
                                                    {selectedAsset.asset_status}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* GR Date */}
                    {/* <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal GR <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={form.gr_date}
                            onChange={(e) => handleChange("gr_date", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />
                    </div> */}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={form.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            placeholder="Barang diterima dalam kondisi baik..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !isValid}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Memproses..." : "Submit GR"}
                    </button>
                </div>

            </div>
        </div>
    )
}