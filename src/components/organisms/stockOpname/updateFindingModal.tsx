import { useState } from "react"
import toast from "react-hot-toast"
import { useUpdateStockOpnameFinding } from "../../../hooks/mutation/stockOpname/updateFinding"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"

type UpdateStockOpnameFindingModalProps = {
  transactionNumber: string
  item: StockOpnameItem
  onClose: () => void
  onSuccess?: () => void
}

const PHYSICAL_STATUS_OPTIONS = [
  { value: "EXISTS", label: "Ada / Sesuai" },
  { value: "MISSING", label: "Hilang" },
  { value: "DAMAGED", label: "Rusak" },
  { value: "OBSOLETE", label: "Usang / Tidak Terpakai" },
]

const CONDITION_OPTIONS = [
  { value: "GOOD", label: "Baik" },
  { value: "FAIR", label: "Cukup" },
  { value: "POOR", label: "Kurang" },
  { value: "BROKEN", label: "Rusak Berat" },
]

const ASSET_STATUS_OPTIONS = [
  { value: "", label: "Tidak diubah" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Tidak Aktif" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "RETIRED", label: "Retired" },
]

export function UpdateStockOpnameFindingModal({
  transactionNumber,
  item,
  onClose,
  onSuccess,
}: UpdateStockOpnameFindingModalProps) {
  const [physicalStatus, setPhysicalStatus] = useState(item.found_physical_status ?? "")
  const [condition, setCondition] = useState(item.found_condition ?? "")
  const [assetStatus, setAssetStatus] = useState(item.found_asset_status ?? "")
  const [notes, setNotes] = useState(item.notes ?? "")

  const { mutate: updateFinding, isPending } = useUpdateStockOpnameFinding({ transactionNumber })

  const handleSubmit = () => {
    if (!physicalStatus || !condition) {
      toast.error("Status fisik dan kondisi wajib diisi")
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
              Isi Temuan Fisik
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
              Status Fisik <span className="text-red-500">*</span>
            </label>
            <select
              value={physicalStatus}
              onChange={(e) => setPhysicalStatus(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">Pilih status fisik</option>
              {PHYSICAL_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Kondisi <span className="text-red-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">Pilih kondisi</option>
              {CONDITION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Status Aset{" "}
              <span className="text-gray-400 font-normal">(opsional, isi jika berubah)</span>
            </label>
            <select
              value={assetStatus}
              onChange={(e) => setAssetStatus(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {ASSET_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Ditemukan lecet pada bodi unit"
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
            disabled={isPending || !physicalStatus || !condition}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : "Simpan Temuan"}
          </button>
        </div>

      </div>
    </div>
  )
}
