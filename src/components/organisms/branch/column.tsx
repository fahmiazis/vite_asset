import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { branchListState } from "../../../models/branch/list"


function ActionButtons({ branchId }: { branchId: string }) {
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
        Detail
      </button>
    </div>
  )
}

export const branchColumns: ColumnDef<branchListState>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'branch_code',
    header: 'Branch Code',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('branch_code')}</div>
    },
  },
  {
    accessorKey: 'branch_name',
    header: 'Branch Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('branch_name')}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
            {status === 'active' ? 'Active' : 'NonActive'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const branch = row.original
      
      return <ActionButtons branchId={branch.id} />
    },
    size: 100,
  },
]