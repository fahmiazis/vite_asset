import { useState } from "react"
import toast from "react-hot-toast"
import { useGoodsReceipt } from "../../../hooks/mutation/transaction/goodsReceipt"
import { useGoodsReceiptStatus } from "../../../hooks/query/transaction/goodsReceipt"
import { useQueryClient } from "@tanstack/react-query"
import type { Item as GRItem, Asset as GRAsset } from "../../../models/transaction/grStatus"

type GoodsReceiptModalProps = {
    transactionNumber: string
    onClose: () => void
    onSuccess?: () => void
}

type GRFormState = {
    notes: string
}

export function GoodsReceiptModal({
    transactionNumber,
    onClose,
    onSuccess,
}: GoodsReceiptModalProps) {
    const [selectedItem, setSelectedItem] = useState<GRItem | null>(null)
    const [selectedAsset, setSelectedAsset] = useState<GRAsset | null>(null)
    const [form, setForm] = useState<GRFormState>({ notes: "" })

    const queryClient = useQueryClient()

    const { data: grData, isLoading } = useGoodsReceiptStatus(transactionNumber, "PENDING_RECEIPT")
    const { mutate: submitGR, isPending } = useGoodsReceipt(transactionNumber)

    const items = grData?.data?.items ?? []

    const handleSelectItem = (itemId: string) => {
        const item = items.find((i) => i.procurement_item_id === Number(itemId)) ?? null
        setSelectedItem(item)
        setSelectedAsset(null)
    }

    const handleSelectAsset = (assetId: string) => {
        const asset = selectedItem?.assets.find((a) => a.asset_id === Number(assetId)) ?? null
        setSelectedAsset(asset)
    }

    const isValid = selectedItem && selectedAsset

    const handleSubmit = () => {
        if (!selectedItem || !selectedAsset) return

        submitGR(
            {
                asset_id: selectedAsset.asset_id,
                asset_number: selectedAsset.asset_number,
                gr_date: new Date().toISOString().split("T")[0],
                notes: form.notes,
            },
            {
                onSuccess: () => {
                    toast.success("Goods Receipt berhasil disubmit")
                    queryClient.invalidateQueries({ queryKey: ["goods-receipt", transactionNumber] })
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
            pending_receipt: "bg-amber-50 text-amber-600 border-amber-200",
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
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4">

                    {/* Progress summary */}
                    {grData?.data && (
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Progress GR</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    ✓ {grData.data.gr_done} done
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    ⏳ {grData.data.gr_pending} pending
                                </span>
                                <span className="text-xs text-gray-400">
                                    / {grData.data.total_assets} total
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Select Item */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Pilih Item <span className="text-red-500">*</span>
                        </label>

                        {isLoading ? (
                            <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                        ) : (
                            <select
                                value={selectedItem?.procurement_item_id ?? ""}
                                onChange={(e) => handleSelectItem(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                            >
                                <option value="">-- Pilih item --</option>
                                {items.map((item) => (
                                    <option key={item.procurement_item_id} value={item.procurement_item_id}>
                                        {item.item_name} · {item.branch_code} · {item.quantity} unit
                                    </option>
                                ))}
                            </select>
                        )}

                        {selectedItem && (
                            <div className="mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                            {selectedItem.item_name}
                                        </p>
                                        <p className="text-xs text-indigo-400 mt-0.5">
                                            {selectedItem.branch_code}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                        {selectedItem.quantity} unit
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Select Asset */}
                    {selectedItem && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Asset Number <span className="text-red-500">*</span>
                            </label>

                            {selectedItem.assets.length === 0 ? (
                                <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
                                    Tidak ada asset pending untuk item ini
                                </p>
                            ) : (
                                <>
                                    <select
                                        value={selectedAsset?.asset_id ?? ""}
                                        onChange={(e) => handleSelectAsset(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    >
                                        <option value="">-- Pilih asset number --</option>
                                        {selectedItem.assets.map((asset) => (
                                            <option key={asset.asset_id} value={asset.asset_id}>
                                                {asset.asset_number} · {asset.asset_name}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedAsset && (
                                        <div className="mt-2 flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div>
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {selectedAsset.asset_number}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {selectedAsset.asset_name} · {selectedAsset.branch_code}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${grStatusBadge(selectedAsset.gr_status)}`}>
                                                {selectedAsset.gr_status}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={form.notes}
                            onChange={(e) => setForm({ notes: e.target.value })}
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