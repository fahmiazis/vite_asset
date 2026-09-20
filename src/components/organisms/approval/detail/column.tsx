import type { ColumnDef } from "@tanstack/react-table"
import type { TFunction } from "i18next"
import type { FlowStep } from "../../../../models/approval/detail"

export interface FlowStepColumnHandlers {
  onEdit: (step: FlowStep) => void
  onDelete: (step: FlowStep) => void
  onToggleVisible: (step: FlowStep, isVisible: boolean) => void
  isMutating?: boolean
}

function ActionButtons({
  flowStep,
  handlers,
  t,
}: {
  flowStep: FlowStep
  handlers: FlowStepColumnHandlers
  t: TFunction
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handlers.onEdit(flowStep)}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t('approvalDetail.step.update')}
      </button>
      <button
        onClick={() => handlers.onDelete(flowStep)}
        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {t('approvalDetail.step.delete')}
      </button>
      <label className="relative inline-flex items-center cursor-pointer" title={t('approvalDetail.step.isVisible')}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={flowStep.is_visible}
          disabled={handlers.isMutating}
          onChange={(e) => handlers.onToggleVisible(flowStep, e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
      </label>
    </div>
  )
}

export function buildFlowStepColumns(
  t: TFunction,
  handlers: FlowStepColumnHandlers
): ColumnDef<FlowStep>[] {
  return [
    {
      id: 'no',
      header: t('approvalDetail.step.no'),
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 60,
    },
    {
      accessorKey: 'step_order',
      header: t('approvalDetail.step.order'),
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue('step_order')}</div>
      ),
    },
    {
      accessorKey: 'step_name',
      header: t('approvalDetail.step.name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('step_name')}</div>,
    },
    {
      accessorKey: 'step_role',
      header: t('approvalDetail.step.role'),
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue('step_role') as string) || '-'}</div>
      ),
    },
    {
      accessorKey: 'role_name',
      header: t('approvalDetail.step.roleName'),
      cell: ({ row }) => <div>{(row.getValue('role_name') as string) || '-'}</div>,
    },
    {
      accessorKey: 'type',
      header: t('approvalDetail.step.type'),
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        return (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                type === 'it'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : type === 'non-it'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              {type}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'approval_way',
      header: t('approvalDetail.step.approvalWay'),
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue('approval_way') as string) || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: t('approvalDetail.step.action'),
      cell: ({ row }) => (
        <ActionButtons flowStep={row.original} handlers={handlers} t={t} />
      ),
      size: 220,
    },
  ]
}
