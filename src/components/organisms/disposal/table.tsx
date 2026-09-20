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
import {
  DISPOSAL_TYPE,
  disposalStageLabel,
  stagesForDisposalType,
} from "../../../utils/disposalStage"

export interface DisposalFilters {
  disposal_type: string
  status: string
  current_stage: string
  start_date: string
  end_date: string
}

interface DisposalTableProps {
  data: disposalListState[]
  total: number
  page: number
  pageSize: number
  isLoading?: boolean
  filters: DisposalFilters
  onPageChange: (page: number) => void
  onFiltersChange: (filters: DisposalFilters) => void
  onResetFilters: () => void
}

// Union stage DISPOSE + SELL, tanpa duplikat — dipakai untuk opsi filter
const ALL_STAGES = Array.from(
  new Set([
    ...stagesForDisposalType(DISPOSAL_TYPE.SELL),
    ...stagesForDisposalType(DISPOSAL_TYPE.DISPOSE),
    "REJECTED",
  ])
)

const STATUS_OPTIONS = ["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "REJECTED"]

export function DisposalTable({
  data,
  total,
  page,
  pageSize,
  isLoading,
  filters,
  onPageChange,
  onFiltersChange,
  onResetFilters,
}: DisposalTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const setFilter = (key: keyof DisposalFilters, value: string) =>
    onFiltersChange({ ...filters, [key]: value })

  const hasActiveFilter = Object.values(filters).some(Boolean)

  const selectClass =
    "px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"

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

      {/* Filter */}
      <section className="flex flex-wrap items-center gap-2">
        <select
          value={filters.disposal_type}
          onChange={(e) => setFilter("disposal_type", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua tipe</option>
          <option value={DISPOSAL_TYPE.DISPOSE}>Dispose</option>
          <option value={DISPOSAL_TYPE.SELL}>Sell</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={filters.current_stage}
          onChange={(e) => setFilter("current_stage", e.target.value)}
          className={selectClass}
        >
          <option value="">Semua stage</option>
          {ALL_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {disposalStageLabel(stage)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.start_date}
          onChange={(e) => setFilter("start_date", e.target.value)}
          className={selectClass}
          title="Tanggal transaksi dari"
        />
        <input
          type="date"
          value={filters.end_date}
          onChange={(e) => setFilter("end_date", e.target.value)}
          className={selectClass}
          title="Tanggal transaksi sampai"
        />

        {hasActiveFilter && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-sm text-gray1 hover:text-[var(--text-color)] underline underline-offset-2"
          >
            Reset
          </button>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray1 ml-auto">
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