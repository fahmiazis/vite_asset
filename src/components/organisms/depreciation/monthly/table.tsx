// components/organisms/depreciation/monthly/table.tsx

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { depreciationColumns } from "./column"
import type { depreListState } from "../../../../models/depreciation/list"

interface DepreciationTableProps {
    data: depreListState[]   // ← ganti dari MonthlyDepreciationState
    isLoading?: boolean
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
    title,
    description,
    confirmLabel,
    confirmClass,
    isLoading,
    onConfirm,
    onCancel,
}: {
    title: string
    description: string
    confirmLabel: string
    confirmClass: string
    isLoading: boolean
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {title}
                </h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {description}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${confirmClass}`}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export function DepreciationTable({ data, isLoading }: DepreciationTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    // const { mutate: calculate, isPending: isCalculating } = useCalculateDepreciation()
    // const { mutate: lock, isPending: isLocking } = useLockDepreciation()

    const table = useReactTable({
        data,
        columns: depreciationColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, columnFilters, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <section className="flex items-center justify-between w-full">
                <input
                    type="text"
                    placeholder="Search depreciation..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-w-sm"
                />
                <div className="flex gap-2 items-center">
                    <button
                        disabled
                        className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg opacity-50 cursor-not-allowed"
                    >
                        Calculate
                    </button>
                    <button
                        disabled
                        className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg opacity-50 cursor-not-allowed"
                    >
                        Lock
                    </button>
                </div>
            </section>

            {/* Table */}
            <div className="rounded-md border">
                <div className="relative overflow-x-auto">
                    <table className="min-w-[1200px] w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={depreciationColumns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    Show{" "}
                    <span className="font-medium">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{" "}
                    Until{" "}
                    <span className="font-medium">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    From{" "}
                    <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> data
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{"<<"}</button>
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{"<"}</button>
                    <span className="text-xs">
                        Page <strong>{table.getState().pagination.pageIndex + 1} From {table.getPageCount()}</strong>
                    </span>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{">"}</button>
                    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">{">>"}</button>
                </div>
            </div>
        </div>
    )
}