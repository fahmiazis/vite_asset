// MutationTable.tsx

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
import { mutationColumns } from "./column"
import type { listMutationDatas } from "../../../models/mutation/list"
import { SearchingIcon } from "hugeicons-react"
import { useTranslation } from "react-i18next"
import {
  DateRangeFilter,
  type DateRangeValue,
} from "../common/dateRangeFilter"

interface Props {
  data: listMutationDatas[]
  isLoading?: boolean
  /** filter tanggal transaksi — ikut baris filter, sama dengan /disposal */
  dateRange: DateRangeValue
  onDateRangeChange: (range: DateRangeValue) => void
  onResetFilters: () => void
}

export function MutationTable({
  data,
  isLoading,
  dateRange,
  onDateRangeChange,
  onResetFilters,
}: Props) {
  const { t } = useTranslation()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const columns = mutationColumns(t)

  const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onGlobalFilterChange: setGlobalFilter,
  state: {
    sorting,
    columnFilters,
    globalFilter,
  },
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
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
      {/* Tombol buat baru ada di header halaman — tidak diulang di sini */}
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <div className="relative max-w-md flex-1 min-w-[220px]">
          <SearchingIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />

          <input
            type="text"
            placeholder={t("label.mutation.searchPlaceholder")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
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

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                      <td
                        key={cell.id}
                        className="px-5 py-4 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={mutationColumns.length}
                    className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    {t("label.mutation.noData")}
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
          {t("label.mutation.showing")}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{" "}
          –{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          {t("label.mutation.of")}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          {t("label.mutation.entries")}
        </p>

        <div className="flex items-center gap-1">
          {[
            {
              label: "«",
              action: () => table.setPageIndex(0),
              disabled: !table.getCanPreviousPage(),
            },
            {
              label: "‹",
              action: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
            },
            {
              label: "›",
              action: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
            },
            {
              label: "»",
              action: () =>
                table.setPageIndex(table.getPageCount() - 1),
              disabled: !table.getCanNextPage(),
            },
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
            {t("label.mutation.page")}{" "}
            <strong className="text-gray-800 dark:text-gray-200">
              {table.getState().pagination.pageIndex + 1}
            </strong>{" "}
            / {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  )
}