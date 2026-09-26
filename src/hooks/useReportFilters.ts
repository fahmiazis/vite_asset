import { useEffect, useState } from "react"
import type { ReportFilterParams } from "../models/report/common"
import { defaultDateRange } from "../utils/dateRange"

export interface ReportFilterState {
  start_date: string
  end_date: string
  branch_code: string
  stage: string
  search: string
}

const initialFilters = (): ReportFilterState => ({
  ...defaultDateRange(),
  branch_code: "",
  stage: "",
  search: "",
})

/**
 * State filter halaman report. Pencarian ditunda 400ms supaya tidak memanggil
 * backend setiap ketikan; filter lain langsung berlaku.
 *
 * `params` yang dikembalikan dipakai untuk tabel DAN unduhan excel, supaya
 * file yang diunduh selalu sama dengan yang sedang dilihat.
 */
export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilterState>(initialFilters)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), 400)
    return () => clearTimeout(timer)
  }, [filters.search])

  const params: ReportFilterParams = {
    start_date: filters.start_date,
    end_date: filters.end_date,
    branch_code: filters.branch_code,
    stage: filters.stage,
    search: debouncedSearch,
  }

  const update = (patch: Partial<ReportFilterState>) => setFilters((prev) => ({ ...prev, ...patch }))

  const reset = () => {
    setFilters(initialFilters())
    setDebouncedSearch("")
  }

  return { filters, params, update, reset }
}
