import { useTranslation } from "react-i18next"
import { Search01Icon } from "hugeicons-react"
import type { ReportBranchOption } from "../../../models/report/common"
import type { ReportFilterState } from "../../../hooks/useReportFilters"
import { DateRangeFilter } from "../common/dateRangeFilter"

interface ReportFilterBarProps {
  filters: ReportFilterState
  branches: ReportBranchOption[]
  /** admin melihat semua cabang; non-admin hanya cabang yang di-assign */
  allBranches: boolean
  onChange: (patch: Partial<ReportFilterState>) => void
  onReset: () => void
}

export function ReportFilterBar({ filters, branches, allBranches, onChange, onReset }: ReportFilterBarProps) {
  const { t } = useTranslation()

  const controlClass =
    "px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="flex flex-col gap-2 px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search01Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder={t("transactionReport.searchPlaceholder")}
            className={`${controlClass} w-full pl-9`}
          />
        </div>

        <select
          value={filters.branch_code}
          onChange={(e) => onChange({ branch_code: e.target.value })}
          className={controlClass}
        >
          <option value="">
            {allBranches ? t("transactionReport.allBranches") : t("transactionReport.myBranches")}
          </option>
          {branches.map((b) => (
            <option key={b.branch_code} value={b.branch_code}>
              {b.branch_code} - {b.branch_name}
            </option>
          ))}
        </select>

        <DateRangeFilter
          start_date={filters.start_date}
          end_date={filters.end_date}
          onChange={(range) => onChange(range)}
        />

        <button
          onClick={onReset}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t("transactionReport.reset")}
        </button>
      </div>

      {!allBranches && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {branches.length > 0
            ? t("transactionReport.branchScopeNote", { count: branches.length })
            : t("transactionReport.noBranchNote")}
        </p>
      )}
    </div>
  )
}
