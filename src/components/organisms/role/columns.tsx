import type { ColumnDef } from "@tanstack/react-table"
import type { roleListState } from "../../../models/roles/list"
import { useNavigate } from "react-router-dom"

function ActionButtons({ roleId }: { roleId: string }) {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/dashboard/role/${roleId}`)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDetail}
        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Detail
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
    header: 'Nama Role',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name')}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
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
    header: 'Tanggal Dibuat',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="text-sm">
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
    header: 'Terakhir Diupdate',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
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
    header: 'Aksi',
    cell: ({ row }) => {
      const role = row.original
      
      return <ActionButtons roleId={role.id} />
    },
    size: 100,
  },
]