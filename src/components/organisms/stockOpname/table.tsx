import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { SearchingIcon } from "hugeicons-react"
import { getStockOpnameColumns } from "./column"
import type { StockOpnameListItem } from "../../../models/stockOpname/list"
import { DateRangeFilter, type DateRangeValue } from "../common/dateRangeFilter"

export interface StockOpnameTab {
  label: string
  value: string
  count: number
}

interface StockOpnameTableProps {
  data: StockOpnameListItem[]
  total: number
  page: number
  pageSize: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  /**
   * Tab, pencarian & tanggal dikendalikan halaman karena semuanya disaring
   * server — sama dengan halaman procurement.
   */
  tabs: StockOpnameTab[]
  activeTab: string
  onTabChange: (value: string) => void
  search: string
  onSearchChange: (value: string) => void
  dateRange: DateRangeValue
  onDateRangeChange: (range: DateRangeValue) => void
  onResetFilters: () => void
}

export function StockOpnameTable({
  data,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onResetFilters,
}: StockOpnameTableProps) {
  const { t } = useTranslation()
  const [sorting, setSorting] = useState<SortingState>([])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const columns = getStockOpnameColumns(t)

  const table = useReactTable({
    data,
    columns,
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
          <p className="mt-4 text-sm text-gray1">{t("stockOpnamePage.table.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-950 p-6 rounded-2xl">

      {/* Tab Stage */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-t-md ${activeTab === tab.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value
                ? "bg-white/20 dark:bg-black/20 text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + filter tanggal */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-md flex-1 min-w-[220px]">
          <SearchingIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t("stockOpnamePage.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <DateRangeFilter {...dateRange} onChange={onDateRangeChange} />

        <button
          onClick={onResetFilters}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-2"
        >
          {t("dateRange.reset")}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-gray1">
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-500" />
          {t("stockOpnamePage.table.loadingInline")}
        </div>
      )}

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
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-sm text-gray1"
                  >
                    {t("stockOpnamePage.table.noData")}
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
          {t("stockOpnamePage.table.pagination.showing", { from, to, total })}
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
            {t("stockOpnamePage.table.pagination.page", { current: page, total: totalPages })}
          </span>
        </div>
      </div>

    </div>
  )
}
