import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import type { StockOpnameDetailState } from "../../../models/stockOpname/detail"

function formatDate(value: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { dot: string; bg: string }> = {
    draft: { dot: "bg-gray-400", bg: "bg-gray-100 text-gray-600" },
    pending: { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    processing: { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    approved: { dot: "bg-green-500", bg: "bg-green-50 text-green-700" },
    rejected: { dot: "bg-red-500", bg: "bg-red-50 text-red-600" },
  }
  const s = map[value?.toLowerCase()] ?? map["draft"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {value ?? "-"}
    </span>
  )
}

function ActionButtons({ id }: { id: string }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate(`/dashboard/stock-opname/${id}`)}
        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        {t("stockOpnamePage.table.detailButton")}
      </button>
    </div>
  )
}

export function getStockOpnameColumns(t: TFunction): ColumnDef<StockOpnameDetailState>[] {
  return [
    {
      accessorFn: (row) => row.transaction.transaction_number,
      id: "transaction_number",
      header: t("stockOpnameColumn.transactionNumber"),
      cell: ({ row }) => (
        <div className="text-xs text-gray1 font-mono leading-tight whitespace-nowrap">
          {row.original.transaction.transaction_number}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.transaction_date,
      id: "transaction_date",
      header: t("stockOpnameColumn.transactionDate"),
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {formatDate(row.original.transaction.transaction_date)}
        </span>
      ),
    },
    {
      accessorFn: (row) => row.transaction.status,
      id: "status",
      header: t("stockOpnameColumn.status"),
      cell: ({ row }) => <StatusBadge value={row.original.transaction.status} />,
    },
    {
      accessorFn: (row) => row.transaction.current_stage,
      id: "current_stage",
      header: t("stockOpnameColumn.stage"),
      cell: ({ row }) => (
        <span className="text-xs text-gray1 capitalize">
          {row.original.transaction.current_stage?.replace(/_/g, " ") ?? "-"}
        </span>
      ),
    },
    {
      id: "item_count",
      header: t("stockOpnameColumn.itemCount"),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.items?.length ?? 0}</span>
      ),
    },
    {
      accessorFn: (row) => row.transaction.created_by,
      id: "created_by",
      header: t("stockOpnameColumn.createdBy"),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.transaction.created_by ?? "-"}</span>
      ),
    },
    {
      accessorFn: (row) => row.transaction.created_at,
      id: "created_at",
      header: t("stockOpnameColumn.createdAt"),
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {formatDate(row.original.transaction.created_at)}
        </span>
      ),
    },
    {
      id: "aksi",
      header: t("stockOpnameColumn.action"),
      cell: ({ row }) => <ActionButtons id={row.original.transaction.transaction_number} />,
    },
  ]
}
