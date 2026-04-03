import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assetsColumns } from './column'
import type { listAssetsState } from '../../../models/asset/list'
import { Search01Icon } from 'hugeicons-react'

interface AssetsTableProps {
  data: listAssetsState[]
  total?: number
  isLoading?: boolean
}

export function AssetsTable({ data, total, isLoading }: AssetsTableProps) {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns: assetsColumns,
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
          <p className="mt-4 text-sm text-gray1">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Search + Actions */}
      <section className="flex items-center justify-between w-full">
        <div className="relative">
          <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray1" />
          <input
            type="text"
            placeholder="Cari nama aset, nomor aset..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/assets/create')}
            className="px-4 py-2 text-xs font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
          >
            + Tambah Aset
          </button>
        </div>
      </section>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full">
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
                    colSpan={assetsColumns.length}
                    className="px-5 py-10 text-center text-sm text-gray1"
                  >
                    Tidak ada data
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
          Menampilkan{' '}
          <span className="font-semibold text-[var(--text-color)]">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          –{' '}
          <span className="font-semibold text-[var(--text-color)]">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-[var(--text-color)]">
            {total ?? table.getFilteredRowModel().rows.length}
          </span>{' '}
          data
        </p>

        <div className="flex items-center gap-1">
          {[
            { label: '«', action: () => table.setPageIndex(0),                        disabled: !table.getCanPreviousPage() },
            { label: '‹', action: () => table.previousPage(),                         disabled: !table.getCanPreviousPage() },
            { label: '›', action: () => table.nextPage(),                             disabled: !table.getCanNextPage() },
            { label: '»', action: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
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
          <span className="text-xs text-gray1 ml-2 whitespace-nowrap">
            Hal <strong>{table.getState().pagination.pageIndex + 1}</strong> / {table.getPageCount()}
          </span>
        </div>
      </div>

    </div>
  )
}