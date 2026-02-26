import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { assetsCategoryListState } from "../../../models/assetsCategory/list"

function ActionButtons({ categoryId }: { categoryId: number }) {
    const navigate = useNavigate()

    const handleDetail = () => {
        navigate(`/dashboard/assets-category/${categoryId}`)
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

export const assetsCategoryColumns: ColumnDef<assetsCategoryListState>[] = [
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
        accessorKey: 'category_code',
        header: 'Category Code',
        cell: ({ row }) => {
            return (
                <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {row.getValue('category_code')}
                </div>
            )
        },
    },
    {
        accessorKey: 'category_name',
        header: 'Category Name',
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue('category_name')}</div>
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const desc: string = row.getValue('description')
            return (
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {desc || '-'}
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                    >
                        {isActive ? 'Active' : 'Non Active'}
                    </span>
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const category = row.original
            return <ActionButtons categoryId={category.id} />
        },
        size: 100,
        meta: {
            sticky: 'right',
        },
    },
]