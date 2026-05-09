import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useGoodsReceipt } from "../../../hooks/mutation/transaction/goodsReceipt"
import { useGoodsReceiptStatus } from "../../../hooks/query/transaction/goodsReceipt"
import { useQueryClient } from "@tanstack/react-query"
import type { Item as GRItem, Asset as GRAsset } from "../../../models/transaction/grStatus"

type GoodsReceiptModalProps = {
    transactionNumber: string
    onClose: () => void
    onSuccess?: () => void
}

type Mode = "single" | "bulk-item" | "bulk-all"

export function GoodsReceiptModal({
    transactionNumber,
    onClose,
    onSuccess,
}: GoodsReceiptModalProps) {
    const { t } = useTranslation()

    const [mode, setMode] = useState<Mode>("single")
    const [selectedItem, setSelectedItem] = useState<GRItem | null>(null)
    const [selectedAsset, setSelectedAsset] = useState<GRAsset | null>(null)
    const [notes, setNotes] = useState("")
    const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null)

    const queryClient = useQueryClient()

    const { data: grData, isLoading } = useGoodsReceiptStatus(transactionNumber, "PENDING_RECEIPT")
    const { mutateAsync: submitGR, isPending } = useGoodsReceipt(transactionNumber)

    const items = grData?.data?.items ?? []

    // ─── Helpers ─────────────────────────────────────────────────────────────

    const getPendingAssets = (item: GRItem) =>
        item.assets.filter((a) => a.gr_status?.toLowerCase() === "pending_receipt")

    const allPendingAssets = items.flatMap((item) =>
        getPendingAssets(item).map((asset) => ({ item, asset }))
    )

    const handleSelectItem = (itemId: string) => {
        const item = items.find((i) => i.procurement_item_id === Number(itemId)) ?? null
        setSelectedItem(item)
        setSelectedAsset(null)
    }

    const handleSelectAsset = (assetId: string) => {
        const asset = selectedItem?.assets.find((a) => a.asset_id === Number(assetId)) ?? null
        setSelectedAsset(asset)
    }

    const grDate = new Date().toISOString().split("T")[0]

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ["goods-receipt", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["approval-transaction", transactionNumber] })
    }

    // ─── Submit Handlers ──────────────────────────────────────────────────────

    const handleSubmitSingle = async () => {
        if (!selectedItem || !selectedAsset) return
        try {
            await submitGR({ asset_id: selectedAsset.asset_id, asset_number: selectedAsset.asset_number, gr_date: grDate, notes })
            toast.success(t("goodsReceipt.success", { count: 1 }))
            invalidateQueries()
            onSuccess?.()
            onClose()
        } catch {
            toast.error(t("goodsReceipt.error"))
        }
    }

    const runBulk = async (targets: { asset: GRAsset }[]) => {
        setBulkProgress({ done: 0, total: targets.length })
        let successCount = 0
        let failCount = 0

        for (const { asset } of targets) {
            try {
                await submitGR({ asset_id: asset.asset_id, asset_number: asset.asset_number, gr_date: grDate, notes })
                successCount++
                setBulkProgress((prev) => prev ? { ...prev, done: prev.done + 1 } : null)
            } catch {
                failCount++
            }
        }

        invalidateQueries()
        setBulkProgress(null)

        if (failCount === 0) {
            toast.success(t("goodsReceipt.success", { count: successCount }))
        } else {
            toast(t("goodsReceipt.successPartial", { success: successCount, fail: failCount }), { icon: "⚠️" })
        }

        if (successCount > 0) {
            onSuccess?.()
            onClose()
        }
    }

    const handleSubmit = () => {
        if (mode === "single") return handleSubmitSingle()
        if (mode === "bulk-item" && selectedItem) return runBulk(getPendingAssets(selectedItem).map((asset) => ({ asset })))
        if (mode === "bulk-all") return runBulk(allPendingAssets)
    }

    // ─── Derived state ────────────────────────────────────────────────────────

    const isValid =
        (mode === "single" && !!selectedItem && !!selectedAsset) ||
        (mode === "bulk-item" && !!selectedItem && getPendingAssets(selectedItem).length > 0) ||
        (mode === "bulk-all" && allPendingAssets.length > 0)

    const grStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending_receipt: "bg-amber-50 text-amber-600 border-amber-200",
            done: "bg-emerald-50 text-emerald-600 border-emerald-200",
            cancelled: "bg-red-50 text-red-600 border-red-200",
        }
        return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-500 border-gray-200"
    }

    const submitLabel = () => {
        if (bulkProgress) return t("goodsReceipt.processing", { done: bulkProgress.done, total: bulkProgress.total })
        if (isPending) return t("goodsReceipt.processing", { done: 0, total: 1 })
        if (mode === "bulk-item") return t("goodsReceipt.submitBulkItem", { count: selectedItem ? getPendingAssets(selectedItem).length : 0 })
        if (mode === "bulk-all") return t("goodsReceipt.submitBulkAll", { count: allPendingAssets.length })
        return t("goodsReceipt.submit")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {t("goodsReceipt.title")}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">{transactionNumber}</p>
                    </div>
                    <button onClick={onClose} disabled={isPending} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

                    {/* Progress summary */}
                    {grData?.data && (
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{t("goodsReceipt.progress.label")}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    ✓ {grData.data.gr_done} {t("goodsReceipt.progress.done")}
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    ⏳ {grData.data.gr_pending} {t("goodsReceipt.progress.pending")}
                                </span>
                                <span className="text-xs text-gray-400">
                                    / {grData.data.total_assets} {t("goodsReceipt.progress.total")}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Bulk progress bar */}
                    {bulkProgress && (
                        <div className="px-3 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                    {t("goodsReceipt.progress.processing")}
                                </span>
                                <span className="text-xs text-indigo-500">{bulkProgress.done} / {bulkProgress.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-indigo-100 dark:bg-indigo-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                    style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Mode selector */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("goodsReceipt.mode.label")}
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            {(
                                [
                                    { value: "single", label: t("goodsReceipt.mode.single") },
                                    { value: "bulk-item", label: t("goodsReceipt.mode.bulkItem") },
                                    { value: "bulk-all", label: t("goodsReceipt.mode.bulkAll") },
                                ] as { value: Mode; label: string }[]
                            ).map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        setMode(opt.value)
                                        setSelectedItem(null)
                                        setSelectedAsset(null)
                                    }}
                                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                        mode === opt.value
                                            ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Mode: Single ── */}
                    {mode === "single" && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("goodsReceipt.selectItem.label")} <span className="text-red-500">*</span>
                                </label>
                                {isLoading ? (
                                    <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                                ) : (
                                    <select
                                        value={selectedItem?.procurement_item_id ?? ""}
                                        onChange={(e) => handleSelectItem(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    >
                                        <option value="">{t("goodsReceipt.selectItem.placeholder")}</option>
                                        {items.map((item) => (
                                            <option key={item.procurement_item_id} value={item.procurement_item_id}>
                                                {item.item_name} · {item.branch_code} · {item.quantity} unit
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {selectedItem && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t("goodsReceipt.selectAsset.label")} <span className="text-red-500">*</span>
                                    </label>
                                    {selectedItem.assets.length === 0 ? (
                                        <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
                                            {t("goodsReceipt.selectItem.noAsset")}
                                        </p>
                                    ) : (
                                        <>
                                            <select
                                                value={selectedAsset?.asset_id ?? ""}
                                                onChange={(e) => handleSelectAsset(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">{t("goodsReceipt.selectAsset.placeholder")}</option>
                                                {selectedItem.assets.map((asset) => (
                                                    <option key={asset.asset_id} value={asset.asset_id}>
                                                        {asset.asset_number} · {asset.asset_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {selectedAsset && (
                                                <div className="mt-2 flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{selectedAsset.asset_number}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{selectedAsset.asset_name} · {selectedAsset.branch_code}</p>
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
                        </>
                    )}

                    {/* ── Mode: Bulk per Item ── */}
                    {mode === "bulk-item" && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("goodsReceipt.selectItem.label")} <span className="text-red-500">*</span>
                            </label>
                            {isLoading ? (
                                <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                            ) : (
                                <select
                                    value={selectedItem?.procurement_item_id ?? ""}
                                    onChange={(e) => handleSelectItem(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                >
                                    <option value="">{t("goodsReceipt.selectItem.placeholder")}</option>
                                    {items.map((item) => (
                                        <option key={item.procurement_item_id} value={item.procurement_item_id}>
                                            {item.item_name} · {item.branch_code} · {item.quantity} unit
                                        </option>
                                    ))}
                                </select>
                            )}

                            {selectedItem && (
                                <div className="mt-2 px-3 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{selectedItem.item_name}</p>
                                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                            {getPendingAssets(selectedItem).length} {t("goodsReceipt.selectItem.assetPending")}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {getPendingAssets(selectedItem).map((asset) => (
                                            <span key={asset.asset_id} className="text-xs px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 rounded">
                                                {asset.asset_number}
                                            </span>
                                        ))}
                                    </div>
                                    {getPendingAssets(selectedItem).length === 0 && (
                                        <p className="text-xs text-amber-500">{t("goodsReceipt.selectItem.noAsset")}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Mode: Bulk All ── */}
                    {mode === "bulk-all" && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {t("goodsReceipt.bulkAll.label")} ({allPendingAssets.length} asset)
                            </p>
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : allPendingAssets.length === 0 ? (
                                <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
                                    {t("goodsReceipt.bulkAll.empty")}
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {items.map((item) => {
                                        const pending = getPendingAssets(item)
                                        if (pending.length === 0) return null
                                        return (
                                            <div key={item.procurement_item_id} className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.item_name}</p>
                                                    <span className="text-xs text-gray-400">{pending.length} asset</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {pending.map((asset) => (
                                                        <span key={asset.asset_id} className="text-xs px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded">
                                                            {asset.asset_number}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("goodsReceipt.notes.label")}{" "}
                            <span className="text-gray-400 font-normal">({t("goodsReceipt.notes.optional")})</span>
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t("goodsReceipt.notes.placeholder")}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
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
                        {t("goodsReceipt.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !isValid || !!bulkProgress}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {submitLabel()}
                    </button>
                </div>
            </div>
        </div>
    )
}