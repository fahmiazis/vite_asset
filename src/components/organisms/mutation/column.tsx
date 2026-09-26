import type { ColumnDef } from "@tanstack/react-table"
import { formatStage } from "../../../utils/stage"
import { Link } from "react-router-dom"
import type { listMutationDatas } from "../../../models/mutation/list"
import { useTranslation } from "react-i18next"
import { RevisionBadge } from "../common/revisionBadge"

// helper format
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// ─── Columns Factory ───────────────────────────────────────

export const mutationColumns = (
  t: (key: string) => string
): ColumnDef<listMutationDatas>[] => [
    {
      id: "no",
      header: t("label.mutation.no"),
      cell: ({ row }) => (
        <div className="text-center">{row.index + 1}</div>
      ),
      size: 60,
    },
    {
      accessorFn: (row) => row.transaction.transaction_number,
      id: "transaction_number",
      header: t("label.mutation.transactionNumber"),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.transaction.transaction_number}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.transaction_type,
      id: "transaction_type",
      header: t("label.mutation.type"),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.transaction.transaction_type}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.transaction_date,
      id: "transaction_date",
      header: t("label.mutation.date"),
      cell: ({ row }) => (
        <div className="text-xs text-gray-500">
          {formatDate(row.original.transaction.transaction_date)}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.current_stage,
      id: "current_stage",
      header: t("label.mutation.stage"),
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {formatStage(row.original.transaction.current_stage)}
          </span>
          <RevisionBadge show={row.original.transaction.needs_revision} />
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.created_by_name ?? row.transaction.created_by,
      id: "created_by",
      header: t("label.mutation.createdBy"),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {row.original.transaction.created_by_name ?? row.original.transaction.created_by}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.transaction.created_at,
      id: "created_at",
      header: t("label.mutation.createdAt"),
      cell: ({ row }) => (
        <div className="text-xs text-gray-500">
          {formatDate(row.original.transaction.created_at)}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("label.mutation.action"),
      cell: ({ row }) => {
        const trx = row.original.transaction

        return (
          <div className="flex items-center gap-2">
            <Link
              to={`/dashboard/mutation/${trx.transaction_number}`}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              {t("label.mutation.detail")}
            </Link>
          </div>
        )
      },
      size: 120,
    },
  ]