import type { ColumnDef } from "@tanstack/react-table"
import type { TFunction } from "i18next"
import { useNavigate } from "react-router-dom"
import type { approvalListState } from "../../../models/approval/list"
import { EyeIcon, PencilEdit02Icon, Delete02Icon } from "hugeicons-react"

export interface ApprovalColumnHandlers {
  onDelete: (flow: approvalListState) => void
}

function ActionButtons({
  flow,
  handlers,
  t,
}: {
  flow: approvalListState
  handlers: ApprovalColumnHandlers
  t: TFunction
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate(`/dashboard/approval/${flow.id}`)}
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        title={t('approvalList.viewDetail')}
      >
        <EyeIcon size={18} />
      </button>
      <button
        onClick={() => navigate(`/dashboard/approval/${flow.id}/edit`)}
        className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
        title={t('approvalList.edit')}
      >
        <PencilEdit02Icon size={18} />
      </button>
      <button
        onClick={() => handlers.onDelete(flow)}
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        title={t('approvalList.delete')}
      >
        <Delete02Icon size={18} />
      </button>
    </div>
  )
}

export function buildApprovalColumns(
  t: TFunction,
  handlers: ApprovalColumnHandlers
): ColumnDef<approvalListState>[] {
  return [
  {
    id: 'no',
    header: t('approvalList.no'),
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'flow_code',
    header: t('approvalList.flowCode'),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('flow_code')}</div>
    },
  },
  {
    accessorKey: 'flow_name',
    header: t('approvalList.flowName'),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('flow_name')}</div>
    },
  },
  {
    accessorKey: 'assignment_type',
    header: t('approvalList.assignmentType'),
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
    accessorKey: 'assigned_username',
    header: t('approvalList.assignedUser'),
    cell: ({ row }) => {
      // sengaja tidak menampilkan UUID-nya — kalau backend belum mem-preload
      // relasi AssignedUser, kolom ini kosong ('-')
      const username = row.original.assigned_username
      return <div>{username || '-'}</div>
    },
  },
  {
    accessorKey: 'is_active',
    header: t('approvalList.status'),
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
            {isActive ? t('approvalList.active') : t('approvalList.inactive')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: t('approvalList.createdAt'),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return (
        <div className="text-xs">
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
    header: t('approvalList.action'),
    cell: ({ row }) => {
      return <ActionButtons flow={row.original} handlers={handlers} t={t} />
    },
    size: 140,
  },
  ]
}
