import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import toast from "react-hot-toast"
import { Inputs } from "../../../molecules/input/inputs"
import type { StockOpnamePhysicalStatusMaster } from "../../../../models/stockOpname/statusMaster"
import { useCreateStockOpnamePhysicalStatusMaster } from "../../../../hooks/mutation/stockOpname/physicalStatusMasterCreate"
import { useDeleteStockOpnamePhysicalStatusMaster } from "../../../../hooks/mutation/stockOpname/physicalStatusMasterDelete"
import { useUpdateStockOpnamePhysicalStatusConditions } from "../../../../hooks/mutation/stockOpname/physicalStatusConditionsUpdate"
import { useStockOpnameConditionMasters } from "../../../../hooks/query/stockOpname/conditionMasterList"
import { ToggleChecklist, ToggleRow } from "./toggleFields"

const CONDITION_CHECKLIST_HINT =
  "Cuma kondisi yang aktif di sini yang bisa dipilih pas isi temuan dengan status fisik ini. Kalau cuma 1, kondisinya otomatis kepilih & dikunci."

function useConditionOptions() {
  const { data } = useStockOpnameConditionMasters()
  return (data?.data ?? []).map((c) => ({ id: c.id, code: c.code, label: c.label }))
}

// ─── Create Modal ─────────────────────────────────────────────────────────

export function CreatePhysicalStatusModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [requiresBorrowDocument, setRequiresBorrowDocument] = useState(false)
  const [countsAsMissing, setCountsAsMissing] = useState(false)
  const [conditionIds, setConditionIds] = useState<Set<number>>(new Set())

  const conditionOptions = useConditionOptions()
  const { mutate, isPending } = useCreateStockOpnamePhysicalStatusMaster()

  const handleSubmit = () => {
    if (!code.trim() || !label.trim()) {
      toast.error("Code dan label wajib diisi")
      return
    }
    if (conditionIds.size === 0) {
      toast.error("Pilih minimal 1 kondisi yang boleh dipakai")
      return
    }
    mutate(
      {
        code: code.trim(),
        label: label.trim(),
        requires_borrow_document: requiresBorrowDocument,
        counts_as_missing: countsAsMissing,
        condition_ids: Array.from(conditionIds),
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6">
          <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">
            Tambah Status Fisik
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Flag di bawah tidak bisa diubah lagi setelah dibuat (tidak ada edit) — pastikan sudah sesuai.
            Daftar kondisi masih bisa diatur ulang kapan aja.
          </p>
        </div>

        <div className="space-y-4 px-6 overflow-y-auto">
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
            disabled={isPending}
          />
          <ToggleRow
            label="Dihitung Sebagai Hilang"
            hint="Masuk bucket 'Hilang' / 'SAP Ada Fisik Tidak' di laporan stock opname"
            value={countsAsMissing}
            onChange={setCountsAsMissing}
            disabled={isPending}
          />

          <ToggleChecklist
            title="Kondisi yang Boleh Dipilih"
            hint={CONDITION_CHECKLIST_HINT}
            options={conditionOptions}
            selected={conditionIds}
            onChange={setConditionIds}
            disabled={isPending}
            emptyText="Belum ada master kondisi"
          />
        </div>

        <div className="flex gap-3 p-6">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || conditionIds.size === 0}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Atur Kondisi Modal ───────────────────────────────────────────────────

function EditConditionsModal({ row, onClose }: { row: StockOpnamePhysicalStatusMaster; onClose: () => void }) {
  const [conditionIds, setConditionIds] = useState<Set<number>>(
    () => new Set(row.allowed_conditions.map((c) => c.id))
  )

  const conditionOptions = useConditionOptions()
  const { mutate, isPending } = useUpdateStockOpnamePhysicalStatusConditions()

  const handleSubmit = () => {
    if (conditionIds.size === 0) {
      toast.error("Pilih minimal 1 kondisi yang boleh dipakai")
      return
    }
    mutate(
      { id: row.id, payload: { condition_ids: Array.from(conditionIds) } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6">
          <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">
            Atur Kondisi — {row.label}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Berlaku buat temuan yang disimpan setelah ini. Temuan yang sudah tersimpan tidak berubah,
            tapi bakal ditolak kalau disimpan ulang dengan kondisi yang tidak diizinkan lagi.
          </p>
        </div>

        <div className="px-6 overflow-y-auto">
          <ToggleChecklist
            title="Kondisi yang Boleh Dipilih"
            hint={CONDITION_CHECKLIST_HINT}
            options={conditionOptions}
            selected={conditionIds}
            onChange={setConditionIds}
            disabled={isPending}
            emptyText="Belum ada master kondisi"
          />
        </div>

        <div className="flex gap-3 p-6">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || conditionIds.size === 0}
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
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
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

function AllowedConditionChips({ row }: { row: StockOpnamePhysicalStatusMaster }) {
  if (row.allowed_conditions.length === 0) {
    return <span className="text-xs text-red-500">Belum diatur</span>
  }
  return (
    <div className="flex flex-wrap gap-1 max-w-[280px] whitespace-normal">
      {row.allowed_conditions.map((c) => (
        <span
          key={c.id}
          className="px-2 py-0.5 text-[11px] font-medium rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
        >
          {c.label}
        </span>
      ))}
    </div>
  )
}

function ActionButtons({ row }: { row: StockOpnamePhysicalStatusMaster }) {
  const [showDelete, setShowDelete] = useState(false)
  const [showConditions, setShowConditions] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowConditions(true)}
        className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded"
      >
        Atur Kondisi
      </button>
      {row.is_system ? (
        <span className="text-xs text-gray-400">Bawaan sistem</span>
      ) : (
        <button
          onClick={() => setShowDelete(true)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
        >
          Hapus
        </button>
      )}
      {showConditions && <EditConditionsModal row={row} onClose={() => setShowConditions(false)} />}
      {showDelete && <DeleteModal id={row.id} label={row.label} onCancel={() => setShowDelete(false)} />}
    </div>
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
    id: "allowed_conditions",
    header: "Kondisi yang Diizinkan",
    cell: ({ row }) => <AllowedConditionChips row={row.original} />,
  },
  {
    accessorKey: "requires_borrow_document",
    header: "Wajib Dok. Peminjaman",
    cell: ({ row }) => <BooleanBadge value={row.getValue("requires_borrow_document")} />,
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
    size: 200,
  },
]
