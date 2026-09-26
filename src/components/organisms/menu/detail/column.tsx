import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { Children } from "../../../../models/menu/detail"
import { MENU_TYPE, menuTypeOf } from "../../../../utils/menu/menuType"

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
        id: 'menu_type',
        header: 'Tipe',
        cell: ({ row }) => {
            const t = menuTypeOf(row.original.menu_type)
            return (
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${MENU_TYPE[t].cls}`}
                    title={MENU_TYPE[t].desc}
                >
                    {MENU_TYPE[t].short}
                </span>
            )
        },
    },
    {
        accessorKey: 'path',
        header: 'Path',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {row.getValue('path') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'route_path',
        header: 'Route Path',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {row.original.route_path || '-'}
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
    {
        id: 'aksi',
        header: 'Aksi',
        cell: ({ row }) => (
            <Link
                to={`/dashboard/menu/update/${row.original.id}`}
                className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
                Edit
            </Link>
        ),
        size: 80,
    },
]
