import type { ColumnDef } from "@tanstack/react-table"
import type { Role, userListState } from "../../../models/users/list"
import { useNavigate } from "react-router-dom"

function ActionButtons({ userId }: { userId: string }) {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate(`/dashboard/user/${userId}`)
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

export const userColumns: ColumnDef<userListState>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: 'fullname',
    header: 'Nama Lengkap',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('fullname')}</div>
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div className="lowercase">{row.getValue('email')}</div>
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
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status === 'active' ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'roles',
    header: 'Role',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as Role[]
      
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <span
              key={role.id}
              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
            >
              {role.name}
            </span>
          ))}
        </div>
      )
    },
  },
   {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      const user = row.original
      
      return <ActionButtons userId={user.id} />
    },
    size: 100,
  },
]