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

interface PageSizeSelectProps<T extends number | "all"> {
  value: T
  onChange: (mode: T) => void
  /** pilihan jumlah baris; default 10/25/50 */
  options?: readonly number[]
  /**
   * tampilkan opsi "Semua". Matikan untuk tabel yang dipaging server dengan
   * batas limit (mis. /assets maksimal 100) — "Semua" di sana akan menipu.
   */
  allowAll?: boolean
}

export function PageSizeSelect<T extends number | "all">({
  value,
  onChange,
  options = PAGE_SIZE_OPTIONS,
  allowAll = true,
}: PageSizeSelectProps<T>) {
  const { t } = useTranslation()

  return (
    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
      {t("table.showData")}
      <select
        value={String(value)}
        onChange={(e) => {
          const next = e.target.value
          onChange((next === "all" ? "all" : Number(next)) as T)
        }}
        className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
        {allowAll && <option value="all">{t("table.showAll")}</option>}
      </select>
    </label>
  )
}

// ─── Paging untuk tabel biasa (array, bukan TanStack) ────────────────────────

/**
 * Paging di sisi klien untuk tabel yang dirender dari array biasa. Halaman
 * dijaga tetap valid saat jumlah baris berubah (mis. hasil pencarian).
 */
export function useClientPagination<T>(rows: T[], initial: PageSizeMode = 10) {
  const [mode, setModeState] = useState<PageSizeMode>(initial)
  const [page, setPage] = useState(1)

  const total = rows.length
  const size = mode === "all" ? Math.max(total, 1) : mode
  const pageCount = Math.max(1, Math.ceil(total / size))
  const current = Math.min(page, pageCount)

  const start = (current - 1) * size
  const pageRows = rows.slice(start, start + size)

  const setMode = (next: PageSizeMode) => {
    setModeState(next)
    setPage(1)
  }

  return {
    mode,
    setMode,
    page: current,
    setPage,
    pageCount,
    pageRows,
    /** nomor urut baris pertama di halaman ini (0-based), untuk kolom "No" */
    offset: start,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + size, total),
    total,
  }
}

type ClientPaginationState = ReturnType<typeof useClientPagination<unknown>>

/** Baris bawah tabel: pilihan jumlah baris, keterangan, dan navigasi halaman. */
export function ClientPagination({ pagination }: { pagination: Omit<ClientPaginationState, "pageRows"> }) {
  const { t } = useTranslation()
  const { mode, setMode, page, setPage, pageCount, from, to, total } = pagination

  const buttons = [
    { label: "«", go: 1, disabled: page <= 1 },
    { label: "‹", go: page - 1, disabled: page <= 1 },
    { label: "›", go: page + 1, disabled: page >= pageCount },
    { label: "»", go: pageCount, disabled: page >= pageCount },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <PageSizeSelect value={mode} onChange={setMode} />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t("table.range", { from, to, total })}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => setPage(btn.go)}
            disabled={btn.disabled}
            className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {btn.label}
          </button>
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
          {t("table.pageOf", { page, pages: pageCount })}
        </span>
      </div>
    </div>
  )
}
