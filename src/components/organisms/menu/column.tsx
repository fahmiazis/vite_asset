import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { allMenuState } from "../../../models/menu/list"

function ActionButtons({ menuId }: { menuId: string }) {
    const navigate = useNavigate()

    const handleDetail = () => {
        navigate(`/dashboard/menu/${menuId}`)
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

export const menuColumns: ColumnDef<allMenuState>[] = [
    {
        id: 'no',
        header: 'No',
        cell: ({ row }) => {
            return <div className="text-center">{row.index + 1}</div>
        },
        size: 60,
        meta: {
            sticky: 'left',
        },
    },
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue('id')}</div>
        },
    },
    {
        accessorKey: 'parent_id',
        header: 'Parent ID',
        cell: ({ row }) => {
            const parentId: string = row.getValue('parent_id')
            return (
                <div className="font-medium text-gray-600 dark:text-gray-400">
                    {parentId || '-'}
                </div>
            )
        },
    },
    {
        accessorKey: 'name',
        header: 'Menu Name',
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue('name')}</div>
        },
    },
    {
        accessorKey: 'path',
        header: 'Path',
        cell: ({ row }) => {
            return (
                <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {row.getValue('path')}
                </div>
            )
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status === 'active'
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
            const menu = row.original

            return <ActionButtons menuId={menu.id} />
        },
        size: 100,
        meta: {
            sticky: 'right',
        },
    },
]