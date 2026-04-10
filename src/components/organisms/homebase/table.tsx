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
import { Link } from "react-router-dom"
import { homeBaseColumns } from "./column"
import type { homeBaseListState } from "../../../models/homebase/list"

interface HomeBaseTableProps {
    data: homeBaseListState[]
    isLoading?: boolean
}

export function HomeBaseTable({ data, isLoading }: HomeBaseTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data,
        columns: homeBaseColumns,
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto" />
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search home base..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-sm w-full"
                />
                <Link
                    to="/dashboard/homebase/create"
                    className="px-4 py-2 text-xs font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity"
                >
                    + Create
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={homeBaseColumns.length}
                                        className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                                    >
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{" "}
                    –{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    entries
                </p>
                <div className="flex items-center gap-1">
                    {[
                        { label: "«", action: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage() },
                        { label: "‹", action: () => table.previousPage(), disabled: !table.getCanPreviousPage() },
                        { label: "›", action: () => table.nextPage(), disabled: !table.getCanNextPage() },
                        { label: "»", action: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.action}
                            disabled={btn.disabled}
                            className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {btn.label}
                        </button>
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        Page <strong className="text-gray-800 dark:text-gray-200">{table.getState().pagination.pageIndex + 1}</strong> / {table.getPageCount()}
                    </span>
                </div>
            </div>
        </div>
    )
}