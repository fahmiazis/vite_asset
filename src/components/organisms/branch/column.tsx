import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { branchListState } from "../../../models/branch/list"
import { useTranslation } from "react-i18next"


function ActionButtons({ branchId }: { branchId: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/dashboard/branch/${branchId}`)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDetail}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t("branchTable.detail")}
      </button>
    </div>
  )
}

// ─── Columns Factory ───────────────────────────────────────

export const branchColumns = (
  t: (key: string) => string
): ColumnDef<branchListState>[] => [
  {
    id: 'no',
    header: t('branchTable.no'),
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'branch_code',
    header: t('branchTable.branchCode'),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('branch_code')}</div>
    },
  },
  {
    accessorKey: 'branch_name',
    header: t('branchTable.branchName'),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('branch_name')}</div>
    },
  },
  {
    accessorKey: 'branch_type',
    header: t('branchTable.branchType'),
    cell: ({ row }) => {
      return <div>{row.getValue('branch_type') || '-'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: t('branchTable.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div className="flex items-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {status === 'active' ? t('branchTable.active') : t('branchTable.inactive')}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: t('branchTable.action'),
    cell: ({ row }) => {
      const branch = row.original
      
      return <ActionButtons branchId={branch.id} />
    },
    size: 100,
  },
]