import type { ColumnDef } from "@tanstack/react-table"
import type { Role, userListState } from "../../../models/users/list"
import { useNavigate } from "react-router-dom"
import { Delete01Icon, EyeIcon } from "hugeicons-react"
import { useDeleteModalStore } from "../../../stores/useDeleteModal"

interface ActionButtonsProps {
  userId: string
  userName: string
}

function ActionButtons({ userId, userName }: ActionButtonsProps) {
  const navigate = useNavigate()
  const openModal = useDeleteModalStore((state) => state.openModal)

  const handleDetail = () => {
    navigate(`/dashboard/user/${userId}`)
  }

  const handleEdit = () => {
    navigate(`/dashboard/user/update/${userId}`)
  }

  const handleDelete = () => {
    openModal(userId, userName)
  }

  return (
    <div className="flex items-center gap-1">
      {/* Detail Button */}
      <button
        onClick={handleDetail}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group relative"
        aria-label="View Details"
      >
        <EyeIcon size={18} className="group-hover:scale-110 transition-transform" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          View Details
        </span>
      </button>

      {/* Edit Button (Optional) */}
      {/* <button
        onClick={handleEdit}
        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 group relative"
        aria-label="Edit User"
      >
        <Edit size={18} className="group-hover:scale-110 transition-transform" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Edit User
        </span>
      </button> */}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 group relative"
        aria-label="Delete User"
      >
        <Delete01Icon size={18} className="group-hover:scale-110 transition-transform" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Delete User
        </span>
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
    header: 'FullName',
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
    header: 'Action',
    cell: ({ row }) => {
      const user = row.original
      
      return <ActionButtons userId={user.id} userName={user.username} />
    },
    size: 100,
  },
]