import { useState } from "react"
import toast from "react-hot-toast"
import { Selects } from "../../molecules/input/selects"
import type { Item } from "../../../models/transaction/detailWStages"
import type { VerifyProcurementItem } from "../../../services/transaction/verif"
import { useVerifyProcurement } from "../../../hooks/mutation/transaction/verify"
import { useInitiateApproval } from "../../../hooks/mutation/transaction/initiateApproval"

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = "ASSET" | "NON_ASSET"

const ITEM_TYPE_OPTIONS = [
    { id: 1, value: "ASSET", label: "Asset" },
    { id: 2, value: "NON_ASSET", label: "Non Asset" },
]

type ItemVerifyState = {
    transaction_procurement_id: number
    item_name: string
    item_type: ItemType | ""
    notes: string
}

// ─── Verify Modal ─────────────────────────────────────────────────────────────

type VerifyModalProps = {
    transactionNumber: string
    items: Item[]
    onClose: () => void
    onSuccess?: () => void
}

export function VerifyModal({
    transactionNumber,
    items,
    onClose,
    onSuccess,
}: VerifyModalProps) {
    const [verifyItems, setVerifyItems] = useState<ItemVerifyState[]>(
        items.map((item) => ({
            transaction_procurement_id: item.id,
            item_name: item.item_name,
            item_type: "",
            notes: "",
        }))
    )
    const [globalNotes, setGlobalNotes] = useState("")

    const { mutate: verify, isPending } = useVerifyProcurement(transactionNumber)
    const { mutate: initiateApproval, isPending: isInitiating } = useInitiateApproval(transactionNumber)

    const loading = isPending || isInitiating


    const handleTypeChange = (id: number, value: string) => {
        setVerifyItems((prev) =>
            prev.map((item) =>
                item.transaction_procurement_id === id
                    ? { ...item, item_type: value as ItemType }
                    : item
            )
        )
    }

    const handleNotesChange = (id: number, value: string) => {
        setVerifyItems((prev) =>
            prev.map((item) =>
                item.transaction_procurement_id === id
                    ? { ...item, notes: value }
                    : item
            )
        )
    }

    const hasUnselected = verifyItems.some((item) => !item.item_type)

    const handleSubmit = () => {
        const payload: VerifyProcurementItem[] = verifyItems.map((item) => ({
            transaction_procurement_id: item.transaction_procurement_id,
            item_type: item.item_type as ItemType,
            notes: item.notes,
        }))

        verify(
            { items: payload, notes: globalNotes },
            {
                onSuccess: () => {
                    initiateApproval(undefined, {
                        onSuccess: () => {
                            toast.success("Transaksi berhasil diverifikasi")
                            onSuccess?.()
                            onClose()
                        },
                        onError: () => {
                            toast.error("Gagal memulai approval")
                        },
                    })
                },
                onError: () => {
                    toast.error("Gagal memverifikasi transaksi")
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Verifikasi Transaksi
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
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
                    {verifyItems.map((item) => (
                        <div
                            key={item.transaction_procurement_id}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-3"
                        >
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {item.item_name}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Selects
                                    label="Tipe item"
                                    value={item.item_type}
                                    onChange={(v) => handleTypeChange(item.transaction_procurement_id, v)}
                                    options={ITEM_TYPE_OPTIONS}
                                    placeholder="Pilih tipe"
                                    labelClassName="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    selectClassName="text-sm py-1.5"
                                    required
                                />
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item.notes}
                                        onChange={(e) => handleNotesChange(item.transaction_procurement_id, e.target.value)}
                                        placeholder="Catatan verifikasi..."
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Global notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catatan keseluruhan <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={globalNotes}
                            onChange={(e) => setGlobalNotes(e.target.value)}
                            placeholder="Semua item terverifikasi..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || hasUnselected}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi"}
                    </button>
                </div>

            </div>
        </div>
    )
}
