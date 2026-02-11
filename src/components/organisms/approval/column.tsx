import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { approvalListState } from "../../../models/approval/list"
import { EyeIcon } from "hugeicons-react"

function ActionButtons({ approvalId }: { approvalId: string }) {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/dashboard/approval/${approvalId}`)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDetail}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        title="View Details"
      >
        <EyeIcon size={18} />
      </button>
    </div>
  )
}

export const approvalColumns: ColumnDef<approvalListState>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return (
        <div className="font-mono text-xs">
          {id.substring(0, 8)}...
        </div>
      )
    },
  },
  {
    accessorKey: 'flow_code',
    header: 'Flow Code',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('flow_code')}</div>
    },
  },
  {
    accessorKey: 'flow_name',
    header: 'Flow Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('flow_name')}</div>
    },
  },
  {
    accessorKey: 'assignment_type',
    header: 'Assignment Type',
    cell: ({ row }) => {
      const type = row.getValue('assignment_type') as string
      return (
        <div className="capitalize">
          {type?.replace(/_/g, ' ') || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'assigned_user_id',
    header: 'Assigned User',
    cell: ({ row }) => {
      const userId = row.getValue('assigned_user_id') as string
      return (
        <div className="font-mono text-xs">
          {userId ? `${userId.substring(0, 8)}...` : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <div className="flex items-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return (
        <div className="text-sm">
          {new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const approval = row.original
      
      return <ActionButtons approvalId={approval.id} />
    },
    size: 100,
  },
]