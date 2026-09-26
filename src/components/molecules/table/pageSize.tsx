import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Table } from "@tanstack/react-table"

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

/** angka = jumlah baris per halaman, "all" = tampilkan semuanya */
export type PageSizeMode = (typeof PAGE_SIZE_OPTIONS)[number] | "all"

/**
 * Menjaga pageSize tabel tetap sinkron dengan pilihan user.
 *
 * Mode "all" dihitung dari jumlah baris setelah difilter, bukan dari data
 * mentah — kalau tidak, hasil pencarian tetap terpotong halaman. Jumlahnya
 * dijaga minimal 1 karena pageSize 0 membuat TanStack Table menghitung
 * pageCount menjadi Infinity saat datanya kosong.
 */
export function usePageSize<T>(table: Table<T>, initial: PageSizeMode = 10) {
  const [mode, setMode] = useState<PageSizeMode>(initial)
  const filteredCount = table.getFilteredRowModel().rows.length

  useEffect(() => {
    table.setPageSize(mode === "all" ? Math.max(filteredCount, 1) : mode)
  }, [mode, filteredCount, table])

  return { mode, setMode }
}

interface PageSizeSelectProps {
  value: PageSizeMode
  onChange: (mode: PageSizeMode) => void
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  const { t } = useTranslation()

  return (
    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
      {t("table.showData")}
      <select
        value={String(value)}
        onChange={(e) => {
          const next = e.target.value
          onChange(next === "all" ? "all" : (Number(next) as PageSizeMode))
        }}
        className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
        <option value="all">{t("table.showAll")}</option>
      </select>
    </label>
  )
}
