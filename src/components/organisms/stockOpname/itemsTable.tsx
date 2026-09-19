import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { getStockOpnameItemColumns } from "./itemsColumn"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 30, 50, 100]

interface StockOpnameItemsTableProps {
  items: StockOpnameItem[]
  isDraft: boolean
  onFillFinding: (item: StockOpnameItem) => void
}

export function StockOpnameItemsTable({ items, isDraft, onFillFinding }: StockOpnameItemsTableProps) {
  const { t } = useTranslation()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const columns = getStockOpnameItemColumns({ t, isDraft, onFillFinding })

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(next.pageIndex)
      setPageSize(next.pageSize)
    },
    state: { pagination: { pageIndex, pageSize } },
  })

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPageIndex(0)
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2.5 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-gray-400">
                    {t("stockOpnameDetail.noAssets")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("stockOpnameDetail.tableShowing")}{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>
              {"–"}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  items.length
                )}
              </span>{" "}
              {t("stockOpnameDetail.tableOf")}{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">{items.length}</span>{" "}
              {t("stockOpnameDetail.assets")}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t("stockOpnameDetail.tablePageSize")}</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="text-xs border border-gray-200 dark:border-gray-700 rounded-md px-1.5 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
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
                className="w-7 h-7 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {btn.label}
              </button>
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
              {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
