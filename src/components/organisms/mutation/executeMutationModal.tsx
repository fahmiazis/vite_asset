import { useState } from "react"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useExecuteMutation } from "../../../hooks/mutation/mutation/executeMutation"

type ExecuteMutationModalProps = {
  transactionNumber: string
  onClose: () => void
  onSuccess?: () => void
}

export function ExecuteMutationModal({
  transactionNumber,
  onClose,
  onSuccess,
}: ExecuteMutationModalProps) {
  const [notes, setNotes] = useState("")

  const queryClient = useQueryClient()
  const { mutate: executeMutation, isPending } = useExecuteMutation(transactionNumber)

  const handleSubmit = () => {
    executeMutation(
      { notes: notes.trim() },
      {
        onSuccess: () => {
          toast.success("Mutasi berhasil dieksekusi")

          queryClient.invalidateQueries({
            queryKey: ["mutation-draft-detail", transactionNumber],
          })

          onSuccess?.()
          onClose()
        },
        onError: () => {
          toast.error("Gagal eksekusi mutasi")
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Eksekusi mutasi
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1 truncate">
                {transactionNumber}
              </p>
            </div>
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
        <div className="px-5 py-4 space-y-3">
          {/* Info box */}
          <div className="flex gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Eksekusi akan memproses perpindahan aset secara permanen. Pastikan seluruh data sudah sesuai sebelum melanjutkan.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth. Eksekusi mutasi aset kantor..."
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
            disabled={isPending}
            className="
              flex-1 px-4 py-2 text-sm font-medium
              bg-indigo-600 hover:bg-indigo-700
              text-white rounded-xl transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isPending && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isPending ? "Memproses..." : "Eksekusi"}
          </button>
        </div>

      </div>
    </div>
  )
}