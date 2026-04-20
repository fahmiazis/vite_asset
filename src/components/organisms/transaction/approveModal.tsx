import { useState } from "react"
import toast from "react-hot-toast"
import { useApproveTransaction } from "../../../hooks/mutation/transaction/approveTransaction"
import { useApprovalStatus } from "../../../hooks/query/transaction/approvalStatus"

type ApproveModalProps = {
    transactionNumber: string
    transactionApprovalId: string
    onClose: () => void
    onSuccess?: () => void
}

export function ApproveModal({
    transactionNumber,
    transactionApprovalId,
    onClose,
    onSuccess,
}: ApproveModalProps) {
    const [notes, setNotes] = useState("")

    const { mutate: approve, isPending } = useApproveTransaction(transactionNumber)
    const { data: approvalId } = useApprovalStatus(transactionApprovalId)

    const handleSubmit = () => {
        approve(
            { transaction_approval_id: approvalId?.data.approvals[0].id || "", notes },
            {
                onSuccess: () => {
                    toast.success("Transaksi berhasil disetujui")
                    onSuccess?.()
                    onClose()
                },
                onError: () => {
                    toast.error("Gagal menyetujui transaksi")
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-sm mx-4">

                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Approve Transaksi
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
                <div className="px-5 py-4">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Disetujui..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 resize-none"
                    />
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
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Menyetujui..." : "Approve"}
                    </button>
                </div>

            </div>
        </div>
    )
}