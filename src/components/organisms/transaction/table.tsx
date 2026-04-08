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
  const [activeTab, setActiveTab] = useState("semua")

  const STATUS_TABS = [
    { label: "Semua", value: "semua", count: data.length },
    { label: "Menunggu", value: "Menunggu", count: data.filter(d => d.transaction.status === "Menunggu").length },
    { label: "Disetujui", value: "Disetujui", count: data.filter(d => d.transaction.status === "Disetujui").length },
    { label: "Ditolak", value: "Ditolak", count: data.filter(d => d.transaction.status === "Ditolak").length },
    { label: "Draft", value: "Draft", count: data.filter(d => d.transaction.status === "Draft").length },
  ]

  const filteredData = activeTab === "semua"
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
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-0">
        <div className="flex items-center gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-t-md ${activeTab === tab.value
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray1 hover:text-[var(--text-color)]"
                }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value
                  ? "bg-white/20 dark:bg-black/20 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray1"
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors mb-1">
          <SlidersHorizontalIcon size={14} />
          Filter Lanjutan
        </button>
      </div>

      {/* Search & Filter Row */}
      <div className="flex items-center gap-3 py-3">
        <div className="relative flex-1 max-w-md">
          <SearchingIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray1" />
          <input
            type="text"
            placeholder="Cari nama aset, nomor PO, atau pemohon..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Dropdowns */}
        {["Semua Kategori", "Semua Prioritas", "Semua Periode"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            {label}
            <ArrowDown01Icon size={14} className="text-gray1" />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-[11px] font-semibold text-gray1 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
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
                  <td colSpan={transaksiColumns.length} className="px-5 py-10 text-center text-sm text-gray1">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3">
        <p className="text-xs text-gray1">
          Menampilkan{" "}
          <span className="font-semibold text-[var(--text-color)]">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{" "}
          –{" "}
          <span className="font-semibold text-[var(--text-color)]">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-[var(--text-color)]">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          data
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
              className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {btn.label}
            </button>
          ))}
          <span className="text-xs text-gray1 ml-2">
            Hal <strong>{table.getState().pagination.pageIndex + 1}</strong> / {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  )
}