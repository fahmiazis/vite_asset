import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { FlowStep } from "../../../../models/approval/detail"

function ActionButtons({ flowStep }: { flowStep: FlowStep }) {
  const navigate = useNavigate()

  const handleUpdate = () => {
    // Navigate ke halaman update flow step
    navigate(`/dashboard/approval-flow/step/${flowStep.id}/edit`)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUpdate}
        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Update
      </button>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={flowStep.is_visible}
          onChange={(e) => {
            // Handle switch toggle
            console.log('Toggle status for step:', flowStep.id, e.target.checked)
            // Tambahkan logic untuk update status
          }}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
      </label>
    </div>
  )
}

export const flowStepColumns: ColumnDef<FlowStep>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'step_order',
    header: 'Step Order',
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('step_order')}
        </div>
      )
    },
  },
  {
    accessorKey: 'step_name',
    header: 'Step Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('step_name')}</div>
    },
  },
  {
    accessorKey: 'role_name',
    header: 'Role Name',
    cell: ({ row }) => {
      return <div>{row.getValue('role_name')}</div>
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <div className="flex items-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              type === 'approval'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : type === 'review'
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
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const flowStep = row.original
      
      return <ActionButtons flowStep={flowStep} />
    },
    size: 150,
  },
]