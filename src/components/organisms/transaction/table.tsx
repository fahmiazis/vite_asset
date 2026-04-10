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
import { transaksiColumns } from "./column"
import { ArrowDown01Icon, SearchingIcon, SlidersHorizontalIcon } from "hugeicons-react"
import type { transactionListState } from "../../../models/transaction/list"

interface TransaksiTableProps {
  data: transactionListState[]
  isLoading?: boolean
}

export function TransaksiTable({ data, isLoading }: TransaksiTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const STATUS_TABS = [
    { label: "All", value: "all", count: data.length },
    { label: "Pending", value: "Menunggu", count: data.filter(d => d.transaction.status === "Menunggu").length },
    { label: "Approved", value: "Disetujui", count: data.filter(d => d.transaction.status === "Disetujui").length },
    { label: "Rejected", value: "Ditolak", count: data.filter(d => d.transaction.status === "Ditolak").length },
    { label: "Draft", value: "Draft", count: data.filter(d => d.transaction.status === "Draft").length },
  ]

  const filteredData = activeTab === "all"
    ? data
    : data.filter((d) => d.transaction.status === activeTab)

  const table = useReactTable({
    data: filteredData,
    columns: transaksiColumns,
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  return (
    <div className="space-y-0 mt-4">

      {/* Tab Status */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-0">
        <div className="flex items-center gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-t-md ${
                activeTab === tab.value
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value
                  ? "bg-white/20 dark:bg-black/20 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-1">
          <SlidersHorizontalIcon size={14} />
          Advanced Filter
        </button>
      </div>

      {/* Search & Filter Row */}
      <div className="flex items-center gap-3 py-3">
        <div className="relative flex-1 max-w-md">
          <SearchingIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by asset name, PO number, or requester..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
        {["All Categories", "All Priorities", "All Periods"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            {label}
            <ArrowDown01Icon size={14} className="text-gray-400 dark:text-gray-500" />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {table.getRowModel().rows.length ? (
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
                  <td colSpan={transaksiColumns.length} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3">
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