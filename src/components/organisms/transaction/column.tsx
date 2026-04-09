import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { transactionListState } from "../../../models/transaction/list"
import { useState } from "react"
import { useDeleteProcurement } from "../../../hooks/mutation/transaction/delete"

// --- Avatar Pemohon ---
function Avatar({ nama }: { nama: string }) {
  const initials = nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  const colors = ["bg-blue-400", "bg-green-400", "bg-orange-400", "bg-purple-400", "bg-rose-400"]
  const color = colors[initials.charCodeAt(0) % colors.length]
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <p className="text-sm font-medium leading-tight">{nama}</p>
    </div>
  )
}

// --- Badge Status ---
function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { dot: string; bg: string }> = {
    Disetujui: { dot: "bg-green-500", bg: "bg-green-50 text-green-700" },
    Menunggu: { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    Ditolak: { dot: "bg-red-500", bg: "bg-red-50 text-red-600" },
    Draft: { dot: "bg-gray-400", bg: "bg-gray-100 text-gray-600" },
  }
  const s = map[value] ?? map["Draft"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {value}
    </span>
  )
}

// --- Delete Confirm Modal ---
function DeleteModal({
  id, onConfirm, onCancel, isLoading,
}: {
  id: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Delete Transaction?
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete{" "}
          <span className="block font-mono font-semibold text-gray-700 dark:text-gray-200 break-all mt-1">
            {id}
          </span>
          <span className="block mt-1">This action cannot be undone.</span>
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Action Buttons ---
function ActionButtons({ id, status }: { id: string; status: string }) {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteProcurement({
    onSuccess: () => setShowDeleteModal(false),
  })

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate(`/dashboard/transaction/${id}`)}
          className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Detail
        </button>
        {status === "Menunggu" && (
          <button
            onClick={() => navigate(`/dashboard/transaksi/${id}/review`)}
            className="px-3 py-1 text-xs font-medium border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors"
          >
            Review
          </button>
        )}
        <button
          onClick={() => navigate(`/dashboard/transaction/update/${id}`)}
          className="px-3 py-1 text-xs font-medium border border-blue-400 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-3 py-1 text-xs font-medium border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>

      {showDeleteModal && (
        <DeleteModal
          id={id}
          isLoading={isDeleting}
          onConfirm={() => deleteTransaction(id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

// --- Columns ---
export const transaksiColumns: ColumnDef<transactionListState>[] = [
  {
    accessorKey: "transaction.transaction_number",
    id: "transaction_number",
    header: "NO. TRANSAKSI",
    cell: ({ row }) => (
      <div className="text-xs text-gray1 font-mono leading-tight">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    id: "nama_item",
    header: "NAMA ITEM",
    cell: ({ row }) => {
      const items = row.original.items
      return (
        <div>
          <p className="text-sm font-semibold leading-tight">{items[0]?.item_name ?? "-"}</p>
          <p className="text-xs text-gray1 mt-0.5">
            {items[0]?.category_name ?? "-"}
            {items.length > 1 && (
              <span className="ml-1 text-blue-500">+{items.length - 1} item lainnya</span>
            )}
          </p>
        </div>
      )
    },
  },
  {
    id: "created_by",
    header: "DIBUAT OLEH",
    cell: ({ row }) => (
      <Avatar nama={row.original.transaction.created_by} />
    ),
  },
  {
    id: "transaction_date",
    header: "TGL TRANSAKSI",
    cell: ({ row }) => {
      const date = new Date(row.original.transaction.transaction_date)
      return (
        <span className="text-sm">
          {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "qty",
    header: "QTY",
    cell: ({ row }) => {
      const totalQty = row.original.items.reduce((sum, item) => sum + item.quantity, 0)
      return (
        <div className="text-center">
          <p className="text-sm font-medium">{totalQty}</p>
          <p className="text-xs text-gray1">unit</p>
        </div>
      )
    },
  },
  {
    id: "total_price",
    header: "NILAI TOTAL",
    cell: ({ row }) => {
      const total = row.original.items.reduce((sum, item) => sum + item.total_price, 0)
      return (
        <span className="text-sm font-semibold tabular-nums">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(total)}
        </span>
      )
    },
  },
  {
    id: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusBadge value={row.original.transaction.status} />,
  },
  {
    id: "aksi",
    header: "AKSI",
    cell: ({ row }) => (
      <ActionButtons
        id={row.original.transaction.transaction_number}
        status={row.original.transaction.status}
      />
    ),
  },
]