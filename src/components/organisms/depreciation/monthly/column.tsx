import type { ColumnDef } from "@tanstack/react-table"
import type { depreListState } from "../../../../models/depreciation/list"
import Links from "../../../atoms/links"
import { useState } from "react"
import { useDeleteDepreciation } from "../../../../hooks/mutation/depreciation/delete"

function formatDate(dateStr: string) {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
    })
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
    reference,
    id,
    onCancel,
}: {
    reference: string
    id: number
    onCancel: () => void
}) {
    const { mutate: deleteDepre, isPending } = useDeleteDepreciation()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Delete Depreciation
                </h3>
                <p className="text-center text-wrap text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure want to delete <span className="font-medium text-gray-700 dark:text-gray-300">"{reference}"</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteDepre(id)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Action Cell ──────────────────────────────────────────────────────────────

function ActionCell({ row }: { row: any }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <div className="flex items-center gap-2">
                <Links
                    href={`/dashboard/depreciation/${row.original.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors inline-block"
                >
                    Detail
                </Links>
                <Links
                    href={`/dashboard/depreciation/update/${row.original.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-block"
                >
                    Edit
                </Links>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    Delete
                </button>
            </div>

            {showModal && (
                <DeleteModal
                    id={row.original.id}
                    reference={row.original.reference_value}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    )
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
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${active
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                    }`}>
                    {active ? "Active" : "Inactive"}
                </span>
            )
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <ActionCell row={row} />,
    },
]