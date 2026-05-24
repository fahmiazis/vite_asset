import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { disposalColumns } from "./column"
import type { disposalListState } from "../../../models/disposal/list"
import { Search01Icon } from "hugeicons-react"

interface DisposalTableProps {
  data: disposalListState[]
  total: number
  page: number
  pageSize: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  onSearchChange: (value: string) => void
}

export function DisposalTable({
  data,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onSearchChange,
}: DisposalTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("")

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const table = useReactTable({
    data,
    columns: disposalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    manualPagination: true,
    pageCount: totalPages,
  })

  const handleSearch = (val: string) => {
    setSearchValue(val)
    onSearchChange(val)
  }

  if (isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto" />
          <p className="mt-4 text-sm text-gray1">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-950 p-6 rounded-2xl">

      {/* Search */}
      <section className="flex items-center justify-between w-full">
        <div className="relative">
          <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray1" />
          <input
            type="text"
            placeholder="Cari no. transaksi, tipe disposal..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
          />
        </div>

        {/* Loading indicator saat fetch halaman baru */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray1">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-500" />
            Memuat...
          </div>
        )}
      </section>

      {/* Table */}
      <div
        className={`rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 transition-opacity ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
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
                  <td
                    colSpan={disposalColumns.length}
                    className="px-5 py-10 text-center text-sm text-gray1"
                  >
                    Tidak ada data disposal
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray1">
          Menampilkan{" "}
          <span className="font-semibold text-[var(--text-color)]">{from}</span>
          {" "}–{" "}
          <span className="font-semibold text-[var(--text-color)]">{to}</span>
          {" "}dari{" "}
          <span className="font-semibold text-[var(--text-color)]">{total}</span>
          {" "}data
        </p>

        <div className="flex items-center gap-1">
          {[
            { label: "«", action: () => onPageChange(1),          disabled: page <= 1 },
            { label: "‹", action: () => onPageChange(page - 1),   disabled: page <= 1 },
            { label: "›", action: () => onPageChange(page + 1),   disabled: page >= totalPages },
            { label: "»", action: () => onPageChange(totalPages), disabled: page >= totalPages },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              disabled={btn.disabled || isLoading}
              className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {btn.label}
            </button>
          ))}
          <span className="text-xs text-gray1 ml-2 whitespace-nowrap">
            Hal <strong>{page}</strong> / {totalPages}
          </span>
        </div>
      </div>

    </div>
  )
}