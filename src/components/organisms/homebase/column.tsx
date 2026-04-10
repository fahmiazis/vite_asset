import type { ColumnDef } from "@tanstack/react-table"
import type { homeBaseListState } from "../../../models/homebase/list"

function formatDate(dateStr: string) {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    })
}

export const homeBaseColumns: ColumnDef<homeBaseListState>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row }) => (
            <div className="text-center text-gray-500 dark:text-gray-400">
                {row.index + 1}
            </div>
        ),
        size: 60,
    },
    {
        accessorKey: "branch.branch_code",
        id: "branch_code",
        header: "Branch Code",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {row.original.branch.branch_code}
            </span>
        ),
    },
    {
        accessorKey: "branch.branch_name",
        id: "branch_name",
        header: "Branch Name",
        cell: ({ row }) => (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {row.original.branch.branch_name}
            </p>
        ),
    },
    {
        accessorKey: "branch.branch_type",
        id: "branch_type",
        header: "Branch Type",
        cell: ({ row }) => (
            <span className="px-2 py-0.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full capitalize">
                {row.original.branch.branch_type}
            </span>
        ),
    },
    {
        accessorKey: "branch.status",
        id: "branch_status",
        header: "Branch Status",
        cell: ({ row }) => {
            const status = row.original.branch.status
            return (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    status === "active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}>
                    {status === "active" ? "Active" : "Inactive"}
                </span>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Home Base Status",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}>
                    {active ? "Active" : "Inactive"}
                </span>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(row.getValue("created_at"))}
            </span>
        ),
    },
]