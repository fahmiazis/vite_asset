import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { transactionListState } from "../../../models/transaction/list"
import { useState } from "react"
import { useDeleteProcurement } from "../../../hooks/mutation/transaction/delete"

// --- Avatar ---
function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  const colors = ["bg-blue-400", "bg-green-400", "bg-orange-400", "bg-purple-400", "bg-rose-400"]
  const color = colors[initials.charCodeAt(0) % colors.length]
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <p className="text-sm font-medium leading-tight text-gray-800 dark:text-gray-200">{name}</p>
    </div>
  )
}

// --- Status Badge ---
function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { dot: string; light: string; dark: string }> = {
    Disetujui: { dot: "bg-green-500", light: "bg-green-50 text-green-700", dark: "dark:bg-green-900/40 dark:text-green-400" },
    Menunggu:  { dot: "bg-yellow-400", light: "bg-yellow-50 text-yellow-700", dark: "dark:bg-yellow-900/40 dark:text-yellow-400" },
    Ditolak:   { dot: "bg-red-500", light: "bg-red-50 text-red-600", dark: "dark:bg-red-900/40 dark:text-red-400" },
    Draft:     { dot: "bg-gray-400", light: "bg-gray-100 text-gray-600", dark: "dark:bg-gray-700 dark:text-gray-400" },
  }

  const LABEL: Record<string, string> = {
    Disetujui: "Approved",
    Menunggu: "Pending",
    Ditolak: "Rejected",
    Draft: "Draft",
  }

  const s = map[value] ?? map["Draft"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.light} ${s.dark}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {LABEL[value] ?? value}
    </span>
  )
}

// --- Delete Modal ---
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
          className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Detail
        </button>
        {status === "Menunggu" && (
          <button
            onClick={() => navigate(`/dashboard/transaksi/${id}/review`)}
            className="px-3 py-1 text-xs font-medium border border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
          >
            Review
          </button>
        )}
        <button
          onClick={() => navigate(`/dashboard/transaction/update/${id}`)}
          className="px-3 py-1 text-xs font-medium border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-3 py-1 text-xs font-medium border border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
    header: "Transaction No.",
    cell: ({ row }) => (
      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono leading-tight">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    id: "item_name",
    header: "Item Name",
    cell: ({ row }) => {
      const items = row.original.items
      return (
        <div>
          <p className="text-sm font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {items[0]?.item_name ?? "-"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {items[0]?.category_name ?? "-"}
            {items.length > 1 && (
              <span className="ml-1 text-blue-500 dark:text-blue-400">
                +{items.length - 1} more items
              </span>
            )}
          </p>
        </div>
      )
    },
  },
  {
    id: "created_by",
    header: "Created By",
    cell: ({ row }) => <Avatar name={row.original.transaction.created_by} />,
  },
  {
    id: "transaction_date",
    header: "Transaction Date",
    cell: ({ row }) => {
      const date = new Date(row.original.transaction.transaction_date)
      return (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "qty",
    header: "Qty",
    cell: ({ row }) => {
      const totalQty = row.original.items.reduce((sum, item) => sum + item.quantity, 0)
      return (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{totalQty}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">unit</p>
        </div>
      )
    },
  },
  {
    id: "total_price",
    header: "Total Value",
    cell: ({ row }) => {
      const total = row.original.items.reduce((sum, item) => sum + item.total_price, 0)
      return (
        <span className="text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-200">
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
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.transaction.status} />,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <ActionButtons
        id={row.original.transaction.transaction_number}
        status={row.original.transaction.status}
      />
    ),
  },
]