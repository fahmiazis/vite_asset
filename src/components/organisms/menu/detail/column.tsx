import type { ColumnDef } from "@tanstack/react-table"
import type { Children } from "../../../../models/menu/detail"

export const menuChildrenColumns: ColumnDef<Children>[] = [
    {
        id: 'no',
        header: 'No',
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        size: 60,
    },
    {
        accessorKey: 'name',
        header: 'Menu Name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'path',
        header: 'Path',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {row.getValue('path')}
            </div>
        ),
    },
    {
        accessorKey: 'icon_name',
        header: 'Icon',
        cell: ({ row }) => (
            <div className="text-xs text-gray-600 dark:text-gray-400">
                {row.getValue('icon_name') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                    {status === 'active' ? 'Active' : 'NonActive'}
                </span>
            )
        },
    },
]