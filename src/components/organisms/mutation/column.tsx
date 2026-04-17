import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { listMutationDatas } from "../../../models/mutation/list"

// helper format
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// ─── Action ─────────────────────────────────────────

function ActionButtons({ row }: { row: listMutationDatas }) {
  const trx = row.transaction

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/dashboard/mutation/${trx.transaction_number}`}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Detail
      </Link>
    </div>
  )
}

// ─── Columns ───────────────────────────────────────

export const mutationColumns: ColumnDef<listMutationDatas>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
    size: 60,
  },
  {
    accessorFn: (row) => row.transaction.transaction_number,
    id: "transaction_number",
    header: "Transaction Number",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.transaction_type,
    id: "transaction_type",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.transaction.transaction_type}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.transaction_date,
    id: "transaction_date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-gray-500">
        {formatDate(row.original.transaction.transaction_date)}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.status,
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.transaction.status

      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === "approved"
              ? "bg-green-100 text-green-800"
              : status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorFn: (row) => row.transaction.created_by,
    id: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.original.transaction.created_by}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.created_at,
    id: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-xs text-gray-500">
        {formatDate(row.original.transaction.created_at)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButtons row={row.original} />,
    size: 120,
  },
]