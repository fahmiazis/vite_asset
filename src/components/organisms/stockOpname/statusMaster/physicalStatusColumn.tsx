import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import toast from "react-hot-toast"
import { Inputs } from "../../../molecules/input/inputs"
import { InputToggle } from "../../../molecules/input/inputTogle"
import type { StockOpnamePhysicalStatusMaster } from "../../../../models/stockOpname/statusMaster"
import { useCreateStockOpnamePhysicalStatusMaster } from "../../../../hooks/mutation/stockOpname/physicalStatusMasterCreate"
import { useDeleteStockOpnamePhysicalStatusMaster } from "../../../../hooks/mutation/stockOpname/physicalStatusMasterDelete"

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

export function CreatePhysicalStatusModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [requiresBorrowDocument, setRequiresBorrowDocument] = useState(false)
  const [requiresNotApplicableCondition, setRequiresNotApplicableCondition] = useState(false)
  const [countsAsMissing, setCountsAsMissing] = useState(false)

  const { mutate, isPending } = useCreateStockOpnamePhysicalStatusMaster()

  const handleSubmit = () => {
    if (!code.trim() || !label.trim()) {
      toast.error("Code dan label wajib diisi")
      return
    }
    mutate(
      {
        code: code.trim(),
        label: label.trim(),
        requires_borrow_document: requiresBorrowDocument,
        requires_not_applicable_condition: requiresNotApplicableCondition,
        counts_as_missing: countsAsMissing,
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">
          Tambah Status Fisik
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Flag di bawah tidak bisa diubah lagi setelah dibuat (tidak ada edit) — pastikan sudah sesuai.
        </p>

        <div className="space-y-4">
          <Inputs
            label="Code"
            value={code}
            onChange={setCode}
            placeholder="Contoh: RUSAK_PARAH"
            helperText="Huruf kapital, angka, underscore. Otomatis di-uppercase."
          />
          <Inputs label="Label" value={label} onChange={setLabel} placeholder="Contoh: Rusak Parah" />

          <ToggleRow
            label="Wajib Dokumen Peminjaman"
            hint="Aset dengan status ini wajib upload dokumen peminjaman dulu (mis. Dipinjam)"
            value={requiresBorrowDocument}
            onChange={setRequiresBorrowDocument}
          />
          <ToggleRow
            label="Wajib Kondisi Tidak Ada"
            hint="Aset dengan status ini kondisinya WAJIB salah satu yang ditandai 'Tidak Ada' (mis. Hilang/Dipinjam — fisik gak bisa dinilai)"
            value={requiresNotApplicableCondition}
            onChange={setRequiresNotApplicableCondition}
          />
          <ToggleRow
            label="Dihitung Sebagai Hilang"
            hint="Masuk bucket 'Hilang' / 'SAP Ada Fisik Tidak' di laporan stock opname"
            value={countsAsMissing}
            onChange={setCountsAsMissing}
          />
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
  const { mutate: deleteRow, isPending } = useDeleteStockOpnamePhysicalStatusMaster()

  const handleDelete = () => {
    deleteRow(id, { onSuccess: () => onCancel() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Hapus Status Fisik
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Yakin mau hapus <span className="font-medium text-gray-700 dark:text-gray-300">"{label}"</span>?
          Status yang sudah pernah dipakai di transaksi tetap tersimpan di data lama, cuma gak bisa dipilih lagi buat temuan baru.
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

function ActionButtons({ row }: { row: StockOpnamePhysicalStatusMaster }) {
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

export const physicalStatusMasterColumns: ColumnDef<StockOpnamePhysicalStatusMaster>[] = [
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
    accessorKey: "requires_borrow_document",
    header: "Wajib Dok. Peminjaman",
    cell: ({ row }) => <BooleanBadge value={row.getValue("requires_borrow_document")} />,
  },
  {
    accessorKey: "requires_not_applicable_condition",
    header: "Wajib Kondisi Tidak Ada",
    cell: ({ row }) => <BooleanBadge value={row.getValue("requires_not_applicable_condition")} />,
  },
  {
    accessorKey: "counts_as_missing",
    header: "Dihitung Hilang",
    cell: ({ row }) => <BooleanBadge value={row.getValue("counts_as_missing")} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButtons row={row.original} />,
    size: 140,
  },
]
