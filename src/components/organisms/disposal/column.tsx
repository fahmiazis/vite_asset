import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { disposalListState } from "../../../models/disposal/list"
import {
  disposalStageLabel,
  disposalTypeLabel,
  formatRupiah,
  isSell,
} from "../../../utils/disposalStage"

// --- Helpers ---
function formatDate(value: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// --- Disposal Type Badge ---
function DisposalTypeBadge({ value }: { value: string }) {
  const cls = isSell(value)
    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {disposalTypeLabel(value)}
    </span>
  )
}

// --- Transaction Status Badge ---
function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { dot: string; bg: string }> = {
    draft:      { dot: "bg-gray-400",   bg: "bg-gray-100 text-gray-600" },
    pending:    { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    processing: { dot: "bg-blue-500",   bg: "bg-blue-50 text-blue-700" },
    approved:   { dot: "bg-green-500",  bg: "bg-green-50 text-green-700" },
    rejected:   { dot: "bg-red-500",    bg: "bg-red-50 text-red-600" },
    completed:  { dot: "bg-blue-500",   bg: "bg-blue-50 text-blue-700" },
    cancelled:  { dot: "bg-gray-400",   bg: "bg-gray-100 text-gray-600" },
  }
  const s = map[value?.toLowerCase()] ?? map["cancelled"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {value ?? "-"}
    </span>
  )
}

// --- Action Buttons ---
function ActionButtons({ id }: { id: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate(`/dashboard/disposal/${id}`)}
        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Detail
      </button>
    </div>
  )
}

export const disposalColumns: ColumnDef<disposalListState>[] = [
  {
    accessorFn: (row) => row.transaction.transaction_number,
    id: "transaction_number",
    header: "NO. TRANSAKSI",
    cell: ({ row }) => (
      <div className="text-xs text-gray1 font-mono leading-tight whitespace-nowrap">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.transaction_date,
    id: "transaction_date",
    header: "TGL TRANSAKSI",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.transaction.transaction_date)}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.disposal_type,
    id: "disposal_type",
    header: "TIPE DISPOSAL",
    cell: ({ row }) => (
      <DisposalTypeBadge value={row.original.transaction.disposal_type} />
    ),
  },
  {
    accessorFn: (row) => row.transaction.status,
    id: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <StatusBadge value={row.original.transaction.status} />
    ),
  },
  {
    accessorFn: (row) => row.transaction.current_stage,
    id: "current_stage",
    header: "STAGE",
    cell: ({ row }) => (
      <span className="text-xs text-gray1">
        {disposalStageLabel(row.original.transaction.current_stage)}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.sale_value,
    id: "sale_value",
    header: "NILAI JUAL",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {row.original.transaction.sale_value != null
          ? formatRupiah(row.original.transaction.sale_value)
          : "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.notes,
    id: "notes",
    header: "CATATAN",
    cell: ({ row }) => (
      <span className="text-sm text-gray1 max-w-[200px] truncate block">
        {row.original.transaction.notes || "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.created_by_name ?? row.transaction.created_by,
    id: "created_by",
    header: "DIBUAT OLEH",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.transaction.created_by_name ?? row.original.transaction.created_by ?? "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.created_at,
    id: "created_at",
    header: "TGL DIBUAT",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.transaction.created_at)}
      </span>
    ),
  },
  {
    id: "aksi",
    header: "AKSI",
    cell: ({ row }) => <ActionButtons id={row.original.transaction.transaction_number} />,
  },
]