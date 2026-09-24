import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import toast from "react-hot-toast"
import { Inputs } from "../../../molecules/input/inputs"
import type { StockOpnameConditionMaster } from "../../../../models/stockOpname/statusMaster"
import { useCreateStockOpnameConditionMaster } from "../../../../hooks/mutation/stockOpname/conditionMasterCreate"
import { useDeleteStockOpnameConditionMaster } from "../../../../hooks/mutation/stockOpname/conditionMasterDelete"
import { useStockOpnamePhysicalStatusMasters } from "../../../../hooks/query/stockOpname/physicalStatusMasterList"
import { ToggleChecklist } from "./toggleFields"

// ─── Create Modal ─────────────────────────────────────────────────────────

export function CreateConditionModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [reportBucket, setReportBucket] = useState<"" | "BAIK" | "RUSAK">("")
  const [physicalStatusIds, setPhysicalStatusIds] = useState<Set<number>>(new Set())

  const { data: physicalStatusData } = useStockOpnamePhysicalStatusMasters()
  const physicalStatusOptions = (physicalStatusData?.data ?? []).map((p) => ({ id: p.id, code: p.code, label: p.label }))

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
        report_bucket: reportBucket,
        physical_status_ids: Array.from(physicalStatusIds),
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6">
          <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">Tambah Kondisi</h3>
          <p className="text-xs text-gray-400 mb-4">
            Code, label, dan bucket laporan tidak bisa diubah lagi setelah dibuat — pastikan sudah sesuai.
          </p>
        </div>

        <div className="space-y-4 px-6 overflow-y-auto">
          <Inputs
            label="Code"
            value={code}
            onChange={setCode}
            placeholder="Contoh: HILANG_SEBAGIAN"
            helperText="Huruf kapital, angka, underscore. Otomatis di-uppercase."
          />
          <Inputs label="Label" value={label} onChange={setLabel} placeholder="Contoh: Hilang Sebagian" />

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

          <ToggleChecklist
            title="Dipakai untuk Status Fisik (opsional)"
            hint="Kondisi baru langsung bisa dipilih buat status fisik yang aktif di sini. Bisa diatur juga nanti lewat tombol 'Atur Kondisi' di tab Status Fisik."
            options={physicalStatusOptions}
            selected={physicalStatusIds}
            onChange={setPhysicalStatusIds}
            disabled={isPending}
            emptyText="Belum ada master status fisik"
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
