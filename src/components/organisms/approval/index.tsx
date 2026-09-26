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
import { PageSizeSelect, usePageSize } from '../../molecules/table/pageSize'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { approvalListState } from '../../../models/approval/list'
import { buildApprovalColumns, type ApprovalColumnHandlers } from './column'

interface ApprovalTableProps {
  data: approvalListState[]
  isLoading?: boolean
  handlers: ApprovalColumnHandlers
}

export function ApprovalFlowTable({ data, isLoading, handlers }: ApprovalTableProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const approvalColumns = useMemo(
    () => buildApprovalColumns(t, handlers),
    [t, handlers]
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns: approvalColumns,
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

  // pilihan jumlah baris, sama dengan /role
  const { mode: pageSizeMode, setMode: setPageSizeMode } = usePageSize(table)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('approvalList.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className='flex items-center justify-between w-full'>
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('approvalList.search')}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-900 dark:border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-sm"
          />
        </div>
        <button
          onClick={() => navigate('/dashboard/approval/create')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('approvalList.create')}
        </button>
      </section>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
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
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
                  colSpan={approvalColumns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  {t('approvalList.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageSizeSelect value={pageSizeMode} onChange={setPageSizeMode} />
        <div className="text-xs text-gray-700 dark:text-gray-300 mr-auto">
          {t('approvalList.pagination.showing')}{' '}
          <span className="font-medium">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{' '}
          {t('approvalList.pagination.to')}{' '}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          {t('approvalList.pagination.of')}{' '}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          {t('approvalList.pagination.entries')}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {'<'}
          </button>

          <span className="text-xs">
            {t('approvalList.pagination.page')}{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} {t('approvalList.pagination.ofPage')}{' '}
              {table.getPageCount()}
            </strong>
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  )
}