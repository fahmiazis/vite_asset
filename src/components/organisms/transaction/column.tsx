import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { transactionListState } from "../../../models/transaction/list"

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
    Menunggu:  { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    Ditolak:   { dot: "bg-red-500",   bg: "bg-red-50 text-red-600" },
    Draft:     { dot: "bg-gray-400",  bg: "bg-gray-100 text-gray-600" },
  }
  const s = map[value] ?? map["Draft"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {value}
    </span>
  )
}

// --- Action Buttons ---
function ActionButtons({ id, status }: { id: string; status: string }) {
  const navigate = useNavigate()
  return (
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
    </div>
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