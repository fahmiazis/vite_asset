import type { ColumnDef } from "@tanstack/react-table"
import type { depreListState } from "../../../../models/depreciation/list"
import Links from "../../../atoms/links"

function formatDate(dateStr: string) {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
    })
}

export const depreciationColumns: ColumnDef<depreListState>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row }) => (
            <div className="text-center text-gray-600 dark:text-gray-400">
                {row.index + 1}
            </div>
        ),
        size: 60,
    },
    {
        accessorKey: "reference_value",
        header: "Reference",
        cell: ({ row }) => (
            <div className="font-medium text-gray-800 dark:text-gray-200">
                {row.getValue("reference_value")}
            </div>
        ),
    },
    {
        accessorKey: "setting_type",
        header: "Setting Type",
        cell: ({ row }) => (
            <span className="px-2 py-0.5 text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full capitalize">
                {row.getValue("setting_type")}
            </span>
        ),
    },
    {
        accessorKey: "calculation_method",
        header: "Method",
        cell: ({ row }) => (
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full uppercase">
                {row.getValue("calculation_method")}
            </span>
        ),
    },
    {
        accessorKey: "depreciation_period",
        header: "Period",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("depreciation_period")}
            </div>
        ),
    },
    {
        accessorKey: "useful_life_months",
        header: "Useful Life",
        cell: ({ row }) => (
            <div className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                {row.getValue("useful_life_months")} months
            </div>
        ),
    },
    {
        accessorKey: "depreciation_rate",
        header: "Rate",
        cell: ({ row }) => {
            const rate = row.getValue("depreciation_rate")
            return (
                <div className="text-sm tabular-nums text-orange-600 dark:text-orange-400">
                    {rate != null ? `${rate}%` : "-"}
                </div>
            )
        },
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(row.getValue("start_date"))}
            </div>
        ),
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(row.getValue("end_date"))}
            </div>
        ),
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    active
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                }`}>
                    {active ? "Active" : "Inactive"}
                </span>
            )
        },
    },
    // ✅ Kolom Action
    {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
        <Links
            href={`/dashboard/depreciation/${row.original.id}`}
            className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors inline-block"
        >
            Detail
        </Links>
    ),
},
]