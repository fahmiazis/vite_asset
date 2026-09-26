import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ClientPagination, useClientPagination } from "../../molecules/table/pageSize"

export interface ReportColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: "left" | "right"
  /** kolom panjang (nomor transaksi, alasan) tidak dipatahkan */
  nowrap?: boolean
}

interface ReportTableProps<T> {
  columns: ReportColumn<T>[]
  rows: T[]
  isLoading: boolean
  error?: string
}

/**
 * Tabel report generik — dipaging di klien karena backend mengembalikan
 * seluruh baris dalam rentang filter (dan baris yang sama yang diunduh ke
 * excel).
 */
export function ReportTable<T>({ columns, rows, isLoading, error }: ReportTableProps<T>) {
  const { t } = useTranslation()
  const pagination = useClientPagination(rows, 25)

  return (
    <div className="flex flex-col gap-3 px-4 md:px-6 py-4">
      <div className="overflow-x-auto app-scrollbar border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">{t("transactionReport.column.no")}</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-medium whitespace-nowrap ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {error ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-10 text-center text-red-600 dark:text-red-400">
                  {error}
                </td>
              </tr>
            ) : isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-10 text-center text-gray-500">
                  {t("transactionReport.loading")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-10 text-center text-gray-500">
                  {t("transactionReport.empty")}
                </td>
              </tr>
            ) : (
              pagination.pageRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-3 py-2 text-gray-500">{pagination.offset + i + 1}</td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 align-top text-gray-800 dark:text-gray-200 ${
                        col.align === "right" ? "text-right" : ""
                      } ${col.nowrap ? "whitespace-nowrap" : ""}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && <ClientPagination pagination={pagination} />}
    </div>
  )
}
