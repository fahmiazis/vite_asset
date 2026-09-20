import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import type { roleListState } from "../../../models/roles/list"
import { useNavigate } from "react-router-dom"
import { useDeleteRole } from "../../../hooks/mutation/role/useDeleteRole"

function DeleteModal({
  roleName,
  isPending,
  onConfirm,
  onCancel,
}: {
  roleName: string
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 mx-auto mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Hapus role
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Role <span className="font-medium text-gray-700 dark:text-gray-300">"{roleName}"</span>{" "}
          akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionButtons({ role }: { role: roleListState }) {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)

  const { mutate: deleteRole, isPending } = useDeleteRole({
    onSuccess: () => setShowDelete(false),
  })

  return (
    <div className="flex items-center gap-2">
      {showDelete && (
        <DeleteModal
          roleName={role.name}
          isPending={isPending}
          onConfirm={() => deleteRole(role.id)}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <button
        onClick={() => navigate(`/dashboard/role/${role.id}`)}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Hak Akses
      </button>
      <button
        onClick={() => setShowDelete(true)}
        className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
      >
        Hapus
      </button>
    </div>
  )
}

export const roleColumns: ColumnDef<roleListState>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'Role Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name')}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className="text-gray-700 dark:text-gray-300 max-w-md">
          {description || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Create at',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="text-xs">
          {date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Update',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ActionButtons role={row.original} />,
    size: 100,
  },
]