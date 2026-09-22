import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import type { StockOpnameConditionMaster } from "../../../../models/stockOpname/statusMaster"
import { conditionMasterColumns, CreateConditionModal } from "./conditionColumn"

interface ConditionMasterTableProps {
  data: StockOpnameConditionMaster[]
  isLoading?: boolean
}

export function ConditionMasterTable({ data, isLoading }: ConditionMasterTableProps) {
  const [showCreate, setShowCreate] = useState(false)

  const table = useReactTable({
    data,
    columns: conditionMasterColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Kondisi</h3>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Kondisi
        </button>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <div className="relative overflow-x-auto">
          <table className="min-w-[800px] w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100 dark:divide-gray-800">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={conditionMasterColumns.length} className="px-4 py-6 text-center text-sm text-gray-400">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateConditionModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
