import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import toast from "react-hot-toast"
import { Inputs } from "../../../molecules/input/inputs"
import { InputToggle } from "../../../molecules/input/inputTogle"
import type { StockOpnameConditionMaster } from "../../../../models/stockOpname/statusMaster"
import { useCreateStockOpnameConditionMaster } from "../../../../hooks/mutation/stockOpname/conditionMasterCreate"
import { useDeleteStockOpnameConditionMaster } from "../../../../hooks/mutation/stockOpname/conditionMasterDelete"

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      <InputToggle checked={value} onChange={onChange} />
    </div>
  )
}

// ─── Create Modal ─────────────────────────────────────────────────────────

export function CreateConditionModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [isNotApplicableValue, setIsNotApplicableValue] = useState(false)
  const [reportBucket, setReportBucket] = useState<"" | "BAIK" | "RUSAK">("")

  const { mutate, isPending } = useCreateStockOpnameConditionMaster()

  const handleSubmit = () => {
    if (!code.trim() || !label.trim()) {
      toast.error("Code dan label wajib diisi")
      return
    }
    mutate(
      {
        code: code.trim(),
        label: label.trim(),
        is_not_applicable_value: isNotApplicableValue,
        report_bucket: reportBucket,
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">Tambah Kondisi</h3>
        <p className="text-xs text-gray-400 mb-4">
          Flag di bawah tidak bisa diubah lagi setelah dibuat (tidak ada edit) — pastikan sudah sesuai.
        </p>

        <div className="space-y-4">
          <Inputs
            label="Code"
            value={code}
            onChange={setCode}
            placeholder="Contoh: HILANG_SEBAGIAN"
            helperText="Huruf kapital, angka, underscore. Otomatis di-uppercase."
          />
          <Inputs label="Label" value={label} onChange={setLabel} placeholder="Contoh: Hilang Sebagian" />

          <ToggleRow
            label="Representasi Tidak Ada / N.A"
            hint="Dipakai sebagai pasangan wajib untuk status fisik yang 'Wajib Kondisi Tidak Ada' (mis. Hilang/Dipinjam)"
            value={isNotApplicableValue}
            onChange={setIsNotApplicableValue}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Bucket Laporan
            </label>
            <select
              value={reportBucket}
              onChange={(e) => setReportBucket(e.target.value as "" | "BAIK" | "RUSAK")}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            >
              <option value="">Tidak dihitung di bucket manapun</option>
              <option value="BAIK">Baik</option>
              <option value="RUSAK">Rusak</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────

function DeleteModal({ id, label, onCancel }: { id: number; label: string; onCancel: () => void }) {
  const { mutate: deleteRow, isPending } = useDeleteStockOpnameConditionMaster()

  const handleDelete = () => {
    deleteRow(id, { onSuccess: () => onCancel() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Hapus Kondisi
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Yakin mau hapus <span className="font-medium text-gray-700 dark:text-gray-300">"{label}"</span>?
          Kondisi yang sudah pernah dipakai di transaksi tetap tersimpan di data lama, cuma gak bisa dipilih lagi buat temuan baru.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        value
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {value ? "Ya" : "Tidak"}
    </span>
  )
}

function ActionButtons({ row }: { row: StockOpnameConditionMaster }) {
  const [showDelete, setShowDelete] = useState(false)

  if (row.is_system) {
    return <span className="text-xs text-gray-400">Bawaan sistem</span>
  }

  return (
    <>
      <button
        onClick={() => setShowDelete(true)}
        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
      >
        Hapus
      </button>
      {showDelete && <DeleteModal id={row.id} label={row.label} onCancel={() => setShowDelete(false)} />}
    </>
  )
}

export const conditionMasterColumns: ColumnDef<StockOpnameConditionMaster>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 50,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => <div className="font-medium">{row.getValue("label")}</div>,
  },
  {
    accessorKey: "is_not_applicable_value",
    header: "Tidak Ada / N.A",
    cell: ({ row }) => <BooleanBadge value={row.getValue("is_not_applicable_value")} />,
  },
  {
    accessorKey: "report_bucket",
    header: "Bucket Laporan",
    cell: ({ row }) => {
      const bucket = row.getValue("report_bucket") as string
      return <div className="text-xs text-gray-600 dark:text-gray-400">{bucket || "-"}</div>
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButtons row={row.original} />,
    size: 140,
  },
]
